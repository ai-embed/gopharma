export default function AdminPharmacyProfilePage() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] text-[#1F1D1B]">
      <div className="flex">
        <aside className="flex w-64 flex-col border-r border-[#E5E7EB] bg-white px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B63D1] text-xs font-semibold text-white">
              +
            </div>
            <div>
              <p className="text-sm font-semibold">GoPharma</p>
              <p className="text-[11px] text-[#6B7280]">Tableau de bord</p>
            </div>
          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Principal
          </p>
          <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
            {[
              "Tableau de bord",
              "Utilisateurs",
              "Pharmacies",
              "Base Medicaments",
              "File de validation",
            ].map((item) => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  item === "Pharmacies"
                    ? "bg-[#EAF2FF] text-[#0B63D1]"
                    : "hover:bg-[#F3F6F9]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-8 py-8">
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
              <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Suspendre
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
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
                <h2 className="text-sm font-semibold">Activite recente</h2>
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
                <div className="mt-4 rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F8FAFC] p-4 text-xs text-[#6B7280]">
                  Apercu carte indisponible
                </div>
              </div>

              <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5 text-xs text-[#B91C1C]">
                <h2 className="text-sm font-semibold">Zone de danger</h2>
                <p className="mt-2">
                  Desactiver temporairement le compte pharmacie.
                </p>
                <button className="mt-4 rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white">
                  Suspendre la pharmacie
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
