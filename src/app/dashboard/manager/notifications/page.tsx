"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { notificationApi } from "@/lib/api/notification.api";
import { Notification } from "@/app/types/notification";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import ManagerNotificationList from "@/components/notifications/ManagerNotificationList";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadData = async () => {
    try {
      const [list, unread] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getUnreadCount(),
      ]);

      setNotifications(list.data.notifications);
      setUnreadCount(unread.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    loadData();
  };

  const handleReadAll = async () => {
    await notificationApi.markAllAsRead();
    loadData();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Notifications</CardTitle>

            <Button variant="outline" onClick={handleReadAll}>
              Mark All Read
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <div className="text-4xl font-bold">
              {unreadCount}
            </div>
            <p className="text-muted-foreground">
              Unread Notifications
            </p>
          </div>

          <ManagerNotificationList
            notifications={notifications}
            onRead={handleRead}
            onRefresh={loadData}   // ✅ BEST FIX
          />
        </CardContent>
      </Card>
    </div>
  );
}