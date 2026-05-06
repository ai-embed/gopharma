"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type PublicPharmacy = {
  _id: string;
  name: string;
  address?: string;
  openNow?: boolean;
  badgeLabel?: string;
  secondaryLabel?: string;
  location?: {
    coordinates: [number, number];
  };
};

type SearchResultsMapProps = {
  pharmacies: PublicPharmacy[];
  userCoords: Coordinates | null;
  selectedPharmacyId?: string | null;
  onPharmacySelect?: (pharmacyId: string) => void;
};

type GoogleWindow = Window & {
  google?: {
    maps: {
      Map: new (
        element: HTMLElement,
        options: Record<string, unknown>
      ) => GoogleMapInstance;
      InfoWindow: new (options?: Record<string, unknown>) => GoogleInfoWindowInstance;
      LatLngBounds: new () => GoogleLatLngBoundsInstance;
      Marker: new (options: Record<string, unknown>) => GoogleMarkerInstance;
    };
  };
  __goPharmaGoogleMapsInit?: () => void;
};

type GoogleMapInstance = {
  fitBounds: (bounds: GoogleLatLngBoundsInstance, padding?: number | Record<string, number>) => void;
  setCenter: (coords: Coordinates) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number | undefined;
  setMapTypeId: (type: string) => void;
};

type GoogleLatLngBoundsInstance = {
  extend: (coords: Coordinates) => void;
  isEmpty: () => boolean;
};

type GoogleInfoWindowInstance = {
  close: () => void;
  setContent: (content: string) => void;
  open: (options: { anchor?: unknown; map?: GoogleMapInstance }) => void;
};

type GoogleMarkerInstance = {
  setMap: (map: GoogleMapInstance | null) => void;
  addListener: (eventName: string, handler: () => void) => void;
};

let googleMapsScriptPromise: Promise<void> | null = null;

const defaultCenter: Coordinates = { lat: 6.3654, lng: 2.4183 };
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#E5E7EB" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6B7280" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F9FAFB" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#D1D5DB" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#EEF2F7" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#E8F5EC" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#9FB0C7" }, { weight: 0.8 }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#8FA2BE" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#7F93B1" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#CAD5E4" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#DDEAF8" }] },
];

function loadGoogleMapsScript(apiKey: string) {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key missing"));
  }

  const googleWindow = window as GoogleWindow;
  if (googleWindow.google?.maps) {
    return Promise.resolve();
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-go-pharma-google-maps="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google Maps load failed")), {
        once: true,
      });
      return;
    }

    googleWindow.__goPharmaGoogleMapsInit = () => {
      resolve();
      delete googleWindow.__goPharmaGoogleMapsInit;
    };

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}` +
      "&v=weekly&loading=async&libraries=marker&callback=__goPharmaGoogleMapsInit";
    script.async = true;
    script.defer = true;
    script.dataset.goPharmaGoogleMaps = "true";
    script.onerror = () => reject(new Error("Google Maps load failed"));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

function buildMarkerIcon(isOpen: boolean) {
  const color = isOpen ? "#18A957" : "#E04F5F";
  const svg = `
    <svg width="38" height="52" viewBox="0 0 38 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 0C8.507 0 0 8.437 0 18.842C0 32.974 19 52 19 52C19 52 38 32.974 38 18.842C38 8.437 29.493 0 19 0Z" fill="${color}"/>
      <circle cx="19" cy="19" r="9" fill="white"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
  };
}

export default function SearchResultsMap({
  pharmacies,
  userCoords,
  selectedPharmacyId = null,
  onPharmacySelect,
}: SearchResultsMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMapInstance | null>(null);
  const markersRef = useRef<GoogleMarkerInstance[]>([]);
  const markerByPharmacyIdRef = useRef<Map<string, GoogleMarkerInstance>>(new Map());
  const infoWindowRef = useRef<GoogleInfoWindowInstance | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(
    googleMapsApiKey ? null : "Clé Google Maps manquante pour afficher la carte."
  );

  const markers = useMemo(
    () =>
      pharmacies
        .map((pharmacy) => {
          const coords = pharmacy.location?.coordinates;
          if (!coords) {
            return null;
          }

          return {
            ...pharmacy,
            position: {
              lat: coords[1],
              lng: coords[0],
            },
          };
        })
        .filter(
          (value): value is PublicPharmacy & { position: Coordinates } => value !== null
        ),
    [pharmacies]
  );

  useEffect(() => {
    let cancelled = false;

    const syncMap = async () => {
      if (!containerRef.current) {
        return;
      }

      if (!googleMapsApiKey) {
        return;
      }

      try {
        await loadGoogleMapsScript(googleMapsApiKey);
        if (cancelled) {
          return;
        }

        const googleWindow = window as GoogleWindow;
        const mapsApi = googleWindow.google?.maps;

        if (!mapsApi) {
          setLoadError("Google Maps n'est pas disponible pour le moment.");
          return;
        }

        if (!mapRef.current) {
          mapRef.current = new mapsApi.Map(containerRef.current, {
            center: defaultCenter,
            zoom: 13,
            disableDefaultUI: true,
            gestureHandling: "greedy",
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
            clickableIcons: false,
            styles: mapStyles,
          });
        }

        mapRef.current.setMapTypeId(isSatellite ? "hybrid" : "roadmap");

        if (!infoWindowRef.current) {
          infoWindowRef.current = new mapsApi.InfoWindow();
        }

        markersRef.current.forEach((marker) => {
          marker.setMap(null);
        });
        markersRef.current = [];
        markerByPharmacyIdRef.current = new Map();

        const bounds = new mapsApi.LatLngBounds();

        markers.forEach((pharmacy) => {
          const marker = new mapsApi.Marker({
            map: mapRef.current ?? undefined,
            position: pharmacy.position,
            title: pharmacy.name,
            icon: buildMarkerIcon(Boolean(pharmacy.openNow)),
            label: pharmacy.badgeLabel
              ? {
                  text: pharmacy.badgeLabel.length > 10
                    ? `${pharmacy.badgeLabel.slice(0, 8)}…`
                    : pharmacy.badgeLabel,
                  color: "#0F172A",
                  fontWeight: "700",
                  fontSize: "11px",
                }
              : undefined,
          });

          marker.addListener("click", () => {
            onPharmacySelect?.(pharmacy._id);
            const popup = `
              <div style="min-width:180px;padding:2px 0;">
                <p style="margin:0 0 6px;font-weight:700;color:#111827;">${pharmacy.name}</p>
                <p style="margin:0 0 4px;font-size:12px;color:#6B7280;">
                  ${pharmacy.address ?? "Adresse non renseignée"}
                </p>
                ${
                  pharmacy.secondaryLabel
                    ? `<p style="margin:0;font-size:12px;color:#6B7280;">${pharmacy.secondaryLabel}</p>`
                    : ""
                }
              </div>
            `;
            infoWindowRef.current?.close();
            infoWindowRef.current?.setContent(popup);
            infoWindowRef.current?.open({ anchor: marker, map: mapRef.current ?? undefined });
          });

          markersRef.current.push(marker);
          markerByPharmacyIdRef.current.set(pharmacy._id, marker);
          bounds.extend(pharmacy.position);
        });

        if (userCoords) {
          const userMarker = new mapsApi.Marker({
            map: mapRef.current ?? undefined,
            position: userCoords,
            title: "Votre position",
            icon: {
              path: "M 0 0 m -9, 0 a 9,9 0 1,0 18,0 a 9,9 0 1,0 -18,0",
              fillColor: "#2563EB",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 3,
              scale: 1.1,
            },
          });
          markersRef.current.push(userMarker);
          bounds.extend(userCoords);
        }

        if (!bounds.isEmpty()) {
          mapRef.current.fitBounds(bounds, 80);
        } else {
          mapRef.current.setCenter(defaultCenter);
          mapRef.current.setZoom(13);
        }

        setLoadError(null);
      } catch {
        if (!cancelled) {
          setLoadError("Impossible de charger Google Maps pour le moment.");
        }
      }
    };

    void syncMap();

    return () => {
      cancelled = true;
    };
  }, [isSatellite, markers, onPharmacySelect, userCoords]);

  useEffect(() => {
    if (!selectedPharmacyId || !mapRef.current) {
      return;
    }

    const selected = markers.find((pharmacy) => pharmacy._id === selectedPharmacyId);
    if (!selected) {
      return;
    }

    mapRef.current.setCenter(selected.position);
    mapRef.current.setZoom(15);

    const marker = markerByPharmacyIdRef.current.get(selectedPharmacyId);
    if (!marker || !infoWindowRef.current) {
      return;
    }

    const popup = `
      <div style="min-width:180px;padding:2px 0;">
        <p style="margin:0 0 6px;font-weight:700;color:#111827;">${selected.name}</p>
        <p style="margin:0 0 4px;font-size:12px;color:#6B7280;">
          ${selected.address ?? "Adresse non renseignée"}
        </p>
        ${
          selected.secondaryLabel
            ? `<p style="margin:0;font-size:12px;color:#6B7280;">${selected.secondaryLabel}</p>`
            : ""
        }
      </div>
    `;

    infoWindowRef.current.close();
    infoWindowRef.current.setContent(popup);
    infoWindowRef.current.open({ anchor: marker, map: mapRef.current });
  }, [markers, selectedPharmacyId]);

  const adjustZoom = (step: number) => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() ?? 13;
    map.setZoom(currentZoom + step);
  };

  const recenterOnUser = () => {
    const map = mapRef.current;
    if (!map || !userCoords) return;
    map.setCenter(userCoords);
    map.setZoom(14);
  };

  return (
    <div className="gp-search-map relative h-full min-h-[720px] overflow-hidden rounded-[32px] border border-[#DCE5F0] bg-[#E6E9ED] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      {loadError ? (
        <div className="flex h-full min-h-[600px] items-center justify-center bg-[#EEF2F7] p-8 text-center">
          <div className="max-w-sm space-y-3">
            <p className="text-lg font-semibold text-[#111827]">Carte indisponible</p>
            <p className="text-sm text-[#6B7280]">{loadError}</p>
          </div>
        </div>
      ) : (
        <>
          <div ref={containerRef} className="h-full min-h-[600px] w-full" />

          <div className="pointer-events-none absolute right-5 top-5 z-10 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setIsSatellite((value) => !value)}
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[#DCE5F0] bg-white/95 text-[22px] text-[#1F2937] shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition hover:text-[#0B63D1]"
              aria-label="Changer le type de carte"
              title={isSatellite ? "Vue plan" : "Vue satellite"}
            >
              ◫
            </button>
            <div className="pointer-events-auto overflow-hidden rounded-[18px] border border-[#DCE5F0] bg-white/95 shadow-[0_14px_28px_rgba(15,23,42,0.12)]">
              <button
                type="button"
                onClick={() => adjustZoom(1)}
                className="flex h-14 w-14 items-center justify-center border-b border-[#E5E7EB] text-[30px] leading-none text-[#1F2937] transition hover:text-[#0B63D1]"
                aria-label="Zoom avant"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => adjustZoom(-1)}
                className="flex h-14 w-14 items-center justify-center text-[34px] leading-none text-[#1F2937] transition hover:text-[#0B63D1]"
                aria-label="Zoom arrière"
              >
                −
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-5 right-5 z-10">
            <button
              type="button"
              onClick={recenterOnUser}
              className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#DCE5F0] bg-white/95 text-[24px] text-[#0B63D1] shadow-[0_18px_30px_rgba(15,23,42,0.14)] transition hover:scale-[1.02]"
              aria-label="Revenir à ma position"
            >
              ◎
            </button>
          </div>
        </>
      )}
    </div>
  );
}
