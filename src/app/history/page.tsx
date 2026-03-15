"use client";

import { TopNav } from "@/components/TopNav";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-5xl space-y-6">
        <TopNav />
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <h1 className="text-lg font-semibold">Historique</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Ecran en cours de preparation.
          </p>
        </div>
      </div>
    </div>
  );
}
