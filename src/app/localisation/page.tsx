export const dynamic = "force-dynamic";

export default function LocalisationPage() {
  return (
    <div className="min-h-screen bg-[#EEF5FB] text-[#1F1D1B]">
      <div className="px-6 py-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#0B63D1]">
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#0B63D1] text-xs font-semibold text-white">
            +
          </span>
          GoPharma
        </div>
      </div>

      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-28 w-28 rounded-full bg-[#EAF2FF]" />
          <h1 className="mt-6 text-2xl font-semibold">
            Trouvons une pharmacie pour vous
          </h1>
          <p className="mt-3 text-sm text-[#6B7280]">
            Pour vous montrer les pharmacies ouvertes les plus proches et les
            temps d&apos;attente precis, nous avons besoin d&apos;acceder a la
            localisation de votre appareil.
          </p>
          <button className="mt-6 w-full rounded-full bg-[#0B63D1] py-3 text-sm font-semibold text-white">
            Autoriser l&apos;acces a la localisation
          </button>
          <div className="my-4 flex items-center gap-3 text-xs text-[#9CA3AF]">
            <div className="h-px flex-1 bg-[#E5E7EB]" />
            ou
            <div className="h-px flex-1 bg-[#E5E7EB]" />
          </div>
          <button className="w-full rounded-full border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#1F2937]">
            Entrer l&apos;adresse manuellement
          </button>
          <p className="mt-6 text-[11px] text-[#9CA3AF]">
            Votre localisation est uniquement utilisee pour trouver des
            resultats.
          </p>
        </div>
      </div>

      <p className="pb-6 text-center text-[10px] text-[#9CA3AF]">
        (c) 2023 PharmaFinder Inc. All rights reserved.
      </p>
    </div>
  );
}
