const weekSchedule = [
  { day: "Lundi", open: true, garde: false, start: "08:00 AM", end: "07:00 PM" },
  { day: "Mardi", open: true, garde: false, start: "08:00 AM", end: "07:00 PM" },
  { day: "Mercredi", open: true, garde: false, start: "08:00 AM", end: "07:00 PM" },
  { day: "Jeudi", open: true, garde: true, start: "08:00 AM", end: "08:00 PM" },
  { day: "Vendredi", open: true, garde: false, start: "08:00 AM", end: "07:00 PM" },
  { day: "Samedi", open: true, garde: false, start: "09:00 AM", end: "01:00 PM" },
  { day: "Dimanche", open: false, garde: true, start: "", end: "" },
];

const specialHours = [
  {
    title: "Jour de Noël",
    date: "25 Dec, 2023",
    status: "Fermé toute la journée",
  },
  {
    title: "Réveillon du Nouvel An",
    date: "31 Dec, 2023",
    status: "08:00 - 14:00",
  },
];

export default function PharmacyPlanningsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Configuration des Horaires</h1>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
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
                d="M12 7.5v5l3 2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h2 className="text-sm font-semibold">
            Heures d&apos;ouverture standard
          </h2>
        </div>
        <p className="mt-3 text-xs text-[#6B7280]">
          Définissez les heures d&apos;ouverture et de fermeture régulières de
          votre pharmacie. Activez &quot;Fermé&quot; pour les jours où la
          pharmacie n&apos;est pas ouverte.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full text-xs">
              <thead className="bg-[#F8FAFC] text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 text-left">JOUR DE LA SEMAINE</th>
                <th className="px-4 py-3 text-left">STATUT</th>
                <th className="px-4 py-3 text-left">GARDE</th>
                <th className="px-4 py-3 text-left">HEURE D&apos;OUVERTURE</th>
                <th className="px-4 py-3 text-left">HEURE DE FERMETURE</th>
              </tr>
            </thead>
            <tbody>
              {weekSchedule.map((row) => (
                <tr
                  key={row.day}
                  className={`border-t border-[#E5E7EB] ${
                    row.day === "Dimanche" ? "bg-[#FEF3F2]" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-semibold">{row.day}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-pressed={row.open}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full px-0.5 transition ${
                        row.open ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow transition ${
                          row.open ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-pressed={row.garde}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full px-0.5 transition ${
                        row.garde ? "bg-[#7C3AED]" : "bg-[#D1D5DB]"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-white shadow transition ${
                          row.garde ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  {row.open ? (
                    <>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[11px] text-[#1F1D1B]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 text-[#9CA3AF]"
                            aria-hidden="true"
                          >
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
                          {row.start}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[11px] text-[#1F1D1B]">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 text-[#9CA3AF]"
                            aria-hidden="true"
                          >
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
                          {row.end}
                        </span>
                      </td>
                    </>
                  ) : (
                    <td className="px-4 py-3" colSpan={2}>
                      <span className="text-[11px] text-[#B91C1C]">
                        Fermé (Ouverture sur garde)
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="15"
                  rx="2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8 3.5v3M16 3.5v3M4 9h16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <h2 className="text-sm font-semibold">
                Heures Speciales &amp; Jours Feries
              </h2>
              <p className="text-xs text-[#6B7280]">
                Ajustez les horaires pour les jours speciaux.
              </p>
            </div>
          </div>
          <button className="text-xs font-semibold text-[#0B63D1]">
            + Ajouter une date speciale
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {specialHours.map((item) => {
            const isClosed = item.status.toLowerCase().includes("ferme");
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0B63D1]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M12 4l2.2 4.4L19 9l-3.5 3.4L16 17l-4-2.1L8 17l.5-4.6L5 9l4.8-.6L12 4z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-[#6B7280]">{item.date}</p>
                  </div>
                </div>
                <p
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${
                    isClosed
                      ? "bg-rose-100 text-rose-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {item.status}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
          Annuler
        </button>
        <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
