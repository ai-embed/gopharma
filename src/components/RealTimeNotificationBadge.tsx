"use client";

import Link from "next/link";
import { useRealTimeNotifications } from "@/lib/RealTimeNotificationsProvider";

interface RealTimeNotificationBadgeProps {
  href?: string;
  showIndicator?: boolean;
}

export function RealTimeNotificationBadge({
  href = "/notifications",
  showIndicator = true,
}: RealTimeNotificationBadgeProps) {
  const { unreadCount, connectionStatus, isRealTime } = useRealTimeNotifications();

  return (
    <Link
      href={href}
      className="relative flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold transition hover:bg-[#F3F4F6]"
    >
      {/* Connection status indicator */}
      {showIndicator && (
        <span
          className={`h-2 w-2 rounded-full ${
            isRealTime ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
          }`}
          title={isRealTime ? "Temps réel actif" : "Temps réel déconnecté"}
        />
      )}

      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-[#6B7280]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>

      {unreadCount > 0 && (
        <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}

      {/* Connection status text (only when disconnected) */}
      {!isRealTime && connectionStatus === "disconnected" && (
        <span className="text-[10px] text-gray-500">(hors ligne)</span>
      )}
    </Link>
  );
}
