"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

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

type ToggleOption = {
  label: string;
  enabled: boolean;
};

const notificationDefaults: ToggleOption[] = [
  { label: "Alertes critiques système", enabled: true },
  { label: "Nouvelles inscriptions", enabled: true },
  { label: "Rapports hebdomadaires", enabled: false },
];

const securityDefaults: ToggleOption[] = [
  { label: "Forcer le 2FA admin", enabled: true },
  { label: "Session expirée après 30 jours", enabled: true },
  { label: "Blocage après 5 tentatives", enabled: false },
];

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

function statusLabel(status: IntegrationStatus["status"]) {
  if (status === "OK") return "Connecté";
  if (status === "ERROR") return "Erreur";
  return "Non configuré";
}

function statusTone(status: IntegrationStatus["status"]) {
  if (status === "OK") return "bg-emerald-100 text-emerald-700";
  if (status === "ERROR") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function toggleAt(items: ToggleOption[], index: number) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, enabled: !item.enabled } : item
  );
}

export default function AdminSettingsPage() {
  const [integrations, setIntegrations] = useState<IntegrationStatusMap | null>(null);
  const [notificationOptions, setNotificationOptions] =
    useState<ToggleOption[]>(notificationDefaults);
  const [securityOptions, setSecurityOptions] =
    useState<ToggleOption[]>(securityDefaults);
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const loadStatus = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    const result = await apiJsonAuth<IntegrationStatusMap>("/api/admin/integrations/status");

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de charger les paramètres administrateur.");
      if (mode === "initial") {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
      return;
    }

    setIntegrations(result.data);

    if (mode === "initial") {
      setLoading(false);
    } else {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStatus("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadStatus]);

  const validateIntegrations = async () => {
    setValidating(true);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<IntegrationStatusMap>("/api/admin/integrations/validate", {
      method: "POST",
    });

    setValidating(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de valider les intégrations.");
      return;
    }

    setIntegrations(result.data);
    setSuccess("Validation des intégrations terminée.");
  };

  const sendSmtpTestEmail = async () => {
    if (!testEmail.trim()) {
      setError("Renseignez un e-mail avant d'envoyer le test SMTP.");
      return;
    }

    setSendingTest(true);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<{ success: boolean }>("/api/admin/integrations/smtp/test-email", {
      method: "POST",
      body: JSON.stringify({ to: testEmail.trim() }),
    });

    setSendingTest(false);

    if (!result.ok) {
      setError(result.error ?? "Échec de l'envoi de l'e-mail de test SMTP.");
      return;
    }

    setSuccess(`E-mail de test SMTP envoyé à ${testEmail.trim()}.`);
  };

  const integrationRows = useMemo(
    () =>
      integrations
        ? [
            { name: "SMTP", value: integrations.smtp },
            { name: "Google Maps", value: integrations.googleMaps },
          ]
        : [],
    [integrations]
  );

  if (loading && !integrations) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 text-sm text-[#6B7280]">
        Chargement des paramètres administrateur...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Paramètres admin</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Gérez les préférences globales, la sécurité et les intégrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void loadStatus("refresh")}
            disabled={refreshing}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
          >
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
          <button
            type="button"
            onClick={validateIntegrations}
            disabled={validating}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M6 12.5l3.5 3.5L18 8.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {validating ? "Validation..." : "Valider les intégrations"}
          </button>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M7 4h10a2 2 0 0 1 2 2v10.5a3.5 3.5 0 0 1-3.5 3.5H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.5 9.5h7M8.5 13h5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Informations générales</h2>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] text-[#6B7280]">Nom de la plateforme</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  GoPharma
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Fuseau horaire</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  Africa/Porto-Novo
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Langue par défaut</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  Français
                </div>
              </div>
              <div>
                <p className="text-[11px] text-[#6B7280]">Support e-mail</p>
                <div className="mt-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs">
                  support@gopharma.app
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M6 12h12M12 6v12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Intégrations</h2>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {integrationRows.map((row) => (
                <div
                  key={row.name}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{row.name}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusTone(row.value.status)}`}
                    >
                      {statusLabel(row.value.status)}
                    </span>
                  </div>
                  <p className="mt-1 text-[#6B7280]">{row.value.details}</p>
                  <p className="mt-2 text-[10px] text-[#9CA3AF]">
                    Vérifié le {formatDateTime(row.value.checkedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M9 9h6M9 13h6M9 17h4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Test SMTP</h2>
            </div>
            <p className="mt-2 text-xs text-[#6B7280]">
              Envoyez un e-mail test pour vérifier immédiatement la configuration SMTP.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                value={testEmail}
                onChange={(event) => setTestEmail(event.target.value)}
                placeholder="admin@gopharma.app"
                className="w-full max-w-sm rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs"
              />
              <button
                type="button"
                onClick={sendSmtpTestEmail}
                disabled={sendingTest}
                className="rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {sendingTest ? "Envoi..." : "Envoyer un e-mail test"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12 4a5 5 0 0 1 5 5v2.2l1.2 2.4c.4.8-.1 1.4-1 1.4H6.8c-.9 0-1.4-.6-1-1.4L7 11.2V9a5 5 0 0 1 5-5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.5 19a2.5 2.5 0 0 0 5 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Notifications</h2>
            </div>
            <p className="mt-2 text-xs text-[#6B7280]">
              Contrôlez les alertes envoyées aux administrateurs.
            </p>
            <div className="mt-4 space-y-3">
              {notificationOptions.map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs"
                >
                  <span>{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setNotificationOptions((previous) => toggleAt(previous, index))}
                    aria-pressed={item.enabled}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full px-0.5 transition ${
                      item.enabled ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold transition ${
                        item.enabled
                          ? "translate-x-5 text-[#0B63D1]"
                          : "translate-x-0 text-[#9CA3AF]"
                      }`}
                    >
                      {item.enabled ? "✓" : ""}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12 4l7 3v5c0 4.5-3 7.5-7 8-4-0.5-7-3.5-7-8V7l7-3z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 9v4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="16.5" r="1" fill="currentColor" />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Sécurité</h2>
            </div>
            <div className="mt-4 space-y-3">
              {securityOptions.map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] px-3 py-2 text-xs"
                >
                  <span>{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setSecurityOptions((previous) => toggleAt(previous, index))}
                    aria-pressed={item.enabled}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full px-0.5 transition ${
                      item.enabled ? "bg-[#0B63D1]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-semibold transition ${
                        item.enabled
                          ? "translate-x-5 text-[#0B63D1]"
                          : "translate-x-0 text-[#9CA3AF]"
                      }`}
                    >
                      {item.enabled ? "✓" : ""}
                    </span>
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-[#9CA3AF]">
              Ces interrupteurs sont actuellement locaux à l&apos;interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
