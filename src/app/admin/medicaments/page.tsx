const stats = [
  {
    label: "Total Medicaments",
    value: "12 450",
    note: "+5% ce mois",
  },
  {
    label: "Categories",
    value: "64",
    note: "Catalogues actifs",
  },
  {
    label: "Mises a Jour",
    value: "128",
    note: "Derniers 30 jours",
  },
  {
    label: "Signales",
    value: "9",
    note: "A verifier",
  },
];

const medicaments = [
  {
    name: "Paracetamol 500mg",
    molecule: "Paracetamol",
    form: "Comprime",
    atc: "N02BE01",
    status: "Actif",
    date: "18 Oct 2023",
  },
  {
    name: "Amoxicilline 500mg",
    molecule: "Amoxicilline",
    form: "Capsule",
    atc: "J01CA04",
    status: "Actif",
    date: "12 Oct 2023",
  },
  {
    name: "Ibuprofene 400mg",
    molecule: "Ibuprofene",
    form: "Comprime",
    atc: "M01AE01",
    status: "A verifier",
    date: "09 Oct 2023",
  },
  {
    name: "Loratadine 10mg",
    molecule: "Loratadine",
    form: "Comprime",
    atc: "R06AX13",
    status: "Actif",
    date: "02 Oct 2023",
  },
  {
    name: "Omeprazole 20mg",
    molecule: "Omeprazole",
    form: "Gelule",
    atc: "A02BC01",
    status: "Inactif",
    date: "29 Sep 2023",
  },
];

const statusStyles: Record<string, string> = {
  Actif: "bg-emerald-100 text-emerald-600",
  "A verifier": "bg-amber-100 text-amber-700",
  Inactif: "bg-slate-100 text-slate-600",
};

export default function AdminMedicamentsPage() {
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
                  item === "Base Medicaments"
                    ? "bg-[#EAF2FF] text-[#0B63D1]"
                    : "hover:bg-[#F3F6F9]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
                {item === "Base Medicaments" ? (
                  <span className="ml-auto rounded-full bg-[#EAF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#0B63D1]">
                    12
                  </span>
                ) : null}
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
            <h1 className="text-lg font-semibold">Base Medicaments</h1>
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
              >
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-[11px] text-[#9CA3AF]">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-sm font-semibold">Tous les Medicaments</h2>
              <div className="flex flex-wrap items-center gap-3">
                <select className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                  <option>Toutes les Categories</option>
                  <option>Analgesiques</option>
                  <option>Antibiotiques</option>
                </select>
                <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                  + Ajouter un medicament
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#F8FAFC] text-[#6B7280]">
                  <tr>
                    <th className="px-4 py-3 text-left">NOM</th>
                    <th className="px-4 py-3 text-left">MOLECULE</th>
                    <th className="px-4 py-3 text-left">FORME</th>
                    <th className="px-4 py-3 text-left">ATC</th>
                    <th className="px-4 py-3 text-left">STATUT</th>
                    <th className="px-4 py-3 text-left">DERNIERE MAJ</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {medicaments.map((item) => (
                    <tr key={item.name} className="border-t border-[#E5E7EB]">
                      <td className="px-4 py-3 font-semibold">{item.name}</td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {item.molecule}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{item.form}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{item.atc}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            statusStyles[item.status]
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">{item.date}</td>
                      <td className="px-4 py-3 text-[11px] font-semibold text-[#0B63D1]">
                        Modifier
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-[#6B7280]">
              <span>Affichage 1-5 sur 12 450</span>
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
                  3
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
