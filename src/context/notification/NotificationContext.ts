import { createContext } from "react";
import type { Notification } from "../../types/notificationType";

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
