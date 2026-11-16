"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PatientShell } from "@/components/PatientShell";

export default function ScanPage() {
  const router = useRouter();
  const [barcode, setBarcode] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submitBarcode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = barcode.trim();

    if (!query) {
      setError("Saisissez un code ou le nom d’un produit pour continuer.");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(query)}&source=scan`);
  };

  return (
    <PatientShell>
      <section className="gp-scan-stage relative overflow-hidden rounded-[2rem] p-5 sm:p-8">
        <div className="gp-scan-orb gp-scan-orb--one" />
        <div className="gp-scan-orb gp-scan-orb--two" />

        <div className="relative mx-auto w-full max-w-xl">
          <div className="mb-5 text-center text-white">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-cyan-100/85">
              Recherche express
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
              Identifiez un produit rapidement
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-blue-50/80">
              Utilisez la saisie manuelle pour rechercher un code-barres ou un médicament dans les pharmacies proches.
            </p>
          </div>

          <div className="gp-scan-card rounded-[2rem] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3FF] text-xs font-extrabold text-[#0B63D1]">
                  SCN
                </span>
                <div>
                  <p className="text-sm font-bold text-[#10233F]">Aperçu du scanner</p>
                  <p className="text-[11px] text-[#6B7280]">Alignez le code dans le cadre</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#6B7280] transition hover:bg-[#F1F6FB] hover:text-[#10233F]"
                aria-label="Fermer le scanner"
              >
                ×
              </button>
            </div>

            <div className="gp-scan-viewport mt-5 overflow-hidden rounded-3xl">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1580281658629-81a3a364c0fa?auto=format&fit=crop&w=1100&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-[#06162D]/42" />
              <div className="gp-scan-frame absolute inset-x-8 top-1/2 h-28 -translate-y-1/2 rounded-2xl" />
              <span className={`gp-scan-line ${isScanning ? "" : "gp-scan-line--paused"}`} />
              <div className="absolute inset-x-0 top-4 flex justify-center">
                <span className="rounded-full bg-[#071729]/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
                  {isScanning ? "Cadrez le code-barres" : "Aperçu en pause"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsScanning((value) => !value)}
                className="absolute bottom-4 right-4 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur transition hover:bg-white/25"
              >
                {isScanning ? "Mettre en pause" : "Reprendre"}
              </button>
            </div>

            <form onSubmit={submitBarcode} className="mt-5">
              <label htmlFor="barcode" className="text-xs font-bold text-[#34455E]">
                Saisie manuelle
              </label>
              <div className="gp-scan-input mt-2 flex items-center gap-2 rounded-2xl p-2">
                <input
                  id="barcode"
                  value={barcode}
                  onChange={(event) => {
                    setBarcode(event.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Code-barres ou nom du médicament"
                  className="min-w-0 flex-1 border-none bg-transparent px-2 py-2 text-sm text-[#10233F] outline-none placeholder:text-[#93A4B8]"
                />
                <button type="submit" className="gp-search-submit shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold text-white">
                  Rechercher
                </button>
              </div>
              {error ? <p className="mt-2 text-xs font-medium text-[#B91C1C]">{error}</p> : null}
            </form>

            <p className="mt-4 text-center text-[11px] leading-5 text-[#6B7280]">
              La recherche vous indiquera où trouver le produit et sa disponibilité.
            </p>
          </div>
        </div>
      </section>
    </PatientShell>
  );
}
