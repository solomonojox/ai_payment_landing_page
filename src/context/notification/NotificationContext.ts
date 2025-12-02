import { createContext } from "react";
// import type { Notification } from "../../types/notificationType";

interface Notification {
  _id: string;
  title: string;
  message: string;
  readBy: string[];
  unread: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  isLoading: boolean;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
