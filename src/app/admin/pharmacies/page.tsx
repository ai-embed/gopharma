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
    note: "Heures d&apos;ouverture actives",
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
    <div className="min-h-screen bg-[#F6F8FA] text-[#1F1D1B]">
      <div className="flex">
        <aside className="flex w-64 flex-col border-r border-[#E5E7EB] bg-white px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B63D1] text-xs font-semibold text-white">
              +
            </div>
            <div>
              <p className="text-sm font-semibold">GoPharma</p>
              <p className="text-[11px] text-[#6B7280]">Dashboard</p>
            </div>
          </div>

          <p className="mt-8 text-[10px] font-semibold uppercase text-[#9CA3AF]">
            Principal
          </p>
          <nav className="mt-3 space-y-1 text-xs font-semibold text-[#6B7280]">
            {[
              "Dashboard",
              "Utilisateurs",
              "Pharmacies",
              "Base Medicaments",
              "File de Validation",
            ].map((item) => (
              <button
                key={item}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  item === "Pharmacies"
                    ? "bg-[#EAF2FF] text-[#0B63D1]"
                    : "hover:bg-[#F3F6F9]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
                {item === "Pharmacies" ? (
                  <span className="ml-auto rounded-full bg-[#EAF2FF] px-2 py-0.5 text-[10px] font-semibold text-[#0B63D1]">
                    12
                  </span>
                ) : null}
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
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[#F3F6F9]"
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
            {["Parametres", "Journaux d&apos;audit"].map((item) => (
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
                <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                  + Ajouter une pharmacie
                </button>
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
                  {pharmacies.map((pharmacy) => (
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
                          <button className="text-[#6B7280]">Profil</button>
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
        </main>
      </div>
    </div>
  );
}
