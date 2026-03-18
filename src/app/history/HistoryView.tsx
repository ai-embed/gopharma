"use client";

import { useEffect, useState } from "react";
import ProfileShell from "@/components/ProfileShell";
import { apiJsonAuth } from "@/lib/api";

export default function HistoryView() {
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

  const [activityItems, setActivityItems] = useState(historyItems);

  useEffect(() => {
    let active = true;
    apiJsonAuth<
      {
        _id: string;
        query: string;
        searchType: "PRODUIT" | "PHARMACIE";
        resultCount: number;
        createdAt: string;
      }[]
    >("/api/history").then((res) => {
      if (!active) return;
      if (!res.ok || !res.data || res.data.length === 0) return;

      const formatter = new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const mapped = res.data.map((entry) => {
        const isProduct = entry.searchType === "PRODUIT";
        return {
          title: entry.query,
          subtitle: isProduct
            ? `Recherche de médicament • ${entry.resultCount} résultats`
            : `Recherche de pharmacie • ${entry.resultCount} résultats`,
          time: formatter.format(new Date(entry.createdAt)),
          category: isProduct ? "Médicaments" : "Pharmacies",
          action: isProduct ? "Relancer" : "Voir détails",
          icon: isProduct ? "Rx" : "PH",
          tone: isProduct
            ? "bg-[#EAF2FF] text-[#0B63D1]"
            : "bg-[#E8FFF1] text-[#0F9D58]",
        };
      });

      setActivityItems(mapped);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ProfileShell activeTab="history">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Historique des activités</h2>
          <p className="text-sm text-[#6B7280]">
            Suivez les recherches, pharmacies consultées et demandes récentes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <button className="rounded-full border border-[#E5E7EB] px-4 py-2 font-semibold text-[#1F2937]">
            Filtrer
          </button>
          <button className="rounded-full bg-[#0B63D1] px-4 py-2 font-semibold text-white">
            Exporter
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {activityItems.map((item) => (
          <div
            key={`${item.title}-${item.time}`}
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
    </ProfileShell>
  );
}
