"use client";

import { TopNav } from "@/components/TopNav";
import { useUser } from "@/lib/useUser";

export default function HistoryPage() {
  const { user } = useUser();

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";
  const email = user?.email ?? "utilisateur@example.com";

  const historyItems = [
    {
      title: "Amoxicilline 500mg",
      subtitle: "Recherché à Paris, 75008 • 12 résultats trouvés",
      time: "Il y a 2 heures",
      category: "Médicaments",
      action: "Relancer",
      icon: "Rx",
      tone: "bg-[#EAF2FF] text-[#0B63D1]",
    },
    {
      title: "Pharmacie du Louvre",
      subtitle: "Profil consulté et horaires d'ouverture",
      time: "Hier",
      category: "Pharmacies",
      action: "Voir détails",
      icon: "PH",
      tone: "bg-[#E8FFF1] text-[#0F9D58]",
    },
    {
      title: "Doliprane 1000mg",
      subtitle: "Disponibilité en stock vérifiée",
      time: "24 oct. 2023",
      category: "Médicaments",
      action: "Relancer",
      icon: "Rx",
      tone: "bg-[#F4EFFF] text-[#6B46C1]",
    },
    {
      title: "Demande de vaccin grippe",
      subtitle: "Question générale pour la vaccination saisonnière",
      time: "15 oct. 2023",
      category: "Consultation",
      action: "Voir détails",
      icon: "QS",
      tone: "bg-[#FFF4E6] text-[#D97706]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto max-w-5xl space-y-6">
        <TopNav />

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#E5E7EB]" />
              <div>
                <h1 className="text-lg font-semibold">{displayName}</h1>
                <p className="text-sm text-[#6B7280]">{email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-[#E8FFF1] px-3 py-1 text-[#0F9D58]">
                    Patient Verifie
                  </span>
                  <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[#0B63D1]">
                    Membre depuis 2021
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
            >
              Modifier le profil
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white">
          <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] px-6 py-4 text-xs font-semibold text-[#6B7280]">
            <button className="rounded-full border border-transparent px-4 py-2">
              Infos personnelles
            </button>
            <button className="rounded-full border border-transparent px-4 py-2">
              Favoris
            </button>
            <button className="rounded-full border border-[#0B63D1] bg-[#EAF2FF] px-4 py-2 text-[#0B63D1]">
              Historique
            </button>
            <button className="rounded-full border border-transparent px-4 py-2">
              Préférences
            </button>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-sm font-semibold">Historique de recherche</h2>
              <div className="flex flex-wrap gap-3">
                <input
                  placeholder="Rechercher dans l'historique..."
                  className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs text-[#6B7280]"
                />
                <select className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs text-[#6B7280]">
                  <option>Derniers 30 jours</option>
                  <option>7 derniers jours</option>
                  <option>Cette annee</option>
                </select>
                <select className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs text-[#6B7280]">
                  <option>Toutes les categories</option>
                  <option>Medicaments</option>
                  <option>Pharmacies</option>
                  <option>Consultation</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {historyItems.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold ${item.tone}`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="text-xs text-[#6B7280]">{item.subtitle}</p>
                      <span className="mt-2 inline-block rounded-full bg-[#F3F6F9] px-3 py-1 text-[11px] font-semibold text-[#6B7280]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-[#6B7280]">
                    <div>{item.time}</div>
                    <button className="mt-2 text-xs font-semibold text-[#0B63D1]">
                      {item.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#6B7280]">
              <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                {"<"}
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
              <span className="px-2">...</span>
              <button className="rounded-full border border-[#E5E7EB] px-3 py-1">
                {">"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
