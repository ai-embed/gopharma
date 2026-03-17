export default function AdminNewUserPage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Ajouter un utilisateur</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Creer un compte utilisateur manuellement.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Annuler
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M6 12.5l3.5 3.5L18 8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Enregistrer
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#6B7280]">Nom complet</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  ex: Dr. Sarah Wilson
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Email</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  ex: sarah@pharmafinder.com
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Role</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  Pharmacien
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Statut</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  Actif
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] text-[#6B7280]">Notes internes</p>
                <textarea
                  placeholder="Ajouter un commentaire..."
                  className="mt-2 h-24 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs text-[#6B7280]"
                />
              </div>
            </div>
          </div>
            </div>
  );
}
