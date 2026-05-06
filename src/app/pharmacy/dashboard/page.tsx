"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type ManagerPharmacy = {
  _id: string;
  name: string;
  address: string;
  accountStatus: string;
  operationalStatus: "OUVERT" | "FERME";
  createdAt?: string;
};

type ManagerProduct = {
  inventoryId: string;
  price: number;
  stockQuantity: number;
  alertThreshold: number;
  isAvailable: boolean;
  product: {
    _id: string;
    name: string;
    category?: string;
  };
};

type VisitStats = {
  total: number;
  last7Days: number;
  last30Days: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PharmacyDashboardPage() {
  const [pharmacy, setPharmacy] = useState<ManagerPharmacy | null>(null);
  const [products, setProducts] = useState<ManagerProduct[]>([]);
  const [visits, setVisits] = useState<VisitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setError(null);
    setLoading(true);

    const [pharmacyResult, productsResult, visitsResult] = await Promise.all([
      apiJsonAuth<ManagerPharmacy>("/api/manager/pharmacy"),
      apiJsonAuth<ManagerProduct[]>("/api/manager/products"),
      apiJsonAuth<VisitStats>("/api/manager/stats/visits"),
    ]);

    if (!pharmacyResult.ok || !pharmacyResult.data) {
      setError(
        pharmacyResult.error ??
          "Impossible de charger le tableau de bord de la pharmacie."
      );
      setLoading(false);
      return;
    }

    setPharmacy(pharmacyResult.data);
    setProducts(productsResult.ok && productsResult.data ? productsResult.data : []);
    setVisits(visitsResult.ok && visitsResult.data ? visitsResult.data : null);

    if (!productsResult.ok) {
      setError(
        productsResult.error ?? "Les statistiques de stock n'ont pas pu être chargées."
      );
    } else if (!visitsResult.ok) {
      setError(
        visitsResult.error ?? "Les statistiques de visites n'ont pas pu être chargées."
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const availableCount = products.filter(
      (item) => item.isAvailable && item.stockQuantity > 0
    ).length;
    const lowStockCount = products.filter(
      (item) => item.stockQuantity > 0 && item.stockQuantity <= item.alertThreshold
    ).length;
    const outOfStockCount = products.filter((item) => item.stockQuantity <= 0).length;
    const stockValue = products.reduce((sum, item) => {
      if (item.stockQuantity <= 0) return sum;
      return sum + item.price * item.stockQuantity;
    }, 0);

    return {
      totalProducts: products.length,
      availableCount,
      lowStockCount,
      outOfStockCount,
      stockValue,
    };
  }, [products]);

  const lowStockProducts = useMemo(
    () =>
      products
        .filter(
          (item) => item.stockQuantity > 0 && item.stockQuantity <= item.alertThreshold
        )
        .sort((a, b) => a.stockQuantity - b.stockQuantity)
        .slice(0, 6),
    [products]
  );

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-sm text-[#6B7280]">
        Chargement du tableau de bord pharmacie...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Tableau de bord pharmacie</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            {pharmacy?.name ?? "Pharmacie"} · {pharmacy?.address ?? "Adresse non renseignée"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
        >
          Actualiser
        </button>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Produits au catalogue</p>
          <p className="mt-2 text-xl font-semibold">{stats.totalProducts}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            {stats.availableCount} produits disponibles
          </p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Stock faible</p>
          <p className="mt-2 text-xl font-semibold text-amber-600">
            {stats.lowStockCount}
          </p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            {stats.outOfStockCount} produits en rupture
          </p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Visites</p>
          <p className="mt-2 text-xl font-semibold">{visits?.last7Days ?? 0}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            7 jours · {visits?.last30Days ?? 0} sur 30 jours
          </p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Valeur du stock</p>
          <p className="mt-2 text-xl font-semibold">{formatCurrency(stats.stockValue)}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            Total visites: {visits?.total ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Alertes stock faible</h2>
            <Link
              href="/pharmacy/inventory"
              className="text-xs font-semibold text-[#0B63D1]"
            >
              Gérer l&apos;inventaire
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-xs text-[#6B7280]">
              Aucun produit sous seuil d&apos;alerte.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280]">
                    <tr>
                      <th className="px-4 py-3 text-left">Produit</th>
                      <th className="px-4 py-3 text-left">Catégorie</th>
                      <th className="px-4 py-3 text-left">Stock</th>
                      <th className="px-4 py-3 text-left">Seuil</th>
                      <th className="px-4 py-3 text-left">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((item) => (
                      <tr key={item.inventoryId} className="border-t border-[#E5E7EB]">
                        <td className="px-4 py-3 font-semibold">{item.product.name}</td>
                        <td className="px-4 py-3 text-[#6B7280]">
                          {item.product.category ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                            {item.stockQuantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{item.alertThreshold}</td>
                        <td className="px-4 py-3 font-semibold">
                          {formatCurrency(item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <h2 className="text-sm font-semibold">État du compte</h2>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Statut validation</span>
                <span className="font-semibold">{pharmacy?.accountStatus ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Ouverture</span>
                <span className="font-semibold">{pharmacy?.operationalStatus ?? "-"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <h2 className="text-sm font-semibold">Actions rapides</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/pharmacy/inventory/new"
                className="rounded-full bg-[#0B63D1] px-3 py-2 text-center text-xs font-semibold text-white"
              >
                Ajouter un produit
              </Link>
              <Link
                href="/pharmacy/plannings"
                className="rounded-full border border-[#E5E7EB] px-3 py-2 text-center text-xs font-semibold text-[#1F1D1B]"
              >
                Mettre à jour les horaires
              </Link>
              <Link
                href="/pharmacy/settings"
                className="rounded-full border border-[#E5E7EB] px-3 py-2 text-center text-xs font-semibold text-[#1F1D1B]"
              >
                Modifier le profil pharmacie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
