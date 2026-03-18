"use client";

import { useEffect, useState } from "react";
import ProfileShell from "@/components/ProfileShell";
import { apiJson, apiJsonAuth } from "@/lib/api";

export default function FavoritesView() {
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
    <ProfileShell activeTab="favorites">
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
          <h2 className="text-sm font-semibold">Aucun favori pour le moment</h2>
          <p className="mt-2 text-xs text-[#6B7280]">
            Ajoutez des produits ou pharmacies pour les retrouver plus vite.
          </p>
        </div>
      )}
    </ProfileShell>
  );
}
