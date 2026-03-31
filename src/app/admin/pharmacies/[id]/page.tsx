"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AdminPharmacy = {
  _id: string;
  name: string;
  address: string;
  ifu: string;
  email?: string;
  description?: string;
  ownerId: string;
  accountStatus: string;
  operationalStatus: "OUVERT" | "FERME";
  validationDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AdminUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  country?: string;
  phoneNumber?: string;
};

type AdminValidation = {
  _id: string;
  pharmacyId: string;
  status: string;
  comment?: string;
  documents: string[];
  createdAt: string;
  reviewedAt?: string;
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
};

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

function formatDateTime(iso?: string) {
  if (!iso) return "-";
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

function toValidationLabel(status: string) {
  const normalized = status.toUpperCase();
  if (normalized.includes("ATTENTE")) return "En attente";
  if (normalized.includes("VALIDE")) return "Validée";
  if (normalized.includes("REJETE")) return "Rejetée";
  return status;
}

export default function AdminPharmacyProfilePage() {
  const params = useParams<{ id: string }>();
  const pharmacyId = typeof params?.id === "string" ? params.id : "";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [pharmacy, setPharmacy] = useState<AdminPharmacy | null>(null);
  const [owner, setOwner] = useState<AdminUser | null>(null);
  const [validations, setValidations] = useState<AdminValidation[]>([]);
  const [ownerActivity, setOwnerActivity] = useState<AuditLogItem[]>([]);

  const currentAccount = useMemo(() => {
    if (!pharmacy) return "";
    return accountLabel(pharmacy, owner);
  }, [pharmacy, owner]);

  const loadData = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!pharmacyId) {
        setError("Identifiant pharmacie invalide.");
        setLoading(false);
        return;
      }

      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);
      setError(null);

      const [pharmaciesResult, usersResult, validationsResult] = await Promise.all([
        apiJsonAuth<AdminPharmacy[]>("/api/admin/pharmacies"),
        apiJsonAuth<AdminUser[]>("/api/admin/users"),
        apiJsonAuth<AdminValidation[]>("/api/admin/validations"),
      ]);

      if (!pharmaciesResult.ok || !pharmaciesResult.data) {
        setError(pharmaciesResult.error ?? "Impossible de charger la pharmacie.");
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

      const foundPharmacy =
        pharmaciesResult.data.find((item) => item._id === pharmacyId) ?? null;
      if (!foundPharmacy) {
        setPharmacy(null);
        setOwner(null);
        setValidations([]);
        setOwnerActivity([]);
        setError("Pharmacie introuvable.");
        if (mode === "initial") setLoading(false);
        if (mode === "refresh") setRefreshing(false);
        return;
      }

      const foundOwner =
        usersResult.data.find((item) => item._id === foundPharmacy.ownerId) ?? null;

      setPharmacy(foundPharmacy);
      setOwner(foundOwner);

      if (validationsResult.ok && validationsResult.data) {
        const byPharmacy = validationsResult.data
          .filter((item) => item.pharmacyId === foundPharmacy._id)
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        setValidations(byPharmacy);
      } else {
        setValidations([]);
      }

      if (foundOwner) {
        const auditResult = await apiJsonAuth<AuditLogListResponse>(
          `/api/admin/audit-logs?page=1&limit=20&actorUserId=${encodeURIComponent(
            foundOwner._id
          )}`
        );
        if (auditResult.ok && auditResult.data) {
          setOwnerActivity(auditResult.data.items);
        } else {
          setOwnerActivity([]);
        }
      } else {
        setOwnerActivity([]);
      }

      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
    },
    [pharmacyId]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const toggleSuspend = async () => {
    if (!pharmacy || !owner) {
      setError("Impossible de changer le statut: propriétaire introuvable.");
      return;
    }

    setChangingStatus(true);
    setError(null);
    setSuccess(null);

    const result =
      currentAccount === "Suspendue"
        ? await apiJsonAuth<{ success: boolean }>(
            `/api/admin/accounts/${owner._id}/unsuspend`,
            { method: "POST" }
          )
        : await apiJsonAuth<{ success: boolean }>(
            `/api/admin/accounts/${owner._id}/suspend`,
            {
              method: "POST",
              body: JSON.stringify({
                reason: "Suspension administrative depuis le profil pharmacie.",
              }),
            }
          );

    setChangingStatus(false);

    if (!result.ok) {
      setError(
        result.error ??
          (currentAccount === "Suspendue"
            ? "Impossible de réactiver cette pharmacie."
            : "Impossible de suspendre cette pharmacie.")
      );
      return;
    }

    setSuccess(
      currentAccount === "Suspendue"
        ? "Pharmacie réactivée avec succès."
        : "Pharmacie suspendue avec succès."
    );
    void loadData("refresh");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280]">
        Chargement du profil pharmacie...
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="space-y-4">
        {error ? <Notice tone="error" message={error} /> : null}
        <Link
          href="/admin/pharmacies"
          className="inline-flex items-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF2FF] text-lg font-semibold text-[#0B63D1]">
            {(pharmacy.name?.[0] ?? "P").toUpperCase()}
          </span>
          <div>
            <h1 className="text-lg font-semibold">{pharmacy.name}</h1>
            <p className="text-xs text-[#6B7280]">{pharmacy.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadData("refresh")}
            disabled={refreshing}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
          >
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
          <button
            onClick={() => void toggleSuspend()}
            disabled={changingStatus || !owner}
            className={`rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 ${
              currentAccount === "Suspendue" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {changingStatus
              ? "..."
              : currentAccount === "Suspendue"
              ? "Réactiver"
              : "Suspendre"}
          </button>
          <Link
            href="/admin/pharmacies"
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Retour
          </Link>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Informations de la pharmacie</h2>
            <div className="mt-4 grid gap-4 text-xs text-[#6B7280] md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">IFU</p>
                <p className="font-semibold text-[#1F1D1B]">{pharmacy.ifu}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Compte</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${accountTone(
                    currentAccount
                  )}`}
                >
                  {currentAccount}
                </span>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Statut opérationnel</p>
                <p className="font-semibold text-[#1F1D1B]">
                  {pharmacy.operationalStatus === "OUVERT" ? "Ouvert" : "Fermé"}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Validation</p>
                <p className="font-semibold text-[#1F1D1B]">
                  {formatDate(pharmacy.validationDate)}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">E-mail</p>
                <p className="font-semibold text-[#1F1D1B]">{pharmacy.email ?? "-"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Mise à jour</p>
                <p className="font-semibold text-[#1F1D1B]">{formatDate(pharmacy.updatedAt)}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] uppercase text-[#9CA3AF]">Description</p>
                <p className="font-semibold text-[#1F1D1B]">
                  {pharmacy.description || "Aucune description"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Historique de validation</h2>
            <div className="mt-4 space-y-3 text-xs">
              {validations.length === 0 ? (
                <p className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[#6B7280]">
                  Aucune validation en attente pour cette pharmacie.
                </p>
              ) : (
                validations.map((item) => (
                  <div key={item._id} className="rounded-2xl border border-[#E5E7EB] px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-[#1F1D1B]">
                        {toValidationLabel(item.status)}
                      </p>
                      <span className="rounded-full bg-[#EAF2FF] px-2 py-1 text-[10px] font-semibold text-[#0B63D1]">
                        {item.documents?.length ?? 0} document(s)
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#6B7280]">
                      Soumis: {formatDateTime(item.createdAt)}
                    </p>
                    <p className="mt-1 text-[11px] text-[#6B7280]">
                      Revu: {formatDateTime(item.reviewedAt)}
                    </p>
                    {item.comment ? (
                      <p className="mt-1 text-[11px] text-[#6B7280]">Commentaire: {item.comment}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Propriétaire du compte</h2>
            {owner ? (
              <div className="mt-4 text-xs text-[#6B7280]">
                <p className="font-semibold text-[#1F1D1B]">{ownerName(owner)}</p>
                <p className="mt-1">{owner.email}</p>
                <p className="mt-1">Téléphone: {owner.phoneNumber ?? "-"}</p>
                <p className="mt-1">Pays: {owner.country ?? "-"}</p>
                <Link
                  href={`/admin/users/${owner._id}`}
                  className="mt-3 inline-flex font-semibold text-[#0B63D1]"
                >
                  Voir le profil utilisateur
                </Link>
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs text-[#6B7280]">
                Propriétaire introuvable.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Activité récente du propriétaire</h2>
            <div className="mt-4 space-y-3 text-xs">
              {ownerActivity.length === 0 ? (
                <p className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[#6B7280]">
                  Aucune activité récente.
                </p>
              ) : (
                ownerActivity.map((event) => (
                  <div key={event._id} className="rounded-2xl border border-[#E5E7EB] px-3 py-3">
                    <p className="font-semibold text-[#1F1D1B]">
                      {event.method} {event.path}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-[11px] text-[#6B7280]">{formatDateTime(event.createdAt)}</p>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          event.outcome === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {event.outcome === "SUCCESS" ? "Succès" : "Erreur"}
                      </span>
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

