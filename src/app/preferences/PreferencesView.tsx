"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice } from "@/components/Notice";
import ProfileShell from "@/components/ProfileShell";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { clearLocationAccessState } from "@/lib/location-preferences";
import { useUser } from "@/lib/useUser";

type UpdatePreferencesResponse = {
  preferences?: {
    language: string;
    timezone: string;
    channels: string[];
    alertsEnabled: boolean;
  };
};

const CHANNELS = [
  {
    key: "IN_APP",
    title: "Notifications dans l’application",
    desc: "Recevoir vos alertes directement dans GoPharma.",
  },
  {
    key: "EMAIL",
    title: "Notifications par e-mail",
    desc: "Recevoir les mises à jour importantes dans votre boîte mail.",
  },
  {
    key: "PUSH",
    title: "Notifications push",
    desc: "Recevoir des rappels instantanés sur votre appareil.",
  },
] as const;

export default function PreferencesView() {
  const { user, loading: userLoading, error: userError } = useUser();

  return (
    <ProfileShell activeTab="preferences">
      {userError ? <Notice tone="error" message={userError} /> : null}
      <PreferencesForm
        key={user?._id ?? "guest"}
        email={user?.email ?? ""}
        initialLanguage={user?.preferences?.language ?? "fr"}
        initialTimezone={user?.preferences?.timezone ?? "Africa/Porto-Novo"}
        initialChannels={user?.preferences?.channels ?? ["IN_APP", "EMAIL"]}
        initialAlertsEnabled={user?.preferences?.alertsEnabled ?? true}
        userLoading={userLoading}
      />
    </ProfileShell>
  );
}

function PreferencesForm({
  email,
  initialLanguage,
  initialTimezone,
  initialChannels,
  initialAlertsEnabled,
  userLoading,
}: {
  email: string;
  initialLanguage: string;
  initialTimezone: string;
  initialChannels: string[];
  initialAlertsEnabled: boolean;
  userLoading: boolean;
}) {
  const [language, setLanguage] = useState(initialLanguage);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [channels, setChannels] = useState<string[]>(initialChannels);
  const [alertsEnabled, setAlertsEnabled] = useState(initialAlertsEnabled);
  const [saving, setSaving] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleChannel = (channel: string) => {
    setChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel]
    );
  };

  const onSave = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);

    const result = await apiJsonAuth<UpdatePreferencesResponse>(
      "/api/users/me/preferences",
      {
        method: "PATCH",
        body: JSON.stringify({
          language,
          timezone,
          channels,
          alertsEnabled,
        }),
      }
    );

    setSaving(false);

    if (!result.ok) {
      setError(result.error ?? "La mise à jour des préférences a échoué.");
      return;
    }

    setSuccess("Préférences mises à jour avec succès.");
  };

  const onRequestPasswordReset = async () => {
    if (!email) {
      setError("Adresse e-mail introuvable pour ce compte.");
      return;
    }

    setError(null);
    setSuccess(null);
    setPasswordResetLoading(true);

    const result = await apiJson<{ success: boolean; message?: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );

    setPasswordResetLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Impossible d'envoyer le lien de réinitialisation.");
      return;
    }

    setSuccess("E-mail de réinitialisation envoyé. Vérifiez votre boîte mail.");
  };

  const onResetLocationPreference = () => {
    setError(null);
    clearLocationAccessState();
    setSuccess(
      "Préférence de localisation réinitialisée. Retournez à l'accueil pour choisir de nouveau."
    );
  };

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
        <h2 className="text-sm font-semibold">Calendrier d&apos;ordonnance</h2>
        <p className="text-xs text-[#6B7280]">
          Accès rapide à votre planification.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#F3F6F9] px-4 py-3 text-xs">
          <span>Gérer votre calendrier</span>
          <Link
            href="/reminders/new"
            className="rounded-full bg-[#0B63D1] px-3 py-2 text-[11px] font-semibold text-white"
          >
            Gérer mon calendrier d&apos;ordonnance
          </Link>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-[#E5E7EB] p-5">
        <div>
          <h2 className="text-sm font-semibold">Paramètres de notification</h2>
          <p className="text-xs text-[#6B7280]">
            Choisissez les canaux utilisés par GoPharma pour vous prévenir.
          </p>
        </div>

        <div className="flex items-center justify-between gap-6 rounded-2xl border border-[#E5E7EB] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-[#1F1D1B]">
              Alertes activées
            </p>
            <p className="text-xs text-[#6B7280]">
              Coupe ou réactive rapidement toutes les alertes du compte.
            </p>
          </div>
          <label className="relative inline-flex h-6 w-11 items-center">
            <input
              type="checkbox"
              checked={alertsEnabled}
              onChange={(event) => setAlertsEnabled(event.target.checked)}
              className="peer sr-only"
              disabled={userLoading || saving}
            />
            <span className="absolute inset-0 rounded-full bg-[#E5E7EB] peer-checked:bg-[#0B63D1]" />
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
          </label>
        </div>

        <div className="space-y-3 text-xs text-[#6B7280]">
          {CHANNELS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-6 rounded-2xl border border-[#E5E7EB] px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-[#1F1D1B]">
                  {item.title}
                </p>
                <p className="text-xs text-[#6B7280]">{item.desc}</p>
              </div>
              <label className="relative inline-flex h-6 w-11 items-center">
                <input
                  type="checkbox"
                  checked={channels.includes(item.key)}
                  onChange={() => toggleChannel(item.key)}
                  className="peer sr-only"
                  disabled={userLoading || saving || !alertsEnabled}
                />
                <span className="absolute inset-0 rounded-full bg-[#E5E7EB] peer-checked:bg-[#0B63D1]" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
        <h2 className="text-sm font-semibold">Langue &amp; région</h2>
        <p className="text-xs text-[#6B7280]">
          Ces informations sont enregistrées dans votre profil utilisateur.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 text-xs text-[#6B7280]">
            <label htmlFor="language" className="text-[11px] font-semibold">
              Langue
            </label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              disabled={userLoading || saving}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="space-y-2 text-xs text-[#6B7280]">
            <label htmlFor="timezone" className="text-[11px] font-semibold">
              Fuseau horaire
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
              disabled={userLoading || saving}
            >
              <option value="Africa/Porto-Novo">Africa/Porto-Novo</option>
              <option value="Europe/Paris">Europe/Paris</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
        <h2 className="text-sm font-semibold">Sécurité du compte</h2>
        <p className="text-xs text-[#6B7280]">
          Utilisez le flux sécurisé de réinitialisation mot de passe par e-mail.
        </p>
        <button
          type="button"
          onClick={onRequestPasswordReset}
          disabled={userLoading || saving || passwordResetLoading}
          className="rounded-full border border-[#E5E7EB] px-4 py-2 text-[11px] font-semibold text-[#1F1D1B] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {passwordResetLoading ? "Envoi..." : "Changer le mot de passe"}
        </button>
      </section>

      <section className="space-y-3 rounded-2xl border border-[#E5E7EB] p-5">
        <h2 className="text-sm font-semibold">Localisation</h2>
        <p className="text-xs text-[#6B7280]">
          Réinitialisez votre choix “Cette fois / Toujours” pour afficher à nouveau
          la demande de localisation.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onResetLocationPreference}
            className="rounded-full border border-[#E5E7EB] px-4 py-2 text-[11px] font-semibold text-[#1F1D1B]"
          >
            Réinitialiser la préférence de localisation
          </button>
          <Link
            href="/"
            className="text-[11px] font-semibold text-[#0B63D1] underline"
          >
            Aller à l&apos;accueil
          </Link>
        </div>
      </section>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={userLoading || saving}
          className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Enregistrement..." : "Enregistrer les préférences"}
        </button>
      </div>

      <section className="space-y-3 rounded-2xl border border-[#FDE2E2] bg-[#FFF5F5] p-5">
        <h2 className="text-sm font-semibold text-[#B91C1C]">Zone de danger</h2>
        <p className="text-xs text-[#B91C1C]">
          Supprimer définitivement votre compte GoPharma.
        </p>
        <Link
          href="/account/delete"
          className="inline-flex rounded-full bg-[#EF4444] px-4 py-2 text-[11px] font-semibold text-white"
        >
          Supprimer mon compte
        </Link>
      </section>
    </div>
  );
}
