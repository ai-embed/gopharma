const growthStats = [
  { label: "Nouveaux utilisateurs", value: "+18%", note: "Ce mois" },
  { label: "Pharmacies ajoutees", value: "+12", note: "Ce mois" },
  { label: "Recherches totales", value: "98k", note: "30 jours" },
];

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
            <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
              Exporter les donnees
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {growthStats.map((stat) => (
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

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Adoption par region</h2>
              <div className="mt-6 h-52 rounded-2xl bg-gradient-to-br from-[#EAF2FF] via-[#F8FAFC] to-[#EAF2FF]" />
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Cohortes d&apos;utilisateurs</h2>
              <div className="mt-6 space-y-3 text-xs text-[#6B7280]">
                <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  Semaine 1 : retention 62%
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  Semaine 2 : retention 48%
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  Semaine 3 : retention 34%
                </div>
              </div>
            </div>
          </div>
            </div>
  );
}
