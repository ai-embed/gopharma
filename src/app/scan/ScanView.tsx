"use client";

import { PatientShell } from "@/components/PatientShell";

export default function ScanPage() {
  return (
    <PatientShell>
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="pointer-events-none absolute inset-0 bg-[#1F2937]/40" />

          <div className="relative mx-auto w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-xs font-semibold text-[#0B63D1]">
                  QR
                </div>
                <h1 className="text-sm font-semibold">
                  Scanner le code-barres du produit
                </h1>
              </div>
              <button className="text-xs text-[#6B7280]">×</button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#1F1D1B]">
              <div
                className="relative h-48 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1580281658629-81a3a364c0fa?auto=format&fit=crop&w=800&q=80')",
                }}
              >
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-x-8 top-10 h-20 rounded-2xl border-2 border-[#60A5FA]" />
                <div className="absolute left-8 right-8 top-20 h-[2px] bg-red-400" />
                <p className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white">
                  Align barcode within frame
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E5E7EB] px-4 py-3">
              <input
                placeholder="Saisir le code-barres manuellement..."
                className="flex-1 border-none text-xs text-[#6B7280] outline-none"
              />
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-[11px] font-semibold text-white">
                Valider
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] text-[#6B7280]">
              Impossible de scanner ? utilisez la saisie manuelle ou contactez le support.
            </p>
          </div>
      </div>
    </PatientShell>
  );
}
