/**
 * Firebase Cloud Messaging (FCM) Configuration
 * Push notifications pour Web, iOS et Android
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, Messaging, onMessage } from "firebase/messaging";

// Firebase config - REMPLACER PAR VOS VALEURS après création projet
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

/**
 * Initialise Firebase (client-side only)
 */
export function initFirebase(): { app: FirebaseApp; messaging: Messaging } | null {
  if (typeof window === "undefined") return null;

  if (!firebaseConfig.apiKey) {
    console.warn("[FCM] Configuration Firebase manquante. Créez un projet Firebase d'abord.");
    return null;
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } else {
    app = getApps()[0];
    messaging = getMessaging(app);
  }

  return { app, messaging };
}

/**
 * Demande permission et récupère le FCM token
 */
export async function requestFcmToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    if (!("Notification" in window)) {
      console.warn("[FCM] Navigateur non supporté");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[FCM] Permission refusée");
      return null;
    }

    const fb = initFirebase();
    if (!fb) return null;

    const token = await getToken(fb.messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log("[FCM] Token:", token.substring(0, 20) + "...");
      return token;
    }
    return null;
  } catch (err) {
    console.error("[FCM] Erreur:", err);
    return null;
  }
}

/**
 * Écoute les messages foreground
 */
export function onForegroundMessage(
  callback: (payload: { title: string; body: string; data?: Record<string, string> }) => void
): () => void {
  const fb = initFirebase();
  if (!fb) return () => {};

  return onMessage(fb.messaging, (payload) => {
    callback({
      title: payload.notification?.title ?? "GoPharma",
      body: payload.notification?.body ?? "",
      data: payload.data as Record<string, string>,
    });
  });
}

/**
 * Enregistre le token sur le backend
 */
export async function registerToken(token: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/notifications/register-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId, platform: "web" }),
    });
    return res.ok;
  } catch (err) {
    console.error("[FCM] Erreur register:", err);
    return false;
  }
}

export { getToken, getMessaging };
