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
    accent: "sky",
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
    accent: "emerald",
  },
  {
    name: "SantéPlus Rx",
    location: "Rive Gauche, Bordeaux",
    owner: "Maria Rodriguez",
    date: "20 Oct. 2023",
    email: "m.rodr@santeplus.fr",
    phone: "+33 5 56 09 87 65",
    docs: [
      { name: "Licence_Bordeaux_2023.pdf", size: "1.8 Mo" },
      { name: "CNI_Verso_Rodriguez.jpg", size: "2.2 Mo" },
    ],
    accent: "violet",
  },
];

const accentStyles: Record<string, string> = {
  sky: "bg-sky-100 text-sky-600",
  emerald: "bg-emerald-100 text-emerald-600",
  violet: "bg-violet-100 text-violet-600",
};

export default function ValidationQueuePage() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Validation des Pharmacies</h1>
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

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-white p-1 text-xs font-semibold text-[#6B7280]">
          <button className="rounded-xl bg-[#0B63D1] px-4 py-2 text-white">
            En Attente
          </button>
          <button className="rounded-xl px-4 py-2">Approuvées</button>
          <button className="rounded-xl px-4 py-2">Rejetées</button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <span>Trier par:</span>
          <select className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]">
            <option>Plus récentes</option>
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
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${
                        accentStyles[request.accent]
                      }`}
                    >
                      {request.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
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
                      <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF2FF] text-[10px] text-[#0B63D1]">
                        @
                      </span>
                      {request.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#9CA3AF]">
                      Telephone
                    </p>
                    <p className="font-semibold text-[#1F1D1B]">
                      <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF2FF] text-[10px] text-[#0B63D1]">
                        +
                      </span>
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
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#0B63D1]">
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path
                                d="M7 4h7l3 3V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 4z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14 4v3h3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
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
                        <button className="text-[#0B63D1]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
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
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button className="flex-1 rounded-xl border border-[#FCA5A5] bg-white px-4 py-2 text-xs font-semibold text-[#DC2626]">
                    × Rejeter
                  </button>
                  <button className="flex-1 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                    ✓ Approuver
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center text-xs text-[#6B7280]">
            Affichage de 3 sur 12 demandes en attente
          </div>

      <div className="mt-4 flex justify-center">
        <button className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
          Charger Plus
        </button>
      </div>
            </div>
  );
}
