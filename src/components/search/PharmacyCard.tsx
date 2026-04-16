"use client";

import Link from "next/link";

interface Coordinates {
  lat: number;
  lng: number;
}

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

interface PharmacyCardProps {
  pharmacy: PublicPharmacy;
  userCoords: Coordinates | null;
  isSelected: boolean;
  isBestPrice: boolean;
  onCardClick: () => void;
}

function getDistanceKm(from: Coordinates, pharmacy?: PublicPharmacy) {
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

export function PharmacyCard({
  pharmacy,
  userCoords,
  isSelected,
  isBestPrice,
  onCardClick,
}: PharmacyCardProps) {
  const directionsUrl = (() => {
    const coords = pharmacy.location?.coordinates;
    if (coords?.length === 2) {
      const [lng, lat] = coords;
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    if (pharmacy.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.address)}`;
    }

    return null;
  })();

  const pharmacyOpenNow = isPharmacyOpenNow(pharmacy);
  const statusLabel = getOpenStatusPill(pharmacyOpenNow, pharmacy.nextTransitionAt);
  const distanceLabel =
    userCoords && pharmacy.location?.coordinates
      ? formatDistance(userCoords, {
          lat: pharmacy.location.coordinates[1],
          lng: pharmacy.location.coordinates[0],
        })
      : null;

  const photoUrl = pharmacy.photoUrl ?? null;

  return (
    <div
      onClick={onCardClick}
      className={`cursor-pointer rounded-[20px] bg-white p-4 transition hover:-translate-y-0.5 ${
        isSelected || isBestPrice
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
              {isBestPrice ? (
                <span className="rounded-sm bg-[#E8F0FF] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.03em] text-[#275CDB]">
                  Meilleur prix
                </span>
              ) : null}
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[#6B7280]">
              <span className="text-[11px] text-[#6B7280]">📍</span>
              {distanceLabel ? `${distanceLabel} • ` : ""}
              {pharmacy.address ?? "Adresse non renseignée"}
            </p>
          </div>
          <p className="inline-flex rounded-full bg-[#EAFBF0] px-3 py-1 text-xs font-semibold text-[#1B8E48]">
            {pharmacyOpenNow ? "Ouvert" : "Fermé"}
          </p>
        </div>
        <div className="min-w-24 text-right">
          <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#16A3E0]">
            {statusLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
