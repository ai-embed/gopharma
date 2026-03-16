export default function AdminNewPharmacyPage() {
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

          <p className="mt-6 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Systeme
          </p>
          <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
            {["Parametres", "Journaux d'audit"].map((item) => (
              <button
                key={item}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#F3F6F9]"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 px-8 py-8">
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
        </main>
      </div>
    </div>
  );
}
