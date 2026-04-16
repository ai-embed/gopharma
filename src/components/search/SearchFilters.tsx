"use client";

type SortMode = "priceAsc" | "priceDesc";

interface SearchFiltersProps {
  openNow: boolean;
  onOpenNowChange: (value: boolean) => void;
  stockOnly: boolean;
  onStockOnlyChange: (value: boolean) => void;
  sortMode: SortMode;
  onSortModeChange: (value: SortMode) => void;
  radiusKm: number;
  onRadiusKmChange: (value: number) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

const baseFilterPillClass =
  "rounded-full border border-[#DCE5F0] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#374151] shadow-[0_4px_10px_rgba(15,23,42,0.03)] transition";

export function SearchFilters({
  openNow,
  onOpenNowChange,
  stockOnly,
  onStockOnlyChange,
  sortMode,
  onSortModeChange,
  radiusKm,
  onRadiusKmChange,
  category,
  onCategoryChange,
  categories,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-[#374151]">
      <button className="rounded-full bg-[#0B63D1] px-3.5 py-2 text-white shadow-[0_10px_20px_rgba(11,99,209,0.18)]">
        ✣ Tous les filtres
      </button>
      <button
        type="button"
        onClick={() => onOpenNowChange(!openNow)}
        className={`${baseFilterPillClass} ${
          openNow
            ? "bg-[#EFF6FF] text-[#0B63D1] ring-1 ring-[#BFDBFE]"
            : "hover:border-[#BFDBFE] hover:text-[#0B63D1]"
        }`}
      >
        Ouvert maintenant
      </button>
      <button
        type="button"
        onClick={() =>
          onSortModeChange(sortMode === "priceAsc" ? "priceDesc" : "priceAsc")
        }
        className={baseFilterPillClass}
      >
        Prix: {sortMode === "priceAsc" ? "croissant" : "décroissant"}
      </button>
      <button
        type="button"
        onClick={() => onStockOnlyChange(!stockOnly)}
        className={`${baseFilterPillClass} ${
          stockOnly
            ? "bg-[#EFF6FF] text-[#0B63D1] ring-1 ring-[#BFDBFE]"
            : "hover:border-[#BFDBFE] hover:text-[#0B63D1]"
        }`}
      >
        {stockOnly ? "Disponibilité complète" : "Tous les stocks"}
      </button>
      <select
        value={String(radiusKm)}
        onChange={(event) => onRadiusKmChange(Number(event.target.value))}
        className={`${baseFilterPillClass} pr-8 text-[11px] text-[#6B7280]`}
      >
        <option value="5">Rayon 5 km</option>
        <option value="10">Rayon 10 km</option>
        <option value="20">Rayon 20 km</option>
        <option value="50">Rayon 50 km</option>
      </select>
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className={`${baseFilterPillClass} pr-8 text-[11px] text-[#6B7280]`}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
