const reportCards = [
  {
    label: "Rapports générés",
    value: "128",
    note: "30 derniers jours",
    noteTone: "slate",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect
          x="5"
          y="4"
          width="14"
          height="16"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 9h8M8 13h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Alertes système",
    value: "6",
    note: "À traiter",
    noteTone: "amber",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 4l7 3v5c0 4.5-3 7.5-7 8-4-0.5-7-3.5-7-8V7l7-3z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 9v4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Pharmacies analysées",
    value: "356",
    note: "Semaine en cours",
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
];

const toneStyles: Record<string, string> = {
  blue: "bg-[#EAF2FF] text-[#0B63D1]",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-600",
};

const noteStyles: Record<string, string> = {
  slate: "text-[#9CA3AF]",
  amber: "text-amber-600",
};

export default function AdminReportsPage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold">Rapports</h1>
              <p className="mt-1 text-xs text-[#6B7280]">
                Vue d&apos;ensemble des rapports système et opérations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
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
                Exporter
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
                  +
                </span>
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
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-[#6B7280]">{card.label}</p>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      toneStyles[card.tone]
                    }`}
                  >
                    {card.icon}
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{card.value}</p>
                <p className={`mt-2 text-[11px] ${noteStyles[card.noteTone]}`}>
                  {card.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Activité hebdomadaire</h2>
                <span className="text-xs text-[#6B7280]">7 jours</span>
              </div>
              <div className="mt-6 flex h-48 items-end gap-3 rounded-2xl bg-gradient-to-br from-[#EAF2FF] via-[#F8FAFC] to-[#EAF2FF] px-4 pb-4">
                {[40, 60, 45, 75, 55, 68, 50].map((value, idx) => (
                  <div
                    key={value}
                    className={`flex-1 rounded-full ${
                      idx === 3 ? "bg-[#0B63D1]" : "bg-[#90B7F2]"
                    }`}
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Alertes et incidents</h2>
                <span className="text-xs text-[#6B7280]">30 jours</span>
              </div>
              <div className="mt-6 space-y-3 text-xs text-[#6B7280]">
                <div className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  API Temps de reponse eleve (3h)
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  2 pharmacies en attente de validation
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Sauvegarde differee (hier)
                </div>
              </div>
            </div>
          </div>
            </div>
  );
}
