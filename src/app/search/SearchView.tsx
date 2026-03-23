"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiJson } from "@/lib/api";
import { PatientShell } from "@/components/PatientShell";

const SearchResultsMap = dynamic(() => import("@/components/SearchResultsMap"), {
  ssr: false,
});

type Coordinates = {
  lat: number;
  lng: number;
};

type PharmacyLocation = {
  coordinates: [number, number];
};

type PublicPharmacy = {
  _id: string;
  name: string;
  address?: string;
  description?: string;
  email?: string;
  services?: string[];
  photoFileId?: string;
  operationalStatus?: "OUVERT" | "FERME";
  openNow?: boolean;
  location?: PharmacyLocation;
};

interface SearchResult {
  _id: string;
  productId: {
    name: string;
    scientificName?: string;
    category?: string;
    isMedicine: boolean;
  };
  pharmacyId: PublicPharmacy;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
}

interface MultiResult {
  pharmacy: PublicPharmacy;
  matchedCount: number;
  matchedProducts: string[];
}

type SearchPanelPharmacy = PublicPharmacy & {
  badgeLabel?: string;
  secondaryLabel?: string;
};

type SortMode = "priceAsc" | "priceDesc";

function parseInitialQuery(rawQuery: string) {
  const tokens = rawQuery
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (tokens.length > 1) {
    return { queryInput: "", queryTokens: tokens };
  }

  return {
    queryInput: tokens[0] ?? "",
    queryTokens: [] as string[],
  };
}

const formatDistance = (from: Coordinates, to: Coordinates) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return `${(earthRadiusKm * c).toFixed(1)} km`;
};

const getDistanceKm = (from: Coordinates, pharmacy?: PublicPharmacy) => {
  const coords = pharmacy?.location?.coordinates;
  if (!coords?.length) {
    return null;
  }

  const [lng, lat] = coords;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat - from.lat);
  const dLng = toRad(lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(lat);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const buildDirectionsUrl = (pharmacy: PublicPharmacy) => {
  const coords = pharmacy.location?.coordinates;
  if (coords?.length === 2) {
    const [lng, lat] = coords;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  if (pharmacy.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.address)}`;
  }

  return null;
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";
  const initialState = useMemo(() => parseInitialQuery(initialQuery), [initialQuery]);
  const [queryInput, setQueryInput] = useState(initialState.queryInput);
  const [queryTokens, setQueryTokens] = useState<string[]>(initialState.queryTokens);
  const [openNow, setOpenNow] = useState(true);
  const [stockOnly, setStockOnly] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("priceAsc");
  const [radiusKm, setRadiusKm] = useState(50);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [multiResults, setMultiResults] = useState<MultiResult[]>([]);
  const [pharmacyMatches, setPharmacyMatches] = useState<PublicPharmacy[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<PublicPharmacy[]>([]);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const shouldAutoSearchRef = useRef(Boolean(initialQuery));

  useEffect(() => {
    let active = true;

    apiJson<string[]>("/api/search/categories").then((res) => {
      if (!active || !res.ok || !res.data) {
        return;
      }

      setCategories(res.data);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!queryInput || queryInput.length < 2) {
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      const res = await apiJson<string[]>(
        `/api/search/autocomplete?q=${encodeURIComponent(queryInput)}&prefix=true`
      );

      if (!active) {
        return;
      }

      if (res.ok && res.data) {
        setSuggestions(res.data.slice(0, 6));
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [queryInput]);

  const loadNearbyPharmacies = useCallback(
    async (coords?: Coordinates, allowFallback = true) => {
      const requestNearbyPharmacies = async (
        currentCoords?: Coordinates,
        canFallback = true
      ) => {
      const params = new URLSearchParams();
      if (currentCoords) {
        params.set("lat", currentCoords.lat.toString());
        params.set("lng", currentCoords.lng.toString());
      }
      params.set("radiusKm", radiusKm.toString());
      params.set("openNow", String(openNow));

      const res = await apiJson<PublicPharmacy[]>(
        `/api/search/pharmacies${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (!res.ok) {
        return;
      }

      const data = res.data ?? [];
      if (currentCoords && data.length === 0 && canFallback) {
        await requestNearbyPharmacies(undefined, false);
        return;
      }

      setNearbyPharmacies(data);
      };

      await requestNearbyPharmacies(coords, allowFallback);
    },
    [openNow, radiusKm]
  );

  useEffect(() => {
    let active = true;

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!active) {
            return;
          }

          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCoords(coords);
          void loadNearbyPharmacies(coords);
        },
        () => {
          void loadNearbyPharmacies();
        },
        { timeout: 5000 }
      );
    } else {
      void loadNearbyPharmacies();
    }

    return () => {
      active = false;
    };
  }, [loadNearbyPharmacies]);

  const visibleSuggestions = queryInput.length < 2 ? [] : suggestions;

  const commitToken = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    setQueryTokens((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
    setQueryInput("");
    setSuggestions([]);
  };

  const removeToken = (value: string) => {
    setQueryTokens((prev) => prev.filter((token) => token !== value));
  };

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    const baseParams = new URLSearchParams();
    if (openNow !== undefined) {
      baseParams.set("openNow", String(openNow));
    }
    if (category) {
      baseParams.set("category", category);
    }
    if (userCoords) {
      baseParams.set("lat", userCoords.lat.toString());
      baseParams.set("lng", userCoords.lng.toString());
    }
    baseParams.set("radiusKm", radiusKm.toString());

    if (queryTokens.length > 0) {
      baseParams.set("q", queryTokens.join(", "));
      const res = await apiJson<MultiResult[]>(
        `/api/search/products/multi?${baseParams.toString()}`
      );

      setLoading(false);

      if (!res.ok) {
        setError(res.error ?? "Recherche multi-produits impossible.");
        return;
      }

      setMultiResults(res.data ?? []);
      setResults([]);
      setPharmacyMatches([]);
      return;
    }

    const trimmedQuery = queryInput.trim();
    if (!trimmedQuery) {
      setResults([]);
      setMultiResults([]);
      setPharmacyMatches(nearbyPharmacies);
      setLoading(false);
      return;
    }

    baseParams.set("q", trimmedQuery);
    const productRes = await apiJson<SearchResult[]>(
      `/api/search/products?${baseParams.toString()}`
    );

    if (!productRes.ok) {
      setLoading(false);
      setError(productRes.error ?? "Recherche impossible.");
      return;
    }

    const productData = productRes.data ?? [];
    if (productData.length > 0) {
      setResults(productData);
      setMultiResults([]);
      setPharmacyMatches([]);
      setLoading(false);
      return;
    }

    const pharmacyParams = new URLSearchParams();
    pharmacyParams.set("q", trimmedQuery);
    pharmacyParams.set("openNow", String(openNow));
    if (userCoords) {
      pharmacyParams.set("lat", userCoords.lat.toString());
      pharmacyParams.set("lng", userCoords.lng.toString());
    }
    pharmacyParams.set("radiusKm", radiusKm.toString());

    const pharmacyRes = await apiJson<PublicPharmacy[]>(
      `/api/search/pharmacies?${pharmacyParams.toString()}`
    );

    setLoading(false);

    if (!pharmacyRes.ok) {
      setError(pharmacyRes.error ?? "Recherche impossible.");
      return;
    }

    setResults([]);
    setMultiResults([]);
    setPharmacyMatches(pharmacyRes.data ?? []);
  }, [category, nearbyPharmacies, openNow, queryInput, queryTokens, radiusKm, userCoords]);

  useEffect(() => {
    if (!shouldAutoSearchRef.current) return;
    if (queryTokens.length === 0 && queryInput === "") return;
    shouldAutoSearchRef.current = false;
    const timer = window.setTimeout(() => {
      void runSearch();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [queryInput, queryTokens, runSearch]);

  const filteredResults = useMemo(
    () => (stockOnly ? results.filter((item) => item.isAvailable) : results),
    [results, stockOnly]
  );

  const groupedResults = useMemo(() => {
    const map = new Map<
      string,
      {
        pharmacy: PublicPharmacy;
        items: SearchResult[];
      }
    >();

    filteredResults.forEach((item) => {
      const pharmacy = item.pharmacyId;
      const key = pharmacy._id;
      if (!map.has(key)) {
        map.set(key, {
          pharmacy,
          items: [],
        });
      }
      map.get(key)?.items.push(item);
    });

    return Array.from(map.values()).sort((a, b) => {
      const priceA = a.items.reduce((sum, item) => sum + item.price, 0);
      const priceB = b.items.reduce((sum, item) => sum + item.price, 0);
      return sortMode === "priceAsc" ? priceA - priceB : priceB - priceA;
    });
  }, [filteredResults, sortMode]);

  const visiblePharmacies = useMemo<SearchPanelPharmacy[]>(() => {
    if (queryTokens.length > 0) {
      return multiResults.map((item) => ({
        ...item.pharmacy,
        badgeLabel: `${item.matchedCount} produits`,
        secondaryLabel: item.matchedProducts.slice(0, 2).join(" • "),
      }));
    }

    if (groupedResults.length > 0) {
      return groupedResults.map((group) => {
        const totalPrice = group.items.reduce((sum, item) => sum + item.price, 0);
        const availableCount = group.items.filter((item) => item.isAvailable).length;

        return {
          ...group.pharmacy,
          badgeLabel: `${totalPrice.toLocaleString("fr-FR")} XOF`,
          secondaryLabel: `${availableCount}/${group.items.length} produits disponibles`,
        };
      });
    }

    if (pharmacyMatches.length > 0) {
      return [...pharmacyMatches]
        .sort((a, b) => {
          if (!userCoords) {
            return a.name.localeCompare(b.name);
          }
          const distanceA = getDistanceKm(userCoords, a) ?? Number.POSITIVE_INFINITY;
          const distanceB = getDistanceKm(userCoords, b) ?? Number.POSITIVE_INFINITY;
          return distanceA - distanceB;
        })
        .map((pharmacy) => ({
        ...pharmacy,
        badgeLabel: pharmacy.openNow ? "Ouvert" : "Fermé",
        secondaryLabel:
          pharmacy.services?.slice(0, 2).join(" • ") ??
          pharmacy.description ??
          pharmacy.email,
      }));
    }

    return [...nearbyPharmacies]
      .sort((a, b) => {
        if (!userCoords) {
          return a.name.localeCompare(b.name);
        }
        const distanceA = getDistanceKm(userCoords, a) ?? Number.POSITIVE_INFINITY;
        const distanceB = getDistanceKm(userCoords, b) ?? Number.POSITIVE_INFINITY;
        return distanceA - distanceB;
      })
      .map((pharmacy) => ({
      ...pharmacy,
      badgeLabel: pharmacy.openNow ? "Ouvert" : "Fermé",
      secondaryLabel:
        pharmacy.services?.slice(0, 2).join(" • ") ??
        pharmacy.description ??
        pharmacy.email,
    }));
  }, [groupedResults, multiResults, nearbyPharmacies, pharmacyMatches, queryTokens.length, userCoords]);

  const pharmacyCount = visiblePharmacies.length;

  return (
    <PatientShell>
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
                onClick={() => {
                  void runSearch();
                }}
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
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[#F3F6F9]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-[#1F1D1B]">
                Résultats de recherche
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                {pharmacyCount} pharmacies trouvées
                {userCoords ? ` près de vous (${radiusKm} km)` : ""}
              </p>
            </div>
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
            <button
              type="button"
              onClick={() =>
                setSortMode((value) => (value === "priceAsc" ? "priceDesc" : "priceAsc"))
              }
              className="rounded-full border border-[#E5E7EB] px-3 py-2"
            >
              Prix: {sortMode === "priceAsc" ? "croissant" : "décroissant"}
            </button>
            <button
              type="button"
              onClick={() => setStockOnly((value) => !value)}
              className={`rounded-full px-3 py-2 ${
                stockOnly ? "bg-[#EAF2FF] text-[#0B63D1]" : "border border-[#E5E7EB]"
              }`}
            >
              {stockOnly ? "En stock seulement" : "Tous les stocks"}
            </button>
            <select
              value={String(radiusKm)}
              onChange={(event) => setRadiusKm(Number(event.target.value))}
              className="rounded-full border border-[#E5E7EB] px-3 py-2 text-xs text-[#6B7280]"
            >
              <option value="5">Rayon 5 km</option>
              <option value="10">Rayon 10 km</option>
              <option value="20">Rayon 20 km</option>
              <option value="50">Rayon 50 km</option>
            </select>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-full border border-[#E5E7EB] px-3 py-2 text-xs text-[#6B7280]"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>
              {pharmacyCount} pharmacies trouvées
              {userCoords ? ` dans ${radiusKm} km` : ""}
            </span>
            <span className="rounded-full border border-[#E5E7EB] px-3 py-1">
              {queryTokens.length > 0 || groupedResults.length > 0
                ? "Vue produits"
                : "Vue pharmacies"}
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-[#6B7280]">Recherche en cours...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : queryTokens.length > 0 ? (
            <div className="space-y-4">
              {multiResults.map((item) => {
                const directionsUrl = buildDirectionsUrl(item.pharmacy);

                return (
                  <div
                    key={item.pharmacy._id}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">{item.pharmacy.name}</h3>
                        <p className="text-xs text-[#6B7280]">
                          {item.pharmacy.address ?? "Adresse non renseignée"}
                        </p>
                        {userCoords && item.pharmacy.location?.coordinates ? (
                          <p className="mt-1 text-[11px] text-[#0B63D1]">
                            {formatDistance(userCoords, {
                              lat: item.pharmacy.location.coordinates[1],
                              lng: item.pharmacy.location.coordinates[0],
                            })}
                          </p>
                        ) : null}
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
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/pharmacies/${item.pharmacy._id}`}
                          className="rounded-full border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#1F1D1B]"
                        >
                          Voir détails
                        </Link>
                        {directionsUrl ? (
                          <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full bg-[#0B63D1] px-3 py-2 text-center text-[11px] font-semibold text-white"
                          >
                            Itinéraire
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : groupedResults.length > 0 ? (
            <div className="space-y-4">
              {groupedResults.map((group) => {
                const availableCount = group.items.filter((item) => item.isAvailable).length;
                const totalPrice = group.items.reduce((sum, item) => sum + item.price, 0);
                const directionsUrl = buildDirectionsUrl(group.pharmacy);

                return (
                  <div
                    key={group.pharmacy._id}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-sm font-semibold">{group.pharmacy.name}</h3>
                          <p className="text-xs text-[#6B7280]">
                            {group.pharmacy.address ?? "Adresse non renseignée"}
                          </p>
                          {userCoords && group.pharmacy.location?.coordinates ? (
                            <p className="mt-1 text-[11px] text-[#0B63D1]">
                              {formatDistance(userCoords, {
                                lat: group.pharmacy.location.coordinates[1],
                                lng: group.pharmacy.location.coordinates[0],
                              })}
                            </p>
                          ) : null}
                        </div>
                        <p className="text-[11px] text-[#6B7280]">
                          {availableCount}/{group.items.length} produits disponibles
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
                                    item.isAvailable ? "bg-emerald-500" : "bg-rose-500"
                                  }`}
                                />
                                <span>{item.productId.name}</span>
                              </div>
                              <span className="text-[#1F1D1B]">
                                {item.price.toLocaleString("fr-FR")} XOF
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#0B63D1]">
                          {totalPrice.toLocaleString("fr-FR")} XOF
                        </p>
                        <p className="text-[11px] text-[#6B7280]">Total estimé</p>
                        <div className="mt-3 flex flex-col gap-2">
                          <Link
                            href={`/pharmacies/${group.pharmacy._id}`}
                            className="rounded-full border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#1F1D1B]"
                          >
                            Voir détails
                          </Link>
                          {directionsUrl ? (
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-[#0B63D1] px-3 py-2 text-center text-[11px] font-semibold text-white"
                            >
                              Itinéraire
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : visiblePharmacies.length === 0 ? (
            <p className="text-sm text-[#6B7280]">Aucun résultat pour le moment.</p>
          ) : (
            <div className="space-y-4">
              {visiblePharmacies.map((pharmacy) => {
                const directionsUrl = buildDirectionsUrl(pharmacy);
                const services = pharmacy.services?.slice(0, 3) ?? [];

                return (
                  <div
                    key={pharmacy._id}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-sm font-semibold">{pharmacy.name}</h3>
                          <p className="text-xs text-[#6B7280]">
                            {pharmacy.address ?? "Adresse non renseignée"}
                          </p>
                          {userCoords && pharmacy.location?.coordinates ? (
                            <p className="mt-1 text-[11px] text-[#0B63D1]">
                              {formatDistance(userCoords, {
                                lat: pharmacy.location.coordinates[1],
                                lng: pharmacy.location.coordinates[0],
                              })}
                            </p>
                          ) : null}
                        </div>
                        {pharmacy.secondaryLabel ? (
                          <p className="text-[11px] text-[#6B7280]">
                            {pharmacy.secondaryLabel}
                          </p>
                        ) : null}
                        {services.length > 0 ? (
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            {services.map((service) => (
                              <span
                                key={service}
                                className="rounded-full bg-[#F3F6F9] px-2 py-1 text-[#6B7280]"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-right">
                        {pharmacy.badgeLabel ? (
                          <p className="text-sm font-semibold text-[#0B63D1]">
                            {pharmacy.badgeLabel}
                          </p>
                        ) : null}
                        <div className="mt-3 flex flex-col gap-2">
                          <Link
                            href={`/pharmacies/${pharmacy._id}`}
                            className="rounded-full border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#1F1D1B]"
                          >
                            Voir détails
                          </Link>
                          {directionsUrl ? (
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-[#0B63D1] px-3 py-2 text-center text-[11px] font-semibold text-white"
                            >
                              Itinéraire
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>

        <SearchResultsMap pharmacies={visiblePharmacies} userCoords={userCoords} />
      </div>
    </PatientShell>
  );
}
