const overviewStats = [
  {
    label: "Utilisateurs Totaux",
    value: "24 592",
    delta: "+12%",
    note: "Vs mois dernier",
    tone: "emerald",
  },
  {
    label: "Pharmacies Actives",
    value: "843",
    delta: "+5%",
    note: "Vs mois dernier",
    tone: "emerald",
  },
  {
    label: "Recherches Quotidiennes",
    value: "3 205",
    delta: "-2.1%",
    note: "Vs hier",
    tone: "rose",
  },
  {
    label: "Temps de Reponse Moyen",
    value: "142ms",
    badge: "Stable",
    note: "Systeme en bonne sante",
    tone: "emerald",
  },
];

const pending = [
  {
    name: "GreenCross Pharma",
    license: "LIC-992831",
    date: "24 Oct 2023",
    status: "En cours",
  },
  {
    name: "CityCare Meds",
    license: "LIC-110294",
    date: "23 Oct 2023",
    status: "Attente",
  },
  {
    name: "Wellness Club",
    license: "LIC-445821",
    date: "23 Oct 2023",
    status: "Attente",
  },
];

const trends = [
  { label: "Antibiotiques", percent: 45 },
  { label: "Analgesiques", percent: 32 },
  { label: "Antihistaminiques", percent: 15 },
  { label: "Vitamines", percent: 8 },
];

const systemStatus = [
  {
    name: "API Principale",
    status: "Operationnel",
    detail: "Disponibilite 99.9%",
    bar: 92,
  },
  {
    name: "BD PostgreSQL",
    status: "Operationnel",
    detail: "Charge 24%",
    bar: 72,
  },
  {
    name: "Index de Recherche",
    status: "Operationnel",
    detail: "Charge CPU serveur 34%",
    bar: 64,
  },
];

export default function AdminDashboardPage() {
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
                  item === "Tableau de bord"
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
            <h1 className="text-lg font-semibold">
              Vue d&apos;ensemble du Tableau de Bord
            </h1>
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

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#6B7280]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Derniere mise a jour : A l&apos;instant
            </span>
            <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
              Exporter les donnees
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
              >
                <p className="text-xs text-[#6B7280]">{stat.label}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xl font-semibold">{stat.value}</span>
                  {stat.delta ? (
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        stat.tone === "emerald"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {stat.delta}
                    </span>
                  ) : null}
                  {stat.badge ? (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                      {stat.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-[11px] text-[#9CA3AF]">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    Verifications de Pharmacie en Attente
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                      3 EN ATTENTE
                    </span>
                  </div>
                  <button className="text-xs font-semibold text-[#0B63D1]">
                    Voir toutes les demandes
                  </button>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB]">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F8FAFC] text-[#6B7280]">
                      <tr>
                        <th className="px-4 py-3 text-left">PHARMACIE</th>
                        <th className="px-4 py-3 text-left">LICENCE NO.</th>
                        <th className="px-4 py-3 text-left">SOUMIS LE</th>
                        <th className="px-4 py-3 text-left">STATUT</th>
                        <th className="px-4 py-3 text-left">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((item) => (
                        <tr
                          key={item.license}
                          className="border-t border-[#E5E7EB]"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[11px] font-semibold text-[#0B63D1]">
                                {item.name[0]}
                              </span>
                              <span className="font-semibold">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">
                            {item.license}
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">
                            {item.date}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                item.status === "En cours"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-[11px] font-semibold">
                              <button className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                OK
                              </button>
                              <button className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                X
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Verifications Supplementaires</span>
                  <button className="text-xs font-semibold text-[#0B63D1]">
                    Gerer tout
                  </button>
                </div>
                <div className="mt-6 rounded-2xl border border-dashed border-[#E5E7EB] px-4 py-6 text-center text-xs text-[#9CA3AF]">
                  File d&apos;attente secondaire active
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="text-sm font-semibold">Tendances de Recherche</h3>
                <div className="mt-4 space-y-3 text-xs text-[#6B7280]">
                  {trends.map((trend) => (
                    <div key={trend.label}>
                      <div className="flex items-center justify-between">
                        <span>{trend.label}</span>
                        <span className="font-semibold text-[#1F1D1B]">
                          {trend.percent}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-[#E5E7EB]">
                        <div
                          className="h-2 rounded-full bg-[#0B63D1]"
                          style={{ width: `${trend.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Etat du Systeme</h3>
                  <button className="text-xs font-semibold text-[#0B63D1]">
                    Actualiser
                  </button>
                </div>
                <div className="mt-4 space-y-4 text-xs text-[#6B7280]">
                  {systemStatus.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-[#E5E7EB] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1F1D1B]">
                          {item.name}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px]">{item.detail}</p>
                      <div className="mt-2 h-2 w-full rounded-full bg-[#E5E7EB]">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${item.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-xs text-[#6B7280]">
                <p className="font-semibold text-[#1F1D1B]">
                  Derniere Sauvegarde
                </p>
                <p className="mt-2">Il y a 2 heures</p>
                <p className="text-[11px] text-[#9CA3AF]">Taille : 2.4 Go</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
