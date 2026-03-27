"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CoordinatePickerMap } from "@/components/CoordinatePickerMap";
import { Notice } from "@/components/Notice";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { usePharmacyStoreStatus } from "@/lib/usePharmacyStoreStatus";

type ManagerPharmacy = {
  _id: string;
  name: string;
  address: string;
  ifu: string;
  email?: string;
  description?: string;
  services?: string[];
  operationalStatus: "OUVERT" | "FERME";
  location: {
    type: "Point";
    coordinates: [number, number];
  };
};

type UserMe = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  preferences: {
    alertsEnabled: boolean;
    channels: Array<"IN_APP" | "EMAIL" | "PUSH">;
  };
};

type NotificationChannel = "IN_APP" | "EMAIL" | "PUSH";

type SettingsSnapshot = {
  pharmacyName: string;
  ifu: string;
  pharmacyEmail: string;
  pharmacyAddress: string;
  description: string;
  servicesText: string;
  latitude: string;
  longitude: string;
  managerPhone: string;
  alertsEnabled: boolean;
  channelInApp: boolean;
  channelEmail: boolean;
  channelPush: boolean;
  operationalStatus: "OUVERT" | "FERME";
};

const defaultSnapshot: SettingsSnapshot = {
  pharmacyName: "",
  ifu: "",
  pharmacyEmail: "",
  pharmacyAddress: "",
  description: "",
  servicesText: "",
  latitude: "",
  longitude: "",
  managerPhone: "",
  alertsEnabled: true,
  channelInApp: true,
  channelEmail: true,
  channelPush: false,
  operationalStatus: "FERME",
};

function toSnapshot(pharmacy: ManagerPharmacy, user: UserMe): SettingsSnapshot {
  const [lng, lat] = pharmacy.location?.coordinates ?? [0, 0];
  const channels = user.preferences?.channels ?? [];

  return {
    pharmacyName: pharmacy.name ?? "",
    ifu: pharmacy.ifu ?? "",
    pharmacyEmail: pharmacy.email ?? "",
    pharmacyAddress: pharmacy.address ?? "",
    description: pharmacy.description ?? "",
    servicesText: (pharmacy.services ?? []).join(", "),
    latitude: String(lat ?? ""),
    longitude: String(lng ?? ""),
    managerPhone: user.phoneNumber ?? "",
    alertsEnabled: user.preferences?.alertsEnabled ?? true,
    channelInApp: channels.includes("IN_APP"),
    channelEmail: channels.includes("EMAIL"),
    channelPush: channels.includes("PUSH"),
    operationalStatus: pharmacy.operationalStatus ?? "FERME",
  };
}

function buildChannels(state: SettingsSnapshot): NotificationChannel[] {
  const channels: NotificationChannel[] = [];
  if (state.channelInApp) channels.push("IN_APP");
  if (state.channelEmail) channels.push("EMAIL");
  if (state.channelPush) channels.push("PUSH");
  return channels.length === 0 ? ["IN_APP"] : channels;
}

export default function PharmacySettingsPage() {
  const [form, setForm] = useState<SettingsSnapshot>(defaultSnapshot);
  const [initial, setInitial] = useState<SettingsSnapshot>(defaultSnapshot);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [managerEmail, setManagerEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const storeStatus = usePharmacyStoreStatus();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const [pharmacyResult, userResult] = await Promise.all([
      apiJsonAuth<ManagerPharmacy>("/api/manager/pharmacy"),
      apiJsonAuth<UserMe>("/api/users/me"),
    ]);

    if (!pharmacyResult.ok || !pharmacyResult.data) {
      setError(pharmacyResult.error ?? "Impossible de charger les paramètres pharmacie.");
      setLoading(false);
      return;
    }

    if (!userResult.ok || !userResult.data) {
      setError(userResult.error ?? "Impossible de charger les préférences utilisateur.");
      setLoading(false);
      return;
    }

    const snapshot = toSnapshot(pharmacyResult.data, userResult.data);
    setForm(snapshot);
    setInitial(snapshot);
    setManagerEmail(userResult.data.email ?? "");
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(initial), [form, initial]);

  const setField = <K extends keyof SettingsSnapshot>(key: K, value: SettingsSnapshot[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setError(null);
    setSuccess(null);

    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setError("Latitude/Longitude invalides.");
      return;
    }

    setSaving(true);

    const services = form.servicesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const pharmacyResult = await apiJsonAuth<ManagerPharmacy>("/api/manager/pharmacy", {
      method: "PATCH",
      body: JSON.stringify({
        name: form.pharmacyName,
        address: form.pharmacyAddress,
        email: form.pharmacyEmail,
        description: form.description,
        services,
        latitude,
        longitude,
      }),
    });

    if (!pharmacyResult.ok || !pharmacyResult.data) {
      setSaving(false);
      setError(pharmacyResult.error ?? "Échec de mise à jour des données pharmacie.");
      return;
    }

    const userResult = await apiJsonAuth<UserMe>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({ phoneNumber: form.managerPhone }),
    });

    if (!userResult.ok || !userResult.data) {
      setSaving(false);
      setError(userResult.error ?? "Échec de mise à jour du téléphone.");
      return;
    }

    const preferencesResult = await apiJsonAuth<UserMe>("/api/users/me/preferences", {
      method: "PATCH",
      body: JSON.stringify({
        alertsEnabled: form.alertsEnabled,
        channels: buildChannels(form),
      }),
    });

    setSaving(false);

    if (!preferencesResult.ok || !preferencesResult.data) {
      setError(preferencesResult.error ?? "Échec de mise à jour des notifications.");
      return;
    }

    const snapshot = toSnapshot(pharmacyResult.data, preferencesResult.data);
    setForm(snapshot);
    setInitial(snapshot);
    setSuccess("Paramètres enregistrés avec succès.");
  };

  const mapCoordinates = useMemo(() => {
    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }, [form.latitude, form.longitude]);

  const toggleOperationalStatus = async () => {
    setError(null);
    setSuccess(null);
    setUpdatingStatus(true);

    const target = form.operationalStatus === "OUVERT" ? "FERME" : "OUVERT";
    const result = await apiJsonAuth<ManagerPharmacy>("/api/manager/pharmacy/status", {
      method: "PATCH",
      body: JSON.stringify({ status: target }),
    });

    setUpdatingStatus(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de mettre à jour le statut.");
      return;
    }

    const nextStatus = result.data.operationalStatus;
    setField("operationalStatus", nextStatus);
    setInitial((prev) => ({ ...prev, operationalStatus: nextStatus }));
    setSuccess(
      nextStatus === "OUVERT"
        ? "Pharmacie marquée OUVERTE."
        : "Pharmacie marquée FERMÉE."
    );
  };

  const onRequestPasswordReset = async () => {
    if (!managerEmail) {
      setError("Adresse e-mail du gestionnaire introuvable.");
      return;
    }

    setError(null);
    setSuccess(null);
    setPasswordResetLoading(true);

    const result = await apiJson<{ success: boolean; message?: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email: managerEmail }),
      }
    );

    setPasswordResetLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Impossible d'envoyer le lien de réinitialisation.");
      return;
    }

    setSuccess("E-mail de réinitialisation envoyé au gestionnaire.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Paramètres de la pharmacie</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Gérer les informations, le statut et les préférences de notification.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setForm(initial)}
            disabled={loading || saving || !dirty}
            className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            onClick={() => void saveAll()}
            disabled={loading || saving || !dirty}
            className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2FF] text-sm font-semibold text-[#0B63D1]">
                  {form.pharmacyName.slice(0, 3).toUpperCase() || "PH"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{form.pharmacyName || "Pharmacie"}</p>
                  <p className="text-xs text-[#6B7280]">IFU: {form.ifu || "-"}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  form.operationalStatus === "OUVERT"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {form.operationalStatus === "OUVERT" ? "Ouvert" : "Fermé"}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-[#6B7280]">
              Horaires: {storeStatus.scheduleLabel}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label>
                <p className="text-[11px] text-[#6B7280]">Nom de la pharmacie</p>
                <input
                  value={form.pharmacyName}
                  onChange={(event) => setField("pharmacyName", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
                />
              </label>

              <div>
                <p className="text-[11px] text-[#6B7280]">Numéro IFU</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2 text-xs text-[#6B7280]">
                  {form.ifu || "-"}
                </div>
              </div>

              <label>
                <p className="text-[11px] text-[#6B7280]">Email professionnel</p>
                <input
                  value={form.pharmacyEmail}
                  onChange={(event) => setField("pharmacyEmail", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
                />
              </label>

              <label>
                <p className="text-[11px] text-[#6B7280]">Téléphone gestionnaire</p>
                <input
                  value={form.managerPhone}
                  onChange={(event) => setField("managerPhone", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Adresse & localisation</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 space-y-2">
                <p className="text-[11px] text-[#6B7280]">
                  Cliquez sur la carte pour enregistrer la position exacte.
                </p>
                <CoordinatePickerMap
                  value={mapCoordinates}
                  onChange={(coords) => {
                    setField("latitude", coords.lat.toFixed(6));
                    setField("longitude", coords.lng.toFixed(6));
                  }}
                />
              </div>
              <label className="md:col-span-2">
                <p className="text-[11px] text-[#6B7280]">Adresse de la pharmacie</p>
                <input
                  value={form.pharmacyAddress}
                  onChange={(event) => setField("pharmacyAddress", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
                />
              </label>
              <label>
                <p className="text-[11px] text-[#6B7280]">Latitude</p>
                <input
                  value={form.latitude}
                  onChange={(event) => setField("latitude", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
                />
              </label>
              <label>
                <p className="text-[11px] text-[#6B7280]">Longitude</p>
                <input
                  value={form.longitude}
                  onChange={(event) => setField("longitude", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Présentation</h2>
            <div className="mt-4 grid gap-4">
              <label>
                <p className="text-[11px] text-[#6B7280]">Description</p>
                <textarea
                  value={form.description}
                  onChange={(event) => setField("description", event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
                />
              </label>
              <label>
                <p className="text-[11px] text-[#6B7280]">Services (séparés par virgule)</p>
                <input
                  value={form.servicesText}
                  onChange={(event) => setField("servicesText", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <p className="mt-2 text-xs text-[#6B7280]">
              Contrôler les alertes automatiques envoyées par la plateforme.
            </p>
            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs">
                <span className="text-[#1F1D1B]">Alertes activées</span>
                <input
                  type="checkbox"
                  checked={form.alertsEnabled}
                  onChange={(event) => setField("alertsEnabled", event.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs">
                <span className="text-[#1F1D1B]">Notifications dans l&apos;app</span>
                <input
                  type="checkbox"
                  checked={form.channelInApp}
                  onChange={(event) => setField("channelInApp", event.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs">
                <span className="text-[#1F1D1B]">Notifications email</span>
                <input
                  type="checkbox"
                  checked={form.channelEmail}
                  onChange={(event) => setField("channelEmail", event.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs">
                <span className="text-[#1F1D1B]">Notifications push</span>
                <input
                  type="checkbox"
                  checked={form.channelPush}
                  onChange={(event) => setField("channelPush", event.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="text-sm font-semibold">Sécurité du compte</h2>
            <p className="mt-2 text-xs text-[#6B7280]">
              Utilisez la réinitialisation sécurisée par e-mail pour changer le mot de passe.
            </p>
            <p className="mt-3 text-[11px] text-[#6B7280]">
              E-mail du gestionnaire:{" "}
              <span className="font-semibold text-[#1F1D1B]">
                {managerEmail || "Non renseigné"}
              </span>
            </p>
            <button
              type="button"
              onClick={() => void onRequestPasswordReset()}
              disabled={
                loading ||
                saving ||
                updatingStatus ||
                passwordResetLoading ||
                !managerEmail
              }
              className="mt-4 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
            >
              {passwordResetLoading ? "Envoi..." : "Changer le mot de passe"}
            </button>
          </div>

          <div className="rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5 text-xs text-[#B91C1C]">
            <h2 className="text-sm font-semibold text-[#B91C1C]">Zone de danger</h2>
            <p className="mt-2">Basculer rapidement le statut opérationnel de la pharmacie.</p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => void toggleOperationalStatus()}
                disabled={loading || updatingStatus}
                className="rounded-full border border-[#FCA5A5] bg-white px-4 py-2 text-xs font-semibold text-[#B91C1C] disabled:opacity-60"
              >
                {updatingStatus
                  ? "Mise à jour..."
                  : form.operationalStatus === "OUVERT"
                  ? "Passer en FERMÉ"
                  : "Passer en OUVERT"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-[#9CA3AF]">
        © 2026 GoPharma. Espace pharmacie connecté au backend.
      </p>
    </div>
  );
}
