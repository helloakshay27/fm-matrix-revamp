import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

export interface Notification {
  id: number;
  title: string;
  message: string;
  type?: string;
  ntype?: string;
  time?: string;
  read: boolean;
  payload?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  notificationCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (value: boolean) => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: number) => void;
  handleNotificationClick: (notification: Notification) => Promise<void>;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!baseUrl || !token) return;

    try {
      const response = await axios.get(
        `https://${baseUrl}/user_notifications.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.unread_notifications) {
        setNotifications(response.data.unread_notifications);
        setNotificationCount(response.data.unread_notifications.length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [baseUrl, token]);

  // Mark a single notification as read
  const markAsRead = useCallback((notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setNotificationCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!baseUrl || !token) return;

    try {
      await axios.get(
        `https://${baseUrl}/user_notifications/mark_all_as_read.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setNotificationCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      // Still update UI on error
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setNotificationCount(0);
    }
  }, [baseUrl, token]);

  // Add a new notification
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      // Check if notification already exists
      if (prev.find((n) => n.id === notification.id)) {
        return prev;
      }
      return [notification, ...prev];
    });
    setNotificationCount((prev) => prev + 1);
  }, []);

  // Remove a notification
  const removeNotification = useCallback((notificationId: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    setNotificationCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Handle notification click - navigate based on type
  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      try {
        // Mark as read via API
        await axios.get(
          `https://${baseUrl}/user_notifications/${notification.id}/mark_as_read.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update UI
        markAsRead(notification.id);

        // Navigation is handled by the component using this context
        setIsNotificationOpen(false);
      } catch (error) {
        console.error("Error marking notification as read:", error);
        // Still update UI even if API call fails
        markAsRead(notification.id);
        setIsNotificationOpen(false);
      }
    },
    [baseUrl, token, markAsRead]
  );

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setNotificationCount(0);
  }, []);

  // Fetch notifications on mount
  // useEffect(() => {
  //   fetchNotifications();
  // }, [fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    notificationCount,
    isNotificationOpen,
    setIsNotificationOpen,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    handleNotificationClick,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
