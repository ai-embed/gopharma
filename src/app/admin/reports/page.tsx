const reportCards = [
  {
    label: "Rapports Generes",
    value: "128",
    note: "30 derniers jours",
  },
  {
    label: "Alertes Systeme",
    value: "6",
    note: "A traiter",
  },
  {
    label: "Pharmacies Analysees",
    value: "356",
    note: "Semaine en cours",
  },
];

export default function AdminReportsPage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Rapports</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Vue d&apos;ensemble des rapports systeme et operations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
                Exporter
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                Generer un rapport
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reportCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
              >
                <p className="text-xs text-[#6B7280]">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
                <p className="mt-2 text-[11px] text-[#9CA3AF]">{card.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Activite hebdomadaire</h2>
                <span className="text-xs text-[#6B7280]">7 jours</span>
              </div>
              <div className="mt-6 h-48 rounded-2xl bg-gradient-to-br from-[#EAF2FF] via-[#F8FAFC] to-[#EAF2FF]" />
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Alertes et incidents</h2>
                <span className="text-xs text-[#6B7280]">30 jours</span>
              </div>
              <div className="mt-6 space-y-3 text-xs text-[#6B7280]">
                <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  API Temps de reponse eleve (3h)
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  2 pharmacies en attente de validation
                </div>
                <div className="rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  Sauvegarde differee (hier)
                </div>
              </div>
            </div>
          </div>
            </div>
  );
}
