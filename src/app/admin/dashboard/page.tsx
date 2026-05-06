"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
};

type AdminPharmacy = {
  _id: string;
  name: string;
  accountStatus: string;
  operationalStatus: "OUVERT" | "FERME";
};

type AdminValidation = {
  _id: string;
  pharmacyId: string;
  requestedByUserId: string;
  status: string;
  documents: string[];
  createdAt: string;
};

type AuditLogItem = {
  _id: string;
  method: string;
  path: string;
  outcome: "SUCCESS" | "ERROR";
  statusCode: number;
  createdAt: string;
};

type AuditLogListResponse = {
  items: AuditLogItem[];
  total: number;
};

type IntegrationStatus = {
  status: "OK" | "ERROR" | "UNCONFIGURED";
  details: string;
  ok: boolean;
  checkedAt: string;
};

type IntegrationStatusMap = {
  smtp: IntegrationStatus;
  googleMaps: IntegrationStatus;
};

type PendingRow = {
  id: string;
  pharmacyName: string;
  ownerName: string;
  status: string;
  documentCount: number;
  submittedAt: string;
};

type RoleBreakdown = {
  label: string;
  value: number;
  percent: number;
};

type IntegrationRow = {
  name: string;
  status: "OK" | "ERROR" | "UNCONFIGURED";
  details: string;
  checkedAt: string;
  ok: boolean;
};

type DashboardData = {
  totalUsers: number;
  activeUsers: number;
  totalPharmacies: number;
  validatedPharmacies: number;
  openPharmacies: number;
  pendingValidations: number;
  auditTotal: number;
  auditErrorCount: number;
  pendingRows: PendingRow[];
  roleBreakdown: RoleBreakdown[];
  integrationRows: IntegrationRow[];
  recentAudit: AuditLogItem[];
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

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

function fullName(firstName?: string, lastName?: string) {
  const composed = [firstName ?? "", lastName ?? ""].join(" ").trim();
  return composed || "Utilisateur";
}

function toValidationLabel(status: string) {
  const normalized = status.toUpperCase();
  if (normalized.includes("ATTENTE")) return "En attente";
  if (normalized.includes("VALIDE")) return "Validée";
  if (normalized.includes("REJETE")) return "Rejetée";
  return status;
}

function toRoleLabel(role: string) {
  const normalized = role.toUpperCase();
  if (normalized.includes("ADMIN")) return "Admins";
  if (normalized.includes("PHARM")) return "Gestionnaires";
  if (normalized.includes("PATIENT")) return "Patients";
  return "Autres";
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadDashboard = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    const [usersResult, pharmaciesResult, validationsResult, auditResult, integrationsResult] =
      await Promise.all([
        apiJsonAuth<AdminUser[]>("/api/admin/users"),
        apiJsonAuth<AdminPharmacy[]>("/api/admin/pharmacies"),
        apiJsonAuth<AdminValidation[]>("/api/admin/validations"),
        apiJsonAuth<AuditLogListResponse>("/api/admin/audit-logs?page=1&limit=20"),
        apiJsonAuth<IntegrationStatusMap>("/api/admin/integrations/status"),
      ]);

    const firstError =
      usersResult.error ??
      pharmaciesResult.error ??
      validationsResult.error ??
      auditResult.error ??
      integrationsResult.error;

    if (
      !usersResult.ok ||
      !pharmaciesResult.ok ||
      !validationsResult.ok ||
      !auditResult.ok ||
      !integrationsResult.ok ||
      !usersResult.data ||
      !pharmaciesResult.data ||
      !validationsResult.data ||
      !auditResult.data ||
      !integrationsResult.data
    ) {
      setError(firstError ?? "Impossible de charger le dashboard administrateur.");
      if (mode === "initial") {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
      return;
    }

    const users = usersResult.data;
    const pharmacies = pharmaciesResult.data;
    const validations = validationsResult.data;
    const auditLogs = auditResult.data;
    const integrations = integrationsResult.data;

    const userById = new Map(users.map((user) => [user._id, user]));
    const pharmacyById = new Map(pharmacies.map((pharmacy) => [pharmacy._id, pharmacy]));

    const pendingRows: PendingRow[] = validations
      .slice(0, 6)
      .map((validation) => ({
        id: validation._id,
        pharmacyName: pharmacyById.get(validation.pharmacyId)?.name ?? "Pharmacie",
        ownerName: fullName(
          userById.get(validation.requestedByUserId)?.firstName,
          userById.get(validation.requestedByUserId)?.lastName
        ),
        status: toValidationLabel(validation.status),
        documentCount: Array.isArray(validation.documents) ? validation.documents.length : 0,
        submittedAt: validation.createdAt,
      }));

    const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
      const label = toRoleLabel(user.role);
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    }, {});

    const roleBreakdown: RoleBreakdown[] = Object.entries(roleCounts)
      .map(([label, value]) => ({
        label,
        value,
        percent: users.length === 0 ? 0 : Math.round((value / users.length) * 100),
      }))
      .sort((a, b) => b.value - a.value);

    const integrationRows: IntegrationRow[] = [
      {
        name: "SMTP",
        status: integrations.smtp.status,
        details: integrations.smtp.details,
        checkedAt: integrations.smtp.checkedAt,
        ok: integrations.smtp.ok,
      },
      {
        name: "Google Maps",
        status: integrations.googleMaps.status,
        details: integrations.googleMaps.details,
        checkedAt: integrations.googleMaps.checkedAt,
        ok: integrations.googleMaps.ok,
      },
    ];

    setData({
      totalUsers: users.length,
      activeUsers: users.filter((user) => user.isActive).length,
      totalPharmacies: pharmacies.length,
      validatedPharmacies: pharmacies.filter((pharmacy) =>
        pharmacy.accountStatus.toUpperCase().includes("VALIDE")
      ).length,
      openPharmacies: pharmacies.filter((pharmacy) => pharmacy.operationalStatus === "OUVERT")
        .length,
      pendingValidations: validations.length,
      auditTotal: auditLogs.total ?? auditLogs.items.length,
      auditErrorCount: auditLogs.items.filter((item) => item.outcome === "ERROR").length,
      pendingRows,
      roleBreakdown,
      integrationRows,
      recentAudit: auditLogs.items.slice(0, 5),
    });
    setLastUpdated(
      new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date())
    );

    if (mode === "initial") {
      setLoading(false);
    } else {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadDashboard("refresh");
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [loadDashboard]);

  if (loading && !data) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280]">
        Chargement du dashboard administrateur...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Vue d&apos;ensemble du Tableau de bord</h1>
        <button
          onClick={() => void loadDashboard("refresh")}
          disabled={refreshing}
          className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
        >
          {refreshing ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#6B7280]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Dernière mise à jour : {lastUpdated ?? "--:--:--"}
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Utilisateurs</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-semibold">{data?.totalUsers ?? 0}</span>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
              {data?.activeUsers ?? 0} actifs
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Comptes enregistrés</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Pharmacies</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-semibold">{data?.totalPharmacies ?? 0}</span>
            <span className="rounded-full bg-[#EAF2FF] px-2 py-1 text-[10px] font-semibold text-[#0B63D1]">
              {data?.openPharmacies ?? 0} ouvertes
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            {data?.validatedPharmacies ?? 0} validées
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Validations</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-semibold">{data?.pendingValidations ?? 0}</span>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
              en attente
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Demandes à traiter</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Audit système</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-semibold">{data?.auditTotal ?? 0}</span>
            <span className="rounded-full bg-rose-100 px-2 py-1 text-[10px] font-semibold text-rose-700">
              {data?.auditErrorCount ?? 0} erreurs
            </span>
          </div>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Logs consultés (page 1)</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">File de validation</div>
              <Link href="/admin/validation-queue" className="text-xs font-semibold text-[#0B63D1]">
                Gérer
              </Link>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB]">
              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full text-xs">
                  <thead className="bg-[#F8FAFC] text-[#6B7280]">
                    <tr>
                      <th className="px-4 py-3 text-left">Pharmacie</th>
                      <th className="px-4 py-3 text-left">Propriétaire</th>
                      <th className="px-4 py-3 text-left">Documents</th>
                      <th className="px-4 py-3 text-left">Soumis le</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.pendingRows ?? []).length === 0 ? (
                      <tr className="border-t border-[#E5E7EB]">
                        <td colSpan={5} className="px-4 py-6 text-center text-[#6B7280]">
                          Aucune validation en attente.
                        </td>
                      </tr>
                    ) : (
                      (data?.pendingRows ?? []).map((item) => (
                        <tr key={item.id} className="border-t border-[#E5E7EB]">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#1F1D1B]">{item.pharmacyName}</p>
                            <p className="text-[11px] text-[#9CA3AF]">#{item.id.slice(-6)}</p>
                          </td>
                          <td className="px-4 py-3 text-[#6B7280]">{item.ownerName}</td>
                          <td className="px-4 py-3 text-[#6B7280]">{item.documentCount}</td>
                          <td className="px-4 py-3 text-[#6B7280]">{formatDate(item.submittedAt)}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Derniers événements audit</h3>
              <Link href="/admin/audit-logs" className="text-xs font-semibold text-[#0B63D1]">
                Voir tout
              </Link>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              {(data?.recentAudit ?? []).length === 0 ? (
                <p className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[#6B7280]">
                  Aucun événement récent.
                </p>
              ) : (
                (data?.recentAudit ?? []).map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] px-3 py-2"
                  >
                    <div>
                      <p className="font-semibold text-[#1F1D1B]">
                        {log.method} {log.path}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">{formatDateTime(log.createdAt)}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        log.outcome === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {log.outcome === "SUCCESS" ? "Succès" : "Erreur"} ({log.statusCode})
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <h3 className="text-sm font-semibold">Intégrations</h3>
            <div className="mt-4 space-y-3 text-xs">
              {(data?.integrationRows ?? []).map((item, index) => (
                <div
                  key={`${item.name}-${item.checkedAt}-${index}`}
                  className="rounded-xl border border-[#E5E7EB] px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F1D1B]">{item.name}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                        item.ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#6B7280]">{item.details}</p>
                  <p className="mt-1 text-[10px] text-[#9CA3AF]">
                    Vérifié: {formatDateTime(item.checkedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <h3 className="text-sm font-semibold">Répartition des rôles</h3>
            <div className="mt-4 space-y-3 text-xs text-[#6B7280]">
              {(data?.roleBreakdown ?? []).length === 0 ? (
                <p className="rounded-xl border border-[#E5E7EB] px-3 py-2">
                  Aucune donnée utilisateur.
                </p>
              ) : (
                (data?.roleBreakdown ?? []).map((role) => (
                  <div key={role.label}>
                    <div className="flex items-center justify-between">
                      <span>{role.label}</span>
                      <span className="font-semibold text-[#1F1D1B]">
                        {role.value} ({role.percent}%)
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-[#E5E7EB]">
                      <div
                        className="h-2 rounded-full bg-[#0B63D1]"
                        style={{ width: `${role.percent}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
