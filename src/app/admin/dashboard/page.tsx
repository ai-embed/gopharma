const overviewStats = [
  {
    label: "Utilisateurs Totaux",
    value: "24 592",
    delta: "+12%",
    note: "Vs mois dernier",
    tone: "blue",
    deltaTone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3z"
          fill="currentColor"
        />
        <path
          d="M4 18a4 4 0 0 1 8 0M12 18a4 4 0 0 1 8 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Pharmacies Actives",
    value: "843",
    delta: "+5%",
    note: "Vs mois dernier",
    tone: "violet",
    deltaTone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M7 4h10a2 2 0 0 1 2 2v12H5V6a2 2 0 0 1 2-2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M9 10h6M9 14h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Recherches Quotidiennes",
    value: "3 205",
    delta: "-2.1%",
    note: "Vs hier",
    tone: "amber",
    deltaTone: "rose",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <circle
          cx="11"
          cy="11"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M20 20l-3.5-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Temps de Reponse Moyen",
    value: "142ms",
    badge: "Stable",
    note: "Système en bonne santé",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M12 8.5v4l2.5 1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const toneStyles: Record<string, string> = {
  blue: "bg-[#EAF2FF] text-[#0B63D1]",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-600",
};

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
    detail: "Disponibilité 99.9%",
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
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">
              Vue d&apos;ensemble du Tableau de Bord
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M20 20l-3.5-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  placeholder="Recherche globale..."
                  className="w-56 rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-10 text-xs"
                />
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-[#6B7280]"
                  aria-hidden="true"
                >
                  <path
                    d="M12 4a5 5 0 0 1 5 5v2.2l1.2 2.4c.4.8-.1 1.4-1 1.4H6.8c-.9 0-1.4-.6-1-1.4L7 11.2V9a5 5 0 0 1 5-5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 19a2.5 2.5 0 0 0 5 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#6B7280]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Dernière mise à jour : À l&apos;instant
            </span>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M12 5v9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M8.5 11.5L12 15l3.5-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 19h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              Exporter les Donnees
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-[#6B7280]">{stat.label}</p>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      toneStyles[stat.tone]
                    }`}
                  >
                    {stat.icon}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xl font-semibold">{stat.value}</span>
                  {stat.delta ? (
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        stat.deltaTone === "emerald"
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
                    Vérifications de Pharmacie en attente
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                      3 EN ATTENTE
                    </span>
                  </div>
                  <button className="text-xs font-semibold text-[#0B63D1]">
                    Voir toutes les demandes
                  </button>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB]">
                  <div className="overflow-x-auto">
                    <table className="min-w-[640px] w-full text-xs">
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
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M6 12.5l4 4L18 8.5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              <button className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M8 8l8 8M16 8l-8 8"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    </table>
                  </div>
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
                  <h3 className="text-sm font-semibold">État du Système</h3>
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
                  Dernière Sauvegarde
                </p>
                <p className="mt-2">Il y a 2 heures</p>
                <p className="text-[11px] text-[#9CA3AF]">Taille : 2.4 Go</p>
              </div>
            </div>
          </div>
            </div>
  );
}
