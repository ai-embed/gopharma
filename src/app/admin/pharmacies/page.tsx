"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AdminPharmacy = {
  _id: string;
  name: string;
  address: string;
  ifu: string;
  email?: string;
  ownerId: string;
  accountStatus: string;
  operationalStatus: "OUVERT" | "FERME";
  validationDate?: string;
  createdAt?: string;
};

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

type AdminValidation = {
  _id: string;
  pharmacyId: string;
  status: string;
};

type PharmacyRow = {
  pharmacy: AdminPharmacy;
  owner: AdminUser | null;
};

function ownerName(user: AdminUser | null) {
  if (!user) return "Propriétaire inconnu";
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.email;
}

function accountLabel(pharmacy: AdminPharmacy, owner: AdminUser | null) {
  const normalized = pharmacy.accountStatus.toUpperCase();
  if (!owner?.isActive || normalized.includes("SUSP")) return "Suspendue";
  if (normalized.includes("ATTENTE")) return "En attente";
  if (normalized.includes("VALIDE")) return "Validée";
  return pharmacy.accountStatus;
}

function accountTone(label: string) {
  if (label === "Validée") return "bg-emerald-100 text-emerald-700";
  if (label === "En attente") return "bg-amber-100 text-amber-700";
  if (label === "Suspendue") return "bg-rose-100 text-rose-700";
  return "bg-zinc-100 text-zinc-700";
}

function operationalTone(status: "OUVERT" | "FERME") {
  return status === "OUVERT"
    ? "bg-[#E8F8EF] text-[#059669]"
    : "bg-[#F3F4F6] text-[#6B7280]";
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

export default function AdminPharmaciesPage() {
  const [rows, setRows] = useState<PharmacyRow[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [changingId, setChangingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [openFilter, setOpenFilter] = useState("ALL");

  const loadData = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);

    const [pharmaciesResult, usersResult, validationsResult] = await Promise.all([
      apiJsonAuth<AdminPharmacy[]>("/api/admin/pharmacies"),
      apiJsonAuth<AdminUser[]>("/api/admin/users"),
      apiJsonAuth<AdminValidation[]>("/api/admin/validations"),
    ]);

    if (!pharmaciesResult.ok || !pharmaciesResult.data) {
      setError(pharmaciesResult.error ?? "Impossible de charger les pharmacies.");
      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
      return;
    }

    if (!usersResult.ok || !usersResult.data) {
      setError(usersResult.error ?? "Impossible de charger les utilisateurs.");
      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
      return;
    }

    const userById = new Map(usersResult.data.map((item) => [item._id, item]));
    setRows(
      pharmaciesResult.data.map((pharmacy) => ({
        pharmacy,
        owner: userById.get(pharmacy.ownerId) ?? null,
      }))
    );

    if (validationsResult.ok && validationsResult.data) {
      setPendingCount(validationsResult.data.length);
    } else {
      setPendingCount(0);
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

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter(({ pharmacy, owner }) => {
      const account = accountLabel(pharmacy, owner);
      const searchValue = [
        pharmacy.name,
        pharmacy.address,
        pharmacy.ifu,
        pharmacy.email,
        owner?.email,
        ownerName(owner),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (query && !searchValue.includes(query)) return false;
      if (statusFilter !== "ALL" && account !== statusFilter) return false;
      if (openFilter !== "ALL" && pharmacy.operationalStatus !== openFilter) return false;
      return true;
    });
  }, [rows, search, statusFilter, openFilter]);

  const total = rows.length;
  const openNow = rows.filter((row) => row.pharmacy.operationalStatus === "OUVERT").length;
  const suspended = rows.filter(
    (row) => accountLabel(row.pharmacy, row.owner) === "Suspendue"
  ).length;
  const waiting = rows.filter(
    (row) => accountLabel(row.pharmacy, row.owner) === "En attente"
  ).length;

  const toggleSuspend = async (row: PharmacyRow) => {
    if (!row.owner) {
      setError("Impossible: aucun propriétaire lié à cette pharmacie.");
      return;
    }

    const current = accountLabel(row.pharmacy, row.owner);
    setChangingId(row.pharmacy._id);
    setError(null);
    setSuccess(null);

    const result =
      current === "Suspendue"
        ? await apiJsonAuth<{ success: boolean }>(
            `/api/admin/accounts/${row.owner._id}/unsuspend`,
            {
              method: "POST",
            }
          )
        : await apiJsonAuth<{ success: boolean }>(
            `/api/admin/accounts/${row.owner._id}/suspend`,
            {
              method: "POST",
              body: JSON.stringify({
                reason: "Suspension administrative depuis la liste pharmacies.",
              }),
            }
          );

    setChangingId(null);

    if (!result.ok) {
      setError(
        result.error ??
          (current === "Suspendue"
            ? "Impossible de réactiver la pharmacie."
            : "Impossible de suspendre la pharmacie.")
      );
      return;
    }

    setSuccess(
      current === "Suspendue"
        ? `Pharmacie réactivée: ${row.pharmacy.name}.`
        : `Pharmacie suspendue: ${row.pharmacy.name}.`
    );
    void loadData("refresh");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Gestion des pharmacies</h1>
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
          <p className="text-xs text-[#6B7280]">Total pharmacies</p>
          <p className="mt-2 text-2xl font-semibold">{total}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Enregistrées</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Ouvertes</p>
          <p className="mt-2 text-2xl font-semibold">{openNow}</p>
          <p className="mt-2 text-[11px] text-emerald-600">Statut opérationnel</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">En attente</p>
          <p className="mt-2 text-2xl font-semibold">{waiting}</p>
          <p className="mt-2 text-[11px] text-amber-600">À valider</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Suspendues</p>
          <p className="mt-2 text-2xl font-semibold">{suspended}</p>
          <p className="mt-2 text-[11px] text-rose-600">Contrôle admin</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-sm font-semibold">Toutes les pharmacies enregistrées</h2>
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher (nom, IFU, adresse, e-mail)..."
              className="w-72 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="ALL">Tous les statuts compte</option>
              <option value="Validée">Validée</option>
              <option value="En attente">En attente</option>
              <option value="Suspendue">Suspendue</option>
            </select>
            <select
              value={openFilter}
              onChange={(event) => setOpenFilter(event.target.value)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="ALL">Ouvert/Fermé</option>
              <option value="OUVERT">Ouvert</option>
              <option value="FERME">Fermé</option>
            </select>
            <Link
              href="/admin/pharmacies/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-sm leading-none">
                +
              </span>
              Ajouter une pharmacie
            </Link>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-xs">
              <thead className="bg-[#F8FAFC] text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 text-left">Pharmacie</th>
                  <th className="px-4 py-3 text-left">Propriétaire</th>
                  <th className="px-4 py-3 text-left">IFU</th>
                  <th className="px-4 py-3 text-left">Localisation</th>
                  <th className="px-4 py-3 text-left">Compte</th>
                  <th className="px-4 py-3 text-left">Opération</th>
                  <th className="px-4 py-3 text-left">Validation</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={8} className="px-4 py-6 text-center text-[#6B7280]">
                      Chargement des pharmacies...
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={8} className="px-4 py-6 text-center text-[#6B7280]">
                      Aucune pharmacie trouvée.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row) => {
                    const account = accountLabel(row.pharmacy, row.owner);
                    const inProgress = changingId === row.pharmacy._id;
                    return (
                      <tr key={row.pharmacy._id} className="border-t border-[#E5E7EB]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2FF] text-xs font-semibold text-[#0B63D1]">
                              {(row.pharmacy.name?.[0] ?? "P").toUpperCase()}
                            </span>
                            <div>
                              <p className="font-semibold text-[#1F1D1B]">{row.pharmacy.name}</p>
                              <p className="text-[10px] text-[#6B7280]">
                                {row.pharmacy.email ?? "Sans e-mail"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#1F1D1B]">{ownerName(row.owner)}</p>
                          <p className="text-[10px] text-[#6B7280]">
                            {row.owner?.email ?? "Utilisateur introuvable"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">{row.pharmacy.ifu}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{row.pharmacy.address}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${accountTone(
                              account
                            )}`}
                          >
                            {account}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${operationalTone(
                              row.pharmacy.operationalStatus
                            )}`}
                          >
                            {row.pharmacy.operationalStatus === "OUVERT" ? "Ouvert" : "Fermé"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6B7280]">
                          {formatDate(row.pharmacy.validationDate)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 text-[11px] font-semibold">
                            <Link
                              href={`/admin/pharmacies/${row.pharmacy._id}`}
                              className="text-[#0B63D1]"
                            >
                              Profil
                            </Link>
                            <button
                              onClick={() => void toggleSuspend(row)}
                              disabled={inProgress}
                              className={`rounded-full border px-3 py-1 disabled:opacity-60 ${
                                account === "Suspendue"
                                  ? "border-emerald-200 text-emerald-700"
                                  : "border-rose-200 text-rose-700"
                              }`}
                            >
                              {inProgress
                                ? "..."
                                : account === "Suspendue"
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
            {filteredRows.length} pharmacie(s) affichée(s) / {total} total
          </span>
          <span>Validations en attente: {pendingCount}</span>
        </div>
      </div>
    </div>
  );
}

