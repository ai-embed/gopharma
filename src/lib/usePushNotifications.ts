"use client";

import { useEffect, useState, useCallback } from "react";
import { requestFcmToken, onForegroundMessage, registerToken } from "./firebase/config";

interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface UsePushNotificationsReturn {
  permission: NotificationPermission | "unsupported";
  token: string | null;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  lastMessage: PushNotification | null;
  error: string | null;
}

/**
 * Hook pour gérer les push notifications FCM
 * Web + Mobile (iOS/Android via PWA/Capacitor)
 */
export function usePushNotifications(userId: string | null): UsePushNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [token, setToken] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<PushNotification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isSupported = typeof window !== "undefined" && "Notification" in window;

  // Check initial permission
  useEffect(() => {
    if (!isSupported) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, [isSupported]);

  // Listen for foreground messages
  useEffect(() => {
    if (!isSupported || permission !== "granted") return;

    const unsubscribe = onForegroundMessage((payload) => {
      setLastMessage(payload);
      
      // Affiche aussi une notification locale si app ouverte
      if ("Notification" in window) {
        new Notification(payload.title, {
          body: payload.body,
          icon: "/icons/icon-192x192.png",
        });
      }
    });

    return () => unsubscribe();
  }, [isSupported, permission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError("Notifications non supportées");
      return false;
    }

    setError(null);

    try {
      const fcmToken = await requestFcmToken();
      
      if (!fcmToken) {
        setPermission(Notification.permission);
        if (Notification.permission === "denied") {
          setError("Permission refusée. Activez les notifications dans les paramètres.");
        }
        return false;
      }

      setToken(fcmToken);
      setPermission("granted");

      // Enregistre sur le backend
      if (userId) {
        await registerToken(fcmToken, userId);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    }
  }, [isSupported, userId]);

  return {
    permission,
    token,
    isSupported,
    requestPermission,
    lastMessage,
    error,
  };
}
