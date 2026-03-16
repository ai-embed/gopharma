"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api";
import { TopNav } from "@/components/TopNav";

interface SearchResult {
  _id: string;
  productId: {
    name: string;
    scientificName?: string;
    category?: string;
    isMedicine: boolean;
  };
  pharmacyId: {
    name: string;
    address?: string;
    operationalStatus?: string;
  };
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
}

interface MultiResult {
  pharmacy: {
    name: string;
    address?: string;
  };
  matchedCount: number;
  matchedProducts: string[];
}

export default function SearchPage() {
  const [queryInput, setQueryInput] = useState("");
  const [queryTokens, setQueryTokens] = useState<string[]>([]);
  const [openNow, setOpenNow] = useState(true);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [multiResults, setMultiResults] = useState<MultiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    apiJson<string[]>("/api/search/categories").then((res) => {
      if (res.ok && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!queryInput || queryInput.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      const res = await apiJson<string[]>(
        `/api/search/autocomplete?q=${encodeURIComponent(queryInput)}&prefix=true`
      );
      if (res.ok && res.data) {
        setSuggestions(res.data.slice(0, 6));
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [queryInput]);

  const visibleSuggestions = queryInput.length < 2 ? [] : suggestions;

  const commitToken = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    setQueryTokens((prev) =>
      prev.includes(cleaned) ? prev : [...prev, cleaned]
    );
    setQueryInput("");
  };

  const removeToken = (value: string) => {
    setQueryTokens((prev) => prev.filter((token) => token !== value));
  };

  const runSearch = async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (openNow !== undefined) params.set("openNow", String(openNow));

    if (queryTokens.length > 0) {
      params.set("q", queryTokens.join(", "));
      const res = await apiJson<MultiResult[]>(
        `/api/search/products/multi?${params.toString()}`
      );
      setLoading(false);
      if (!res.ok) {
        setError(res.error ?? "Recherche multi-produits impossible.");
        return;
      }
      setMultiResults(res.data ?? []);
      setResults([]);
      return;
    }

    params.set("q", queryInput || "");
    if (category) params.set("category", category);
    const res = await apiJson<SearchResult[]>(
      `/api/search/products?${params.toString()}`
    );
    setLoading(false);

    if (!res.ok) {
      setError(res.error ?? "Recherche impossible.");
      return;
    }

    setResults(res.data ?? []);
    setMultiResults([]);
  };

  const groupedResults = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        address?: string;
        items: SearchResult[];
      }
    >();
    results.forEach((item) => {
      const key = item.pharmacyId.name;
      if (!map.has(key)) {
        map.set(key, {
          name: item.pharmacyId.name,
          address: item.pharmacyId.address,
          items: [],
        });
      }
      map.get(key)?.items.push(item);
    });
    return Array.from(map.values());
  }, [results]);

  const pharmacyCount =
    queryTokens.length > 0 ? multiResults.length : groupedResults.length;

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-6 text-[#1F1D1B]">
      <div className="mx-auto max-w-7xl space-y-5">
        <TopNav />

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-4">
            <div className="relative rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                {queryTokens.map((token) => (
                  <span
                    key={token}
                    className="flex items-center gap-2 rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-semibold text-[#0B63D1]"
                  >
                    {token}
                    <button
                      type="button"
                      onClick={() => removeToken(token)}
                      className="text-[10px] font-semibold"
                    >
                      x
                    </button>
                  </span>
                ))}
                <input
                  value={queryInput}
                  onChange={(event) => setQueryInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      commitToken(queryInput);
                    }
                  }}
                  placeholder="Ajouter un produit..."
                  className="min-w-[140px] flex-1 border-none bg-transparent text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={runSearch}
                  className="rounded-full bg-[#0B63D1] px-3 py-2 text-[11px] font-semibold text-white"
                >
                  Rechercher
                </button>
              </div>
              {visibleSuggestions.length > 0 ? (
                <div className="absolute left-4 right-4 top-full z-10 mt-2 rounded-2xl border border-[#E5E7EB] bg-white p-2 text-sm shadow">
                  {visibleSuggestions.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        commitToken(item);
                        setSuggestions([]);
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[#F3F6F9]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#6B7280]">
              <button className="rounded-full border border-[#E5E7EB] px-3 py-2">
                Tous les filtres
              </button>
              <button
                type="button"
                onClick={() => setOpenNow((value) => !value)}
                className={`rounded-full px-3 py-2 ${
                  openNow ? "bg-[#EAF2FF] text-[#0B63D1]" : "border border-[#E5E7EB]"
                }`}
              >
                Ouvert maintenant
              </button>
              <button className="rounded-full border border-[#E5E7EB] px-3 py-2">
                Prix: croissant
              </button>
              <button className="rounded-full border border-[#E5E7EB] px-3 py-2">
                Disponibilite
              </button>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-full border border-[#E5E7EB] px-3 py-2 text-xs text-[#6B7280]"
              >
                <option value="">Toutes les categories</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>{pharmacyCount} pharmacies trouvées près de vous</span>
              <span className="rounded-full border border-[#E5E7EB] px-3 py-1">
                Prix total
              </span>
            </div>

            {loading ? (
              <p className="text-sm text-[#6B7280]">Recherche en cours...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : queryTokens.length > 0 ? (
              <div className="space-y-4">
                {multiResults.map((item) => (
                  <div
                    key={item.pharmacy.name}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">
                          {item.pharmacy.name}
                        </h3>
                        <p className="text-xs text-[#6B7280]">
                          {item.pharmacy.address ?? "Adresse non renseignée"}
                        </p>
                        <p className="mt-2 text-[11px] text-[#6B7280]">
                          {item.matchedCount} produits disponibles
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          {item.matchedProducts.map((product) => (
                            <span
                              key={product}
                              className="rounded-full bg-[#F3F6F9] px-2 py-1 text-[#6B7280]"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="rounded-full bg-[#0B63D1] px-3 py-2 text-[11px] font-semibold text-white">
                        Itineraire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : groupedResults.length === 0 ? (
              <p className="text-sm text-[#6B7280]">Aucun resultat pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {groupedResults.map((group) => {
                  const availableCount = group.items.filter(
                    (item) => item.isAvailable
                  ).length;
                  const totalPrice = group.items.reduce(
                    (sum, item) => sum + item.price,
                    0
                  );
                  return (
                    <div
                      key={group.name}
                      className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-sm font-semibold">{group.name}</h3>
                            <p className="text-xs text-[#6B7280]">
                              {group.address ?? "Adresse non renseignée"}
                            </p>
                          </div>
                          <p className="text-[11px] text-[#6B7280]">
                            {availableCount}/{group.items.length} produits
                            disponibles
                          </p>
                          <div className="space-y-1 text-[11px] text-[#6B7280]">
                            {group.items.map((item) => (
                              <div
                                key={item._id}
                                className="flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      item.isAvailable
                                        ? "bg-emerald-500"
                                        : "bg-rose-500"
                                    }`}
                                  />
                                  <span>{item.productId.name}</span>
                                </div>
                                <span className="text-[#1F1D1B]">
                                  {item.price.toLocaleString()} XOF
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#0B63D1]">
                            {totalPrice.toLocaleString()} XOF
                          </p>
                          <p className="text-[11px] text-[#6B7280]">
                            Total panier
                          </p>
                          <button className="mt-3 rounded-full bg-[#0B63D1] px-3 py-2 text-[11px] font-semibold text-white">
                            Itineraire
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="relative min-h-[600px] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E6E9ED]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#dfe6ee,transparent_60%),radial-gradient(circle_at_80%_40%,#dfe6ee,transparent_50%)]" />
            <div className="absolute inset-0 opacity-40">
              <div className="absolute left-10 top-10 h-40 w-40 rounded-full border-2 border-white/60" />
              <div className="absolute right-16 top-24 h-64 w-64 rounded-full border-2 border-white/60" />
              <div className="absolute left-32 bottom-20 h-64 w-64 rounded-full border-2 border-white/60" />
            </div>
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1F1D1B] shadow">
                ⛶
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1F1D1B] shadow">
                +
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1F1D1B] shadow">
                -
              </button>
            </div>
            <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
              ⊙
            </div>

            <div className="absolute left-1/3 top-1/3 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0B63D1] shadow">
              4,50€
            </div>
            <div className="absolute left-1/2 top-1/2 flex items-center gap-2 rounded-full bg-[#0B63D1] px-3 py-1 text-xs font-semibold text-white shadow">
              5,20€
            </div>
            <div className="absolute right-1/4 top-2/3 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1F1D1B] shadow">
              6,15€
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
