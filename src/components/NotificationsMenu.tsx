"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/lib/useNotifications";

type NotificationsMenuProps = {
  pollIntervalMs?: number;
};

function formatNotificationDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationsMenu({ pollIntervalMs = 15000 }: NotificationsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { notifications, unreadCount, loading, refreshing, markAsRead, markAllAsRead } =
    useNotifications({ pollIntervalMs });

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#1F2937]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            d="M6.5 17.5h11l-1.5-2v-4.5a4.5 4.5 0 1 0-9 0V15.5l-1.5 2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M10 18.5a2 2 0 0 0 4 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#0B63D1]" />
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[320px] rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-[#1F2937]">Notifications</p>
            <button
              type="button"
              onClick={() => void markAllAsRead()}
              className="text-[11px] font-semibold text-[#0B63D1]"
            >
              Tout lire
            </button>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs text-[#6B7280]">
                Chargement...
              </p>
            ) : notifications.length === 0 ? (
              <p className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-xs text-[#6B7280]">
                Aucune notification.
              </p>
            ) : (
              notifications.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => void markAsRead(item._id)}
                  className={`w-full rounded-xl border px-3 py-2 text-left ${
                    item.isRead
                      ? "border-[#E5E7EB] bg-white"
                      : "border-[#C7D8F7] bg-[#F3F8FF]"
                  }`}
                >
                  <p className="text-xs font-semibold text-[#1F2937]">{item.title}</p>
                  <p className="mt-1 text-xs text-[#6B7280]">{item.message}</p>
                  <p className="mt-1 text-[10px] text-[#9CA3AF]">
                    {formatNotificationDate(item.sentAt)}
                  </p>
                </button>
              ))
            )}
          </div>

          {refreshing ? (
            <p className="mt-2 text-[10px] text-[#9CA3AF]">Actualisation...</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
