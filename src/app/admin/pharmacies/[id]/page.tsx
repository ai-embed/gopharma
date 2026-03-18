export default function AdminPharmacyProfilePage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FF] text-lg font-semibold text-[#0B63D1]">
                CP
              </span>
              <div>
                <h1 className="text-lg font-semibold">City Pharmacy</h1>
                <p className="text-xs text-[#6B7280]">New York, NY</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Suspendre
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M4 16.5V20h3.5L18 9.5l-3.5-3.5L4 16.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.5 6.5l3 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                Modifier
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">
                  Informations de la pharmacie
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 text-xs text-[#6B7280]">
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Licence
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">LIC-992831</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Statut
                    </p>
                    <p className="font-semibold text-emerald-600">Actif</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Email
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      contact@citypharmacy.com
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Telephone
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      +1 (212) 456-7812
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Activité récente</h2>
                <div className="mt-4 space-y-3 text-xs text-[#6B7280]">
                  <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                    24 Oct - Mise a jour de stock (Paracetamol 500mg)
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                    23 Oct - Ajout de produit (Vitamine C)
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                    22 Oct - Changement d&apos;horaires
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Localisation</h2>
                <div className="mt-4 rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-4 text-xs text-[#6B7280]">
                  Apercu carte indisponible
                </div>
              </div>

              <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5 text-xs text-[#B91C1C]">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FDE2E2] text-[#B91C1C]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 5v8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
                      <path
                        d="M12 3l9 16H3L12 3z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h2 className="text-sm font-semibold">Zone de danger</h2>
                </div>
                <p className="mt-2">
                  Désactiver temporairement le compte pharmacie.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M6 12h12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  Suspendre la pharmacie
                </button>
              </div>
            </div>
          </div>
            </div>
  );
}
