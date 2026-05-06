"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJsonAuth } from "@/lib/api";

type WeeklySlot = {
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
};

type ExceptionSlot = {
  startDate: string;
  endDate: string;
  isClosed: boolean;
  openTime?: string;
  closeTime?: string;
};

type ManagerSchedule = {
  weekly: WeeklySlot[];
  exceptions: ExceptionSlot[];
};

type ManagerPharmacy = {
  operationalStatus: "OUVERT" | "FERME";
};

function toMinutes(time?: string) {
  if (!time || !time.includes(":")) return null;
  const [h, m] = time.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function formatHour(time?: string) {
  if (!time) return "";
  const [h, m] = time.split(":");
  if (!h) return "";
  if (!m || m === "00") return `${h}h`;
  return `${h}h${m}`;
}

function isDateInRange(dateIso: string, startIso: string, endIso: string) {
  return dateIso >= startIso.slice(0, 10) && dateIso <= endIso.slice(0, 10);
}

export function usePharmacyStoreStatus() {
  const [operationalStatus, setOperationalStatus] = useState<"OUVERT" | "FERME">("FERME");
  const [schedule, setSchedule] = useState<ManagerSchedule>({ weekly: [], exceptions: [] });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const [pharmacyResult, scheduleResult] = await Promise.all([
        apiJsonAuth<ManagerPharmacy>("/api/manager/pharmacy"),
        apiJsonAuth<ManagerSchedule>("/api/manager/schedules"),
      ]);

      if (!mounted) return;

      if (pharmacyResult.ok && pharmacyResult.data) {
        setOperationalStatus(pharmacyResult.data.operationalStatus);
      }
      if (scheduleResult.ok && scheduleResult.data) {
        setSchedule(scheduleResult.data);
      }
    };

    void load();
    const timer = window.setInterval(() => {
      void load();
    }, 60000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return useMemo(() => {
    const isOpen = operationalStatus === "OUVERT";

    if (!isOpen) {
      return {
        isOpen: false,
        leftLabel: "Fermé",
        rightLabel: "Mode manuel",
        scheduleLabel: "Pharmacie fermée manuellement",
        operationalStatus,
      };
    }

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const todayIso = now.toISOString().slice(0, 10);
    const todayDay = now.getDay();

    const exception = (schedule.exceptions ?? []).find((item) =>
      isDateInRange(todayIso, item.startDate, item.endDate)
    );

    const source: WeeklySlot = exception
      ? {
          dayOfWeek: todayDay,
          isClosed: exception.isClosed,
          openTime: exception.openTime,
          closeTime: exception.closeTime,
        }
      : (schedule.weekly ?? []).find((item) => item.dayOfWeek === todayDay) ?? {
          dayOfWeek: todayDay,
          isClosed: true,
        };

    if (source.isClosed) {
      return {
        isOpen: true,
        leftLabel: "Ouvert",
        rightLabel: "Fermé aujourd'hui",
        scheduleLabel: "Fermé aujourd'hui (horaire)",
        operationalStatus,
      };
    }

    const openMinutes = toMinutes(source.openTime);
    const closeMinutes = toMinutes(source.closeTime);
    if (openMinutes === null || closeMinutes === null) {
      return {
        isOpen: true,
        leftLabel: "Ouvert",
        rightLabel: "Horaires non définis",
        scheduleLabel: "Horaires non définis",
        operationalStatus,
      };
    }

    if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
      const label = `Ferme à ${formatHour(source.closeTime)}`;
      return {
        isOpen: true,
        leftLabel: "Ouvert",
        rightLabel: label,
        scheduleLabel: label,
        operationalStatus,
      };
    }

    const label = `Ouvre à ${formatHour(source.openTime)}`;
    return {
      isOpen: true,
      leftLabel: "Ouvert",
      rightLabel: label,
      scheduleLabel: label,
      operationalStatus,
    };
  }, [operationalStatus, schedule]);
}
