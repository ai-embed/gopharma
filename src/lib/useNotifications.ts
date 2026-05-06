"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiJsonAuth } from "@/lib/api";

export type AppNotification = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
  type: string;
};

type UseNotificationsOptions = {
  enabled?: boolean;
  pollIntervalMs?: number;
};

export function useNotifications(options?: UseNotificationsOptions) {
  const enabled = options?.enabled ?? true;
  const pollIntervalMs = options?.pollIntervalMs ?? 15000;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(
    async (showLoader = false) => {
      if (!enabled) {
        setNotifications([]);
        setLoading(false);
        setRefreshing(false);
        setError(null);
        return;
      }

      setError(null);
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const result = await apiJsonAuth<AppNotification[]>("/api/notifications");
      if (!result.ok || !result.data) {
        setNotifications([]);
        setError(result.error ?? "Impossible de charger les notifications.");
      } else {
        setNotifications(result.data);
      }

      setLoading(false);
      setRefreshing(false);
    },
    [enabled]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      const result = await apiJsonAuth<{ success: boolean }>(
        `/api/notifications/${notificationId}/read`,
        { method: "PATCH" }
      );
      if (!result.ok) {
        return false;
      }
      setNotifications((current) =>
        current.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item
        )
      );
      return true;
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((item) => !item.isRead);
    if (unread.length === 0) return true;
    const results = await Promise.all(unread.map((item) => markAsRead(item._id)));
    return results.every(Boolean);
  }, [markAsRead, notifications]);

  useEffect(() => {
    const bootstrapTimer = window.setTimeout(() => {
      void refresh(true);
    }, 0);
    const pollTimer = window.setInterval(() => {
      void refresh();
    }, pollIntervalMs);

    return () => {
      window.clearTimeout(bootstrapTimer);
      window.clearInterval(pollTimer);
    };
  }, [pollIntervalMs, refresh]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  return {
    notifications,
    unreadCount,
    loading,
    refreshing,
    error,
    refresh,
    markAsRead,
    markAllAsRead,
  };
}
