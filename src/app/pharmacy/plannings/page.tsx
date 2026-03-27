"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type WeeklySlot = {
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  onDuty: boolean;
};

type ExceptionSlot = {
  startDate: string;
  endDate: string;
  isClosed: boolean;
  onDuty: boolean;
  openTime?: string;
  closeTime?: string;
  label?: string;
};

type ManagerSchedule = {
  weekly: WeeklySlot[];
  exceptions: ExceptionSlot[];
};

const dayLabels = [
  { key: 1, label: "Lundi" },
  { key: 2, label: "Mardi" },
  { key: 3, label: "Mercredi" },
  { key: 4, label: "Jeudi" },
  { key: 5, label: "Vendredi" },
  { key: 6, label: "Samedi" },
  { key: 0, label: "Dimanche" },
];

function buildDefaultWeekly(): WeeklySlot[] {
  return dayLabels.map((day) => ({
    dayOfWeek: day.key,
    openTime: "08:00",
    closeTime: "19:00",
    isClosed: day.key === 0,
    onDuty: false,
  }));
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeWeekly(input: WeeklySlot[]): WeeklySlot[] {
  const map = new Map(input.map((slot) => [slot.dayOfWeek, slot]));
  return dayLabels.map((day) => {
    const existing = map.get(day.key);
    if (!existing) {
      return {
        dayOfWeek: day.key,
        openTime: "08:00",
        closeTime: "19:00",
        isClosed: day.key === 0,
        onDuty: false,
      };
    }
    return {
      dayOfWeek: day.key,
      openTime: existing.openTime ?? "08:00",
      closeTime: existing.closeTime ?? "19:00",
      isClosed: Boolean(existing.isClosed),
      onDuty: Boolean(existing.onDuty),
    };
  });
}

export default function PharmacyPlanningsPage() {
  const [weekly, setWeekly] = useState<WeeklySlot[]>(buildDefaultWeekly());
  const [exceptions, setExceptions] = useState<ExceptionSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingWeekly, setSavingWeekly] = useState(false);
  const [addingException, setAddingException] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [exceptionLabel, setExceptionLabel] = useState("");
  const [exceptionStartDate, setExceptionStartDate] = useState(todayIsoDate());
  const [exceptionEndDate, setExceptionEndDate] = useState(todayIsoDate());
  const [exceptionIsClosed, setExceptionIsClosed] = useState(true);
  const [exceptionOnDuty, setExceptionOnDuty] = useState(false);
  const [exceptionOpenTime, setExceptionOpenTime] = useState("08:00");
  const [exceptionCloseTime, setExceptionCloseTime] = useState("14:00");

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<ManagerSchedule>("/api/manager/schedules");
    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de charger les horaires.");
      setWeekly(buildDefaultWeekly());
      setExceptions([]);
      setLoading(false);
      return;
    }

    setWeekly(normalizeWeekly(result.data.weekly ?? []));
    setExceptions(result.data.exceptions ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSchedule();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadSchedule]);

  const rows = useMemo(
    () =>
      dayLabels.map((day) => ({
        ...day,
        slot:
          weekly.find((item) => item.dayOfWeek === day.key) ?? {
            dayOfWeek: day.key,
            openTime: "08:00",
            closeTime: "19:00",
            isClosed: false,
            onDuty: false,
          },
      })),
    [weekly]
  );

  const updateSlot = (dayOfWeek: number, patch: Partial<WeeklySlot>) => {
    setWeekly((prev) =>
      prev.map((slot) =>
        slot.dayOfWeek === dayOfWeek
          ? {
              ...slot,
              ...patch,
            }
          : slot
      )
    );
  };

  const saveWeekly = async () => {
    setError(null);
    setSuccess(null);
    setSavingWeekly(true);

    const payload = weekly.map((slot) => ({
      dayOfWeek: slot.dayOfWeek,
      isClosed: slot.isClosed,
      onDuty: slot.onDuty,
      openTime: slot.isClosed ? undefined : slot.openTime,
      closeTime: slot.isClosed ? undefined : slot.closeTime,
    }));

    const result = await apiJsonAuth<ManagerSchedule>("/api/manager/schedules/weekly", {
      method: "PUT",
      body: JSON.stringify({ weekly: payload }),
    });

    setSavingWeekly(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Enregistrement des horaires impossible.");
      return;
    }

    setWeekly(normalizeWeekly(result.data.weekly ?? []));
    setSuccess("Horaires hebdomadaires enregistrés.");
  };

  const addException = async () => {
    setError(null);
    setSuccess(null);

    if (!exceptionStartDate || !exceptionEndDate) {
      setError("Renseignez les dates de l'exception.");
      return;
    }

    if (exceptionEndDate < exceptionStartDate) {
      setError("La date de fin doit être supérieure ou égale à la date de début.");
      return;
    }

    if (!exceptionIsClosed && exceptionCloseTime <= exceptionOpenTime) {
      setError("L'heure de fermeture doit être après l'heure d'ouverture.");
      return;
    }

    setAddingException(true);
    const result = await apiJsonAuth<ManagerSchedule>("/api/manager/schedules/exceptions", {
      method: "POST",
      body: JSON.stringify({
        startDate: exceptionStartDate,
        endDate: exceptionEndDate,
        isClosed: exceptionIsClosed,
        onDuty: exceptionOnDuty,
        openTime: exceptionIsClosed ? undefined : exceptionOpenTime,
        closeTime: exceptionIsClosed ? undefined : exceptionCloseTime,
        label: exceptionLabel || undefined,
      }),
    });
    setAddingException(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Ajout de l'exception impossible.");
      return;
    }

    setExceptions(result.data.exceptions ?? []);
    setExceptionLabel("");
    setExceptionStartDate(todayIsoDate());
    setExceptionEndDate(todayIsoDate());
    setExceptionIsClosed(true);
    setExceptionOnDuty(false);
    setSuccess("Exception ajoutée.");
  };

  const removeException = async (index: number) => {
    setError(null);
    setSuccess(null);
    const result = await apiJsonAuth<{ success: boolean }>(
      `/api/manager/schedules/exceptions/${index}`,
      { method: "DELETE" }
    );
    if (!result.ok) {
      setError(result.error ?? "Suppression impossible.");
      return;
    }
    setExceptions((prev) => prev.filter((_, idx) => idx !== index));
    setSuccess("Exception supprimée.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Configuration des horaires</h1>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Heures d&apos;ouverture hebdomadaires</h2>
          <button
            type="button"
            disabled={savingWeekly || loading}
            onClick={() => void saveWeekly()}
            className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {savingWeekly ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-xs">
              <thead className="bg-[#F8FAFC] text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 text-left">Jour</th>
                  <th className="px-4 py-3 text-left">Ouvert</th>
                  <th className="px-4 py-3 text-left">Garde</th>
                  <th className="px-4 py-3 text-left">Ouverture</th>
                  <th className="px-4 py-3 text-left">Fermeture</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-[#6B7280]" colSpan={5}>
                      Chargement...
                    </td>
                  </tr>
                ) : (
                  rows.map(({ key, label, slot }) => (
                    <tr key={key} className="border-t border-[#E5E7EB]">
                      <td className="px-4 py-3 font-semibold">{label}</td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={!slot.isClosed}
                          onChange={(event) =>
                            updateSlot(key, { isClosed: !event.target.checked })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={slot.onDuty}
                          onChange={(event) =>
                            updateSlot(key, { onDuty: event.target.checked })
                          }
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          disabled={slot.isClosed}
                          value={slot.openTime ?? "08:00"}
                          onChange={(event) =>
                            updateSlot(key, { openTime: event.target.value })
                          }
                          className="rounded-lg border border-[#E5E7EB] px-3 py-1.5"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          disabled={slot.isClosed}
                          value={slot.closeTime ?? "19:00"}
                          onChange={(event) =>
                            updateSlot(key, { closeTime: event.target.value })
                          }
                          className="rounded-lg border border-[#E5E7EB] px-3 py-1.5"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
        <h2 className="text-sm font-semibold">Exceptions & jours spéciaux</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={exceptionLabel}
            onChange={(event) => setExceptionLabel(event.target.value)}
            placeholder="Libellé (ex: Jour férié)"
            className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs"
          />
          <label className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs">
            <input
              type="checkbox"
              checked={exceptionIsClosed}
              onChange={(event) => setExceptionIsClosed(event.target.checked)}
            />
            Fermé toute la journée
          </label>
          <label className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs">
            Début
            <input
              type="date"
              value={exceptionStartDate}
              onChange={(event) => setExceptionStartDate(event.target.value)}
              max={exceptionEndDate || undefined}
              className="mt-1 w-full"
            />
          </label>
          <label className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs">
            Fin
            <input
              type="date"
              value={exceptionEndDate}
              onChange={(event) => setExceptionEndDate(event.target.value)}
              min={exceptionStartDate || undefined}
              className="mt-1 w-full"
            />
          </label>
          {!exceptionIsClosed ? (
            <>
              <label className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs">
                Ouverture
                <input
                  type="time"
                  value={exceptionOpenTime}
                  onChange={(event) => setExceptionOpenTime(event.target.value)}
                  className="mt-1 w-full"
                />
              </label>
              <label className="rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs">
                Fermeture
                <input
                  type="time"
                  value={exceptionCloseTime}
                  onChange={(event) => setExceptionCloseTime(event.target.value)}
                  className="mt-1 w-full"
                />
              </label>
            </>
          ) : null}
          <label className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2 text-xs">
            <input
              type="checkbox"
              checked={exceptionOnDuty}
              onChange={(event) => setExceptionOnDuty(event.target.checked)}
            />
            Pharmacie de garde
          </label>
        </div>

        <button
          type="button"
          disabled={
            addingException ||
            !exceptionStartDate ||
            !exceptionEndDate ||
            exceptionEndDate < exceptionStartDate
          }
          onClick={() => void addException()}
          className="mt-4 rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {addingException ? "Ajout..." : "Ajouter une exception"}
        </button>

        <div className="mt-4 space-y-2">
          {exceptions.length === 0 ? (
            <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs text-[#6B7280]">
              Aucune exception enregistrée.
            </p>
          ) : (
            exceptions.map((item, index) => (
              <div
                key={`${item.startDate}-${item.endDate}-${index}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#1F1D1B]">
                    {item.label || "Exception"}
                  </p>
                  <p className="text-[#6B7280]">
                    {item.startDate.slice(0, 10)} → {item.endDate.slice(0, 10)}
                  </p>
                  <p className="text-[#6B7280]">
                    {item.isClosed
                      ? "Fermé"
                      : `${item.openTime ?? "--:--"} - ${item.closeTime ?? "--:--"}`}
                    {item.onDuty ? " · Garde" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void removeException(index)}
                  className="rounded-full border border-[#FECACA] px-3 py-1 text-[11px] font-semibold text-[#B91C1C]"
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
