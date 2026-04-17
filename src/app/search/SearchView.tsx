"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { PatientShell } from "@/components/PatientShell";
import { useFavorites } from "@/lib/useFavorites";
import { SearchFilters } from "@/components/search/SearchFilters";

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
  photoUrl?: string;
  bannerUrl?: string;
  operationalStatus?: "OUVERT" | "FERME";
  openNow?: boolean;
  nextTransitionAt?: string;
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

type SearchPanelPharmacy = PublicPharmacy & {
  badgeLabel?: string;
  secondaryLabel?: string;
};

type SortMode = "priceAsc" | "priceDesc";

type GroupedPharmacyResult = {
  pharmacy: PublicPharmacy;
  items: SearchResult[];
  matchedProductCount: number;
  availableCount: number;
  totalPrice: number;
};

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

const formatCompactMoney = (value: number) => `${value.toLocaleString("fr-FR")} F`;

const formatTransitionHour = (isoDate?: string) => {
  if (!isoDate) {
    return null;
  }

  const value = new Date(isoDate);
  if (Number.isNaN(value.getTime())) {
    return null;
  }

  const hours = value.getHours().toString().padStart(2, "0");
  const minutes = value.getMinutes().toString().padStart(2, "0");
  return minutes === "00" ? `${hours}h` : `${hours}h${minutes}`;
};

const getOpenStatusPill = (isOpen?: boolean, nextTransitionAt?: string) => {
  if (!isOpen) {
    return "◔ Fermé";
  }

  const transitionLabel = formatTransitionHour(nextTransitionAt);
  return transitionLabel ? `◔ Ouvert jusqu'à ${transitionLabel}` : "◔ Ouvert";
};

const isPharmacyOpenNow = (pharmacy: PublicPharmacy) =>
  pharmacy.openNow ?? pharmacy.operationalStatus === "OUVERT";

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
  const [pharmacyMatches, setPharmacyMatches] = useState<PublicPharmacy[]>([]);
  const [nearbyPharmacies, setNearbyPharmacies] = useState<PublicPharmacy[]>([]);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { isPharmacyFavorite, togglePharmacyFavorite, mutating: favoriteMutating } =
    useFavorites();
  const shouldAutoSearchRef = useRef(Boolean(initialQuery));
  const runSearchRef = useRef<(() => Promise<void>) | null>(null);
  const hasSearchInputRef = useRef(
    initialState.queryTokens.length > 0 || initialState.queryInput.trim() !== ""
  );
  const resultCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const recordHistory = useCallback(
    (query: string, searchType: "PRODUIT" | "PHARMACIE", resultCount: number) => {
      const cleanQuery = query.trim();
      if (!cleanQuery) return;

      void apiJsonAuth("/api/history", {
        method: "POST",
        body: JSON.stringify({
          query: cleanQuery,
          searchType,
          resultCount,
        }),
      });
    },
    []
  );

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

  const clearSearch = () => {
    setQueryInput("");
    setQueryTokens([]);
    setSuggestions([]);
    setResults([]);
    setPharmacyMatches(nearbyPharmacies);
    setSelectedPharmacyId(null);
    setError(null);
    setLoading(false);
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
      const productResponses = await Promise.all(
        queryTokens.map(async (term) => {
          const params = new URLSearchParams(baseParams.toString());
          params.set("q", term);
          return apiJson<SearchResult[]>(`/api/search/products?${params.toString()}`);
        })
      );

      const failingResponse = productResponses.find((response) => !response.ok);
      if (failingResponse) {
        setLoading(false);
        setError(failingResponse.error ?? "Recherche multi-produits impossible.");
        return;
      }

      const mergedResults = productResponses.flatMap((response) => response.data ?? []);

      setResults(mergedResults);
      setPharmacyMatches([]);
      setSelectedPharmacyId(null);
      queryTokens.forEach((term, index) => {
        const count = productResponses[index]?.data?.length ?? 0;
        recordHistory(term, "PRODUIT", count);
      });
      setLoading(false);
      return;
    }

    const trimmedQuery = queryInput.trim();
    if (!trimmedQuery) {
      setResults([]);
      setPharmacyMatches(nearbyPharmacies);
      setSelectedPharmacyId(null);
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
      setPharmacyMatches([]);
      setSelectedPharmacyId(null);
      recordHistory(trimmedQuery, "PRODUIT", productData.length);
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
    setPharmacyMatches(pharmacyRes.data ?? []);
    setSelectedPharmacyId(null);
    recordHistory(trimmedQuery, "PHARMACIE", pharmacyRes.data?.length ?? 0);
  }, [
    category,
    nearbyPharmacies,
    openNow,
    queryInput,
    queryTokens,
    radiusKm,
    recordHistory,
    userCoords,
  ]);

  useEffect(() => {
    runSearchRef.current = runSearch;
  }, [runSearch]);

  useEffect(() => {
    hasSearchInputRef.current = queryTokens.length > 0 || queryInput.trim() !== "";
  }, [queryInput, queryTokens]);

  useEffect(() => {
    if (!shouldAutoSearchRef.current) return;
    if (queryTokens.length === 0 && queryInput === "") return;
    shouldAutoSearchRef.current = false;
    const timer = window.setTimeout(() => {
      void runSearch();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [queryInput, queryTokens, runSearch]);

  useEffect(() => {
    if (!hasSearchInputRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      const run = runSearchRef.current;
      if (run) {
        void run();
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [category, openNow, radiusKm]);

  useEffect(() => {
    if (!selectedPharmacyId) {
      return;
    }

    const target = resultCardRefs.current[selectedPharmacyId];
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selectedPharmacyId]);

  const filteredResults = useMemo(
    () => (stockOnly ? results.filter((item) => item.isAvailable) : results),
    [results, stockOnly]
  );

  const groupedResults = useMemo<GroupedPharmacyResult[]>(() => {
    const map = new Map<
      string,
      {
        pharmacy: PublicPharmacy;
        items: Map<string, SearchResult>;
        matchedProducts: Set<string>;
      }
    >();

    filteredResults.forEach((item) => {
      const pharmacy = item.pharmacyId;
      const key = pharmacy._id;
      if (!map.has(key)) {
        map.set(key, {
          pharmacy,
          items: new Map<string, SearchResult>(),
          matchedProducts: new Set<string>(),
        });
      }

      const entry = map.get(key);
      if (!entry) {
        return;
      }

      entry.items.set(item._id, item);
      entry.matchedProducts.add(item.productId.name);
    });

    return Array.from(map.values())
      .map((entry) => {
        const items = Array.from(entry.items.values()).sort((a, b) =>
          a.productId.name.localeCompare(b.productId.name)
        );
        const availableCount = items.filter((item) => item.isAvailable).length;
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

        return {
          pharmacy: entry.pharmacy,
          items,
          matchedProductCount: entry.matchedProducts.size,
          availableCount,
          totalPrice,
        };
      })
      .sort((a, b) => {
        if (queryTokens.length > 0 && b.availableCount !== a.availableCount) {
          return b.availableCount - a.availableCount;
        }

        if (queryTokens.length > 0 && b.matchedProductCount !== a.matchedProductCount) {
          return b.matchedProductCount - a.matchedProductCount;
        }

        if (sortMode === "priceAsc" && a.totalPrice !== b.totalPrice) {
          return a.totalPrice - b.totalPrice;
        }

        if (sortMode === "priceDesc" && a.totalPrice !== b.totalPrice) {
          return b.totalPrice - a.totalPrice;
        }

        if (userCoords) {
          const distanceA = getDistanceKm(userCoords, a.pharmacy) ?? Number.POSITIVE_INFINITY;
          const distanceB = getDistanceKm(userCoords, b.pharmacy) ?? Number.POSITIVE_INFINITY;
          if (distanceA !== distanceB) {
            return distanceA - distanceB;
          }
        }

        return a.pharmacy.name.localeCompare(b.pharmacy.name);
      });
  }, [filteredResults, queryTokens.length, sortMode, userCoords]);

  const totalPriceByPharmacy = useMemo(() => {
    const totals = new Map<string, number>();

    results.forEach((item) => {
      const pharmacyId = item.pharmacyId?._id;
      if (!pharmacyId) {
        return;
      }

      totals.set(pharmacyId, (totals.get(pharmacyId) ?? 0) + item.price);
    });

    return totals;
  }, [results]);

  const visiblePharmacies = useMemo<SearchPanelPharmacy[]>(() => {
    if (groupedResults.length > 0) {
      return groupedResults.map((group) => {
        return {
          ...group.pharmacy,
          badgeLabel: `${group.totalPrice.toLocaleString("fr-FR")} XOF`,
          secondaryLabel:
            queryTokens.length > 0
              ? `${group.matchedProductCount}/${queryTokens.length} produits disponibles`
              : `${group.availableCount}/${group.items.length} produits disponibles`,
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
      .slice(0, 3)
      .map((pharmacy) => ({
        ...pharmacy,
        secondaryLabel:
          pharmacy.services?.slice(0, 2).join(" • ") ??
          pharmacy.description ??
          pharmacy.email,
      }));
  }, [groupedResults, nearbyPharmacies, pharmacyMatches, queryTokens.length, userCoords]);

  const pharmacyCount = visiblePharmacies.length;
  const locationLabel = userCoords ? "près de vous" : "dans votre zone";
  const hasComparedProducts = groupedResults.length > 0;

  return (
    <PatientShell>
      <div className="grid gap-6 xl:grid-cols-[560px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="relative overflow-visible rounded-[28px] border border-[#DCE5F0] bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="rounded-[20px] border border-[#DCE5F0] bg-[#FBFCFE] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[18px] leading-none text-[#98A2B3]">⌕</span>
                {queryTokens.map((token) => (
                  <span
                    key={token}
                    className="flex items-center gap-2 rounded-[10px] bg-[#1CA6E8] px-3 py-1.5 text-[10px] font-semibold text-white shadow-[0_6px_16px_rgba(22,163,224,0.18)]"
                  >
                    {token}
                    <button
                      type="button"
                      onClick={() => removeToken(token)}
                      className="text-xs font-bold text-white/90"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={queryInput}
                  onChange={(event) => setQueryInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      if (queryInput.trim()) {
                        if (queryTokens.length > 0) {
                          commitToken(queryInput);
                        } else {
                          void runSearch();
                        }
                      } else {
                        void runSearch();
                      }
                    }

                    if (event.key === ",") {
                      event.preventDefault();
                      commitToken(queryInput);
                    }
                  }}
                  placeholder="Ajouter un produit..."
                  className="min-w-45 flex-1 border-none bg-transparent text-[14px] leading-6 text-[#4B5563] outline-none placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-auto text-[18px] leading-none text-[#667085] transition hover:text-[#111827]"
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => {
                    void runSearch();
                  }}
                  className="rounded-md bg-blue-500 px-4 py-2 text-[12px] font-semibold text-white shadow-md transition hover:bg-blue-600"
                >
                  Rechercher
                </button>
              </div>
            </div>
            {visibleSuggestions.length > 0 ? (
              <div className="absolute left-5 right-5 top-full z-10 mt-3 rounded-md border border-gray-200 bg-white p-2 text-sm shadow-md">
                {visibleSuggestions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      commitToken(item);
                    }}
                  className="block w-full rounded-md px-3 py-2 text-left text-[13px] hover:bg-gray-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3 px-1 pt-1">
            <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#111827]">
              Résultats de recherche
            </h2>
            <p className="text-[13px] text-[#6B7280]">
              {pharmacyCount} pharmacies trouvées {locationLabel}
            </p>
          </div>

          {!hasComparedProducts ? (
            <p className="px-1 text-[12px] text-[#6B7280]">
              Ajoutez un ou plusieurs produits pour comparer les prix par pharmacie.
            </p>
          ) : null}

          <SearchFilters
            openNow={openNow}
            onOpenNowChange={setOpenNow}
            stockOnly={stockOnly}
            onStockOnlyChange={setStockOnly}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            radiusKm={radiusKm}
            onRadiusKmChange={setRadiusKm}
            category={category}
            onCategoryChange={setCategory}
            categories={categories}
          />

          {loading ? (
            <p className="text-sm text-[#6B7280]">Recherche en cours...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : groupedResults.length > 0 ? (
            <div className="space-y-4">
              {groupedResults.map((group, index) => {
                const directionsUrl = buildDirectionsUrl(group.pharmacy);
                const isSelected = selectedPharmacyId === group.pharmacy._id;
                const isBestPrice =
                  sortMode === "priceAsc" &&
                  index === 0 &&
                  (groupedResults.length === 1 ||
                    group.totalPrice < groupedResults[1].totalPrice);
                const pharmacyOpenNow = isPharmacyOpenNow(group.pharmacy);
                const statusLabel = getOpenStatusPill(
                  pharmacyOpenNow,
                  group.pharmacy.nextTransitionAt
                );
                const distanceLabel =
                  userCoords && group.pharmacy.location?.coordinates
                    ? formatDistance(userCoords, {
                        lat: group.pharmacy.location.coordinates[1],
                        lng: group.pharmacy.location.coordinates[0],
                      })
                    : null;

                return (
                  <div
                    key={group.pharmacy._id}
                    ref={(node) => {
                      resultCardRefs.current[group.pharmacy._id] = node;
                    }}
                    onClick={() => setSelectedPharmacyId(group.pharmacy._id)}
                    className={`cursor-pointer rounded-md bg-white p-4 transition hover:-translate-y-0.5 ${
                      isSelected || isBestPrice
                        ? "border-2 border-blue-200 shadow-md"
                        : "border border-gray-200 shadow-sm hover:border-blue-200 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/pharmacies/${group.pharmacy._id}`}
                              onClick={(event) => event.stopPropagation()}
                              className="text-sm font-semibold text-[#111827] hover:text-blue-500"
                            >
                              {group.pharmacy.name}
                            </Link>
                            {isBestPrice ? (
                              <span className="rounded-sm bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.03em] text-blue-500">
                                Meilleur prix
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#6B7280]">
                            <span className="text-[11px] text-[#6B7280]">📍</span>
                            {distanceLabel ? `${distanceLabel} • ` : ""}
                            {group.pharmacy.address ?? "Adresse non renseignée"}
                          </p>
                        </div>
                        <p className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-500">
                          {queryTokens.length > 0
                            ? `${group.availableCount}/${queryTokens.length} produits disponibles`
                            : `${group.availableCount}/${group.items.length} produits disponibles`}
                        </p>
                        <div className="space-y-1.5 text-[13px] text-[#374151]">
                          {group.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold ${
                                    item.isAvailable
                                      ? "bg-green-100 text-green-500"
                                      : "bg-red-100 text-red-500"
                                  }`}
                                >
                                  {item.isAvailable ? "✓" : "×"}
                                </span>
                                <span className="text-[#1F2937]">
                                  {item.productId.name} :{" "}
                                  <span
                                    className={
                                      item.isAvailable ? "text-green-500" : "text-red-500"
                                    }
                                  >
                                    {item.isAvailable ? "En stock" : "Indisponible"}
                                  </span>
                                </span>
                              </div>
                              <span className="min-w-22 text-right text-[13px] font-semibold text-[#16A3E0]">
                                {formatCompactMoney(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="min-w-24 text-right">
                        <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#16A3E0]">
                          {formatCompactMoney(group.totalPrice)}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">Total panier</p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void togglePharmacyFavorite(group.pharmacy._id);
                          }}
                          disabled={favoriteMutating}
                          className={`mt-2 rounded-full px-3 py-1 text-[10px] font-semibold ${
                            isPharmacyFavorite(group.pharmacy._id)
                              ? "border border-[#BFDBFE] bg-[#EFF6FF] text-[#0B63D1]"
                              : "border border-[#E5E7EB] bg-white text-[#6B7280]"
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                          {isPharmacyFavorite(group.pharmacy._id) ? "★ Favori" : "☆ Favori"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-[#E5E7EB] pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                            pharmacyOpenNow
                              ? "bg-[#ECFDF3] text-[#15803D]"
                              : "bg-[#FEF2F2] text-[#B91C1C]"
                          }`}
                        >
                          {statusLabel}
                        </span>
                        {directionsUrl ? (
                          <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-xl bg-[#18A8EA] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(22,163,224,0.22)] transition hover:bg-[#1099DA]"
                          >
                            ⟡ Itinéraire
                          </a>
                        ) : null}
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
                const isSelected = selectedPharmacyId === pharmacy._id;
                const pharmacyOpenNow = isPharmacyOpenNow(pharmacy);
                const distanceLabel =
                  userCoords && pharmacy.location?.coordinates
                    ? formatDistance(userCoords, {
                        lat: pharmacy.location.coordinates[1],
                        lng: pharmacy.location.coordinates[0],
                      })
                    : null;
                const bottomStatus = getOpenStatusPill(
                  pharmacyOpenNow,
                  pharmacy.nextTransitionAt
                );
                const totalPrice = totalPriceByPharmacy.get(pharmacy._id);

                return (
                  <div
                    key={pharmacy._id}
                    ref={(node) => {
                      resultCardRefs.current[pharmacy._id] = node;
                    }}
                    onClick={() => setSelectedPharmacyId(pharmacy._id)}
                    className={`cursor-pointer rounded-[20px] bg-white p-4 transition hover:-translate-y-0.5 ${
                      isSelected
                        ? "border-2 border-[#CBE8FA] shadow-[0_18px_38px_rgba(34,157,227,0.14)]"
                        : "border border-[#DCE5F0] shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-[#CBE8FA] hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/pharmacies/${pharmacy._id}`}
                              onClick={(event) => event.stopPropagation()}
                              className="text-sm font-semibold text-[#111827] hover:text-[#0B63D1]"
                            >
                              {pharmacy.name}
                            </Link>
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                                pharmacyOpenNow
                                  ? "bg-[#DCFCE7] text-[#15803D]"
                                  : "bg-[#FEE2E2] text-[#B91C1C]"
                              }`}
                            >
                              {pharmacyOpenNow ? "Ouvert" : "Fermé"}
                            </span>
                          </div>
                          <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#6B7280]">
                            <span className="text-[11px] text-[#6B7280]">📍</span>
                            {distanceLabel ? `${distanceLabel} • ` : ""}
                            {pharmacy.address ?? "Adresse non renseignée"}
                          </p>
                        </div>
                        {pharmacy.secondaryLabel ? (
                          <p className="inline-flex rounded-full bg-[#EAFBF0] px-3 py-1 text-xs font-semibold text-[#1B8E48]">
                            {pharmacy.secondaryLabel}
                          </p>
                        ) : null}
                        {services.length > 0 ? (
                          <div className="flex flex-wrap gap-2 text-[11px]">
                            {services.map((service) => (
                              <span
                                key={service}
                                className="rounded-full bg-[#F3F4F6] px-3 py-1.5 text-[#6B7280]"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="min-w-22 text-right">
                        <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#16A3E0]">
                          {totalPrice !== undefined ? formatCompactMoney(totalPrice) : "—"}
                        </p>
                        <p className="text-[11px] text-[#6B7280]">Total panier</p>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            void togglePharmacyFavorite(pharmacy._id);
                          }}
                          disabled={favoriteMutating}
                          className={`mt-2 rounded-full px-3 py-1 text-[10px] font-semibold ${
                            isPharmacyFavorite(pharmacy._id)
                              ? "border border-[#BFDBFE] bg-[#EFF6FF] text-[#0B63D1]"
                              : "border border-[#E5E7EB] bg-white text-[#6B7280]"
                          } disabled:cursor-not-allowed disabled:opacity-70`}
                        >
                          {isPharmacyFavorite(pharmacy._id) ? "★ Favori" : "☆ Favori"}
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 border-t border-[#E5E7EB] pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                            pharmacyOpenNow
                              ? "bg-[#ECFDF3] text-[#15803D]"
                              : "bg-[#FEF2F2] text-[#B91C1C]"
                          }`}
                        >
                          {bottomStatus}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/pharmacies/${pharmacy._id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="rounded-xl border border-[#D1D5DB] px-4 py-2 text-center text-[12px] font-semibold text-[#1F1D1B]"
                          >
                            Voir détails
                          </Link>
                          {directionsUrl ? (
                            <a
                              href={directionsUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="rounded-xl bg-[#18A8EA] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_10px_24px_rgba(22,163,224,0.22)] transition hover:bg-[#1099DA]"
                            >
                              ⟡ Itinéraire
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

        <SearchResultsMap
          pharmacies={visiblePharmacies}
          userCoords={userCoords}
          selectedPharmacyId={selectedPharmacyId}
          onPharmacySelect={setSelectedPharmacyId}
        />
      </div>
    </PatientShell>
  );
}
