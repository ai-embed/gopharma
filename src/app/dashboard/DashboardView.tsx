"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PatientShell } from "@/components/PatientShell";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import {
  clearPersistentLocationChoice,
  hasSessionLocationChoice,
  getPersistentLocationChoice,
  getSavedLocationCoords,
  markSessionLocationChoiceDone,
  requestCurrentPosition,
  saveLocationCoords,
  setPersistentLocationChoice,
  type Coordinates,
} from "@/lib/location-preferences";

const popularSearches = ["Paracétamol", "Vitamine C", "Ibuprofène"];

type Pharmacy = {
  _id: string;
  name: string;
  address: string;
  description?: string;
  email?: string;
  services?: string[];
  isSeeded?: boolean;
  location?: { coordinates: [number, number] };
  openNow?: boolean;
  operationalStatus?: "OUVERT" | "FERME";
  photoUrl?: string;
  bannerUrl?: string;
};

const distanceInKm = (from: Coordinates, to: Coordinates) => {
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
  return earthRadiusKm * c;
};

const formatDistance = (from: Coordinates, to: Coordinates) =>
  `${distanceInKm(from, to).toFixed(1)} km`;

function addCloudinaryTransformations(url: string, options: { width?: number; height?: number; crop?: string }) {
  if (!url.includes('cloudinary.com')) return url;
  const { width, height, crop } = options;
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  
  if (transformations.length === 0) return url;
  
  const transformationString = transformations.join(',');
  return url.replace(/\/upload\//, `/upload/${transformationString}/`);
}

function selectNearbyPharmacies(items: Pharmacy[], origin: Coordinates) {
  return [...items]
    .sort((left, right) => {
      const leftCoordinates = left.location?.coordinates;
      const rightCoordinates = right.location?.coordinates;
      const leftDistance = leftCoordinates
        ? distanceInKm(origin, { lat: leftCoordinates[1], lng: leftCoordinates[0] })
        : Number.POSITIVE_INFINITY;
      const rightDistance = rightCoordinates
        ? distanceInKm(origin, { lat: rightCoordinates[1], lng: rightCoordinates[0] })
        : Number.POSITIVE_INFINITY;
      return leftDistance - rightDistance;
    });
}

export default function DashboardPage() {
  const router = useRouter();
  const [pharmacyFilter, setPharmacyFilter] = useState<"all" | "open" | "duty">("all");
  const [pharmacyQuery, setPharmacyQuery] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [queryTokens, setQueryTokens] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<{ name: string; time: string }[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [pharmacyLoading, setPharmacyLoading] = useState(true);
  const [pharmacyError, setPharmacyError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [askingLocation, setAskingLocation] = useState(false);
  const [showLocationChoice, setShowLocationChoice] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const locationSessionContext = getAccessToken() ?? "anonymous";

  const loadPharmacies = useCallback(async (coords?: Coordinates) => {
    if (!mountedRef.current) {
      return;
    }

    if (!coords) {
      setPharmacyError(null);
      setPharmacyLoading(false);
      setPharmacies([]);
      return;
    }

    setPharmacyLoading(true);
    setPharmacyError(null);

    const params = new URLSearchParams();
    params.set("lat", coords.lat.toString());
    params.set("lng", coords.lng.toString());
    params.set("radiusKm", "50");

    const res = await apiJson<Pharmacy[]>(
      `/api/pharmacies?${params.toString()}`
    );

    if (!mountedRef.current) {
      return;
    }

    if (!res.ok) {
      setPharmacyError(res.error ?? "Impossible de charger les pharmacies.");
      setPharmacies([]);
      setPharmacyLoading(false);
      return;
    }

    const data = res.data ?? [];
    setPharmacies(selectNearbyPharmacies(data, coords));
    setPharmacyLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!queryInput || queryInput.length < 2) {
      setSuggestions([]);
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
      } else {
        setSuggestions([]);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [queryInput]);

  useEffect(() => {
    let active = true;
    apiJsonAuth<
      { query: string; createdAt: string }[]
    >("/api/history").then((res) => {
      if (!active) return;
      if (res.ok && res.data && res.data.length > 0) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const formatter = new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "short",
        });
        setRecentSearches(
          sorted.slice(0, 2).map((item) => ({
            name: item.query,
            time: formatter.format(new Date(item.createdAt)),
          }))
        );
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const coords = getSavedLocationCoords();
    if (coords) {
      void Promise.resolve().then(() => {
        if (!active || !mountedRef.current) {
          return;
        }
        setUserCoords(coords);
      });
      void loadPharmacies(coords);
    } else {
      void loadPharmacies();
    }

    return () => {
      active = false;
    };
  }, [loadPharmacies]);

  useEffect(() => {
    let active = true;
    const scheduleState = (callback: () => void) => {
      if (!active || !mountedRef.current) {
        return;
      }
      callback();
    };

    const savedChoice = getPersistentLocationChoice();
    const fallbackCoords = getSavedLocationCoords();
    const sessionChoiceDone = hasSessionLocationChoice(locationSessionContext);

    if (savedChoice === "always" && fallbackCoords) {
      scheduleState(() => {
        setUserCoords(fallbackCoords);
        setShowLocationChoice(false);
        setLocationError(null);
        setAskingLocation(true);
      });
      void loadPharmacies(fallbackCoords);

      void requestCurrentPosition()
        .then((coords) => {
          if (!active || !mountedRef.current) {
            return;
          }
          saveLocationCoords(coords, "always");
          markSessionLocationChoiceDone(locationSessionContext);
          setUserCoords(coords);
          void loadPharmacies(coords);
          setShowLocationChoice(false);
        })
        .catch(() => {
          if (!active || !mountedRef.current) {
            return;
          }
          // Keep previous "always" behavior with stored coords if refresh fails.
        })
        .finally(() => {
          if (!active || !mountedRef.current) {
            return;
          }
          setAskingLocation(false);
        });

      return () => {
        active = false;
      };
    }

    if (sessionChoiceDone) {
      scheduleState(() => {
        setShowLocationChoice(false);
        setLocationError(null);
      });

      return () => {
        active = false;
      };
    }

    scheduleState(() => {
      setShowLocationChoice(true);
      setLocationError(null);
    });

    if (savedChoice === "always") {
      scheduleState(() => {
        setAskingLocation(true);
      });

      void requestCurrentPosition()
        .then((coords) => {
          if (!active || !mountedRef.current) {
            return;
          }
          saveLocationCoords(coords, "always");
          markSessionLocationChoiceDone(locationSessionContext);
          setUserCoords(coords);
          void loadPharmacies(coords);
          setShowLocationChoice(false);
        })
        .catch(() => {
          if (!active || !mountedRef.current) {
            return;
          }
          setLocationError("Impossible d'activer la localisation automatiquement.");
        })
        .finally(() => {
          if (!active || !mountedRef.current) {
            return;
          }
          setAskingLocation(false);
        });
    }

    return () => {
      active = false;
    };
  }, [loadPharmacies, locationSessionContext]);

  const handleLocationChoice = async (mode: "once" | "always") => {
    setAskingLocation(true);
    setLocationError(null);

    try {
      const coords = await requestCurrentPosition();
      saveLocationCoords(coords, mode);

      if (mode === "always") {
        setPersistentLocationChoice("always");
      } else {
        clearPersistentLocationChoice();
      }

      markSessionLocationChoiceDone(locationSessionContext);
      setShowLocationChoice(false);
      setUserCoords(coords);
      await loadPharmacies(coords);
    } catch (error) {
      if (mode === "always") {
        clearPersistentLocationChoice();
      }
      setLocationError(
        error instanceof Error
          ? error.message
          : "Impossible de récupérer votre localisation."
      );
    } finally {
      setAskingLocation(false);
    }
  };

  const handleSkipLocation = () => {
    setLocationError(null);
    markSessionLocationChoiceDone(locationSessionContext);
    setShowLocationChoice(false);
  };

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
  };

  const addPopularSearch = (value: string) => {
    commitToken(value);
  };

  const submitSearch = () => {
    const trailing = queryInput.trim();
    const terms = [...queryTokens];
    if (trailing) {
      terms.push(trailing);
    }

    if (terms.length === 0) {
      router.push("/search");
      return;
    }

    const params = new URLSearchParams();
    params.set("q", terms.join(","));
    params.set("source", "dashboard");
    router.push(`/search?${params.toString()}`);
  };

  const visibleSuggestions = queryInput.length < 2 ? [] : suggestions;
  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesFilter =
      pharmacyFilter === "all" ||
      (pharmacyFilter === "open" && pharmacy.openNow) ||
      (pharmacyFilter === "duty" && pharmacy.services?.includes("Garde"));
    const normalizedQuery = pharmacyQuery.trim().toLocaleLowerCase("fr");
    const matchesQuery =
      !normalizedQuery ||
      `${pharmacy.name} ${pharmacy.address}`.toLocaleLowerCase("fr").includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });
  const openPharmacyCount = pharmacies.filter((pharmacy) => pharmacy.openNow).length;
  const dutyPharmacyCount = pharmacies.filter((pharmacy) =>
    pharmacy.services?.includes("Garde")
  ).length;

  return (
    <PatientShell>
      <div
        className={`gp-dashboard space-y-6 transition ${
          showLocationChoice ? "pointer-events-none blur-[1px]" : ""
        }`}
        aria-hidden={showLocationChoice}
      >
      <section className="gp-hero relative rounded-[2rem] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-[1px]" />
            <div className="absolute -right-10 -bottom-20 h-56 w-56 rounded-full bg-cyan-200/15 blur-[1px]" />
          </div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="gp-hero__eyebrow text-[10px] font-extrabold uppercase">
                Votre santé, à portée de main
              </p>
              <span className="gp-hero__status">
                <span className="gp-hero__status-dot" />
                {userCoords ? "Position active" : "Position protégée"}
              </span>
            </div>
            <h1 className="gp-hero__title">
              Trouvez vos médicaments et pharmacies à proximité
            </h1>
            <p className="gp-hero__copy text-sm sm:text-[15px]">
              Recherchez des médicaments sur ordonnance, des produits en vente libre,
              et vérifiez la disponibilité des stocks instantanément.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              className="gp-dashboard-search relative mt-6 rounded-2xl px-3 py-3"
            >
              <div className="gp-dashboard-search-inner rounded-[20px] border px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
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
                        aria-label={`Retirer ${token}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={queryInput}
                    onChange={(event) => setQueryInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === ",") {
                        event.preventDefault();
                        commitToken(queryInput);
                      }

                      if (event.key === "Enter") {
                        if (queryInput.trim()) {
                          event.preventDefault();
                          if (queryTokens.length > 0) {
                            commitToken(queryInput);
                          }
                        }
                      }
                    }}
                    placeholder="Ajouter un produit..."
                    className="gp-search-input min-w-45 flex-1 border-none bg-transparent text-[14px] leading-6 text-[#4B5563] outline-none placeholder:text-[#9CA3AF]"
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
                    type="submit"
                    className="gp-search-submit rounded-xl px-4 py-2 text-[12px] font-semibold text-white"
                  >
                    Rechercher
                  </button>
                </div>
              </div>
              {visibleSuggestions.length > 0 ? (
                <div className="gp-panel absolute left-3 right-3 top-full z-20 mt-2 rounded-xl p-2 text-sm shadow-md">
                  {visibleSuggestions.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        commitToken(item);
                      }}
                      className="block w-full rounded-md px-3 py-2 text-left text-[13px] text-[#1F2937] hover:bg-gray-100"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </form>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-white/70">Populaire :</span>
              {popularSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => addPopularSearch(item)}
                  className="gp-popular-chip rounded-full px-3 py-1.5 text-[11px] font-semibold"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
      </section>

      <section aria-label="Actions rapides" className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        <Link href="/scan" className="gp-quick-action rounded-3xl p-4 sm:p-5">
          <span className="gp-quick-action__icon bg-[#EAF3FF] text-[#0B63D1]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M8 8h8v8H8z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 11h4M10 13h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="relative z-10 mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold tracking-[-0.02em] text-[#10233F]">Scanner un produit</p>
              <p className="mt-1 text-xs leading-5 text-[#6B7280]">Vérifiez la disponibilité en un geste.</p>
            </div>
            <span className="text-lg text-[#0B63D1]" aria-hidden="true">↗</span>
          </div>
        </Link>
        <Link href="/reminders/new" className="gp-quick-action rounded-3xl p-4 sm:p-5">
          <span className="gp-quick-action__icon bg-[#EAFBF0] text-[#16834A]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <rect x="4" y="5" width="16" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M8 3v4M16 3v4M4 10h16M9 14h2M14 14h1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <div className="relative z-10 mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold tracking-[-0.02em] text-[#10233F]">Créer un rappel</p>
              <p className="mt-1 text-xs leading-5 text-[#6B7280]">Ne manquez plus vos prises importantes.</p>
            </div>
            <span className="text-lg text-[#16834A]" aria-hidden="true">↗</span>
          </div>
        </Link>
        <Link href="/favorites" className="gp-quick-action rounded-3xl p-4 sm:p-5">
          <span className="gp-quick-action__icon bg-[#FFF2F6] text-[#D64E7B]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M12 20.5S4.5 16.1 4.5 9.8A4.3 4.3 0 0 1 12 6.9a4.3 4.3 0 0 1 7.5 2.9c0 6.3-7.5 10.7-7.5 10.7Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="relative z-10 mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold tracking-[-0.02em] text-[#10233F]">Mes pharmacies</p>
              <p className="mt-1 text-xs leading-5 text-[#6B7280]">Retrouvez vos adresses préférées.</p>
            </div>
            <span className="text-lg text-[#D64E7B]" aria-hidden="true">↗</span>
          </div>
        </Link>
      </section>

      <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="gp-section-kicker">Pour vous</p>
              <h2 className="gp-section-heading mt-1">Recherches récentes</h2>
            </div>
            <Link href="/history" className="text-xs font-bold text-[#0B63D1] transition hover:text-[#0754B7]">
              Tout voir
            </Link>
          </div>
          <div className="gp-panel overflow-hidden rounded-3xl">
            {recentSearches.length === 0 ? (
              <div className="px-5 py-6 text-sm text-[#6B7280]">
                Aucune recherche récente pour le moment.
              </div>
            ) : (
              recentSearches.map((item, index) => (
                <Link
                  key={`${item.name}-${item.time}-${index}`}
                  href={`/search?q=${encodeURIComponent(item.name)}`}
                  className="gp-recent-link flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-[#6B7280]">{item.time}</p>
                  </div>
                  <span className="text-[#9CA3AF]">{">"}</span>
                </Link>
              ))
            )}
          </div>
      </section>

      <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="gp-section-kicker">Autour de vous</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="gp-section-heading">Pharmacies à proximité</h2>
                {userCoords && !pharmacyLoading ? (
                  <span className="gp-pharmacy-count">
                    {pharmacies.length} pharmacies inscrites autour de vous
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[#6B7280]">
                Seules les pharmacies inscrites et validées sur GoPharma apparaissent ici.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {userCoords ? (
                <button
                  type="button"
                  onClick={() => void loadPharmacies(userCoords)}
                  disabled={pharmacyLoading}
                  className="gp-outline-button rounded-full border px-3.5 py-2 text-[11px] font-bold disabled:cursor-wait disabled:opacity-60"
                >
                  <span className={pharmacyLoading ? "inline-block animate-spin" : "inline-block"} aria-hidden="true">↻</span>
                  <span className="ml-1.5">{pharmacyLoading ? "Actualisation…" : "Actualiser"}</span>
                </button>
              ) : null}
              <Link
                href="/search"
                className="gp-map-button rounded-full px-3.5 py-2 text-[11px] font-bold"
              >
                <span aria-hidden="true">⌖</span>
                <span className="ml-1.5">Explorer la carte</span>
              </Link>
            </div>
          </div>
          {!userCoords ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 shadow-[0_8px_20px_rgba(180,124,20,0.06)]">
              <p>
                Localisation non activée: nous ne pouvons pas déterminer votre position exacte.
                Activez-la pour voir les pharmacies réellement proches de vous.
              </p>
            </div>
          ) : null}

          {!userCoords && askingLocation ? (
            <p className="text-sm text-[#6B7280]">Chargement des pharmacies...</p>
          ) : null}

          {userCoords ? (
            pharmacyLoading ? (
              <div className="gp-panel flex items-center gap-3 rounded-3xl p-5 text-sm text-[#6B7280]" role="status">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0B63D1] border-t-transparent" />
                Recherche des meilleures adresses autour de vous…
              </div>
            ) : pharmacyError ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700" role="alert">
                <p className="font-semibold">Impossible de charger les pharmacies.</p>
                <p className="mt-1">{pharmacyError}</p>
                <button
                  type="button"
                  onClick={() => void loadPharmacies(userCoords)}
                  className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-100"
                >
                  Réessayer
                </button>
              </div>
            ) : pharmacies.length === 0 ? (
              <div className="gp-panel rounded-3xl px-5 py-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3FF] text-2xl text-[#0B63D1]" aria-hidden="true">⌖</span>
                <p className="mt-3 text-sm font-bold text-[#10233F]">Aucune pharmacie à proximité</p>
                <p className="mt-1 text-xs text-[#6B7280]">Élargissez votre recherche pour découvrir d’autres adresses.</p>
                <Link href="/search" className="gp-map-button mt-4 inline-flex rounded-full px-4 py-2 text-xs font-bold">
                  Rechercher une pharmacie
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="gp-pharmacy-toolbar flex flex-col gap-3 rounded-3xl p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer les pharmacies">
                    {([
                      { id: "all", label: "Toutes", count: pharmacies.length },
                      { id: "open", label: "Ouvertes", count: openPharmacyCount },
                      { id: "duty", label: "De garde", count: dutyPharmacyCount },
                    ] as const).map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        aria-pressed={pharmacyFilter === filter.id}
                        onClick={() => setPharmacyFilter(filter.id)}
                        className={`gp-filter-pill rounded-full px-3.5 py-2 text-[11px] font-bold ${
                          pharmacyFilter === filter.id ? "gp-filter-pill--active" : ""
                        }`}
                      >
                        {filter.label}
                        <span className="ml-1.5 opacity-70">{filter.count}</span>
                      </button>
                    ))}
                  </div>
                  <label className="gp-pharmacy-search flex min-w-0 items-center gap-2 rounded-full px-3.5 py-2 sm:w-64">
                    <span className="text-base text-[#8CA0B4]" aria-hidden="true">⌕</span>
                    <input
                      type="search"
                      value={pharmacyQuery}
                      onChange={(event) => setPharmacyQuery(event.target.value)}
                      placeholder="Nom ou quartier"
                      className="min-w-0 flex-1 bg-transparent text-xs text-[#10233F] outline-none placeholder:text-[#94A3B8]"
                    />
                    {pharmacyQuery ? (
                      <button
                        type="button"
                        onClick={() => setPharmacyQuery("")}
                        aria-label="Effacer le filtre"
                        className="text-sm text-[#8CA0B4] hover:text-[#0B63D1]"
                      >
                        ×
                      </button>
                    ) : null}
                  </label>
                </div>

                {filteredPharmacies.length === 0 ? (
                  <div className="gp-panel rounded-3xl px-5 py-8 text-center">
                    <p className="text-sm font-bold text-[#10233F]">Aucun résultat pour ce filtre</p>
                    <p className="mt-1 text-xs text-[#6B7280]">Essayez une autre catégorie ou un autre quartier.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPharmacyFilter("all");
                        setPharmacyQuery("");
                      }}
                      className="gp-map-button mt-4 rounded-full px-4 py-2 text-xs font-bold"
                    >
                      Effacer les filtres
                    </button>
                  </div>
                ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredPharmacies.map((pharmacy, pharmacyIndex) => {
                  const coords = pharmacy.location?.coordinates;
                  const distance =
                    coords && userCoords
                      ? formatDistance(
                          userCoords,
                          { lat: coords[1], lng: coords[0] }
                        )
                      : "Distance inconnue";
                  const statusLabel = pharmacy.openNow ? "OUVERT" : "FERME";
                  const photoUrl = pharmacy.photoUrl 
                    ? addCloudinaryTransformations(pharmacy.photoUrl, { width: 200, height: 200, crop: 'fill' })
                    : null;

                  return (
                    <div
                      key={pharmacy._id}
                      className="gp-pharmacy-card group rounded-3xl border p-4"
                      style={{ animationDelay: `${Math.min(pharmacyIndex, 8) * 45}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="gp-pharmacy-card__media-wrap h-[4.5rem] w-[4.5rem] shrink-0">
                          <div
                            className={`gp-pharmacy-card__media flex h-full w-full items-center justify-center rounded-2xl ${
                              photoUrl ? "" : "bg-gradient-to-br from-[#DDF2FF] via-[#EAF3FF] to-[#DDF5EA]"
                            }`}
                            style={{
                              backgroundImage: photoUrl ? `url('${photoUrl}')` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                            role="img"
                            aria-label={`Photo de ${pharmacy.name}`}
                          >
                            {!photoUrl ? (
                              <svg viewBox="0 0 32 32" className="h-8 w-8 text-[#0B63D1]" aria-hidden="true">
                                <path d="M5 14.5 16 7l11 7.5V27H5V14.5Z" fill="currentColor" opacity=".14" />
                                <path d="M5 14.5 16 7l11 7.5M7 14v12h18V14M13 26v-7a3 3 0 0 1 6 0v7M12 14h8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 11v5m-2.5-2.5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                              </svg>
                            ) : null}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate pr-2 text-sm font-bold tracking-[-0.02em] text-[#10233F]">{pharmacy.name}</p>
                            <span className={`gp-open-badge shrink-0 ${statusLabel === "OUVERT" ? "gp-open-badge--open" : "gp-open-badge--closed"}`}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {statusLabel}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-1 text-xs text-[#6B7280]">{pharmacy.address}</p>
                          <p className="gp-distance-pill mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold">
                            <span aria-hidden="true">⌖</span>
                            {distance}
                          </p>
                          {pharmacy.description ? (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#6B7280]">
                              {pharmacy.description}
                            </p>
                          ) : null}
                          {pharmacy.services && pharmacy.services.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#6B7280]">
                              {pharmacy.services.slice(0, 3).map((service) => (
                                <span
                                  key={service}
                                  className={`gp-service-chip rounded-full px-2.5 py-1 ${service === "Garde" ? "gp-service-chip--duty" : ""}`}
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          ) : pharmacy.email ? (
                            <p className="mt-2 text-xs text-[#6B7280]">{pharmacy.email}</p>
                          ) : null}
                          <Link
                            href={`/pharmacies/${pharmacy._id}`}
                            className="gp-outline-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-xs font-bold"
                          >
                            Voir la pharmacie
                            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
                )}
              </div>
            )
          ) : null}
      </section>
      </div>

      {showLocationChoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/45 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-location-consent-title"
            className="w-full max-w-xl rounded-[2rem] border border-[#D5E6FF] bg-white p-6 text-left shadow-[0_28px_74px_rgba(15,23,42,0.26)]"
          >
            <h2
              id="dashboard-location-consent-title"
              className="text-lg font-semibold text-[#0B63D1]"
            >
              Autoriser votre localisation
            </h2>
            <p className="mt-2 text-sm text-[#4B5563]">
              Choisissez comment GoPharma peut accéder à votre position.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={askingLocation}
                onClick={() => void handleLocationChoice("once")}
              className="gp-outline-button rounded-2xl border px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70"
              >
                Uniquement cette fois
              </button>
              <button
                type="button"
                disabled={askingLocation}
                onClick={() => void handleLocationChoice("always")}
              className="gp-search-submit rounded-2xl px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                Toujours
              </button>
            </div>
            <button
              type="button"
              disabled={askingLocation}
              onClick={handleSkipLocation}
              className="mt-3 text-xs font-semibold text-[#6B7280] underline disabled:cursor-not-allowed disabled:opacity-70"
            >
              Continuer sans localisation
            </button>
            {locationError ? (
              <p className="mt-3 text-xs text-amber-700">{locationError}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </PatientShell>
  );
}
