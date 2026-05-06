"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type GrowthData = {
  usersGrowth: number;
  usersCurrent: number;
  pharmaciesGrowth: number;
  pharmaciesCurrent: number;
  searchesCount: number;
  topCountries: { country: string; count: number; percent: number }[];
  roleBreakdown: { label: string; count: number; percent: number }[];
};

function toCsv(data: GrowthData | null) {
  if (!data) return "";
  const lines = [
    ["metric", "value"],
    ["usersCurrent30d", String(data.usersCurrent)],
    ["usersGrowthPercent", String(data.usersGrowth)],
    ["pharmaciesCurrent30d", String(data.pharmaciesCurrent)],
    ["pharmaciesGrowthPercent", String(data.pharmaciesGrowth)],
    ["searchEvents30d", String(data.searchesCount)],
  ];
  return lines.map((line) => line.join(",")).join("\n");
}

export default function AdminGrowthPage() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGrowth = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    const growthResult = await apiJsonAuth<GrowthData>("/api/admin/growth");
    if (!growthResult.ok || !growthResult.data) {
      setError(growthResult.error ?? "Impossible de charger les métriques de croissance.");
      if (mode === "initial") {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
      return;
    }

    setData(growthResult.data);

    if (mode === "initial") {
      setLoading(false);
    } else {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadGrowth("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadGrowth]);

  const csv = useMemo(() => toCsv(data), [data]);

  const downloadCsv = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-growth.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280]">
        Chargement des métriques de croissance...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Croissance</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Indicateurs d&apos;adoption de la plateforme.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={downloadCsv}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Exporter les données
          </button>
          <button
            type="button"
            onClick={() => void loadGrowth("refresh")}
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
          <p className="text-xs text-[#6B7280]">Nouveaux utilisateurs</p>
          <p className="mt-2 text-2xl font-semibold">
            {data?.usersGrowth && data.usersGrowth > 0 ? "+" : ""}
            {data?.usersGrowth ?? 0}%
          </p>
          <p className="mt-2 text-[11px] text-emerald-600">{data?.usersCurrent ?? 0} ce mois</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Pharmacies ajoutées</p>
          <p className="mt-2 text-2xl font-semibold">
            {data?.pharmaciesGrowth && data.pharmaciesGrowth > 0 ? "+" : ""}
            {data?.pharmaciesGrowth ?? 0}%
          </p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">{data?.pharmaciesCurrent ?? 0} ce mois</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Recherches totales</p>
          <p className="mt-2 text-2xl font-semibold">{data?.searchesCount ?? 0}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">30 derniers jours</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-sm font-semibold">Adoption par région</h2>
          <div className="mt-6 space-y-3">
            {(data?.topCountries ?? []).map((row) => (
              <div key={row.country}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-[#1F1D1B]">{row.country}</span>
                  <span className="font-semibold text-[#0B63D1]">{row.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#EAF2FF]">
                  <div
                    className="h-2 rounded-full bg-[#0B63D1]"
                    style={{ width: `${Math.max(6, row.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h2 className="text-sm font-semibold">Cohortes d&apos;utilisateurs</h2>
          <div className="mt-6 space-y-3 text-xs text-[#6B7280]">
            {(data?.roleBreakdown ?? []).map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2"
              >
                <span>{row.label}</span>
                <span className="font-semibold text-[#1F1D1B]">
                  {row.count} ({row.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
