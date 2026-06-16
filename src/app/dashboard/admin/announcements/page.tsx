"use client";

import { useEffect, useState } from "react";
import { notificationApi } from "@/lib/api/notification.api";
import { Notification } from "@/app/types/notification";
import NotificationList from "@/components/notifications/NotificationList";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] =
    useState<Notification[]>([]);

  const loadData = async () => {
    const res = await notificationApi.getNotifications();

    const filtered = res.data.notifications.filter(
      (n: Notification) => n.type === "ANNOUNCEMENT"
    );

    setAnnouncements(filtered);
  };

  useEffect(() => {
    loadData();
  }, []);

  // optional (announcement read handle)
  const handleRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    loadData();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">
        Announcements
      </h1>

      <NotificationList
        notifications={announcements}
        onRead={handleRead}
        onRefresh={loadData}
      />
    </div>
  );
}