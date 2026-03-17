const growthStats = [
  {
    label: "Nouveaux utilisateurs",
    value: "+18%",
    note: "Ce mois",
    noteTone: "emerald",
    tone: "blue",
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
    label: "Pharmacies ajoutees",
    value: "+12",
    note: "Ce mois",
    noteTone: "slate",
    tone: "emerald",
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
    label: "Recherches totales",
    value: "98k",
    note: "30 jours",
    noteTone: "slate",
    tone: "amber",
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
];

const toneStyles: Record<string, string> = {
  blue: "bg-[#EAF2FF] text-[#0B63D1]",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-700",
};

const noteStyles: Record<string, string> = {
  emerald: "text-emerald-600",
  slate: "text-[#9CA3AF]",
};

export default function AdminGrowthPage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Croissance</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Indicateurs de croissance et adoption.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
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
              Exporter les donnees
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {growthStats.map((stat) => (
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
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                <p className={`mt-2 text-[11px] ${noteStyles[stat.noteTone]}`}>
                  {stat.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Adoption par region</h2>
              <div className="mt-6 flex h-52 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF2FF] via-[#F8FAFC] to-[#EAF2FF]">
                <div className="grid w-40 gap-3">
                  <div className="h-2 rounded-full bg-[#0B63D1]" />
                  <div className="h-2 rounded-full bg-[#7AA7F0]" />
                  <div className="h-2 rounded-full bg-[#C6DAFA]" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Cohortes d&apos;utilisateurs</h2>
              <div className="mt-6 space-y-3 text-xs text-[#6B7280]">
                <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  <span>Semaine 1</span>
                  <span className="font-semibold text-emerald-600">62%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  <span>Semaine 2</span>
                  <span className="font-semibold text-amber-600">48%</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  <span>Semaine 3</span>
                  <span className="font-semibold text-rose-600">34%</span>
                </div>
              </div>
            </div>
          </div>
            </div>
  );
}
