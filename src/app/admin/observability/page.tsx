"use client";

import { useCallback, useEffect, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type ObservabilityEvent = {
  id: string;
  timestamp: string;
  level: "error" | "warn";
  message: string;
  path: string;
  method: string;
  statusCode: number;
  traceId: string;
};

type ObservabilityStats = {
  totalActions: number;
  totalErrors: number;
  totalWarnings: number;
  errorRate: number;
  uniqueEndpointsAffected: number;
  recentEvents: ObservabilityEvent[];
};

export default function ObservabilityDashboard() {
  const [stats, setStats] = useState<ObservabilityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "error" | "warn">("all");

  const loadStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const result = await apiJsonAuth<ObservabilityStats>("/api/admin/observability");
    if (result.ok && result.data) {
      setStats(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Impossible de charger les données d’observabilité.");
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStats();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadStats]);

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "Date inconnue";
    return date.toLocaleString("fr-FR", { hour12: false });
  };

  const filteredEvents =
    stats?.recentEvents.filter((event) => filter === "all" || event.level === filter) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Observabilité API</h1>
        <button
          type="button"
          onClick={() => void loadStats(true)}
          disabled={loading || refreshing}
          className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold disabled:opacity-60"
        >
          {refreshing ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      <p className="text-xs text-[#6B7280]">
        Données des dernières 24 heures, calculées à partir des actions API journalisées
        (POST, PUT, PATCH et DELETE). Les requêtes de lecture ne sont pas incluses.
      </p>

      {error ? <Notice tone="error" message={error} /> : null}

      {loading && !stats ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-sm text-[#6B7280]">
          Chargement des données d’observabilité...
        </div>
      ) : null}

      {stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <p className="text-xs text-[#6B7280]">Erreurs serveur (24 h)</p>
              <p className="mt-2 text-2xl font-semibold text-red-600">{stats.totalErrors}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <p className="text-xs text-[#6B7280]">Taux d’échec des actions journalisées</p>
              <p className="mt-2 text-2xl font-semibold">{stats.errorRate}%</p>
              <p className="mt-1 text-[11px] text-[#9CA3AF]">
                sur {stats.totalActions} actions
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <p className="text-xs text-[#6B7280]">Routes affectées (24 h)</p>
              <p className="mt-2 text-2xl font-semibold text-amber-600">
                {stats.uniqueEndpointsAffected}
              </p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <p className="text-xs text-[#6B7280]">Réponses 4xx (24 h)</p>
              <p className="mt-2 text-2xl font-semibold text-blue-600">{stats.totalWarnings}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {(["all", "error", "warn"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  filter === value
                    ? "bg-[#0B63D1] text-white"
                    : "border border-[#E5E7EB] bg-white"
                }`}
              >
                {value === "all" ? "Tous" : value === "error" ? "Erreurs serveur" : "Réponses 4xx"}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] px-4 py-3">
              <h2 className="text-sm font-semibold">Événements récents</h2>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {filteredEvents.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-[#6B7280]">
                  Aucune erreur journalisée pour ce filtre sur les dernières 24 heures.
                </p>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="px-4 py-3 hover:bg-[#F8FAFC]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              event.level === "error" ? "bg-red-500" : "bg-amber-500"
                            }`}
                          />
                          <span className="text-xs font-semibold text-[#6B7280]">
                            {formatTime(event.timestamp)}
                          </span>
                          <span className="rounded bg-[#F3F4F6] px-2 py-0.5 text-[10px]">
                            {event.method} {event.path}
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] ${
                              event.level === "error"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {event.statusCode}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{event.message}</p>
                        <p className="mt-1 text-[10px] text-[#9CA3AF]">
                          Trace ID : {event.traceId}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
