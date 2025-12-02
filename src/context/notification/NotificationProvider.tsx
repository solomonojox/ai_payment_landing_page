import React, { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../auth/useAuth";
import { NotificationContext } from "./NotificationContext";
import { ApiUrl } from "../../config/apiConfig";
// import type { Notification } from "../../types/notificationType";
// import { NotificationService } from "../../services/NotificationService";

// export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const { user } = useAuth();

//   // const fetchNotifications = useCallback(async () => {
//   //   if (!user) return;

//   //   try {
//   //     setIsLoading(true);
//   //     const response = await NotificationService.getNotifications();

//   //     const notificationsWithUnread = response.map((notif: Notification) => ({
//   //       ...notif,
//   //       unread: !notif.readBy.includes(user.id ?? "")
//   //     }));

//   //     setNotifications(notificationsWithUnread);
//   //   } catch (error) {
//   //     console.error("Error fetching notifications:", error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // }, [user]);

//   // const markAsRead = async (notificationId: string) => {
//   //   if (!user) return;

//   //   try {
//   //     await NotificationService.markNotificationAsRead(notificationId);

//   //     setNotifications((prev) =>
//   //       prev.map((notif) =>
//   //         notif._id === notificationId
//   //           ? {
//   //             ...notif,
//   //             readBy: notif.readBy.includes(user!.id as string)
//   //               ? notif.readBy
//   //               : [...notif.readBy, user!.id as string],
//   //             unread: false,
//   //           }
//   //           : notif
//   //       )
//   //     );

//   //   } catch (error) {
//   //     console.error("Error marking notification as read:", error);
//   //   }
//   // };

//   useEffect(() => {
//     if (!user) return;

//     const newSocket = io(ApiUrl || "http://localhost:4170", {
//       auth: { token: localStorage.getItem("fasma_token") },
//     });

//     newSocket.on("connect", () => {
//       newSocket.emit("register", { userId: user.id });
//     });

//     newSocket.on("newNotification", (notification: Notification) => {
//       setNotifications((prev) => [
//         {
//           ...notification,
//           unread: true,
//         },
//         ...prev,
//       ]);
//     });

//     newSocket.on("disconnect", () => {
//       // console.log("Disconnected from notifications server");
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [user]);

//   // useEffect(() => {
//   //   if (user) {
//   //     fetchNotifications();
//   //   }
//   // }, [user, fetchNotifications]);

//   // const unreadCount = notifications.filter((notif) => notif.unread).length;

//   // return (
//   //   <NotificationContext.Provider
//   //     value={{
//   //       notifications,
//   //       // unreadCount,
//   //       // markAsRead,
//   //       // fetchNotifications,
//   //       isLoading,
//   //     }}
//   //   >
//   //     {children}
//   //   </NotificationContext.Provider>
//   // );
// };
