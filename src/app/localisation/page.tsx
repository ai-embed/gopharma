"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PatientShell } from "@/components/PatientShell";
import { getAccessToken } from "@/lib/auth";
import {
  markSessionLocationChoiceDone,
  requestCurrentPosition,
  saveLocationCoords,
} from "@/lib/location-preferences";

export const dynamic = "force-dynamic";

export default function LocalisationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await requestCurrentPosition();
      saveLocationCoords(coords, "once");
      markSessionLocationChoiceDone(getAccessToken() ?? "anonymous");
      router.push("/search");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Impossible de récupérer votre localisation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <section className="gp-location-card w-full max-w-md rounded-[2rem] p-7 text-center sm:p-8">
          <div className="gp-location-pulse mx-auto flex h-24 w-24 items-center justify-center rounded-full">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl text-[#0B63D1] shadow-[0_10px_24px_rgba(11,99,209,0.2)]">
              ⌖
            </span>
          </div>
          <p className="gp-section-kicker mt-6">Recherche de proximité</p>
          <h1 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#10233F]">
            Trouvons une pharmacie pour vous
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">
            Votre position nous aide à proposer les pharmacies ouvertes et les produits disponibles près de vous.
          </p>
          <button
            type="button"
            onClick={() => void allowLocation()}
            disabled={loading}
            className="gp-search-submit mt-6 w-full rounded-full py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Recherche de votre position…" : "Utiliser ma localisation"}
          </button>
          <div className="my-5 flex items-center gap-3 text-xs text-[#9CA3AF]">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            ou
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>
          <button
            type="button"
            onClick={() => router.push("/search")}
            className="gp-outline-button w-full rounded-full border bg-white py-3 text-sm font-bold"
          >
            Choisir une pharmacie sur la carte
          </button>
          {error ? <p className="mt-4 text-xs font-medium text-[#B91C1C]">{error}</p> : null}
          <p className="mt-6 text-[11px] leading-5 text-[#9CA3AF]">
            Votre localisation est uniquement utilisée pour personnaliser les résultats proches de vous.
          </p>
        </section>
      </div>
    </PatientShell>
  );
}
