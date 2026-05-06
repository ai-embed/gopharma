"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AuditLogItem = {
  _id: string;
  method: string;
  path: string;
  outcome: "SUCCESS" | "ERROR";
  statusCode: number;
  errorMessage?: string;
  createdAt: string;
};

type AuditLogResponse = {
  items: AuditLogItem[];
};

type AdminReportsOverviewResponse = {
  reportTotal: number;
  alertsTotal: number;
  pharmaciesTotal: number;
  errorEvents: number;
  pendingValidations: number;
  weeklyBars: { day: string; count: number }[];
  incidents: { label: string; tone: "amber" | "rose" | "emerald" }[];
};

type WeeklyBar = {
  day: string;
  count: number;
  height: number;
};

type ReportData = {
  reportTotal: number;
  alertsTotal: number;
  pharmaciesTotal: number;
  errorEvents: number;
  pendingValidations: number;
  weeklyBars: WeeklyBar[];
  incidents: { label: string; tone: "amber" | "rose" | "emerald" }[];
  logs: AuditLogItem[];
};

function toRenderableBars(input: { day: string; count: number }[]) {
  const maxCount = Math.max(1, ...input.map((item) => item.count));
  return input.map((item) => ({
    ...item,
    height: Math.max(12, Math.round((item.count / maxCount) * 100)),
  }));
}

function toneClass(tone: "amber" | "rose" | "emerald") {
  if (tone === "rose") return "bg-rose-500";
  if (tone === "emerald") return "bg-emerald-500";
  return "bg-amber-500";
}

function toCsv(rows: AuditLogItem[]) {
  const header = ["id", "date", "method", "path", "outcome", "statusCode"];
  const body = rows.map((item) => [
    item._id,
    item.createdAt,
    item.method,
    item.path,
    item.outcome,
    String(item.statusCode),
  ]);
  return [header, ...body]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    const [overviewResult, auditResult] = await Promise.all([
      apiJsonAuth<AdminReportsOverviewResponse>("/api/admin/reports/overview"),
      apiJsonAuth<AuditLogResponse>("/api/admin/audit-logs?page=1&limit=100"),
    ]);

    if (!overviewResult.ok || !overviewResult.data) {
      setError(overviewResult.error ?? "Impossible de charger les rapports.");
      if (mode === "initial") {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
      return;
    }

    const logs = auditResult.ok && auditResult.data ? auditResult.data.items ?? [] : [];

    setData({
      reportTotal: overviewResult.data.reportTotal,
      alertsTotal: overviewResult.data.alertsTotal,
      pharmaciesTotal: overviewResult.data.pharmaciesTotal,
      errorEvents: overviewResult.data.errorEvents,
      pendingValidations: overviewResult.data.pendingValidations,
      weeklyBars: toRenderableBars(overviewResult.data.weeklyBars),
      incidents: overviewResult.data.incidents,
      logs,
    });

    if (mode === "initial") {
      setLoading(false);
    } else {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReports("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadReports]);

  const exportLogs = useMemo(() => {
    if (!data) return "";
    return toCsv(data.logs);
  }, [data]);

  const downloadCsv = () => {
    if (!exportLogs) return;
    const blob = new Blob([exportLogs], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280]">
        Chargement des rapports...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Rapports</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Vue d&apos;ensemble des opérations système.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadCsv}
            disabled={!data}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
          >
            Exporter
          </button>
          <button
            type="button"
            onClick={() => void loadReports("refresh")}
            disabled={refreshing}
            className="rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Rapports générés</p>
          <p className="mt-2 text-2xl font-semibold">{data?.reportTotal ?? 0}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Journal d&apos;audit total</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Alertes système</p>
          <p className="mt-2 text-2xl font-semibold">{data?.alertsTotal ?? 0}</p>
          <p className="mt-2 text-[11px] text-amber-600">À traiter</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Pharmacies analysées</p>
          <p className="mt-2 text-2xl font-semibold">{data?.pharmaciesTotal ?? 0}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Base administrée</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Activité hebdomadaire</h2>
            <span className="text-xs text-[#6B7280]">7 jours</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3 rounded-2xl bg-gradient-to-br from-[#EAF2FF] via-[#F8FAFC] to-[#EAF2FF] px-4 pb-4">
            {(data?.weeklyBars ?? []).map((bar, index) => (
              <div key={`${bar.day}-${index}`} className="group flex flex-1 flex-col items-center gap-2">
                <div
                  className={`w-full rounded-full ${index === 3 ? "bg-[#0B63D1]" : "bg-[#90B7F2]"}`}
                  style={{ height: `${bar.height}%` }}
                  title={`${bar.day}: ${bar.count}`}
                />
                <span className="text-[10px] text-[#6B7280]">{bar.day.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Alertes et incidents</h2>
            <span className="text-xs text-[#6B7280]">Temps réel</span>
          </div>
          <div className="mt-6 space-y-3 text-xs text-[#6B7280]">
            {(data?.incidents ?? []).map((incident) => (
              <div
                key={incident.label}
                className="flex items-center gap-2 rounded-2xl border border-[#E5E7EB] px-3 py-2"
              >
                <span className={`h-2 w-2 rounded-full ${toneClass(incident.tone)}`} />
                {incident.label}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-[#9CA3AF]">
            Erreurs API: {data?.errorEvents ?? 0} • Validations en attente:{" "}
            {data?.pendingValidations ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
