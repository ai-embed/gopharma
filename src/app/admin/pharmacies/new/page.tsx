export default function AdminNewPharmacyPage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Ajouter une pharmacie</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Enregistrer un nouvel etablissement.
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
                <p className="text-[11px] text-[#6B7280]">Nom de la pharmacie</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  ex: Pharmacie de la Sante
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Numero IFU</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  000-000-000
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] text-[#6B7280]">Adresse</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  123 Rue de la Pharmacie, Ville, Pays
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Contact email</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  contact@pharmacie.com
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Telephone</p>
                <div className="mt-2 rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs">
                  +229 67 00 00 00
                </div>
              </div>
            </div>
          </div>
            </div>
  );
}
