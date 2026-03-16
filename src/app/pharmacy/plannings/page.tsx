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
    title: "Jour de Noel",
    date: "25 Dec, 2023",
    status: "Ferme toute la journee",
  },
  {
    title: "Reveillon du Nouvel An",
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
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
            o
          </span>
          <h2 className="text-sm font-semibold">Heures d&apos;Ouverture Standard</h2>
        </div>
        <p className="mt-3 text-xs text-[#6B7280]">
          Definissez les heures d&apos;ouverture et de fermeture regulieres de
          votre pharmacie. Activez &quot;Ferme&quot; pour les jours ou la
          pharmacie n&apos;est pas ouverte.
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <table className="w-full text-xs">
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
                    <div
                      className={`flex h-5 w-10 items-center rounded-full px-0.5 ${
                        row.open ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white shadow ${
                          row.open ? "translate-x-5" : ""
                        } transition`}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={`flex h-5 w-10 items-center rounded-full px-0.5 ${
                        row.garde ? "bg-[#7C3AED]" : "bg-[#D1D5DB]"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white shadow ${
                          row.garde ? "translate-x-5" : ""
                        } transition`}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {row.open ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[11px] text-[#6B7280]">
                        {row.start}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#B91C1C]">
                        Ferme (Ouverture sur Garde)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.open ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-[11px] text-[#6B7280]">
                        {row.end}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#B91C1C]">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Ouvert
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
              Annuler
            </button>
            <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
              o
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
          {specialHours.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0B63D1]">
                  o
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[#6B7280]">{item.date}</p>
                </div>
              </div>
              <p className="mt-3 inline-flex rounded-full bg-rose-100 px-3 py-1 text-[10px] font-semibold text-rose-600">
                {item.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-[#9CA3AF]">
        (c) 2023 PharmaFinder Inc. Panneau de Controle Super Admin v2.4.0
      </p>
    </div>
  );
}
