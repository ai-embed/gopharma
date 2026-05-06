"use client";

import { useEffect, useRef, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

type CoordinatePickerMapProps = {
  value: Coordinates | null;
  onChange: (value: Coordinates) => void;
};

type GoogleWindow = Window & {
  google?: {
    maps: {
      Map: new (
        element: HTMLElement,
        options: Record<string, unknown>
      ) => GoogleMapInstance;
      Marker: new (options: Record<string, unknown>) => GoogleMarkerInstance;
    };
  };
  __goPharmaGoogleMapsInit?: () => void;
};

type GoogleMapInstance = {
  setCenter: (coords: Coordinates) => void;
  addListener: (eventName: string, callback: (event: GoogleMapClickEvent) => void) => void;
};

type GoogleMapClickEvent = {
  latLng?: {
    lat: () => number;
    lng: () => number;
  };
};

type GoogleMarkerInstance = {
  setPosition: (coords: Coordinates) => void;
};

let scriptPromise: Promise<void> | null = null;
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const defaultCenter = { lat: 6.3654, lng: 2.4183 };

function loadGoogleMapsScript(apiKey: string) {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key missing"));
  }

  const googleWindow = window as GoogleWindow;
  if (googleWindow.google?.maps) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    googleWindow.__goPharmaGoogleMapsInit = () => {
      resolve();
      delete googleWindow.__goPharmaGoogleMapsInit;
    };
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}` +
      "&v=weekly&loading=async&callback=__goPharmaGoogleMapsInit";
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Google Maps load failed"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function CoordinatePickerMap({ value, onChange }: CoordinatePickerMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<GoogleMapInstance | null>(null);
  const markerRef = useRef<GoogleMarkerInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      if (!containerRef.current) return;
      if (!googleMapsApiKey) {
        setError("Clé Google Maps absente.");
        return;
      }

      try {
        await loadGoogleMapsScript(googleMapsApiKey);
        if (cancelled) return;

        const googleWindow = window as GoogleWindow;
        const mapsApi = googleWindow.google?.maps;
        if (!mapsApi) {
          setError("Google Maps indisponible.");
          return;
        }

        if (!mapRef.current) {
          const center = value ?? defaultCenter;
          mapRef.current = new mapsApi.Map(containerRef.current, {
            center,
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
          });

          markerRef.current = new mapsApi.Marker({
            map: mapRef.current,
            position: center,
          });

          mapRef.current.addListener("click", (event) => {
            const lat = event.latLng?.lat();
            const lng = event.latLng?.lng();
            if (lat === undefined || lng === undefined) return;
            markerRef.current?.setPosition({ lat, lng });
            onChange({ lat, lng });
          });
        }

        if (value) {
          mapRef.current.setCenter(value);
          markerRef.current?.setPosition(value);
        }
      } catch {
        if (!cancelled) {
          setError("Impossible de charger la carte.");
        }
      }
    };

    const timer = window.setTimeout(() => {
      void init();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [onChange, value]);

  if (error) {
    return (
      <p className="rounded-xl border border-[#FECACA] bg-[#FFF5F5] px-4 py-3 text-xs text-[#B91C1C]">
        {error}
      </p>
    );
  }

  return <div ref={containerRef} className="h-56 w-full rounded-xl border border-[#E5E7EB]" />;
}
