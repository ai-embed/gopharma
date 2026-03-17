import Link from "next/link";

const stats = [
  {
    label: "Total Pharmacies",
    value: "156",
    note: "+12% ce mois",
    tone: "blue",
  },
  {
    label: "Ouvertes Actuellement",
    value: "84",
    note: "Heures d'ouverture actives",
    tone: "emerald",
  },
  {
    label: "Renouvellements en Attente",
    value: "5",
    note: "Action Requise",
    tone: "amber",
  },
  {
    label: "Signalees",
    value: "2",
    note: "Examen necessaire",
    tone: "rose",
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

export default function AdminPharmaciesPage() {
  return (
    <div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">Gestion des Pharmacies</h1>
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

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#6B7280]">{stat.label}</p>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-semibold ${
                      stat.tone === "blue"
                        ? "bg-[#EAF2FF] text-[#0B63D1]"
                        : stat.tone === "emerald"
                        ? "bg-emerald-100 text-emerald-600"
                        : stat.tone === "amber"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    o
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                <p className="mt-2 text-[11px] text-[#9CA3AF]">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="text-sm font-semibold">
                Toutes les Pharmacies Enregistrees
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <select className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                  <option>Tous les Statuts</option>
                  <option>Actif</option>
                  <option>En attente</option>
                </select>
                <Link
                  href="/admin/pharmacies/new"
                  className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
                >
                  + Ajouter une pharmacie
                </Link>
              </div>
            </div>

            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#F8FAFC] text-[#6B7280]">
                  <tr>
                    <th className="px-4 py-3 text-left">DETAILS PHARMACIE</th>
                    <th className="px-4 py-3 text-left">LOCALISATION</th>
                    <th className="px-4 py-3 text-left">STATUT</th>
                    <th className="px-4 py-3 text-left">DATE DE VERIFICATION</th>
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
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF2FF] text-xs font-semibold text-[#0B63D1]">
                            {pharmacy.name[0]}
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
                          <button className="text-[#0B63D1]">
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

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-[#6B7280]">
              <span>Affichage 1-5 sur 156</span>
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
