import { useCallback, useState } from "react";
import { apiJson, apiJsonAuth } from "./api";

type Coordinates = {
  lat: number;
  lng: number;
};

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

interface SearchResult {
  _id: string;
  productId: {
    name: string;
    scientificName?: string;
    category?: string;
    isMedicine: boolean;
  };
  pharmacyId: PublicPharmacy;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
}

interface UseSearchOptions {
  openNow?: boolean;
  category?: string;
  radiusKm?: number;
  userCoords?: Coordinates | null;
}

export function useSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [pharmacyMatches, setPharmacyMatches] = useState<PublicPharmacy[]>([]);

  const recordHistory = useCallback(
    (query: string, searchType: "PRODUIT" | "PHARMACIE", resultCount: number) => {
      const cleanQuery = query.trim();
      if (!cleanQuery) return;

      void apiJsonAuth("/api/history", {
        method: "POST",
        body: JSON.stringify({
          query: cleanQuery,
          searchType,
          resultCount,
        }),
      });
    },
    []
  );

  const searchProducts = useCallback(
    async (
      query: string,
      options: UseSearchOptions = {}
    ): Promise<SearchResult[]> => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("q", query);
      if (options.openNow !== undefined) {
        params.set("openNow", String(options.openNow));
      }
      if (options.category) {
        params.set("category", options.category);
      }
      if (options.userCoords) {
        params.set("lat", options.userCoords.lat.toString());
        params.set("lng", options.userCoords.lng.toString());
      }
      if (options.radiusKm) {
        params.set("radiusKm", options.radiusKm.toString());
      }

      const res = await apiJson<SearchResult[]>(
        `/api/search/products?${params.toString()}`
      );

      setLoading(false);

      if (!res.ok) {
        setError(res.error ?? "Recherche impossible.");
        return [];
      }

      const data = res.data ?? [];
      recordHistory(query, "PRODUIT", data.length);
      setResults(data);
      setPharmacyMatches([]);
      return data;
    },
    [recordHistory]
  );

  const searchPharmacies = useCallback(
    async (
      query: string,
      options: UseSearchOptions = {}
    ): Promise<PublicPharmacy[]> => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("q", query);
      params.set("openNow", String(options.openNow ?? true));
      if (options.userCoords) {
        params.set("lat", options.userCoords.lat.toString());
        params.set("lng", options.userCoords.lng.toString());
      }
      if (options.radiusKm) {
        params.set("radiusKm", options.radiusKm.toString());
      }

      const res = await apiJson<PublicPharmacy[]>(
        `/api/search/pharmacies?${params.toString()}`
      );

      setLoading(false);

      if (!res.ok) {
        setError(res.error ?? "Recherche impossible.");
        return [];
      }

      const data = res.data ?? [];
      recordHistory(query, "PHARMACIE", data.length);
      setResults([]);
      setPharmacyMatches(data);
      return data;
    },
    [recordHistory]
  );

  const searchMultiProducts = useCallback(
    async (
      terms: string[],
      options: UseSearchOptions = {}
    ): Promise<SearchResult[]> => {
      setLoading(true);
      setError(null);

      const baseParams = new URLSearchParams();
      if (options.openNow !== undefined) {
        baseParams.set("openNow", String(options.openNow));
      }
      if (options.category) {
        baseParams.set("category", options.category);
      }
      if (options.userCoords) {
        baseParams.set("lat", options.userCoords.lat.toString());
        baseParams.set("lng", options.userCoords.lng.toString());
      }
      baseParams.set("radiusKm", String(options.radiusKm ?? 50));

      const productResponses = await Promise.all(
        terms.map(async (term) => {
          const params = new URLSearchParams(baseParams.toString());
          params.set("q", term);
          return apiJson<SearchResult[]>(`/api/search/products?${params.toString()}`);
        })
      );

      const failingResponse = productResponses.find((response) => !response.ok);
      if (failingResponse) {
        setLoading(false);
        setError(failingResponse.error ?? "Recherche multi-produits impossible.");
        return [];
      }

      const mergedResults = productResponses.flatMap((response) => response.data ?? []);

      setResults(mergedResults);
      setPharmacyMatches([]);
      terms.forEach((term, index) => {
        const count = productResponses[index]?.data?.length ?? 0;
        recordHistory(term, "PRODUIT", count);
      });
      setLoading(false);
      return mergedResults;
    },
    [recordHistory]
  );

  const loadCategories = useCallback(async (): Promise<string[]> => {
    const res = await apiJson<string[]>("/api/search/categories");
    if (res.ok && res.data) {
      return res.data;
    }
    return [];
  }, []);

  const loadAutocomplete = useCallback(
    async (query: string): Promise<string[]> => {
      const res = await apiJson<string[]>(
        `/api/search/autocomplete?q=${encodeURIComponent(query)}&prefix=true`
      );
      if (res.ok && res.data) {
        return res.data.slice(0, 6);
      }
      return [];
    },
    []
  );

  return {
    loading,
    error,
    results,
    pharmacyMatches,
    searchProducts,
    searchPharmacies,
    searchMultiProducts,
    loadCategories,
    loadAutocomplete,
    setError,
  };
}
