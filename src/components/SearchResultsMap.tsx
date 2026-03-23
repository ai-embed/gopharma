"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { divIcon, LatLngExpression, latLngBounds } from "leaflet";

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
};

function FitBounds({
  pharmacies,
  userCoords,
}: {
  pharmacies: PublicPharmacy[];
  userCoords: Coordinates | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = pharmacies
      .map((pharmacy) => {
        const coords = pharmacy.location?.coordinates;
        return coords ? ([coords[1], coords[0]] as [number, number]) : null;
      })
      .filter((value): value is [number, number] => value !== null);

    if (userCoords) {
      points.push([userCoords.lat, userCoords.lng]);
    }

    if (points.length === 0) {
      map.setView([6.3654, 2.4183], 13);
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 14);
      return;
    }

    map.fitBounds(latLngBounds(points), {
      padding: [40, 40],
    });
  }, [map, pharmacies, userCoords]);

  return null;
}

const createPriceIcon = (label: string, isOpen: boolean) =>
  divIcon({
    className: "",
    html: `<div class="${
      isOpen ? "gp-map-badge gp-map-badge-open" : "gp-map-badge gp-map-badge-closed"
    }">${label}</div>`,
    iconSize: [84, 34],
    iconAnchor: [42, 34],
  });

const currentLocationIcon = divIcon({
  className: "",
  html: '<div class="gp-current-location"><span></span></div>',
  iconSize: [54, 54],
  iconAnchor: [27, 27],
});

export default function SearchResultsMap({
  pharmacies,
  userCoords,
}: SearchResultsMapProps) {
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
            position: [coords[1], coords[0]] as LatLngExpression,
          };
        })
        .filter((value): value is PublicPharmacy & { position: LatLngExpression } => value !== null),
    [pharmacies]
  );

  return (
    <div className="relative h-full min-h-[600px] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-[#E6E9ED]">
      <MapContainer
        center={[6.3654, 2.4183]}
        zoom={13}
        zoomControl
        className="h-full min-h-[600px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds pharmacies={markers} userCoords={userCoords} />

        {markers.map((pharmacy) => (
          <Marker
            key={pharmacy._id}
            position={pharmacy.position}
            icon={createPriceIcon(pharmacy.badgeLabel ?? pharmacy.name, Boolean(pharmacy.openNow))}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{pharmacy.name}</p>
                <p className="text-xs text-[#6B7280]">
                  {pharmacy.address ?? "Adresse non renseignée"}
                </p>
                {pharmacy.secondaryLabel ? (
                  <p className="text-xs text-[#6B7280]">{pharmacy.secondaryLabel}</p>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}

        {userCoords ? (
          <Marker
            position={[userCoords.lat, userCoords.lng]}
            icon={currentLocationIcon}
          >
            <Popup>Votre position</Popup>
          </Marker>
        ) : null}
      </MapContainer>
    </div>
  );
}
