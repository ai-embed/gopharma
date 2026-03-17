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
              <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Annuler
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                Enregistrer
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#6B7280]">Nom complet</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  ex: Dr. Sarah Wilson
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Email</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  ex: sarah@pharmafinder.com
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Role</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  Pharmacien
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Statut</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  Actif
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] text-[#6B7280]">Notes internes</p>
                <div className="mt-2 h-24 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs text-[#6B7280]">
                  Ajouter un commentaire...
                </div>
              </div>
            </div>
          </div>
            </div>
  );
}
