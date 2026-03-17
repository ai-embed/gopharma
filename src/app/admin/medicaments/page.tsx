const stats = [
  {
    label: "Total Medicaments",
    value: "12 450",
    note: "+5% ce mois",
    noteTone: "emerald",
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
    label: "Categories",
    value: "64",
    note: "Catalogues actifs",
    noteTone: "slate",
    tone: "emerald",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M5 7h6v6H5zM13 7h6v6h-6zM5 15h6v4H5zM13 15h6v4h-6z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "Mises a Jour",
    value: "128",
    note: "Derniers 30 jours",
    noteTone: "slate",
    tone: "amber",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M4 12a8 8 0 0 1 13.6-5.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M20 4v5h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 12a8 8 0 0 1-13.6 5.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4 20v-5h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Signales",
    value: "9",
    note: "A verifier",
    noteTone: "rose",
    tone: "rose",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M6 4h8l4 4v12H6z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M14 4v4h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 14h6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const toneStyles: Record<string, { icon: string }> = {
  blue: { icon: "bg-[#EAF2FF] text-[#0B63D1]" },
  emerald: { icon: "bg-emerald-100 text-emerald-600" },
  amber: { icon: "bg-amber-100 text-amber-700" },
  rose: { icon: "bg-rose-100 text-rose-600" },
};

const noteStyles: Record<string, string> = {
  emerald: "text-emerald-600",
  slate: "text-[#9CA3AF]",
  rose: "text-rose-600",
  amber: "text-amber-600",
};

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
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">Base Medicaments</h1>
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-[#6B7280]">{stat.label}</p>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      toneStyles[stat.tone].icon
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

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-sm font-semibold">Tous les Medicaments</h2>
              <div className="flex flex-wrap items-center gap-3">
                <select className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                  <option>Toutes les Categories</option>
                  <option>Analgesiques</option>
                  <option>Antibiotiques</option>
                </select>
                <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
                    +
                  </span>
                  Ajouter un medicament
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#F8FAFC] text-[#6B7280]">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <span className="inline-flex h-4 w-4 rounded-full border border-[#D1D5DB]" />
                    </th>
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
                      <td className="px-4 py-3">
                        <span className="inline-flex h-4 w-4 rounded-full border border-[#D1D5DB]" />
                      </td>
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
            </div>
  );
}
