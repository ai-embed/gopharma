"use client";

import { PatientShell } from "@/components/PatientShell";

const days = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
];

export default function NewReminderPage() {
  return (
    <PatientShell>
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold">Nouveau rappel d&apos;ordonnance</h1>
            <p className="text-sm text-[#6B7280]">
              Configurez votre calendrier de medication pour ne jamais oublier une prise.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Informations médicament</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Nom du médicament</label>
                  <input
                    placeholder="Doliprane"
                    className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
                  />
                </div>
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Dosage</label>
                  <input
                    placeholder="1000mg"
                    className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
                  />
                </div>
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Forme</label>
                  <select className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2">
                    <option>Comprime</option>
                    <option>Gelule</option>
                    <option>Sirop</option>
                  </select>
                </div>
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Posologie</label>
                  <input
                    placeholder="2 prises"
                    className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
                  />
                </div>
              </div>
              <button className="text-xs font-semibold text-[#0B63D1]">
                + Ajouter un autre médicament
              </button>
            </section>

            <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Photo d&apos;ordonnance</h2>
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-8 text-center text-xs text-[#6B7280]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                  +
                </div>
                <p>Parcourir les fichiers ou glisser deposer</p>
                <p className="text-[11px]">PNG, JPG, PDF (max 5 Mo)</p>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Etat d&apos;achat des produits</h2>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <label className="flex items-start gap-3 rounded-2xl border border-[#E5E7EB] px-4 py-3">
                  <input type="radio" name="purchase" defaultChecked />
                  <div>
                    <p className="text-sm font-semibold">Oui, deja achetes</p>
                    <p className="text-xs text-[#6B7280]">
                      Disponibles dans votre pharmacie
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-[#E5E7EB] px-4 py-3">
                  <input type="radio" name="purchase" />
                  <div>
                    <p className="text-sm font-semibold">Non, a acheter</p>
                    <p className="text-xs text-[#6B7280]">
                      Lancer une recherche
                    </p>
                  </div>
                </label>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Calendrier et frequence</h2>
              <p className="text-xs text-[#6B7280]">
                Jours de prise du médicament
              </p>
              <div className="flex flex-wrap gap-2">
                {days.map((day, index) => (
                  <button
                    key={day}
                    className={`h-9 w-9 rounded-full text-xs font-semibold ${
                      index < 5
                        ? "bg-[#0B63D1] text-white"
                        : "border border-[#E5E7EB] text-[#6B7280]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Nombre de prises par jour</label>
                  <select className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2">
                    <option>2 prises</option>
                    <option>3 prises</option>
                    <option>4 prises</option>
                  </select>
                </div>
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Rappel avance</label>
                  <select className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2">
                    <option>10 minutes</option>
                    <option>30 minutes</option>
                    <option>1 heure</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Horaires des prises</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {["08:00", "20:00"].map((time, index) => (
                  <div key={time} className="flex items-center gap-3">
                    <span className="w-12 text-xs text-[#6B7280]">
                      Prise {index + 1}
                    </span>
                    <input
                      defaultValue={time}
                      className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2 text-xs"
                    />
                  </div>
                ))}
              </div>
              <button className="text-xs font-semibold text-[#0B63D1]">
                + Ajouter une prise
              </button>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Duree du traitement</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Date de debut</label>
                  <input className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2" />
                </div>
                <div className="space-y-2 text-xs text-[#6B7280]">
                  <label className="text-[11px] font-semibold">Date de fin</label>
                  <input className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-[#6B7280]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#CBD5E1]" />
                Traitement continu / maladie chronique
              </label>
            </section>

            <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
              <h2 className="text-sm font-semibold">Instructions</h2>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                {["Avant le repas", "Pendant le repas", "Apres le repas"].map((label) => (
                  <button
                    key={label}
                    className={`rounded-2xl border px-4 py-3 ${
                      label === "Pendant le repas"
                        ? "border-[#0B63D1] bg-[#EAF2FF] text-[#0B63D1]"
                        : "border-[#E5E7EB] text-[#6B7280]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#6B7280]">
                Annuler
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white">
                Creer le calendrier
              </button>
            </div>
          </div>
      </div>
    </PatientShell>
  );
}
