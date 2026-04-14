"use client";

import { createContext, useContext, useCallback, useState, ReactNode } from "react";
import { useWebSocket } from "./useWebSocket";
import { Notification } from "./schemas";

interface RealTimeNotification extends Notification {
  source: "websocket" | "polling";
  receivedAt: string;
}

interface RealTimeContextValue {
  notifications: RealTimeNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  connectionStatus: "connected" | "disconnected" | "connecting";
  isRealTime: boolean;
}

const RealTimeContext = createContext<RealTimeContextValue | null>(null);

interface RealTimeNotificationsProviderProps {
  children: ReactNode;
  userId: string;
  wsUrl?: string;
  fallbackToPolling?: boolean;
}

export function RealTimeNotificationsProvider({
  children,
  userId,
  wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "wss://ws.gopharma.local",
  fallbackToPolling = true,
}: RealTimeNotificationsProviderProps) {
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [isRealTime, setIsRealTime] = useState(false);

  const handleMessage = useCallback((data: unknown) => {
    const message = data as { type: string; payload: unknown };
    
    if (message.type === "notification") {
      const notification = message.payload as Notification;
      setNotifications((prev) => [
        {
          ...notification,
          source: "websocket",
          receivedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } else if (message.type === "notifications.batch") {
      const batch = (message.payload as Notification[]).map((n) => ({
        ...n,
        source: "websocket" as const,
        receivedAt: new Date().toISOString(),
      }));
      setNotifications((prev) => [...batch, ...prev]);
    }
  }, []);

  const handleOpen = useCallback(() => {
    setIsRealTime(true);
    // Subscribe to user's notifications channel
    ws.send({ type: "subscribe", channel: `user:${userId}:notifications` });
  }, [userId]);

  const handleClose = useCallback(() => {
    setIsRealTime(false);
  }, []);

  const ws = useWebSocket({
    url: `${wsUrl}?userId=${userId}`,
    onMessage: handleMessage,
    onOpen: handleOpen,
    onClose: handleClose,
    autoConnect: true,
    reconnectAttempts: 3,
  });

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    
    // Send read confirmation via WebSocket
    ws.send({ type: "notification.read", notificationId: id });
  }, [ws]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    ws.send({ type: "notifications.readAll" });
  }, [ws]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const connectionStatus = ws.status === "open" ? "connected" : 
                          ws.status === "connecting" ? "connecting" : "disconnected";

  return (
    <RealTimeContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        connectionStatus,
        isRealTime,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
}

export function useRealTimeNotifications(): RealTimeContextValue {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error("useRealTimeNotifications must be used within RealTimeNotificationsProvider");
  }
  return context;
}
