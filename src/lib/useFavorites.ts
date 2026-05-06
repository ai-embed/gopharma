"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiJsonAuth } from "@/lib/api";

export type FavoriteTargetType = "PHARMACY" | "PRODUCT";

export type FavoriteItem = {
  _id: string;
  targetType: FavoriteTargetType;
  pharmacyId?: string;
  productId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type CreateFavoritePayload = {
  targetType: FavoriteTargetType;
  pharmacyId?: string;
  productId?: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await apiJsonAuth<FavoriteItem[]>("/api/favorites");
    if (!result.ok || !result.data) {
      setFavorites([]);
      setError(result.error ?? "Impossible de charger les favoris.");
      setLoading(false);
      return;
    }

    setFavorites(result.data);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [refresh]);

  const addFavorite = useCallback(async (payload: CreateFavoritePayload) => {
    setMutating(true);
    const result = await apiJsonAuth<FavoriteItem>("/api/favorites", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setMutating(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible d'ajouter ce favori.");
      return null;
    }

    setFavorites((prev) => {
      const alreadyExists = prev.some((item) => item._id === result.data?._id);
      if (alreadyExists) return prev;
      return [result.data as FavoriteItem, ...prev];
    });
    setError(null);
    return result.data;
  }, []);

  const removeFavorite = useCallback(async (favoriteId: string) => {
    setMutating(true);
    const result = await apiJsonAuth<{ success: boolean }>(`/api/favorites/${favoriteId}`, {
      method: "DELETE",
    });
    setMutating(false);

    if (!result.ok) {
      setError(result.error ?? "Impossible de supprimer ce favori.");
      return false;
    }

    setFavorites((prev) => prev.filter((item) => item._id !== favoriteId));
    setError(null);
    return true;
  }, []);

  const pharmacyFavoriteMap = useMemo(() => {
    const map = new Map<string, FavoriteItem>();
    favorites.forEach((item) => {
      if (item.targetType === "PHARMACY" && item.pharmacyId) {
        map.set(item.pharmacyId, item);
      }
    });
    return map;
  }, [favorites]);

  const isPharmacyFavorite = useCallback(
    (pharmacyId: string) => pharmacyFavoriteMap.has(pharmacyId),
    [pharmacyFavoriteMap]
  );

  const togglePharmacyFavorite = useCallback(
    async (pharmacyId: string) => {
      const existing = pharmacyFavoriteMap.get(pharmacyId);
      if (existing) {
        return removeFavorite(existing._id);
      }

      const created = await addFavorite({
        targetType: "PHARMACY",
        pharmacyId,
      });
      return Boolean(created);
    },
    [addFavorite, pharmacyFavoriteMap, removeFavorite]
  );

  return {
    favorites,
    loading,
    mutating,
    error,
    refresh,
    addFavorite,
    removeFavorite,
    isPharmacyFavorite,
    togglePharmacyFavorite,
  };
}
