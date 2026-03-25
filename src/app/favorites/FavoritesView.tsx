"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Notice } from "@/components/Notice";
import ProfileShell from "@/components/ProfileShell";
import { apiJson } from "@/lib/api";
import { FavoriteItem, useFavorites } from "@/lib/useFavorites";

type DisplayFavorite = {
  id: string;
  label: string;
  subtitle: string;
  type: "PHARMACY" | "PRODUCT";
  targetHref?: string;
};

export default function FavoritesView() {
  const { favorites, loading, error, mutating, removeFavorite } = useFavorites();
  const [displayFavorites, setDisplayFavorites] = useState<DisplayFavorite[]>([]);

  useEffect(() => {
    let active = true;

    const mapFavorites = async (source: FavoriteItem[]) => {
      const pharmacyFavorites = source.filter(
        (item) => item.targetType === "PHARMACY" && item.pharmacyId
      );
      const pharmacyMap = new Map<string, { name: string; address?: string }>();

      await Promise.all(
        pharmacyFavorites.map(async (item) => {
          if (!item.pharmacyId) return;
          const detail = await apiJson<{ name: string; address?: string }>(
            `/api/pharmacies/${item.pharmacyId}`
          );
          if (detail.ok && detail.data) {
            pharmacyMap.set(item.pharmacyId, detail.data);
          }
        })
      );

      const mapped = source.map((fav) => {
        if (fav.targetType === "PHARMACY" && fav.pharmacyId) {
          const info = pharmacyMap.get(fav.pharmacyId);
          return {
            id: fav._id,
            label: info?.name ?? "Pharmacie favorite",
            subtitle: info?.address ?? `ID: ${fav.pharmacyId}`,
            type: "PHARMACY" as const,
            targetHref: `/pharmacies/${fav.pharmacyId}`,
          };
        }

        return {
          id: fav._id,
          label: "Produit favori",
          subtitle: fav.productId ? `ID: ${fav.productId}` : "Produit",
          type: "PRODUCT" as const,
        };
      });

      if (active) {
        setDisplayFavorites(mapped);
      }
    };

    void mapFavorites(favorites);
    return () => {
      active = false;
    };
  }, [favorites]);

  const hasFavorites = displayFavorites.length > 0;

  return (
    <ProfileShell activeTab="favorites">
      {error ? <Notice tone="error" message={error} /> : null}

      {loading ? (
        <p className="text-center text-xs text-[#6B7280]">
          Chargement des favoris...
        </p>
      ) : hasFavorites ? (
        <div className="space-y-3">
          {displayFavorites.map((fav) => (
            <div
              key={fav.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
            >
              <div className="min-w-[220px]">
                <p className="text-sm font-semibold">{fav.label}</p>
                <p className="text-xs text-[#6B7280]">{fav.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[11px] font-semibold text-[#6B7280]">
                  {fav.type === "PHARMACY" ? "Pharmacie" : "Produit"}
                </span>
                {fav.targetHref ? (
                  <Link
                    href={fav.targetHref}
                    className="rounded-full border border-[#D1D5DB] px-3 py-1 text-[11px] font-semibold text-[#374151]"
                  >
                    Voir
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    void removeFavorite(fav.id);
                  }}
                  disabled={mutating}
                  className="rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-1 text-[11px] font-semibold text-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-sm font-semibold">Aucun favori pour le moment</h2>
          <p className="mt-2 text-xs text-[#6B7280]">
            Ajoutez des produits ou pharmacies pour les retrouver plus vite.
          </p>
        </div>
      )}
    </ProfileShell>
  );
}
