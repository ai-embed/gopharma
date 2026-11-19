"use client";

import { useEffect, useState, useCallback } from "react";
import {
  hasFirebaseMessagingConfig,
  requestFcmToken,
  onForegroundMessage,
  registerToken,
} from "./firebase/config";

interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface UsePushNotificationsReturn {
  permission: NotificationPermission | "unsupported";
  token: string | null;
  isSupported: boolean;
  isConfigured: boolean;
  isRegistered: boolean;
  requestPermission: () => Promise<boolean>;
  lastMessage: PushNotification | null;
  error: string | null;
}

/**
 * Hook pour gérer les push notifications FCM
 * Web + Mobile (iOS/Android via PWA/Capacitor)
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  // Initialisation lazy pour éviter setState dans useEffect
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() => {
    if (typeof window === "undefined") return "default";
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const [token, setToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [lastMessage, setLastMessage] = useState<PushNotification | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = hasFirebaseMessagingConfig();
  const isSupported =
    typeof window !== "undefined" &&
    "Notification" in window &&
    typeof navigator !== "undefined" &&
    "serviceWorker" in navigator;

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
        setError(
          Notification.permission === "denied"
            ? "Permission refusée. Activez les notifications dans les paramètres."
            : "Impossible de récupérer un jeton push. Vérifiez la configuration Firebase et le service worker."
        );
        return false;
      }

      setToken(fcmToken);
      setPermission("granted");

      const registered = await registerToken(fcmToken);
      setIsRegistered(registered);
      if (!registered) {
        setError("Le jeton push n’a pas pu être enregistré sur votre compte.");
      }

      return registered;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    }
  }, [isSupported]);

  return {
    permission,
    token,
    isSupported,
    isConfigured,
    isRegistered,
    requestPermission,
    lastMessage,
    error,
  };
}
