"use client";

import { useEffect, useRef } from "react";
import type { Coordinates } from "@/lib/location-preferences";

const defaultCenter: Coordinates = { lat: 6.3654, lng: 2.4183 };

export function LocationPicker({
  coordinates,
  onChange,
  className = "h-64",
}: {
  coordinates: Coordinates;
  onChange: (coordinates: Coordinates) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onChangeRef = useRef(onChange);
  const coordinatesRef = useRef(coordinates);

  onChangeRef.current = onChange;
  coordinatesRef.current = coordinates;

  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;

    void import("leaflet").then((L) => {
      if (disposed || !containerRef.current) return;

      const initial = coordinatesRef.current ?? defaultCenter;
      map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
        [initial.lat, initial.lng],
        15
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([initial.lat, initial.lng], {
        draggable: true,
        icon: L.divIcon({
          className: "",
          html: '<span class="gp-location-picker-marker"></span>',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);

      const updateCoordinates = (value: { lat: number; lng: number }) => {
        const selected = { lat: value.lat, lng: value.lng };
        coordinatesRef.current = selected;
        marker.setLatLng([selected.lat, selected.lng]);
        onChangeRef.current(selected);
      };

      map.on("click", (event: import("leaflet").LeafletMouseEvent) => {
        updateCoordinates(event.latlng);
      });
      marker.on("dragend", () => updateCoordinates(marker.getLatLng()));
      window.setTimeout(() => map?.invalidateSize(), 0);
    });

    return () => {
      disposed = true;
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label="Carte pour choisir un emplacement, cliquez ou déplacez le repère"
      className={`overflow-hidden rounded-2xl border border-[#E5E7EB] ${className}`}
    />
  );
}
