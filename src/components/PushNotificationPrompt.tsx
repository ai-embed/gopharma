"use client";

import { usePushNotifications } from "@/lib/usePushNotifications";

interface PushNotificationPromptProps {
  userId: string | null;
}

export function PushNotificationPrompt({ userId }: PushNotificationPromptProps) {
  const { permission, isSupported, requestPermission, error } = usePushNotifications(userId);

  if (!isSupported) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          Votre navigateur ne supporte pas les notifications push.
        </p>
      </div>
    );
  }

  if (permission === "granted") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <p className="text-sm font-semibold text-emerald-800">
            Notifications activées
          </p>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Notifications bloquées. Activez-les dans les paramètres de votre navigateur.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-[#EAF2FF] p-2">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-[#0B63D1]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold">Activer les notifications</h3>
          <p className="mt-1 text-xs text-[#6B7280]">
            Recevez des alertes en temps réel : commandes, stock faible, validations...
          </p>
          {error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
          )}
          <button
            onClick={requestPermission}
            className="mt-3 rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
          >
            Autoriser les notifications
          </button>
        </div>
      </div>
    </div>
  );
}
