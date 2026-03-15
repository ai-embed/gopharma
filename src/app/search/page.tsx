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
  const [query, setQuery] = useState("");
  const [address, setAddress] = useState("");
  const [radiusKm, setRadiusKm] = useState(20);
  const [maxPrice, setMaxPrice] = useState("");
  const [openNow, setOpenNow] = useState(true);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [multiResults, setMultiResults] = useState<MultiResult[]>([]);
  const [multiQuery, setMultiQuery] = useState("");
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
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await apiJson<string[]>(
        `/api/search/autocomplete?q=${encodeURIComponent(query)}&prefix=true`
      );
      if (res.ok && res.data) {
        setSuggestions(res.data.slice(0, 6));
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const maxPriceNumber = useMemo(() => {
    if (!maxPrice.trim()) return undefined;
    const value = Number(maxPrice);
    return Number.isNaN(value) ? undefined : value;
  }, [maxPrice]);

  const runSearch = async () => {
    setLoading(true);
    setError(null);
    setMultiResults([]);

    const params = new URLSearchParams();
    params.set("q", query || "");
    if (address.trim()) params.set("address", address.trim());
    if (category) params.set("category", category);
    if (openNow !== undefined) params.set("openNow", String(openNow));
    if (radiusKm) params.set("radiusKm", String(radiusKm));
    if (maxPriceNumber !== undefined) params.set("maxPrice", String(maxPriceNumber));

    const res = await apiJson<SearchResult[]>(
      `/api/search/products?${params.toString()}`
    );
    setLoading(false);

    if (!res.ok) {
      setError(res.error ?? "Recherche impossible.");
      return;
    }

    setResults(res.data ?? []);
  };

  const runMultiSearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    const params = new URLSearchParams();
    params.set("q", multiQuery);
    if (address.trim()) params.set("address", address.trim());
    if (openNow !== undefined) params.set("openNow", String(openNow));
    if (radiusKm) params.set("radiusKm", String(radiusKm));
    if (maxPriceNumber !== undefined) params.set("maxPrice", String(maxPriceNumber));

    const res = await apiJson<MultiResult[]>(
      `/api/search/products/multi?${params.toString()}`
    );
    setLoading(false);

    if (!res.ok) {
      setError(res.error ?? "Recherche multi-produits impossible.");
      return;
    }

    setMultiResults(res.data ?? []);
  };

  const [mode, setMode] = useState<"single" | "multi">("single");

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-6xl space-y-6">
        <TopNav />

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Recherche de produits</h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Trouvez rapidement un produit disponible près de vous.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                mode === "single"
                  ? "bg-[#0B63D1] text-white"
                  : "border border-[#E5E7EB] text-[#1F2937]"
              }`}
            >
              Simple
            </button>
            <button
              type="button"
              onClick={() => setMode("multi")}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                mode === "multi"
                  ? "bg-[#0B63D1] text-white"
                  : "border border-[#E5E7EB] text-[#1F2937]"
              }`}
            >
              Multi-produits
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 rounded-3xl border border-[#E5E7EB] bg-white p-6">
            {mode === "single" ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Produit recherché
                </label>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Paracetamol, Ibuprofen..."
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                />
                {suggestions.length > 0 ? (
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-2 text-sm shadow">
                    {suggestions.map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => {
                          setQuery(item);
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
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Liste de produits (séparés par des virgules)
                </label>
                <textarea
                  value={multiQuery}
                  onChange={(event) => setMultiQuery(event.target.value)}
                  placeholder="Paracetamol, Ibuprofen, Vitamine C"
                  className="min-h-[120px] w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">Adresse</label>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Cotonou, Benin"
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Rayon (km)
                </label>
                <input
                  type="number"
                  min={1}
                  value={radiusKm}
                  onChange={(event) => setRadiusKm(Number(event.target.value))}
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {mode === "single" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6B7280]">Catégorie</label>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Toutes</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6B7280]">
                    Prix max (XOF)
                  </label>
                  <input
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="5000"
                    className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Prix max (XOF)
                </label>
                <input
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="5000"
                  className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                />
              </div>
            )}

            <label className="flex items-center gap-3 text-sm text-[#6B7280]">
              <input
                type="checkbox"
                checked={openNow}
                onChange={(event) => setOpenNow(event.target.checked)}
                className="h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1] focus:ring-blue-200"
              />
              Afficher uniquement les pharmacies ouvertes
            </label>

            <button
              type="button"
              onClick={mode === "single" ? runSearch : runMultiSearch}
              className="w-full rounded-2xl bg-[#0B63D1] px-6 py-3 text-sm font-semibold text-white"
            >
              Lancer la recherche
            </button>
          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#1F2937]">Résultats</h2>
            {loading ? (
              <p className="mt-4 text-sm text-[#6B7280]">Recherche en cours...</p>
            ) : error ? (
              <p className="mt-4 text-sm text-red-600">{error}</p>
            ) : mode === "single" ? (
              results.length === 0 ? (
                <p className="mt-4 text-sm text-[#6B7280]">
                  Aucun résultat pour le moment.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {results.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-2xl border border-[#E5E7EB] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold">
                            {item.productId.name}
                          </h3>
                          <p className="mt-1 text-xs text-[#6B7280]">
                            {item.pharmacyId.name}
                          </p>
                          {item.pharmacyId.address ? (
                            <p className="text-xs text-[#9CA3AF]">
                              {item.pharmacyId.address}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#0B63D1]">
                            {item.price.toLocaleString()} XOF
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            Stock: {item.stockQuantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : multiResults.length === 0 ? (
              <p className="mt-4 text-sm text-[#6B7280]">
                Aucun résultat pour le moment.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {multiResults.map((item) => (
                  <div
                    key={item.pharmacy.name}
                    className="rounded-2xl border border-[#E5E7EB] p-4"
                  >
                    <h3 className="text-sm font-semibold">{item.pharmacy.name}</h3>
                    {item.pharmacy.address ? (
                      <p className="text-xs text-[#9CA3AF]">
                        {item.pharmacy.address}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-[#6B7280]">
                      {item.matchedCount} produits trouvés
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.matchedProducts.map((product) => (
                        <span
                          key={product}
                          className="rounded-full bg-[#F3F6F9] px-3 py-1 text-xs text-[#1F2937]"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
