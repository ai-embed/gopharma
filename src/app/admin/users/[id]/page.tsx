export default function AdminUserProfilePage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FF] text-lg font-semibold text-[#0B63D1]">
                SW
              </span>
              <div>
                <h1 className="text-lg font-semibold">Dr. Sarah Wilson</h1>
                <p className="text-xs text-[#6B7280]">
                  sarah.w@pharmafinder.com
                </p>
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

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Informations</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2 text-xs text-[#6B7280]">
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Role
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">Pharmacien</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Statut
                    </p>
                    <p className="font-semibold text-emerald-600">Actif</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Telephone
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      +33 6 12 34 56 78
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase text-[#9CA3AF]">
                      Derniere connexion
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      Aujourd&apos;hui 09:40
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Activite recente</h2>
                <div className="mt-4 space-y-3 text-xs text-[#6B7280]">
                  <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                    24 Oct - Validation de pharmacie MediLife Centrale
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                    23 Oct - Mise a jour inventaire (Amoxicilline 500mg)
                  </div>
                  <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                    22 Oct - Export des rapports hebdomadaires
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <h2 className="text-sm font-semibold">Pharmacie associee</h2>
                <div className="mt-4 rounded-2xl border border-[#E5E7EB] p-4 text-xs text-[#6B7280]">
                  <p className="font-semibold text-[#1F1D1B]">
                    Pharmacie CVS #4290
                  </p>
                  <p className="mt-1">Cotonou, Benin</p>
                  <p className="mt-1 text-emerald-600">Active</p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5 text-xs text-[#B91C1C]">
                <h2 className="text-sm font-semibold">Zone de danger</h2>
                <p className="mt-2">
                  Desactiver l&apos;acces utilisateur ou revoquer les droits.
                </p>
                <button className="mt-4 rounded-full bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white">
                  Revoquer l&apos;acces
                </button>
              </div>
            </div>
          </div>
            </div>
  );
}
