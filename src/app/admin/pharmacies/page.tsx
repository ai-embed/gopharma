import Link from "next/link";

const stats = [
  {
    label: "Total Pharmacies",
    value: "156",
    note: "+12% ce mois",
    noteTone: "emerald",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <rect
          x="5"
          y="4"
          width="14"
          height="16"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 8h8M8 12h8M8 16h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Ouvertes Actuellement",
    value: "84",
    note: "Heures d'ouverture actives",
    noteTone: "slate",
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
  {
    label: "Renouvellements en Attente",
    value: "5",
    note: "Action Requise",
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
    label: "Signalees",
    value: "2",
    note: "Examen necessaire",
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
          d="M9 13h6M9 17h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const pharmacies = [
  {
    name: "City Pharmacy",
    email: "contact@citypharmacy.com",
    location: "New York, NY",
    status: "Actif",
    date: "24 Oct 2023",
    action: "Modifier",
  },
  {
    name: "HealthPlus Meds",
    email: "admin@healthplus.org",
    location: "San Francisco, CA",
    status: "En attente",
    date: "01 Nov 2023",
    action: "Reviser",
  },
  {
    name: "Galaxy Pharma",
    email: "info@galaxypharma.net",
    location: "Austin, TX",
    status: "Actif",
    date: "15 Oct 2023",
    action: "Modifier",
  },
  {
    name: "MediCare Center",
    email: "support@medicare.io",
    location: "Chicago, IL",
    status: "Signalee",
    date: "Hier",
    action: "Enqueter",
  },
  {
    name: "Nature Health",
    email: "hello@naturehealth.co",
    location: "Seattle, WA",
    status: "Actif",
    date: "12 Sep 2023",
    action: "Modifier",
  },
];

const statusStyles: Record<string, string> = {
  Actif: "bg-emerald-100 text-emerald-600",
  "En attente": "bg-amber-100 text-amber-700",
  Signalee: "bg-rose-100 text-rose-600",
};

const toneStyles: Record<
  string,
  { icon: string }
> = {
  blue: { icon: "bg-[#EAF2FF] text-[#0B63D1]" },
  emerald: { icon: "bg-emerald-100 text-emerald-600" },
  amber: { icon: "bg-amber-100 text-amber-700" },
  rose: { icon: "bg-rose-100 text-rose-600" },
};

const noteStyles: Record<string, string> = {
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  rose: "text-rose-600",
  slate: "text-[#9CA3AF]",
};

export default function AdminPharmaciesPage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Gestion des Pharmacies</h1>
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
            <div className="flex items-center justify-between">
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
              <h2 className="text-sm font-semibold">
                Toutes les Pharmacies Enregistrées
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <select className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                  <option>Tous les Statuts</option>
                  <option>Actif</option>
                  <option>En attente</option>
                </select>
                <Link
                  href="/admin/pharmacies/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
                    +
                  </span>
                  Ajouter une pharmacie
                </Link>
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-[720px] w-full text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280]">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <span className="inline-flex h-4 w-4 rounded-full border border-[#D1D5DB]" />
                    </th>
                    <th className="px-4 py-3 text-left">DÉTAILS PHARMACIE</th>
                    <th className="px-4 py-3 text-left">LOCALISATION</th>
                    <th className="px-4 py-3 text-left">STATUT</th>
                    <th className="px-4 py-3 text-left">DATE DE VÉRIFICATION</th>
                    <th className="px-4 py-3 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacies.map((pharmacy, index) => (
                    <tr
                      key={pharmacy.email}
                      className="border-t border-[#E5E7EB]"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex h-4 w-4 rounded-full border border-[#D1D5DB]" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF2FF] text-xs font-semibold text-[#0B63D1]">
                            {pharmacy.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div>
                            <p className="font-semibold">{pharmacy.name}</p>
                            <p className="text-[10px] text-[#6B7280]">
                              {pharmacy.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {pharmacy.location}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                            statusStyles[pharmacy.status]
                          }`}
                        >
                          {pharmacy.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {pharmacy.date}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 text-[11px] font-semibold">
                          <button
                            className={`${
                              pharmacy.status === "Signalee"
                                ? "text-rose-600"
                                : "text-[#0B63D1]"
                            }`}
                          >
                            {pharmacy.action}
                          </button>
                          <Link
                            href={`/admin/pharmacies/${index + 1}`}
                            className="text-[#6B7280]"
                          >
                            Profil
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-[#6B7280]">
              <span>Affichage 1-5 sur 156</span>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                  Précédent
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
