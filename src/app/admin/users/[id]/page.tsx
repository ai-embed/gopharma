"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  country?: string;
  phoneNumber?: string;
  createdAt?: string;
  emailVerifiedAt?: string | null;
};

type AdminPharmacy = {
  _id: string;
  name: string;
  address: string;
  ownerId: string;
  accountStatus: string;
  operationalStatus: "OUVERT" | "FERME";
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

type UserUpdateDraft = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
};

function formatDate(iso?: string | null) {
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

function userName(user: AdminUser) {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return name || "Utilisateur";
}

function initials(user: AdminUser) {
  const first = user.firstName?.[0] ?? "";
  const last = user.lastName?.[0] ?? "";
  const value = `${first}${last}`.toUpperCase();
  return value || "U";
}

function roleLabel(role: string) {
  const normalized = role.toUpperCase();
  if (normalized.includes("PHARM")) return "Pharmacien";
  if (normalized.includes("PATIENT")) return "Patient";
  if (normalized.includes("ADMIN")) return "Admin";
  return role;
}

function statusLabel(accountStatus: string, isActive: boolean) {
  const normalized = accountStatus.toUpperCase();
  if (!isActive || normalized.includes("SUSP")) return "Suspendu";
  if (normalized.includes("ATTENTE")) return "En attente";
  if (normalized.includes("VALIDE")) return "Actif";
  return accountStatus;
}

function statusTone(label: string) {
  if (label === "Actif") return "bg-emerald-100 text-emerald-700";
  if (label === "En attente") return "bg-amber-100 text-amber-700";
  if (label === "Suspendu") return "bg-rose-100 text-rose-700";
  return "bg-zinc-100 text-zinc-700";
}

export default function AdminUserProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = typeof params?.id === "string" ? params.id : "";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [user, setUser] = useState<AdminUser | null>(null);
  const [linkedPharmacy, setLinkedPharmacy] = useState<AdminPharmacy | null>(null);
  const [activity, setActivity] = useState<AuditLogItem[]>([]);
  const [draft, setDraft] = useState<UserUpdateDraft>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phoneNumber: "",
  });

  const currentStatus = useMemo(() => {
    if (!user) return "";
    return statusLabel(user.accountStatus, user.isActive);
  }, [user]);

  const loadData = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!userId) {
        setError("Identifiant utilisateur invalide.");
        setLoading(false);
        return;
      }

      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);
      setError(null);

      const [userResult, pharmaciesResult, activityResult] = await Promise.all([
        apiJsonAuth<AdminUser>(`/api/admin/users/${encodeURIComponent(userId)}`),
        apiJsonAuth<AdminPharmacy[]>("/api/admin/pharmacies"),
        apiJsonAuth<AuditLogListResponse>(
          `/api/admin/audit-logs?page=1&limit=20&actorUserId=${encodeURIComponent(userId)}`
        ),
      ]);

      if (!userResult.ok || !userResult.data) {
        setError(userResult.error ?? "Impossible de charger l'utilisateur.");
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

      const loadedUser = userResult.data;
      setUser(loadedUser);
      setDraft({
        firstName: loadedUser.firstName ?? "",
        lastName: loadedUser.lastName ?? "",
        email: loadedUser.email ?? "",
        country: loadedUser.country ?? "",
        phoneNumber: loadedUser.phoneNumber ?? "",
      });
      setLinkedPharmacy(
        pharmaciesResult.data.find((pharmacy) => pharmacy.ownerId === loadedUser._id) ?? null
      );

      if (activityResult.ok && activityResult.data) {
        setActivity(activityResult.data.items);
      } else {
        setActivity([]);
      }

      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
    },
    [userId]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const toggleSuspend = async () => {
    if (!user) return;
    setChangingStatus(true);
    setError(null);
    setSuccess(null);

    const actionPath =
      currentStatus === "Suspendu"
        ? `/api/admin/accounts/${user._id}/unsuspend`
        : `/api/admin/accounts/${user._id}/suspend`;

    const result = await apiJsonAuth<{ success: boolean }>(actionPath, {
      method: "POST",
      ...(currentStatus === "Suspendu"
        ? {}
        : {
            body: JSON.stringify({
              reason: "Suspension administrative depuis le profil utilisateur.",
            }),
          }),
    });

    setChangingStatus(false);

    if (!result.ok) {
      setError(
        result.error ??
          (currentStatus === "Suspendu"
            ? "Impossible de réactiver ce compte."
            : "Impossible de suspendre ce compte.")
      );
      return;
    }

    setSuccess(
      currentStatus === "Suspendu"
        ? "Compte réactivé avec succès."
        : "Compte suspendu avec succès."
    );
    void loadData("refresh");
  };

  const saveUser = async () => {
    if (!user) return;
    setSavingUser(true);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<AdminUser>(`/api/admin/users/${encodeURIComponent(user._id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        email: draft.email.trim().toLowerCase(),
        country: draft.country.trim(),
        phoneNumber: draft.phoneNumber.trim() || undefined,
      }),
    });

    setSavingUser(false);
    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de mettre à jour l'utilisateur.");
      return;
    }

    setSuccess("Utilisateur mis à jour avec succès.");
    setUser(result.data);
    setDraft({
      firstName: result.data.firstName ?? "",
      lastName: result.data.lastName ?? "",
      email: result.data.email ?? "",
      country: result.data.country ?? "",
      phoneNumber: result.data.phoneNumber ?? "",
    });
  };

  const removeUser = async () => {
    if (!user) return;
    const confirmed = window.confirm(
      "Supprimer définitivement cet utilisateur ? Cette action est irréversible."
    );
    if (!confirmed) return;

    setDeletingUser(true);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<{ success: boolean }>(
      `/api/admin/users/${encodeURIComponent(user._id)}`,
      { method: "DELETE" }
    );
    setDeletingUser(false);

    if (!result.ok) {
      setError(result.error ?? "Impossible de supprimer l'utilisateur.");
      return;
    }

    router.push("/admin/users");
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280]">
        Chargement du profil utilisateur...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        {error ? <Notice tone="error" message={error} /> : null}
        <Link
          href="/admin/users"
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
            {initials(user)}
          </span>
          <div>
            <h1 className="text-lg font-semibold">{userName(user)}</h1>
            <p className="text-xs text-[#6B7280]">{user.email}</p>
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
            disabled={changingStatus}
            className={`rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 ${
              currentStatus === "Suspendu" ? "bg-emerald-600" : "bg-rose-600"
            }`}
          >
            {changingStatus
              ? "..."
              : currentStatus === "Suspendu"
              ? "Réactiver"
              : "Suspendre"}
          </button>
          <Link
            href="/admin/users"
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Retour
          </Link>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Informations utilisateur</h2>
            <div className="mt-4 grid gap-4 text-xs text-[#6B7280] md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Rôle</p>
                <p className="font-semibold text-[#1F1D1B]">{roleLabel(user.role)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Statut</p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${statusTone(
                    currentStatus
                  )}`}
                >
                  {currentStatus}
                </span>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Pays</p>
                <p className="font-semibold text-[#1F1D1B]">{user.country ?? "-"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Téléphone</p>
                <p className="font-semibold text-[#1F1D1B]">{user.phoneNumber ?? "-"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Créé le</p>
                <p className="font-semibold text-[#1F1D1B]">{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-[#9CA3AF]">Email vérifié</p>
                <p className="font-semibold text-[#1F1D1B]">
                  {user.emailVerifiedAt ? formatDate(user.emailVerifiedAt) : "Non vérifié"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Édition rapide</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void saveUser()}
                  disabled={savingUser || deletingUser}
                  className="rounded-xl bg-[#0B63D1] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {savingUser ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  type="button"
                  onClick={() => void removeUser()}
                  disabled={savingUser || deletingUser}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 disabled:opacity-60"
                >
                  {deletingUser ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-xs md:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#6B7280]">Prénom</p>
                <input
                  value={draft.firstName}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, firstName: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs"
                />
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Nom</p>
                <input
                  value={draft.lastName}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, lastName: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs"
                />
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">E-mail</p>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs"
                />
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Pays</p>
                <input
                  value={draft.country}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, country: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs"
                />
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] text-[#6B7280]">Téléphone</p>
                <input
                  value={draft.phoneNumber}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, phoneNumber: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Activité récente</h2>
            <div className="mt-4 space-y-3 text-xs">
              {activity.length === 0 ? (
                <p className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-[#6B7280]">
                  Aucune activité récente pour cet utilisateur.
                </p>
              ) : (
                activity.map((event) => (
                  <div
                    key={event._id}
                    className="rounded-2xl border border-[#E5E7EB] px-3 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-[#1F1D1B]">
                        {event.method} {event.path}
                      </p>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          event.outcome === "SUCCESS"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {event.outcome === "SUCCESS" ? "Succès" : "Erreur"} ({event.statusCode})
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#6B7280]">
                      {formatDateTime(event.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Pharmacie associée</h2>
            {linkedPharmacy ? (
              <div className="mt-4 rounded-xl border border-[#E5E7EB] px-4 py-3 text-xs text-[#6B7280]">
                <p className="font-semibold text-[#1F1D1B]">{linkedPharmacy.name}</p>
                <p className="mt-1">{linkedPharmacy.address}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                      linkedPharmacy.operationalStatus === "OUVERT"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {linkedPharmacy.operationalStatus === "OUVERT" ? "Ouverte" : "Fermée"}
                  </span>
                  <span className="rounded-full bg-[#EAF2FF] px-2 py-1 text-[10px] font-semibold text-[#0B63D1]">
                    {linkedPharmacy.accountStatus}
                  </span>
                </div>
                <Link
                  href={`/admin/pharmacies/${linkedPharmacy._id}`}
                  className="mt-3 inline-flex font-semibold text-[#0B63D1]"
                >
                  Voir la pharmacie
                </Link>
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs text-[#6B7280]">
                Aucun compte pharmacie lié.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Résumé admin</h2>
            <div className="mt-4 space-y-2 text-xs text-[#6B7280]">
              <p>ID utilisateur: {user._id}</p>
              <p>Événements audit affichés: {activity.length}</p>
              <p>
                Dernier événement:{" "}
                {activity.length > 0 ? formatDateTime(activity[0]?.createdAt) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
