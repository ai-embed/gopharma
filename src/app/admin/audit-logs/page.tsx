const auditRows = [
  {
    id: "#AUD-9012",
    date: "24 Oct 2023",
    time: "10:18",
    action: "Connexion admin",
    actor: "Alex Morgan",
    cible: "Systeme",
    statut: "Succes",
  },
  {
    id: "#AUD-9011",
    date: "24 Oct 2023",
    time: "09:55",
    action: "Validation pharmacie",
    actor: "Alex Morgan",
    cible: "MediLife Centrale",
    statut: "Succes",
  },
  {
    id: "#AUD-9009",
    date: "23 Oct 2023",
    time: "18:21",
    action: "Suppression utilisateur",
    actor: "Super Admin",
    cible: "user_83x21",
    statut: "Reussi",
  },
  {
    id: "#AUD-9007",
    date: "23 Oct 2023",
    time: "15:04",
    action: "Changement de role",
    actor: "Alex Morgan",
    cible: "Dr. Emily Davis",
    statut: "En attente",
  },
  {
    id: "#AUD-9002",
    date: "22 Oct 2023",
    time: "11:40",
    action: "Suspension pharmacie",
    actor: "Alex Morgan",
    cible: "MediCare Center",
    statut: "Alerte",
  },
];

const statusStyles: Record<string, string> = {
  Succes: "bg-emerald-100 text-emerald-600",
  Reussi: "bg-emerald-100 text-emerald-600",
  "En attente": "bg-amber-100 text-amber-700",
  Alerte: "bg-rose-100 text-rose-600",
};

export default function AdminAuditLogsPage() {
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
              <p className="text-[11px] text-[#6B7280]">Dashboard</p>
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
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#F3F6F9]"
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
              </button>
            ))}
          </nav>

          <p className="mt-6 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Analytique
          </p>
          <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
            {["Rapports", "Croissance"].map((item) => (
              <button
                key={item}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#F3F6F9]"
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
            {["Parametres", "Journaux d&apos;audit"].map((item) => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  item === "Journaux d'audit"
                    ? "bg-[#EAF2FF] text-[#0B63D1]"
                    : "hover:bg-[#F3F6F9]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-3 text-xs text-[#6B7280]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2FF] text-[11px] font-semibold text-[#0B63D1]">
              AM
            </span>
            <div>
              <p className="text-[11px] font-semibold text-[#1F1D1B]">
                Alex Morgan
              </p>
              <p className="text-[10px]">Super Admin</p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">Journaux d&apos;audit</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  placeholder="Recherche globale..."
                  className="w-56 rounded-full border border-[#E5E7EB] bg-white py-2 pl-4 pr-10 text-xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  o
                </span>
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
                o
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                placeholder="Filtrer par action ou utilisateur..."
                className="w-64 rounded-full border border-[#E5E7EB] bg-white py-2 pl-4 pr-4 text-xs"
              />
              <select className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                <option>30 derniers jours</option>
                <option>7 derniers jours</option>
                <option>3 derniers mois</option>
              </select>
              <select className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                <option>Toutes les actions</option>
                <option>Connexion</option>
                <option>Suppression</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Exporter en CSV
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                Imprimer le rapport
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
              <table className="w-full text-xs">
                <thead className="bg-[#F8FAFC] text-[#6B7280]">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">DATE &amp; HEURE</th>
                    <th className="px-4 py-3 text-left">ACTION</th>
                    <th className="px-4 py-3 text-left">ACTEUR</th>
                    <th className="px-4 py-3 text-left">CIBLE</th>
                    <th className="px-4 py-3 text-left">STATUT</th>
                    <th className="px-4 py-3 text-left">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {auditRows.map((row) => (
                    <tr key={row.id} className="border-t border-[#E5E7EB]">
                      <td className="px-4 py-3 text-[#6B7280]">{row.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{row.date}</div>
                        <div className="text-[10px] text-[#6B7280]">
                          {row.time}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{row.action}</td>
                      <td className="px-4 py-3">{row.actor}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{row.cible}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            statusStyles[row.statut]
                          }`}
                        >
                          {row.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#0B63D1]">Voir</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#6B7280]">
              <span>Affichage de 1 a 5 sur 214 resultats</span>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  Precedent
                </button>
                <button className="rounded-full bg-[#0B63D1] px-3 py-1 text-white">
                  1
                </button>
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  2
                </button>
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
