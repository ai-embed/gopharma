const requests = [
  {
    name: "MediLife Centrale",
    location: "Quartier des Affaires, Lyon",
    owner: "Sarah Jenkins",
    date: "24 Oct. 2023",
    email: "sarah.j@medlife.fr",
    phone: "+33 4 78 12 34 56",
    docs: [
      { name: "Licence_Commerciale_2023.pdf", size: "2.4 Mo" },
      { name: "ID_Pharmacien_Recto.jpg", size: "1.3 Mo" },
    ],
  },
  {
    name: "Pharmacie de l'Etoile",
    location: "Avenue des Champs, Paris",
    owner: "Dr. James Wilson",
    date: "23 Oct. 2023",
    email: "contact@etoile-pharma.fr",
    phone: "+33 1 45 67 89 01",
    docs: [
      { name: "Enregistrement_Ordre.pdf", size: "4.1 Mo" },
      { name: "Passeport_Scan.png", size: "3.2 Mo" },
    ],
  },
  {
    name: "SantePlus Rx",
    location: "Rive Gauche, Bordeaux",
    owner: "Maria Rodriguez",
    date: "20 Oct. 2023",
    email: "m.rodr@santeplus.fr",
    phone: "+33 5 56 09 87 65",
    docs: [
      { name: "Licence_Bordeaux_2023.pdf", size: "1.8 Mo" },
      { name: "CNI_Verso_Rodriguez.jpg", size: "2.2 Mo" },
    ],
  },
];

export default function ValidationQueuePage() {
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
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  item === "File de validation"
                    ? "bg-[#EAF2FF] text-[#0B63D1]"
                    : "hover:bg-[#F3F6F9]"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {item}
                {item === "File de validation" ? (
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
            <h1 className="text-lg font-semibold">Validation des Pharmacies</h1>
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

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white p-1 text-xs font-semibold text-[#6B7280]">
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-white">
                En Attente
              </button>
              <button className="rounded-full px-4 py-2">Approuvees</button>
              <button className="rounded-full px-4 py-2">Rejetees</button>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <span>Trier par:</span>
              <select className="rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
                <option>Plus Recentes</option>
                <option>Plus anciennes</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {requests.map((request) => (
              <div
                key={request.name}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF2FF] text-sm font-semibold text-[#0B63D1]">
                      {request.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{request.name}</p>
                      <p className="text-xs text-[#6B7280]">
                        {request.location}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                    EN ATTENTE
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-xs text-[#6B7280] sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] uppercase text-[#9CA3AF]">
                      Proprietaire
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      {request.owner}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#9CA3AF]">
                      Date de demande
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      {request.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#9CA3AF]">
                      Contact
                    </p>
                    <p className="font-semibold text-[#0B63D1]">
                      {request.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#9CA3AF]">
                      Telephone
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      {request.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase text-[#9CA3AF]">
                    Documents soumis
                  </p>
                  <div className="mt-2 space-y-2">
                    {request.docs.map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8FAFC] text-[11px] text-[#6B7280]">
                            PDF
                          </span>
                          <div>
                            <p className="font-semibold text-[#1F1D1B]">
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-[#9CA3AF]">
                              {doc.size}
                            </p>
                          </div>
                        </div>
                        <button className="text-[#0B63D1]">o</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button className="flex-1 rounded-full border border-[#FCA5A5] bg-white px-4 py-2 text-xs font-semibold text-[#DC2626]">
                    Rejeter
                  </button>
                  <button className="flex-1 rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                    Approuver
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center text-xs text-[#6B7280]">
            Affichage de 3 sur 12 demandes en attente
          </div>

          <div className="mt-4 flex justify-center">
            <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
              Charger Plus
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
