/**
 * Firebase Cloud Messaging - Service Worker
 * Gère les notifications quand l'app est fermée (background)
 * 
 * PRÉREQUIS: Remplacer YOUR_* par les valeurs de votre projet Firebase
 */

importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// ⚠️ CONFIGURATION - Remplacer par vos valeurs Firebase
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
});

const messaging = firebase.messaging();

/**
 * Message reçu en background
 */
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);

  const title = payload.notification?.title || "GoPharma";
  const options = {
    body: payload.notification?.body || "Nouvelle notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    tag: payload.data?.type || "default",
    requireInteraction: true,
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});

/**
 * Clic sur notification
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let url = "/dashboard";

  // Redirection selon le type
  if (data.type === "ORDER_STATUS") url = "/history";
  if (data.type === "STOCK_ALERT") url = "/pharmacy/inventory";
  if (data.type === "VALIDATION_STATUS") url = "/pharmacy/dashboard";

  if (event.action === "dismiss") return;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));
