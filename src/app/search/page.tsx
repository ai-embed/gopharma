import { Suspense } from "react";
import SearchView from "./SearchView";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-[#6B7280]">
          Chargement de la recherche...
        </div>
      }
    >
      <SearchView />
    </Suspense>
  );
}
