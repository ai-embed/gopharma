const growthStats = [
  { label: "Nouveaux utilisateurs", value: "+18%", note: "Ce mois" },
  { label: "Pharmacies ajoutees", value: "+12", note: "Ce mois" },
  { label: "Recherches totales", value: "98k", note: "30 jours" },
];

export default function AdminGrowthPage() {
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
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  item === "Croissance"
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
        </main>
      </div>
    </div>
  );
}
