"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AuditLogItem = {
  _id: string;
  actorUserId?: string;
  actorRole?: string;
  method: string;
  path: string;
  outcome: "SUCCESS" | "ERROR";
  statusCode: number;
  errorMessage?: string;
  createdAt: string;
};

type AuditLogResponse = {
  items: AuditLogItem[];
  page: number;
  limit: number;
  total: number;
};

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function userName(user: AdminUser | undefined, actorRole?: string) {
  if (user) {
    const full = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    return full || user.email;
  }
  if (actorRole) return actorRole;
  return "Système";
}

function badgeTone(outcome: "SUCCESS" | "ERROR") {
  return outcome === "SUCCESS"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [usersById, setUsersById] = useState<Map<string, AdminUser>>(new Map());
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [outcomeFilter, setOutcomeFilter] = useState<"ALL" | "SUCCESS" | "ERROR">("ALL");

  const loadLogs = useCallback(
    async (targetPage: number, mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);
      setError(null);

      const query = new URLSearchParams({
        page: String(targetPage),
        limit: String(limit),
      });
      if (methodFilter !== "ALL") query.set("method", methodFilter);
      if (outcomeFilter !== "ALL") query.set("outcome", outcomeFilter);

      const [logsResult, usersResult] = await Promise.all([
        apiJsonAuth<AuditLogResponse>(`/api/admin/audit-logs?${query.toString()}`),
        apiJsonAuth<AdminUser[]>("/api/admin/users"),
      ]);

      if (!logsResult.ok || !logsResult.data) {
        setError(logsResult.error ?? "Impossible de charger les journaux d'audit.");
        if (mode === "initial") setLoading(false);
        if (mode === "refresh") setRefreshing(false);
        return;
      }

      setLogs(logsResult.data.items ?? []);
      setPage(logsResult.data.page ?? targetPage);
      setTotal(logsResult.data.total ?? 0);

      if (usersResult.ok && usersResult.data) {
        setUsersById(new Map(usersResult.data.map((item) => [item._id, item])));
      }

      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
    },
    [limit, methodFilter, outcomeFilter]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLogs(1, "initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadLogs]);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter((item) => {
      const actor = userName(usersById.get(item.actorUserId ?? ""), item.actorRole).toLowerCase();
      const data = `${item.method} ${item.path} ${item.statusCode} ${actor}`.toLowerCase();
      return data.includes(query);
    });
  }, [logs, search, usersById]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const exportCsv = () => {
    const headers = ["id", "date", "method", "path", "actor", "outcome", "statusCode"];
    const rows = filteredLogs.map((item) => [
      item._id,
      formatDateTime(item.createdAt),
      item.method,
      item.path,
      userName(usersById.get(item.actorUserId ?? ""), item.actorRole),
      item.outcome,
      String(item.statusCode),
    ]);

    const csv = [headers, ...rows]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Journaux d&apos;audit</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Exporter en CSV
          </button>
          <button
            onClick={() => void loadLogs(page, "refresh")}
            disabled={refreshing}
            className="rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Filtrer localement (action, acteur, route...)"
          className="w-72 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs"
        />
        <select
          value={methodFilter}
          onChange={(event) => setMethodFilter(event.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
        >
          <option value="ALL">Toutes les méthodes</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
        <select
          value={outcomeFilter}
          onChange={(event) => setOutcomeFilter(event.target.value as "ALL" | "SUCCESS" | "ERROR")}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
        >
          <option value="ALL">Tous les résultats</option>
          <option value="SUCCESS">Succès</option>
          <option value="ERROR">Erreur</option>
        </select>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full text-xs">
              <thead className="bg-[#F8FAFC] text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Date &amp; Heure</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Acteur</th>
                  <th className="px-4 py-3 text-left">Résultat</th>
                  <th className="px-4 py-3 text-left">Détails</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={6} className="px-4 py-6 text-center text-[#6B7280]">
                      Chargement des logs...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={6} className="px-4 py-6 text-center text-[#6B7280]">
                      Aucun log trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => (
                    <tr key={item._id} className="border-t border-[#E5E7EB]">
                      <td className="px-4 py-3 text-[#6B7280]">#{item._id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3 font-semibold">{formatDateTime(item.createdAt)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#1F1D1B]">{item.method}</p>
                        <p className="text-[#6B7280]">{item.path}</p>
                      </td>
                      <td className="px-4 py-3 text-[#1F1D1B]">
                        {userName(usersById.get(item.actorUserId ?? ""), item.actorRole)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${badgeTone(item.outcome)}`}
                        >
                          {item.outcome === "SUCCESS" ? "Succès" : "Erreur"} • {item.statusCode}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {item.errorMessage ? item.errorMessage : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-[#6B7280]">
          <span>
            Page {page} / {totalPages} • {total} entrée(s)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void loadLogs(Math.max(1, page - 1), "refresh")}
              disabled={page <= 1 || refreshing}
              className="rounded-full border border-[#E5E7EB] px-3 py-1 disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => void loadLogs(Math.min(totalPages, page + 1), "refresh")}
              disabled={page >= totalPages || refreshing}
              className="rounded-full border border-[#E5E7EB] px-3 py-1 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
