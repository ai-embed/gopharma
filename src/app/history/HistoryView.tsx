"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Notice } from "@/components/Notice";
import ProfileShell from "@/components/ProfileShell";
import { apiJsonAuth } from "@/lib/api";

type SearchHistoryItem = {
  _id: string;
  query: string;
  searchType: "PRODUIT" | "PHARMACIE";
  resultCount: number;
  createdAt: string;
};

type UserActivityItem = {
  _id: string;
  method: string;
  path: string;
  outcome: "SUCCESS" | "ERROR";
  statusCode: number;
  createdAt: string;
};

type HistoryCard = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  category: string;
  action: string;
  href?: string;
  icon: string;
  tone: string;
  sortAt: number;
};

export default function HistoryView() {
  const [activityItems, setActivityItems] = useState<HistoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiJsonAuth<SearchHistoryItem[]>("/api/history"),
      apiJsonAuth<{ items: UserActivityItem[] }>("/api/history/activity?limit=20&page=1"),
    ]).then(([historyRes, auditRes]) => {
      if (!active) return;

      const hasHistory = historyRes.ok && Array.isArray(historyRes.data);
      const hasAudit = auditRes.ok && Array.isArray(auditRes.data?.items);

      if (!hasHistory && !hasAudit) {
        setError(
          historyRes.error ?? auditRes.error ?? "Impossible de charger l’historique."
        );
        setLoading(false);
        return;
      }

      const mappedSearchHistory = (historyRes.data ?? []).map((entry): HistoryCard => {
        const isProduct = entry.searchType === "PRODUIT";
        return {
          id: `search-${entry._id}`,
          title: entry.query,
          subtitle: isProduct
            ? `${entry.resultCount} résultats médicaments`
            : `${entry.resultCount} résultats pharmacies`,
          time: formatRelativeDate(entry.createdAt),
          category: isProduct ? "Médicaments" : "Pharmacies",
          action: "Relancer",
          href: `/search?q=${encodeURIComponent(entry.query)}`,
          icon: isProduct ? "Rx" : "PH",
          tone: isProduct ? "bg-[#EAF2FF] text-[#0B63D1]" : "bg-[#E8FFF1] text-[#0F9D58]",
          sortAt: new Date(entry.createdAt).getTime(),
        };
      });

      const mappedAudit = (auditRes.data?.items ?? []).map((entry): HistoryCard => ({
        id: `audit-${entry._id}`,
        title: mapAuditTitle(entry),
        subtitle: `${entry.method} ${entry.path}`,
        time: formatRelativeDate(entry.createdAt),
        category: "Activité",
        action: "Voir",
        icon: "ACT",
        tone:
          entry.outcome === "SUCCESS"
            ? "bg-[#EEF2FF] text-[#4F46E5]"
            : "bg-[#FEF2F2] text-[#B91C1C]",
        sortAt: new Date(entry.createdAt).getTime(),
      }));

      const merged = [...mappedSearchHistory, ...mappedAudit].sort(
        (a, b) => b.sortAt - a.sortAt
      );

      setActivityItems(merged);
      setError(null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ProfileShell activeTab="history">
      {error ? <Notice tone="error" message={error} /> : null}

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
        {loading ? (
          <p className="text-sm text-[#6B7280]">Chargement de l&apos;historique...</p>
        ) : activityItems.length === 0 ? (
          <div className="rounded-2xl border border-[#E5E7EB] p-4 text-center">
            <p className="text-sm font-semibold">Aucune activité récente</p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Vos recherches et actions apparaîtront ici.
            </p>
          </div>
        ) : (
          activityItems.map((item) => (
            <div
              key={item.id}
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
                {item.href ? (
                  <Link
                    href={item.href}
                    className="rounded-full border border-[#0B63D1] px-4 py-1 text-[#0B63D1]"
                  >
                    {item.action}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="rounded-full border border-[#0B63D1] px-4 py-1 text-[#0B63D1]"
                  >
                    {item.action}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </ProfileShell>
  );
}

function mapAuditTitle(item: UserActivityItem) {
  if (item.path.includes("/favorites")) {
    return "Gestion des favoris";
  }
  if (item.path.includes("/history")) {
    return "Historique utilisateur";
  }
  if (item.path.includes("/users/me/preferences")) {
    return "Préférences mises à jour";
  }
  if (item.path.includes("/users/me")) {
    return "Profil mis à jour";
  }
  return "Action du compte";
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "À l'instant";
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
