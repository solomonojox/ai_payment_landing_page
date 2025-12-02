import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { X } from "lucide-react";
import type { Notification } from "../../types/notificationType";

interface NotificationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  notification: Notification;
}

export default function NotificationModal({ open, setOpen, notification }: NotificationModalProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {notification?.title}
          </DialogTitle>
          <DialogDescription>
            {formatTime(notification?.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-gray-700 leading-relaxed">
            {notification?.message}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}