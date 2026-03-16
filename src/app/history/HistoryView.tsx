"use client";

import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { useUser } from "@/lib/useUser";

export default function HistoryView() {
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF2FF] text-lg font-semibold text-[#0B63D1]">
                {displayName.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-semibold">{displayName}</p>
                <p className="text-sm text-[#6B7280]">{email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-[#0B63D1]">
                Patient
              </span>
              <span className="rounded-full bg-[#E8FFF1] px-3 py-1 text-[#0F9D58]">
                Actif
              </span>
              <span className="rounded-full bg-[#F4F4F5] px-3 py-1 text-[#6B7280]">
                ID #GP-0324
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[#E5E7EB] pt-4 text-sm font-medium">
            {[
              { label: "Profil", href: "/profile" },
              { label: "Favoris", href: "/favorites" },
              { label: "Historique", href: "/history" },
              { label: "Préférences", href: "/preferences" },
            ].map((tab) => {
              const isActive = tab.href === "/history";
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive
                      ? "bg-[#0B63D1] text-white"
                      : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Historique des activites</h2>
              <p className="text-sm text-[#6B7280]">
                Suivez les recherches, pharmacies consultees et demandes
                recentes.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button className="rounded-full border border-[#E5E7EB] px-4 py-2 font-semibold text-[#1F2937]">
                Filtrer
              </button>
              <button className="rounded-full bg-[#0B63D1] px-4 py-2 font-semibold text-white">
                Exporter
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {historyItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E5E7EB] p-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold ${item.tone}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-[#6B7280]">{item.subtitle}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{item.time}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                  <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[#6B7280]">
                    {item.category}
                  </span>
                  <button className="rounded-full border border-[#0B63D1] px-4 py-1 text-[#0B63D1]">
                    {item.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
