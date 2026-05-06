"use client";

type SortMode = "priceAsc" | "priceDesc";
export type DistanceMode =
  | "within5"
  | "within10"
  | "within20"
  | "within50"
  | "beyond50"
  | "unlimited";

interface SearchFiltersProps {
  openNow: boolean;
  onOpenNowChange: (value: boolean) => void;
  sortMode: SortMode;
  onSortModeChange: (value: SortMode) => void;
  distanceMode: DistanceMode;
  onDistanceModeChange: (value: DistanceMode) => void;
}

const baseFilterPillClass =
  "rounded-full border border-[#DCE5F0] bg-white px-3.5 py-2 text-[11px] font-semibold text-[#374151] shadow-[0_4px_10px_rgba(15,23,42,0.03)] transition";

export function SearchFilters({
  openNow,
  onOpenNowChange,
  sortMode,
  onSortModeChange,
  distanceMode,
  onDistanceModeChange,
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
      <select
        value={distanceMode}
        onChange={(event) => onDistanceModeChange(event.target.value as DistanceMode)}
        className={`${baseFilterPillClass} pr-8 text-[11px] text-[#6B7280]`}
      >
        <option value="within5">Jusqu&apos;à 5 km</option>
        <option value="within10">Jusqu&apos;à 10 km</option>
        <option value="within20">Jusqu&apos;à 20 km</option>
        <option value="within50">Jusqu&apos;à 50 km</option>
        <option value="beyond50">Loin (≥ 50 km)</option>
        <option value="unlimited">Illimité</option>
      </select>
    </div>
  );
}
