"use client";

import { useEffect, useState } from "react";

import { notificationApi } from "@/lib/api/notification.api";

import { Notification } from "@/app/types/notification";
import NotificationList from "@/components/notifications/NotificationList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const loadData = async () => {
    const [list, unread] =
      await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getUnreadCount(),
      ]);

    setNotifications(
      list.data.notifications
    );

    setUnreadCount(
      unread.data.count
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRead = async (
    id: string
  ) => {
    await notificationApi.markAsRead(
      id
    );

    loadData();
  };

  const handleReadAll =
    async () => {
      await notificationApi.markAllAsRead();

      loadData();
    };

  return (
    <div className="space-y-6">

      <Card>

        <CardHeader>

          <div className="flex items-center justify-between">

            <CardTitle>
              Notifications
            </CardTitle>

            <Button
              onClick={
                handleReadAll
              }
            >
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

          <NotificationList
            notifications={
              notifications
            }
            onRead={
              handleRead
            }
          />

        </CardContent>

      </Card>

    </div>
  );
}