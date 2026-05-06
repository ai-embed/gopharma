"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  accountStatus: string;
  isActive: boolean;
  createdAt?: string;
};

type AdminValidation = {
  _id: string;
  status: string;
};

function fullName(user: AdminUser) {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return name || "Utilisateur";
}

function roleLabel(role: string) {
  const normalized = role.toUpperCase();
  if (normalized.includes("PHARM")) return "PHARMACIEN";
  if (normalized.includes("PATIENT")) return "PATIENT";
  if (normalized.includes("ADMIN")) return "ADMIN";
  return "AUTRE";
}

function roleBadge(role: string) {
  const label = roleLabel(role);
  if (label === "PHARMACIEN") return "bg-sky-100 text-sky-600";
  if (label === "PATIENT") return "bg-slate-100 text-slate-600";
  if (label === "ADMIN") return "bg-violet-100 text-violet-600";
  return "bg-zinc-100 text-zinc-700";
}

function accountLabel(status: string, isActive: boolean) {
  const normalized = status.toUpperCase();
  if (!isActive || normalized.includes("SUSP")) return "Suspendu";
  if (normalized.includes("ATTENTE")) return "En attente";
  if (normalized.includes("VALIDE")) return "Actif";
  return status;
}

function accountTextColor(label: string) {
  if (label === "Actif") return "text-emerald-600";
  if (label === "En attente") return "text-amber-600";
  if (label === "Suspendu") return "text-rose-600";
  return "text-[#6B7280]";
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isToday(iso?: string) {
  if (!iso) return false;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingValidationCount, setPendingValidationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [changingUserId, setChangingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);

    const [usersResult, validationsResult] = await Promise.all([
      apiJsonAuth<AdminUser[]>("/api/admin/users"),
      apiJsonAuth<AdminValidation[]>("/api/admin/validations"),
    ]);

    if (!usersResult.ok || !usersResult.data) {
      setError(usersResult.error ?? "Impossible de charger les utilisateurs.");
      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
      return;
    }

    setUsers(usersResult.data);

    if (validationsResult.ok && validationsResult.data) {
      setPendingValidationCount(validationsResult.data.length);
    } else {
      setPendingValidationCount(0);
    }

    if (mode === "initial") setLoading(false);
    if (mode === "refresh") setRefreshing(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const role = roleLabel(user.role);
      const status = accountLabel(user.accountStatus, user.isActive);
      const searchable = `${fullName(user)} ${user.email}`.toLowerCase();

      if (query && !searchable.includes(query)) return false;
      if (roleFilter !== "ALL" && role !== roleFilter) return false;
      if (statusFilter !== "ALL" && status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter(
    (user) => accountLabel(user.accountStatus, user.isActive) === "Actif"
  ).length;
  const managerUsers = users.filter((user) => roleLabel(user.role) === "PHARMACIEN").length;
  const newToday = users.filter((user) => isToday(user.createdAt)).length;

  const toggleSuspend = async (user: AdminUser) => {
    const status = accountLabel(user.accountStatus, user.isActive);
    setChangingUserId(user._id);
    setError(null);
    setSuccess(null);

    if (status === "Suspendu") {
      const result = await apiJsonAuth<{ success: boolean }>(
        `/api/admin/accounts/${user._id}/unsuspend`,
        {
          method: "POST",
        }
      );

      setChangingUserId(null);

      if (!result.ok) {
        setError(result.error ?? "Impossible de réactiver le compte.");
        return;
      }
      setSuccess(`Compte réactivé: ${fullName(user)}.`);
      void loadData("refresh");
      return;
    }

    const result = await apiJsonAuth<{ success: boolean }>(
      `/api/admin/accounts/${user._id}/suspend`,
      {
        method: "POST",
        body: JSON.stringify({
          reason: "Suspension administrative depuis l'interface admin.",
        }),
      }
    );

    setChangingUserId(null);

    if (!result.ok) {
      setError(result.error ?? "Impossible de suspendre le compte.");
      return;
    }

    setSuccess(`Compte suspendu: ${fullName(user)}.`);
    void loadData("refresh");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Gestion des utilisateurs</h1>
        <button
          onClick={() => void loadData("refresh")}
          disabled={refreshing}
          className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
        >
          {refreshing ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Utilisateurs totaux</p>
          <p className="mt-2 text-2xl font-semibold">{totalUsers}</p>
          <p className="mt-2 text-[11px] text-emerald-600">{activeUsers} actifs</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Validations en attente</p>
          <p className="mt-2 text-2xl font-semibold">{pendingValidationCount}</p>
          <p className="mt-2 text-[11px] text-amber-600">Action requise</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Pharmaciens</p>
          <p className="mt-2 text-2xl font-semibold">{managerUsers}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Comptes gestionnaires</p>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Nouveaux aujourd&apos;hui</p>
          <p className="mt-2 text-2xl font-semibold">{newToday}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Créés ce jour</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-sm font-semibold">Tous les utilisateurs inscrits</h2>
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher nom ou e-mail..."
              className="w-56 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
            />
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="ALL">Tous les rôles</option>
              <option value="ADMIN">Admin</option>
              <option value="PHARMACIEN">Pharmacien</option>
              <option value="PATIENT">Patient</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="En attente">En attente</option>
              <option value="Suspendu">Suspendu</option>
            </select>
            <Link
              href="/admin/users/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
                +
              </span>
              Ajouter un utilisateur
            </Link>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-xs">
              <thead className="bg-[#F8FAFC] text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 text-left">Utilisateur</th>
                  <th className="px-4 py-3 text-left">Rôle</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Créé le</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={5} className="px-4 py-6 text-center text-[#6B7280]">
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={5} className="px-4 py-6 text-center text-[#6B7280]">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const status = accountLabel(user.accountStatus, user.isActive);
                    const initials = (user.firstName?.[0] ?? "U").toUpperCase();
                    const inProgress = changingUserId === user._id;
                    return (
                      <tr key={user._id} className="border-t border-[#E5E7EB]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-semibold text-[#0B63D1]">
                              {initials}
                            </span>
                            <div>
                              <p className="font-semibold text-[#1F1D1B]">{fullName(user)}</p>
                              <p className="text-[10px] text-[#6B7280]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${roleBadge(user.role)}`}>
                            {roleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-2 text-[11px] font-semibold ${accountTextColor(status)}`}>
                            <span className="h-2 w-2 rounded-full bg-current" />
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{formatDate(user.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 text-[11px] font-semibold">
                            <Link href={`/admin/users/${user._id}`} className="text-[#0B63D1]">
                              Voir
                            </Link>
                            <button
                              onClick={() => void toggleSuspend(user)}
                              disabled={inProgress}
                              className={`rounded-full border px-3 py-1 disabled:opacity-60 ${
                                status === "Suspendu"
                                  ? "border-emerald-200 text-emerald-700"
                                  : "border-rose-200 text-rose-700"
                              }`}
                            >
                              {inProgress
                                ? "..."
                                : status === "Suspendu"
                                ? "Réactiver"
                                : "Suspendre"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-[#6B7280]">
          <span>
            {filteredUsers.length} utilisateur(s) affiché(s) / {totalUsers} total
          </span>
          <span>Connecté au backend admin</span>
        </div>
      </div>
    </div>
  );
}
