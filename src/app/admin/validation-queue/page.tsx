"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { API_BASE, apiJsonAuth } from "@/lib/api";

type AdminValidation = {
  _id: string;
  pharmacyId: string;
  requestedByUserId: string;
  status: string;
  comment?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
};

type AdminPharmacy = {
  _id: string;
  name: string;
  address: string;
  ownerId: string;
  accountStatus: string;
};

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};

type QueueTab = "EN_ATTENTE" | "APPROUVEE" | "REJETEE";

type QueueRow = {
  validation: AdminValidation;
  pharmacy: AdminPharmacy | null;
  requester: AdminUser | null;
};

function fullName(user: AdminUser | null) {
  if (!user) return "Utilisateur inconnu";
  const value = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return value || user.email;
}

function statusLabel(value: string) {
  const normalized = value.toUpperCase();
  if (normalized.includes("ATTENTE")) return "EN ATTENTE";
  if (normalized.includes("VALID")) return "APPROUVÉE";
  if (normalized.includes("REJET")) return "REJETÉE";
  return value;
}

function formatDateTime(iso?: string) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function documentUrl(fileId: string) {
  if (fileId.startsWith("http://") || fileId.startsWith("https://")) return fileId;
  if (API_BASE) return `${API_BASE}/api/files/${fileId}`;
  return `/api/files/${fileId}`;
}

export default function ValidationQueuePage() {
  const [pendingRows, setPendingRows] = useState<QueueRow[]>([]);
  const [reviewedRows, setReviewedRows] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tab, setTab] = useState<QueueTab>("EN_ATTENTE");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"recent" | "old">("recent");

  const loadQueue = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);

    const [validationsResult, pharmaciesResult, usersResult] = await Promise.all([
      apiJsonAuth<AdminValidation[]>("/api/admin/validations"),
      apiJsonAuth<AdminPharmacy[]>("/api/admin/pharmacies"),
      apiJsonAuth<AdminUser[]>("/api/admin/users"),
    ]);

    if (!validationsResult.ok || !validationsResult.data) {
      setError(validationsResult.error ?? "Impossible de charger la file de validation.");
      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
      return;
    }

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

    const pharmacyById = new Map(pharmaciesResult.data.map((item) => [item._id, item]));
    const userById = new Map(usersResult.data.map((item) => [item._id, item]));

    setPendingRows(
      validationsResult.data.map((validation) => ({
        validation,
        pharmacy: pharmacyById.get(validation.pharmacyId) ?? null,
        requester: userById.get(validation.requestedByUserId) ?? null,
      }))
    );

    if (mode === "initial") setLoading(false);
    if (mode === "refresh") setRefreshing(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadQueue("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadQueue]);

  const approvedRows = reviewedRows.filter((row) =>
    row.validation.status.toUpperCase().includes("VALID")
  );
  const rejectedRows = reviewedRows.filter((row) =>
    row.validation.status.toUpperCase().includes("REJET")
  );

  const currentRows = useMemo(() => {
    const source =
      tab === "EN_ATTENTE" ? pendingRows : tab === "APPROUVEE" ? approvedRows : rejectedRows;
    const query = search.trim().toLowerCase();

    const filtered = source.filter((row) => {
      const searchable = [
        row.pharmacy?.name,
        row.pharmacy?.address,
        row.requester?.email,
        row.requester?.phoneNumber,
        fullName(row.requester),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return !query || searchable.includes(query);
    });

    return filtered.sort((a, b) => {
      const left = new Date(a.validation.createdAt).getTime();
      const right = new Date(b.validation.createdAt).getTime();
      return sort === "recent" ? right - left : left - right;
    });
  }, [approvedRows, pendingRows, rejectedRows, search, sort, tab]);

  const reviewValidation = async (row: QueueRow, action: "approve" | "reject") => {
    const label = action === "approve" ? "approuver" : "rejeter";
    const defaultComment = action === "approve" ? "Validé par admin." : "Rejeté par admin.";
    const comment = window.prompt(`Commentaire (${label})`, defaultComment);
    if (comment === null) return;

    setActingId(row.validation._id);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<{
      validation?: AdminValidation;
      success?: boolean;
    }>(`/api/admin/validations/${row.validation._id}/${action}`, {
      method: "POST",
      body: JSON.stringify({ comment: comment.trim() }),
    });

    setActingId(null);

    if (!result.ok) {
      setError(result.error ?? "Impossible de traiter cette validation.");
      return;
    }

    setPendingRows((previous) =>
      previous.filter((item) => item.validation._id !== row.validation._id)
    );

    const reviewedValidation: AdminValidation = {
      ...row.validation,
      status: action === "approve" ? "VALIDE" : "REJETE",
      comment: comment.trim() || row.validation.comment,
      updatedAt: new Date().toISOString(),
    };

    setReviewedRows((previous) => [
      {
        ...row,
        validation: reviewedValidation,
      },
      ...previous,
    ]);

    setSuccess(
      action === "approve"
        ? `Validation approuvée: ${row.pharmacy?.name ?? "pharmacie"}.`
        : `Validation rejetée: ${row.pharmacy?.name ?? "pharmacie"}.`
    );
  };

  const isEmptyState = !loading && currentRows.length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Validation des pharmacies</h1>
        <button
          onClick={() => void loadQueue("refresh")}
          disabled={refreshing}
          className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
        >
          {refreshing ? "Actualisation..." : "Actualiser"}
        </button>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 rounded-xl border border-[#E5E7EB] bg-white p-1 text-xs font-semibold text-[#6B7280]">
          <button
            onClick={() => setTab("EN_ATTENTE")}
            className={`rounded-xl px-4 py-2 ${tab === "EN_ATTENTE" ? "bg-[#0B63D1] text-white" : ""}`}
          >
            En attente ({pendingRows.length})
          </button>
          <button
            onClick={() => setTab("APPROUVEE")}
            className={`rounded-xl px-4 py-2 ${tab === "APPROUVEE" ? "bg-[#0B63D1] text-white" : ""}`}
          >
            Approuvées ({approvedRows.length})
          </button>
          <button
            onClick={() => setTab("REJETEE")}
            className={`rounded-xl px-4 py-2 ${tab === "REJETEE" ? "bg-[#0B63D1] text-white" : ""}`}
          >
            Rejetées ({rejectedRows.length})
          </button>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher pharmacie, email, téléphone..."
          className="w-72 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs"
        />

        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <span>Trier:</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as "recent" | "old")}
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            <option value="recent">Plus récentes</option>
            <option value="old">Plus anciennes</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {loading ? (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280]">
            Chargement des validations...
          </div>
        ) : (
          currentRows.map((row) => {
            const inProgress = actingId === row.validation._id;
            return (
              <div
                key={row.validation._id}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1F1D1B]">
                      {row.pharmacy?.name ?? "Pharmacie"}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      {row.pharmacy?.address ?? "Adresse non renseignée"}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                    {statusLabel(row.validation.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-xs text-[#6B7280] sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] uppercase text-[#9CA3AF]">Propriétaire</p>
                    <p className="font-semibold text-[#1F1D1B]">{fullName(row.requester)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#9CA3AF]">Date de demande</p>
                    <p className="font-semibold text-[#1F1D1B]">
                      {formatDateTime(row.validation.createdAt)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] uppercase text-[#9CA3AF]">Contact</p>
                    <p className="font-semibold text-[#0B63D1]">
                      {row.requester?.email ?? "E-mail indisponible"}
                      {row.requester?.phoneNumber ? ` • ${row.requester.phoneNumber}` : ""}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-semibold uppercase text-[#9CA3AF]">
                    Documents soumis
                  </p>
                  <div className="mt-2 space-y-2">
                    {(row.validation.documents ?? []).length === 0 ? (
                      <div className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs text-[#6B7280]">
                        Aucun document.
                      </div>
                    ) : (
                      row.validation.documents.map((docId, index) => (
                        <div
                          key={docId}
                          className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-[#1F1D1B]">Document {index + 1}</p>
                            <p className="text-[10px] text-[#9CA3AF]">{docId}</p>
                          </div>
                          <a
                            href={documentUrl(docId)}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-[#E5E7EB] px-2 py-1 text-[11px] font-semibold text-[#0B63D1]"
                          >
                            Ouvrir
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={
                      row.pharmacy?._id ? `/admin/pharmacies/${row.pharmacy._id}` : "/admin/pharmacies"
                    }
                    className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
                  >
                    Voir le profil
                  </Link>
                  <div className="flex items-center gap-3">
                    {tab === "EN_ATTENTE" ? (
                      <>
                        <button
                          onClick={() => void reviewValidation(row, "reject")}
                          disabled={inProgress}
                          className="rounded-xl border border-[#FCA5A5] bg-white px-4 py-2 text-xs font-semibold text-[#DC2626] disabled:opacity-60"
                        >
                          {inProgress ? "Traitement..." : "Rejeter"}
                        </button>
                        <button
                          onClick={() => void reviewValidation(row, "approve")}
                          disabled={inProgress}
                          className="rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          {inProgress ? "Traitement..." : "Approuver"}
                        </button>
                      </>
                    ) : (
                      <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[11px] font-semibold text-[#6B7280]">
                        Traité dans cette session
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isEmptyState ? (
        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-5 text-sm text-[#6B7280]">
          {tab === "EN_ATTENTE"
            ? "Aucune validation en attente."
            : "Aucune validation traitée dans cette session."}
        </div>
      ) : null}
    </div>
  );
}
