"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PatientShell } from "@/components/PatientShell";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { useUser } from "@/lib/useUser";

export default function FavoritesView() {
  const { user } = useUser();
  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";
  const email = user?.email ?? "utilisateur@example.com";

  const [favorites, setFavorites] = useState<
    {
      id: string;
      label: string;
      subtitle: string;
      type: "PHARMACY" | "PRODUCT";
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiJsonAuth<
      {
        _id: string;
        targetType: "PHARMACY" | "PRODUCT";
        pharmacyId?: string;
        productId?: string;
      }[]
    >("/api/favorites").then(async (res) => {
      if (!active) return;
      if (!res.ok || !res.data) {
        setLoading(false);
        return;
      }

      const pharmacyIds = res.data
        .filter((item) => item.targetType === "PHARMACY" && item.pharmacyId)
        .map((item) => item.pharmacyId as string);

      const pharmacyMap = new Map<string, { name: string; address?: string }>();
      await Promise.all(
        pharmacyIds.map(async (id) => {
          const detail = await apiJson<{ name: string; address?: string }>(
            `/api/pharmacies/${id}`
          );
          if (detail.ok && detail.data) {
            pharmacyMap.set(id, detail.data);
          }
        })
      );

      const mapped = res.data.map((fav) => {
        if (fav.targetType === "PHARMACY" && fav.pharmacyId) {
          const info = pharmacyMap.get(fav.pharmacyId);
          return {
            id: fav._id,
            label: info?.name ?? "Pharmacie favorite",
            subtitle: info?.address ?? `ID: ${fav.pharmacyId}`,
            type: "PHARMACY" as const,
          };
        }
        return {
          id: fav._id,
          label: "Produit favori",
          subtitle: fav.productId ? `ID: ${fav.productId}` : "Produit",
          type: "PRODUCT" as const,
        };
      });

      setFavorites(mapped);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const hasFavorites = favorites.length > 0;

  return (
    <PatientShell>
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#E5E7EB]" />
              <div>
                <h1 className="text-lg font-semibold">{displayName}</h1>
                <p className="text-sm text-[#6B7280]">{email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-[#E8FFF1] px-3 py-1 text-[#0F9D58]">
                    Patient vérifié
                  </span>
                  <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[#0B63D1]">
                    Membre depuis 2021
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/profile/edit"
              className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
            >
              Modifier le profil
            </Link>
          </div>
      </div>

      <div className="rounded-3xl border border-[#E5E7EB] bg-white">
          <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] px-6 py-4 text-xs font-semibold text-[#6B7280]">
            <Link
              className="rounded-full border border-transparent px-4 py-2"
              href="/profile"
            >
              Infos personnelles
            </Link>
            <Link
              className="rounded-full border border-[#0B63D1] bg-[#EAF2FF] px-4 py-2 text-[#0B63D1]"
              href="/favorites"
            >
              Favoris
            </Link>
            <Link
              className="rounded-full border border-transparent px-4 py-2"
              href="/history"
            >
              Historique
            </Link>
            <Link
              className="rounded-full border border-transparent px-4 py-2"
              href="/preferences"
            >
              Préférences
            </Link>
          </div>

          <div className="px-6 py-8">
            {loading ? (
              <p className="text-center text-xs text-[#6B7280]">
                Chargement des favoris...
              </p>
            ) : hasFavorites ? (
              <div className="space-y-3">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="text-sm font-semibold">{fav.label}</p>
                      <p className="text-xs text-[#6B7280]">{fav.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[11px] font-semibold text-[#6B7280]">
                      {fav.type === "PHARMACY" ? "Pharmacie" : "Produit"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-sm font-semibold">
                  Aucun favori pour le moment
                </h2>
                <p className="mt-2 text-xs text-[#6B7280]">
                  Ajoutez des produits ou pharmacies pour les retrouver plus
                  vite.
                </p>
              </div>
            )}
          </div>
      </div>
    </PatientShell>
  );
}
