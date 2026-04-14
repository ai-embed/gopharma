"use client";

import { useEffect, useState } from "react";
import { apiJsonAuth } from "@/lib/api";

type ErrorEvent = {
  id: string;
  timestamp: string;
  level: "error" | "warn";
  message: string;
  path: string;
  method: string;
  statusCode?: number;
  userId?: string;
  traceId: string;
  userAgent?: string;
};

type ObservabilityStats = {
  totalErrors: number;
  totalWarnings: number;
  last24hErrors: number;
  apiErrorRate: number; // percentage
  uniqueEndpointsAffected: number;
  topErrors: ErrorEvent[];
  recentEvents: ErrorEvent[];
};

export default function ObservabilityDashboard() {
  const [stats, setStats] = useState<ObservabilityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "error" | "warn">("all");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await apiJsonAuth<ObservabilityStats>("/api/admin/observability");
    
    if (result.ok && result.data) {
      setStats(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Impossible de charger les données");
      // Fallback to mock data for demo
      setStats(getMockStats());
    }
    setLoading(false);
  };

  const getMockStats = (): ObservabilityStats => ({
    totalErrors: 12,
    totalWarnings: 45,
    last24hErrors: 3,
    apiErrorRate: 2.4,
    uniqueEndpointsAffected: 5,
    topErrors: [
      {
        id: "err-1",
        timestamp: new Date().toISOString(),
        level: "error",
        message: "Database connection timeout",
        path: "/api/search/products",
        method: "GET",
        statusCode: 500,
        traceId: "abc123-def456",
      },
      {
        id: "err-2",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        level: "error",
        message: "Invalid pharmacy ID format",
        path: "/api/pharmacies/:id",
        method: "GET",
        statusCode: 400,
        traceId: "xyz789-uvw012",
      },
    ],
    recentEvents: [
      {
        id: "warn-1",
        timestamp: new Date().toISOString(),
        level: "warn",
        message: "Slow query detected (>2s)",
        path: "/api/admin/users",
        method: "GET",
        traceId: "slow-123-query",
      },
    ],
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", { hour12: false });
  };

  if (loading) {
    return <div className="p-8 text-center text-[#6B7280]">Chargement...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  const allEvents = [...stats.topErrors, ...stats.recentEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredEvents = filter === "all" 
    ? allEvents 
    : allEvents.filter(e => e.level === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Observabilité Production</h1>
        <button
          onClick={loadStats}
          className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold"
        >
          Actualiser
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Total Erreurs (24h)</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">{stats.last24hErrors}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Taux d&apos;erreur API</p>
          <p className="mt-2 text-2xl font-semibold">{stats.apiErrorRate}%</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Endpoints affectés</p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">{stats.uniqueEndpointsAffected}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Total Warnings</p>
          <p className="mt-2 text-2xl font-semibold text-blue-600">{stats.totalWarnings}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "error", "warn"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              filter === f
                ? "bg-[#0B63D1] text-white"
                : "border border-[#E5E7EB] bg-white"
            }`}
          >
            {f === "all" ? "Tous" : f === "error" ? "Erreurs" : "Warnings"}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#E5E7EB] px-4 py-3">
          <h2 className="text-sm font-semibold">Événements récents</h2>
        </div>
        <div className="divide-y divide-[#E5E7EB]">
          {filteredEvents.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#6B7280]">
              Aucun événement
            </p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="px-4 py-3 hover:bg-[#F8FAFC]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
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
                      {event.statusCode && (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] text-red-700">
                          {event.statusCode}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm">{event.message}</p>
                    <p className="mt-1 text-[10px] text-[#9CA3AF]">
                      Trace ID: {event.traceId}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
