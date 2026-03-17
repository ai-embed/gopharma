const activityRows = [
  {
    id: "#TRX-8902",
    date: "24 Oct 2023",
    time: "09:42",
    action: "Vente",
    actionTone: "emerald",
    product: "Panadol Extra",
    change: "-2",
    changeTone: "rose",
    user: "Jean Dupont",
  },
  {
    id: "#INV-4412",
    date: "23 Oct 2023",
    time: "16:15",
    action: "Reapprovisionnement",
    actionTone: "sky",
    product: "Amoxicilline 500mg",
    change: "+500",
    changeTone: "emerald",
    user: "Sarah Admin",
  },
  {
    id: "#LOG-3321",
    date: "23 Oct 2023",
    time: "14:30",
    action: "Changement de prix",
    actionTone: "violet",
    product: "Vitamine C Complexe",
    change: "--",
    changeTone: "slate",
    user: "Michel Ross",
  },
  {
    id: "#TRX-8899",
    date: "23 Oct 2023",
    time: "11:20",
    action: "Vente",
    actionTone: "emerald",
    product: "Ibuprofene 200mg",
    change: "-1",
    changeTone: "rose",
    user: "Jean Dupont",
  },
  {
    id: "#EXP-0012",
    date: "22 Oct 2023",
    time: "09:00",
    action: "Alerte expiration",
    actionTone: "amber",
    product: "Sirop Toux Enfant",
    change: "--",
    changeTone: "slate",
    user: "Systeme",
  },
  {
    id: "#TRX-8850",
    date: "21 Oct 2023",
    time: "18:45",
    action: "Vente",
    actionTone: "emerald",
    product: "Comprimes Allergie",
    change: "-1",
    changeTone: "rose",
    user: "Lisa W.",
  },
];

const actionStyles: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-600",
  sky: "bg-sky-100 text-sky-600",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-700",
};

const changeStyles: Record<string, string> = {
  emerald: "text-emerald-600",
  rose: "text-rose-600",
  slate: "text-slate-400",
};

export default function PharmacyHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">
          Historique d&apos;Activite de la Pharmacie
        </h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              aria-hidden="true"
            >
              <path
                d="M4 7h16M7 12h10M10 17h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              placeholder="Filtrer par produit ou utilisateur..."
              className="w-64 rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-xs"
            />
          </div>
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              aria-hidden="true"
            >
              <path
                d="M7 4v3M17 4v3M4 9h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <rect
                x="4"
                y="6"
                width="16"
                height="14"
                rx="2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
            <select className="rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-8 text-xs font-semibold text-[#1F1D1B]">
              <option>30 derniers jours</option>
              <option>7 derniers jours</option>
              <option>3 derniers mois</option>
            </select>
          </div>
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              aria-hidden="true"
            >
              <path
                d="M4 6h16M8 12h8M10 18h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <select className="rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-8 text-xs font-semibold text-[#1F1D1B]">
              <option>Toutes les actions</option>
              <option>Ventes</option>
              <option>Reapprovisionnement</option>
            </select>
          </div>
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
            Exporter en CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M7 8V4h10v4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <rect
                x="5"
                y="9"
                width="14"
                height="8"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M7.5 14h9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Imprimer le rapport
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <table className="w-full text-xs">
            <thead className="bg-[#F8FAFC] text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 text-left">ID TRANSACTION</th>
                <th className="px-4 py-3 text-left">DATE ET HEURE</th>
                <th className="px-4 py-3 text-left">ACTION</th>
                <th className="px-4 py-3 text-left">NOM DU PRODUIT</th>
                <th className="px-4 py-3 text-left">CHANGEMENT</th>
                <th className="px-4 py-3 text-left">UTILISATEUR</th>
                <th className="px-4 py-3 text-left">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {activityRows.map((row) => (
                <tr key={row.id} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3 text-[#6B7280]">{row.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{row.date}</div>
                    <div className="text-[10px] text-[#6B7280]">{row.time}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        actionStyles[row.actionTone]
                      }`}
                    >
                      {row.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F4F6] text-[#6B7280]">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          aria-hidden="true"
                        >
                          <rect
                            x="6"
                            y="4"
                            width="12"
                            height="16"
                            rx="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M9 12h6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <span className="font-semibold">{row.product}</span>
                    </div>
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      changeStyles[row.changeTone]
                    }`}
                  >
                    {row.change}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF2FF] text-[10px] font-semibold text-[#0B63D1]">
                        {row.user[0]}
                      </span>
                      <span className="text-[11px] font-semibold">
                        {row.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#0B63D1]">Voir</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#6B7280]">
          <span>Affichage de 1 a 6 sur 128 resultats</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
              Precedent
            </button>
            <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
              Suivant
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-[#9CA3AF]">
        (c) 2023 PharmaFinder Inc. Panneau de Controle Super Admin v2.4.0
      </p>
    </div>
  );
}
