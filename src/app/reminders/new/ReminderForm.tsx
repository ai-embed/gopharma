"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { PatientShell } from "@/components/PatientShell";
import { apiJsonAuth } from "@/lib/api";

type ReminderFrequency = "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM";

type ReminderItem = {
  _id: string;
  medicationName: string;
  note?: string;
  frequency: ReminderFrequency;
  intervalHours: number;
  startDate: string;
  endDate?: string;
  nextRunAt: string;
  isActive: boolean;
};

const frequencyOptions: { label: string; value: ReminderFrequency }[] = [
  { label: "Tous les jours", value: "DAILY" },
  { label: "Toutes les semaines", value: "WEEKLY" },
  { label: "Tous les mois", value: "MONTHLY" },
  { label: "Personnalisé (heures)", value: "CUSTOM" },
];

function fromInputDateTime(value: string) {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReminderForm() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [medicationName, setMedicationName] = useState("");
  const [note, setNote] = useState("");
  const [frequency, setFrequency] = useState<ReminderFrequency>("DAILY");
  const [intervalHours, setIntervalHours] = useState("8");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (saving) return false;
    if (!medicationName.trim()) return false;
    if (frequency === "CUSTOM") {
      const parsed = Number(intervalHours);
      if (!Number.isFinite(parsed) || parsed < 1) return false;
    }
    return true;
  }, [frequency, intervalHours, medicationName, saving]);

  const loadReminders = useCallback(async () => {
    setError(null);
    setLoading(true);
    const result = await apiJsonAuth<ReminderItem[]>("/api/reminders");
    if (!result.ok || !result.data) {
      setReminders([]);
      setError(result.error ?? "Impossible de charger les rappels.");
      setLoading(false);
      return;
    }
    setReminders(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReminders();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadReminders]);

  const resetForm = () => {
    setMedicationName("");
    setNote("");
    setFrequency("DAILY");
    setIntervalHours("8");
    setStartDate("");
    setEndDate("");
  };

  const createReminder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload = {
      medicationName: medicationName.trim(),
      note: note.trim() || undefined,
      frequency,
      intervalHours: frequency === "CUSTOM" ? Number(intervalHours) : undefined,
      startDate: fromInputDateTime(startDate),
      endDate: fromInputDateTime(endDate),
    };

    const result = await apiJsonAuth<ReminderItem>("/api/reminders", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Création du rappel impossible.");
      return;
    }

    resetForm();
    setSuccess("Rappel enregistré.");
    await loadReminders();
  };

  const toggleReminder = async (item: ReminderItem) => {
    setRowBusyId(item._id);
    setError(null);
    setSuccess(null);
    const result = await apiJsonAuth<ReminderItem>(`/api/reminders/${item._id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !item.isActive }),
    });
    setRowBusyId(null);
    if (!result.ok) {
      setError(result.error ?? "Mise à jour impossible.");
      return;
    }
    setSuccess(item.isActive ? "Rappel désactivé." : "Rappel activé.");
    await loadReminders();
  };

  const deleteReminder = async (item: ReminderItem) => {
    const confirmed = window.confirm(
      `Supprimer le rappel "${item.medicationName}" ?`
    );
    if (!confirmed) return;
    setRowBusyId(item._id);
    setError(null);
    setSuccess(null);
    const result = await apiJsonAuth<{ success: boolean }>(`/api/reminders/${item._id}`, {
      method: "DELETE",
    });
    setRowBusyId(null);
    if (!result.ok) {
      setError(result.error ?? "Suppression impossible.");
      return;
    }
    setSuccess("Rappel supprimé.");
    await loadReminders();
  };

  return (
    <PatientShell>
      <div className="space-y-6">
        {error ? <Notice tone="error" message={error} /> : null}
        {success ? <Notice tone="success" message={success} /> : null}

        <form
          onSubmit={createReminder}
          className="rounded-3xl border border-[#E5E7EB] bg-white p-6"
        >
          <div className="space-y-2">
            <h1 className="text-lg font-semibold">Calendrier d&apos;ordonnance</h1>
            <p className="text-sm text-[#6B7280]">
              Créez et gérez vos rappels de prise de médicaments.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold text-[#6B7280]">Médicament</span>
              <input
                value={medicationName}
                onChange={(event) => setMedicationName(event.target.value)}
                placeholder="Ex: Paracétamol 500mg"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold text-[#6B7280]">Fréquence</span>
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value as ReminderFrequency)}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm"
              >
                {frequencyOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold text-[#6B7280]">Intervalle (heures)</span>
              <input
                value={intervalHours}
                onChange={(event) => setIntervalHours(event.target.value)}
                disabled={frequency !== "CUSTOM"}
                placeholder="8"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm disabled:bg-[#F8FAFC]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold text-[#6B7280]">Début</span>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold text-[#6B7280]">Fin (optionnel)</span>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-semibold text-[#6B7280]">Note</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Ex: après le repas"
                className="w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm"
              />
            </label>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-[#0B63D1] px-5 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : "Créer le rappel"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="text-sm font-semibold">Rappels existants</h2>
          {loading ? (
            <p className="mt-3 text-xs text-[#6B7280]">Chargement...</p>
          ) : reminders.length === 0 ? (
            <p className="mt-3 text-xs text-[#6B7280]">Aucun rappel enregistré.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {reminders.map((item) => {
                const busy = rowBusyId === item._id;
                return (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">
                          {item.medicationName}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {item.frequency} • Prochain envoi: {formatDateTime(item.nextRunAt)}
                        </p>
                        {item.note ? (
                          <p className="mt-1 text-xs text-[#6B7280]">{item.note}</p>
                        ) : null}
                        <p className="mt-1 text-[11px] text-[#9CA3AF]">
                          Début: {formatDateTime(item.startDate)} • Fin:{" "}
                          {formatDateTime(item.endDate)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          item.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {item.isActive ? "Actif" : "Inactif"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void toggleReminder(item)}
                        className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2937] disabled:opacity-60"
                      >
                        {item.isActive ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void deleteReminder(item)}
                        className="rounded-full border border-[#FECACA] bg-white px-3 py-1.5 text-xs font-semibold text-[#B91C1C] disabled:opacity-60"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PatientShell>
  );
}
