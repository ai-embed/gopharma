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

const fallbackSearches = [
  { name: "Doliprane 1000mg", time: "Il y a 2 heures" },
  { name: "Vitamine C 500", time: "Hier" },
];

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
  const distance = earthRadiusKm * c;
  return `${distance.toFixed(1)} km`;
};

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

function pickRandomNearbyPharmacies(items: Pharmacy[], limit = 6) {
  if (items.length <= limit) {
    return items;
  }

  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = current;
  }

  return shuffled.slice(0, limit);
}

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState(fallbackSearches);
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
    params.set("seedOnly", "true");

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
    setPharmacies(pickRandomNearbyPharmacies(data, 6));
    setPharmacyLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

  return (
    <PatientShell>
      <div
        className={`space-y-6 transition ${
          showLocationChoice ? "pointer-events-none blur-[1px]" : ""
        }`}
        aria-hidden={showLocationChoice}
      >
      <section className="relative overflow-hidden rounded-3xl border border-[#0B63D1] bg-[#0B63D1] px-5 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute -left-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -right-10 -bottom-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <h1 className="text-2xl font-semibold">
              Trouvez vos médicaments et pharmacies à proximité
            </h1>
            <p className="text-sm text-white/80">
              Recherchez des médicaments sur ordonnance, des produits en vente libre,
              et vérifiez la disponibilité des stocks instantanément.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const value = search.trim();
                router.push(
                  value ? `/search?q=${encodeURIComponent(value)}` : "/search"
                );
              }}
              className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white px-3 py-3"
            >
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un médicament (ex: Amoxicilline) ou une pharmacie..."
                className="flex-1 border-none bg-transparent text-xs text-[#1F1D1B] outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
              >
                Rechercher
              </button>
            </form>
          </div>
      </section>

      <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recherches récentes</h2>
          </div>
          <div className="rounded-2xl border border-[#E5E7EB] bg-white">
            {recentSearches.length === 0 ? (
              <div className="px-5 py-6 text-sm text-[#6B7280]">
                Aucune recherche récente pour le moment.
              </div>
            ) : (
              recentSearches.map((item, index) => (
                <Link
                  key={`${item.name}-${item.time}-${index}`}
                  href={`/search?q=${encodeURIComponent(item.name)}`}
                  className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4 last:border-b-0"
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Pharmacies à proximité</h2>
            <Link
              href="/search"
              className="rounded-full border border-[#E5E7EB] px-3 py-2 text-[11px] font-semibold text-[#1F1D1B]"
            >
              Voir la carte
            </Link>
          </div>
          {!userCoords ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
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
              <p className="text-sm text-[#6B7280]">Chargement des pharmacies...</p>
            ) : pharmacyError ? (
              <p className="text-sm text-red-600">{pharmacyError}</p>
            ) : pharmacies.length === 0 ? (
              <p className="text-sm text-[#6B7280]">
                Aucune pharmacie disponible pour le moment.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pharmacies.map((pharmacy) => {
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
                      className="rounded-3xl border border-[#E5E7EB] bg-white p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="h-20 w-20 rounded-2xl bg-[#E5E7EB]"
                          style={{
                            backgroundImage: photoUrl ? `url('${photoUrl}')` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          role="img"
                          aria-label={`Photo de ${pharmacy.name}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{pharmacy.name}</p>
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                statusLabel === "OUVERT"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-rose-100 text-rose-600"
                              }`}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          <p className="text-xs text-[#6B7280]">
                            {pharmacy.address} • {distance}
                          </p>
                          {pharmacy.description ? (
                            <p className="mt-2 text-xs text-[#6B7280]">
                              {pharmacy.description}
                            </p>
                          ) : null}
                          {pharmacy.services && pharmacy.services.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#6B7280]">
                              {pharmacy.services.slice(0, 3).map((service) => (
                                <span
                                  key={service}
                                  className="rounded-full bg-[#F3F6F9] px-2 py-1"
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
                            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#0B63D1] px-3 py-2 text-xs font-semibold text-[#0B63D1]"
                          >
                            Voir détails
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : null}
      </section>
      </div>

      {showLocationChoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/35 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dashboard-location-consent-title"
            className="w-full max-w-xl rounded-3xl border border-[#D5E6FF] bg-white p-6 text-left shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
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
                className="rounded-2xl border border-[#C9DCF9] px-4 py-3 text-sm font-semibold text-[#0B63D1] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Uniquement cette fois
              </button>
              <button
                type="button"
                disabled={askingLocation}
                onClick={() => void handleLocationChoice("always")}
                className="rounded-2xl bg-[#0B63D1] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
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
