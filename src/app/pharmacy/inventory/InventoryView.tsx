"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type ManagerProduct = {
  inventoryId: string;
  price: number;
  stockQuantity: number;
  alertThreshold: number;
  isAvailable: boolean;
  expiryDate?: string;
  product: {
    _id: string;
    name: string;
    category?: string;
    barcode?: string;
  };
};

type StockUpdateResponse = {
  _id: string;
};

type PriceUpdateResponse = {
  _id: string;
};

type ManagerCategory = {
  _id: string;
  name: string;
  normalizedName: string;
  productCount: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatDate(date?: string) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("fr-FR");
}

export default function InventoryView() {
  const [products, setProducts] = useState<ManagerProduct[]>([]);
  const [managerCategories, setManagerCategories] = useState<ManagerCategory[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes catégories");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [categoryBusyId, setCategoryBusyId] = useState<string | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingInventoryId, setPendingInventoryId] = useState<string | null>(null);

  const loadProducts = useCallback(async (showMainLoader = false) => {
    setError(null);
    setSuccess(null);
    if (showMainLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const [productsResult, categoriesResult] = await Promise.all([
      apiJsonAuth<ManagerProduct[]>("/api/manager/products"),
      apiJsonAuth<ManagerCategory[]>("/api/manager/products/categories"),
    ]);

    if (!productsResult.ok || !productsResult.data) {
      setError(productsResult.error ?? "Impossible de charger l'inventaire.");
      setProducts([]);
    } else {
      setProducts(productsResult.data);
    }

    if (!categoriesResult.ok || !categoriesResult.data) {
      setManagerCategories([]);
    } else {
      setManagerCategories(categoriesResult.data);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProducts(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  const categories = useMemo(
    () => [
      "Toutes catégories",
      ...managerCategories.map((entry) => entry.name).sort((a, b) => a.localeCompare(b)),
    ],
    [managerCategories]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let list = products.filter((item) => {
      const categoryMatch =
        category === "Toutes catégories" || item.product.category === category;
      if (!categoryMatch) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        item.product.name,
        item.product.category ?? "",
        item.product.barcode ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "stock-asc") return a.stockQuantity - b.stockQuantity;
      if (sortBy === "stock-desc") return b.stockQuantity - a.stockQuantity;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

    return list;
  }, [products, query, category, sortBy]);

  const stats = useMemo(() => {
    const lowStock = products.filter(
      (item) => item.stockQuantity > 0 && item.stockQuantity <= item.alertThreshold
    ).length;
    const outOfStock = products.filter((item) => item.stockQuantity <= 0).length;
    const nearExpiry = products.filter((item) => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      if (Number.isNaN(expiryDate.getTime())) return false;
      const now = new Date();
      const diffMs = expiryDate.getTime() - now.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 30;
    }).length;
    return {
      total: products.length,
      lowStock,
      outOfStock,
      nearExpiry,
    };
  }, [products]);

  const quickUpdateStock = async (item: ManagerProduct) => {
    const response = window.prompt(
      `Nouveau stock pour ${item.product.name}`,
      String(item.stockQuantity)
    );
    if (response === null) return;
    const nextValue = Number(response);
    if (!Number.isFinite(nextValue) || nextValue < 0) {
      setError("Stock invalide.");
      return;
    }

    setPendingInventoryId(item.inventoryId);
    setError(null);
    const result = await apiJsonAuth<StockUpdateResponse>(
      `/api/manager/products/${item.inventoryId}/stock`,
      {
        method: "PATCH",
        body: JSON.stringify({
          stockQuantity: Math.floor(nextValue),
          alertThreshold: item.alertThreshold,
          description: "Mise à jour rapide depuis l'inventaire",
        }),
      }
    );

    setPendingInventoryId(null);
    if (!result.ok) {
      setError(result.error ?? "Mise à jour du stock impossible.");
      return;
    }

    setSuccess("Stock mis à jour.");
    await loadProducts();
  };

  const quickUpdatePrice = async (item: ManagerProduct) => {
    const response = window.prompt(
      `Nouveau prix (€) pour ${item.product.name}`,
      String(item.price)
    );
    if (response === null) return;
    const nextValue = Number(response.replace(",", "."));
    if (!Number.isFinite(nextValue) || nextValue < 0) {
      setError("Prix invalide.");
      return;
    }

    setPendingInventoryId(item.inventoryId);
    setError(null);
    const result = await apiJsonAuth<PriceUpdateResponse>(
      `/api/manager/products/${item.inventoryId}/price`,
      {
        method: "PATCH",
        body: JSON.stringify({
          price: nextValue,
          description: "Mise à jour rapide depuis l'inventaire",
        }),
      }
    );

    setPendingInventoryId(null);
    if (!result.ok) {
      setError(result.error ?? "Mise à jour du prix impossible.");
      return;
    }

    setSuccess("Prix mis à jour.");
    await loadProducts();
  };

  const deleteProduct = async (item: ManagerProduct) => {
    const confirmed = window.confirm(
      `Supprimer ${item.product.name} de votre inventaire ?`
    );
    if (!confirmed) return;

    setPendingInventoryId(item.inventoryId);
    setError(null);
    const result = await apiJsonAuth<{ success: boolean }>(
      `/api/manager/products/${item.inventoryId}`,
      {
        method: "DELETE",
      }
    );
    setPendingInventoryId(null);

    if (!result.ok) {
      setError(result.error ?? "Suppression impossible.");
      return;
    }

    setSuccess("Produit supprimé de l'inventaire.");
    await loadProducts();
  };

  const createCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setCreatingCategory(true);
    setError(null);
    const result = await apiJsonAuth<ManagerCategory>("/api/manager/products/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    setCreatingCategory(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Création de catégorie impossible.");
      return;
    }

    setNewCategoryName("");
    setSuccess("Catégorie créée.");
    await loadProducts();
  };

  const startRenameCategory = (entry: ManagerCategory) => {
    setEditingCategoryId(entry._id);
    setEditingCategoryName(entry.name);
  };

  const saveRenameCategory = async () => {
    if (!editingCategoryId) return;
    const name = editingCategoryName.trim();
    if (!name) {
      setError("Le nom de catégorie est requis.");
      return;
    }

    setCategoryBusyId(editingCategoryId);
    setError(null);
    const result = await apiJsonAuth<ManagerCategory>(
      `/api/manager/products/categories/${editingCategoryId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }
    );
    setCategoryBusyId(null);

    if (!result.ok) {
      setError(result.error ?? "Renommage impossible.");
      return;
    }

    setEditingCategoryId(null);
    setEditingCategoryName("");
    setSuccess("Catégorie renommée.");
    await loadProducts();
  };

  const deleteCategory = async (entry: ManagerCategory) => {
    const replacement = window.prompt(
      "Catégorie de remplacement (laissez vide pour supprimer la catégorie des produits existants).",
      ""
    );
    if (replacement === null) return;

    setCategoryBusyId(entry._id);
    setError(null);
    const result = await apiJsonAuth<{ success: boolean }>(
      `/api/manager/products/categories/${entry._id}`,
      {
        method: "DELETE",
        body: JSON.stringify({
          replaceWith: replacement.trim() || undefined,
        }),
      }
    );
    setCategoryBusyId(null);

    if (!result.ok) {
      setError(result.error ?? "Suppression de catégorie impossible.");
      return;
    }

    if (category === entry.name) {
      setCategory("Toutes catégories");
    }
    setSuccess("Catégorie supprimée.");
    await loadProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Inventaire des produits</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadProducts()}
            className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
          <Link
            href="/pharmacy/inventory/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
              +
            </span>
            Ajouter un produit
          </Link>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Total produits</p>
          <p className="mt-2 text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Stock faible</p>
          <p className="mt-2 text-xl font-semibold text-amber-600">{stats.lowStock}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Rupture</p>
          <p className="mt-2 text-xl font-semibold text-rose-600">{stats.outOfStock}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Expiration proche (30 j)</p>
          <p className="mt-2 text-xl font-semibold">{stats.nearExpiry}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
          <p className="text-xs font-semibold text-[#1F1D1B]">Catégories produit (CRUD)</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Nouvelle catégorie"
              className="min-w-[180px] flex-1 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
            />
            <button
              type="button"
              onClick={() => void createCategory()}
              disabled={creatingCategory}
              className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {creatingCategory ? "Création..." : "Créer"}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {managerCategories.length === 0 ? (
              <span className="text-xs text-[#6B7280]">Aucune catégorie.</span>
            ) : (
              managerCategories.map((entry) => {
                const isEditing = editingCategoryId === entry._id;
                const isBusy = categoryBusyId === entry._id;
                return (
                  <div
                    key={entry._id}
                    className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs"
                  >
                    {isEditing ? (
                      <input
                        value={editingCategoryName}
                        onChange={(event) => setEditingCategoryName(event.target.value)}
                        className="w-32 rounded-full border border-[#E5E7EB] px-2 py-1 text-xs"
                      />
                    ) : (
                      <span className="font-semibold">
                        {entry.name} ({entry.productCount})
                      </span>
                    )}
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void saveRenameCategory()}
                          disabled={isBusy}
                          className="text-[#0B63D1]"
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(null);
                            setEditingCategoryName("");
                          }}
                          className="text-[#6B7280]"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startRenameCategory(entry)}
                          disabled={isBusy}
                          className="text-[#0B63D1]"
                        >
                          Renommer
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteCategory(entry)}
                          disabled={isBusy}
                          className="text-[#B91C1C]"
                        >
                          Suppr.
                        </button>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M20 20l-3.5-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full rounded-full border border-[#E5E7EB] py-2 pl-10 pr-4 text-xs"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-full border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            {categories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-full border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            <option value="recent">Tri: défaut</option>
            <option value="stock-asc">Stock croissant</option>
            <option value="stock-desc">Stock décroissant</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {loading ? (
          <p className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-xs text-[#6B7280]">
            Chargement de l&apos;inventaire...
          </p>
        ) : (
          <>
            <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EB]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[840px] text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280]">
                    <tr>
                      <th className="px-4 py-3 text-left">Produit</th>
                      <th className="px-4 py-3 text-left">Catégorie</th>
                      <th className="px-4 py-3 text-left">Prix</th>
                      <th className="px-4 py-3 text-left">Stock</th>
                      <th className="px-4 py-3 text-left">Seuil</th>
                      <th className="px-4 py-3 text-left">Disponibilité</th>
                      <th className="px-4 py-3 text-left">Expiration</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item) => {
                      const isPending = pendingInventoryId === item.inventoryId;
                      return (
                        <tr key={item.inventoryId} className="border-t border-[#E5E7EB]">
                          <td className="px-4 py-3">
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-[10px] text-[#9CA3AF]">
                              {item.product.barcode ?? "Sans code-barres"}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">
                            {item.product.category ?? "-"}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`font-semibold ${
                                item.stockQuantity > 0 &&
                                item.stockQuantity <= item.alertThreshold
                                  ? "text-amber-700"
                                  : item.stockQuantity <= 0
                                  ? "text-rose-700"
                                  : "text-[#1F1D1B]"
                              }`}
                            >
                              {item.stockQuantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">{item.alertThreshold}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                item.isAvailable
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                            >
                              {item.isAvailable ? "Disponible" : "Indisponible"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">
                            {formatDate(item.expiryDate)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => void quickUpdateStock(item)}
                                className="rounded-full border border-[#E5E7EB] px-3 py-1 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Stock
                              </button>
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => void quickUpdatePrice(item)}
                                className="rounded-full border border-[#E5E7EB] px-3 py-1 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Prix
                              </button>
                              <button
                                type="button"
                                disabled={isPending}
                                onClick={() => void deleteProduct(item)}
                                className="rounded-full border border-[#FECACA] px-3 py-1 text-[11px] font-semibold text-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Suppr.
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-xs text-[#6B7280]">
                Aucun produit trouvé avec ces filtres.
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
