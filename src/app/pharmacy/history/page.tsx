"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type ManagerProduct = {
  inventoryId: string;
  product: {
    _id: string;
    name: string;
  };
};

type StockMovementType =
  | "ENTREE"
  | "SORTIE"
  | "AJUSTEMENT"
  | "CREER"
  | "SUPPRIMER"
  | "MODIFIER";

type StockMovement = {
  _id: string;
  productId: string;
  type: StockMovementType;
  quantityDelta: number;
  previousPrice?: number;
  nextPrice?: number;
  description?: string;
  actorUserId?: string;
  date: string;
};

type AuditActivityItem = {
  _id: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  outcome: "SUCCESS" | "ERROR";
  statusCode: number;
  metadata?: {
    params?: Record<string, string | number | boolean>;
    query?: Record<string, string | number | boolean | string[]>;
  };
  createdAt: string;
};

type AuditActivityResponse = {
  items: AuditActivityItem[];
  page: number;
  limit: number;
  total: number;
};

type HistoryEntryKind = "movement" | "schedule";

type HistoryEntry = {
  id: string;
  kind: HistoryEntryKind;
  date: string;
  actionCode: StockMovementType | "SCHEDULE";
  actionLabel: string;
  actionToneClass: string;
  targetLabel: string;
  changeLabel: string;
  description: string;
  searchBlob: string;
};

const typeLabels: Record<StockMovementType, string> = {
  ENTREE: "Entrée",
  SORTIE: "Sortie",
  AJUSTEMENT: "Ajustement",
  CREER: "Création",
  SUPPRIMER: "Suppression",
  MODIFIER: "Modification",
};

const typeTone: Record<StockMovementType, string> = {
  ENTREE: "bg-emerald-100 text-emerald-700",
  SORTIE: "bg-rose-100 text-rose-700",
  AJUSTEMENT: "bg-sky-100 text-sky-700",
  CREER: "bg-violet-100 text-violet-700",
  SUPPRIMER: "bg-slate-200 text-slate-700",
  MODIFIER: "bg-amber-100 text-amber-700",
};

const scheduleTone = {
  success: "bg-indigo-100 text-indigo-700",
  error: "bg-rose-100 text-rose-700",
};

function formatDateTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { date: "-", time: "-" };
  return {
    date: parsed.toLocaleDateString("fr-FR"),
    time: parsed.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function formatCurrency(value?: number) {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function mapScheduleAction(activity: AuditActivityItem): {
  actionLabel: string;
  changeLabel: string;
  description: string;
} {
  const path = activity.path;

  if (activity.method === "PUT" && path.includes("/manager/schedules/weekly")) {
    return {
      actionLabel: "Horaires",
      changeLabel: "Mise à jour hebdomadaire",
      description: "Horaires hebdomadaires mis à jour.",
    };
  }

  if (activity.method === "POST" && path.includes("/manager/schedules/exceptions")) {
    return {
      actionLabel: "Garde",
      changeLabel: "Ajout d'exception",
      description: "Période de garde/exception ajoutée.",
    };
  }

  if (activity.method === "DELETE" && path.includes("/manager/schedules/exceptions")) {
    const index = activity.path.split("/").at(-1);
    return {
      actionLabel: "Garde",
      changeLabel: "Suppression d'exception",
      description: index
        ? `Exception supprimée (index ${index}).`
        : "Exception supprimée.",
    };
  }

  return {
    actionLabel: "Planning",
    changeLabel: `${activity.method} ${activity.statusCode}`,
    description: activity.path,
  };
}

export default function PharmacyHistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("30");
  const [actionFilter, setActionFilter] = useState<
    "ALL" | StockMovementType | "SCHEDULE"
  >("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referenceNow, setReferenceNow] = useState<number>(0);

  const loadData = useCallback(async () => {
    setError(null);
    setLoading(true);

    const [productsResult, movementsResult, activityResult] = await Promise.all([
      apiJsonAuth<ManagerProduct[]>("/api/manager/products"),
      apiJsonAuth<StockMovement[]>("/api/manager/products/movements"),
      apiJsonAuth<AuditActivityResponse>("/api/history/activity?page=1&limit=100"),
    ]);

    if (!movementsResult.ok || !movementsResult.data) {
      setError(movementsResult.error ?? "Impossible de charger l'historique.");
      setEntries([]);
      setLoading(false);
      return;
    }

    const productsMap: Record<string, string> = {};
    if (productsResult.ok && productsResult.data) {
      for (const entry of productsResult.data) {
        if (entry.product?._id) {
          productsMap[entry.product._id] = entry.product.name;
        }
      }
    }

    const movementEntries: HistoryEntry[] = movementsResult.data.map((entry) => {
      const productName =
        productsMap[entry.productId] ?? `Produit ${entry.productId.slice(-6)}`;

      const changeLabel =
        entry.type === "MODIFIER"
          ? `${formatCurrency(entry.previousPrice)} -> ${formatCurrency(entry.nextPrice)}`
          : `${entry.quantityDelta > 0 ? "+" : ""}${entry.quantityDelta}`;

      return {
        id: entry._id,
        kind: "movement",
        date: entry.date,
        actionCode: entry.type,
        actionLabel: typeLabels[entry.type],
        actionToneClass: typeTone[entry.type],
        targetLabel: productName,
        changeLabel,
        description: entry.description ?? "Mouvement de stock.",
        searchBlob: [
          productName,
          typeLabels[entry.type],
          entry.description ?? "",
          entry.actorUserId ?? "",
        ]
          .join(" ")
          .toLowerCase(),
      };
    });

    const scheduleEntries: HistoryEntry[] =
      activityResult.ok && activityResult.data
        ? activityResult.data.items
            .filter((item) => item.path.includes("/manager/schedules"))
            .map((item) => {
              const mapped = mapScheduleAction(item);
              const tone =
                item.outcome === "SUCCESS"
                  ? scheduleTone.success
                  : scheduleTone.error;

              return {
                id: item._id,
                kind: "schedule",
                date: item.createdAt,
                actionCode: "SCHEDULE",
                actionLabel: mapped.actionLabel,
                actionToneClass: tone,
                targetLabel: "Planning pharmacie",
                changeLabel: mapped.changeLabel,
                description: mapped.description,
                searchBlob: [
                  mapped.actionLabel,
                  mapped.changeLabel,
                  mapped.description,
                  item.path,
                ]
                  .join(" ")
                  .toLowerCase(),
              };
            })
        : [];

    const merged = [...movementEntries, ...scheduleEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setEntries(merged);
    setReferenceNow(Date.now());
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const filteredEntries = useMemo(() => {
    const periodDays = Number(period);
    const queryNormalized = query.trim().toLowerCase();

    return entries.filter((entry) => {
      if (actionFilter === "SCHEDULE" && entry.kind !== "schedule") {
        return false;
      }

      if (
        actionFilter !== "ALL" &&
        actionFilter !== "SCHEDULE" &&
        entry.actionCode !== actionFilter
      ) {
        return false;
      }

      if (Number.isFinite(periodDays) && periodDays > 0 && referenceNow > 0) {
        const entryDate = new Date(entry.date).getTime();
        const diffDays = (referenceNow - entryDate) / (1000 * 60 * 60 * 24);
        if (diffDays > periodDays) return false;
      }

      if (!queryNormalized) return true;

      return entry.searchBlob.includes(queryNormalized);
    });
  }, [actionFilter, entries, period, query, referenceNow]);

  const exportCsv = () => {
    const rows = filteredEntries.map((entry) => {
      const { date, time } = formatDateTime(entry.date);
      return [
        entry.id,
        date,
        time,
        entry.actionLabel,
        entry.targetLabel,
        entry.changeLabel,
        entry.description,
      ];
    });

    const csvLines = [
      ["ID", "Date", "Heure", "Action", "Cible", "Changement", "Description"],
      ...rows,
    ]
      .map((line) =>
        line
          .map((item) => `"${String(item).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvLines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "historique-pharmacie.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Historique d&apos;activité</h1>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrer par action ou description..."
            className="w-72 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs"
          />
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-semibold text-[#1F1D1B]"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
            <option value="365">12 derniers mois</option>
          </select>
          <select
            value={actionFilter}
            onChange={(event) =>
              setActionFilter(event.target.value as "ALL" | StockMovementType | "SCHEDULE")
            }
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-semibold text-[#1F1D1B]"
          >
            <option value="ALL">Toutes les actions</option>
            <option value="SCHEDULE">Horaires / Gardes</option>
            <option value="ENTREE">Entrée</option>
            <option value="SORTIE">Sortie</option>
            <option value="AJUSTEMENT">Ajustement</option>
            <option value="CREER">Création</option>
            <option value="SUPPRIMER">Suppression</option>
            <option value="MODIFIER">Modification</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Exporter en CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
          >
            Imprimer
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-xs">
              <thead className="bg-[#F8FAFC] text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Date & heure</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Cible</th>
                  <th className="px-4 py-3 text-left">Changement</th>
                  <th className="px-4 py-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-[#6B7280]" colSpan={6}>
                      Chargement de l&apos;historique...
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-[#6B7280]" colSpan={6}>
                      Aucune action trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => {
                    const { date, time } = formatDateTime(entry.date);

                    return (
                      <tr key={entry.id} className="border-t border-[#E5E7EB]">
                        <td className="px-4 py-3 text-[#6B7280]">#{entry.id.slice(-8)}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{date}</div>
                          <div className="text-[10px] text-[#6B7280]">{time}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${entry.actionToneClass}`}
                          >
                            {entry.actionLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold">{entry.targetLabel}</td>
                        <td className="px-4 py-3 font-semibold">{entry.changeLabel}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{entry.description}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-[#6B7280]">{filteredEntries.length} action(s)</div>
      </div>
    </div>
  );
}
