"use client";

import { Notification } from "@/app/types/notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NotificationDialog from "./NotificationDialog";

interface Props {
  notifications: Notification[];
  onRead: (notificationId: string) => void;
  onRefresh: () => void;
}

export default function NotificationList({
  notifications,
  onRead,
  onRefresh,
}: Props) {
  if (!notifications.length) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No Notifications Found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-xl border p-5 transition-all ${
            notification.isRead
              ? "bg-muted/20"
              : "bg-primary/5 border-primary/20"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {notification.title}
                </h3>

                {!notification.isRead && (
                  <Badge>New</Badge>
                )}

                <Badge variant="outline">
                  {notification.type}
                </Badge>
              </div>

              <p className="text-muted-foreground">
                {notification.message}
              </p>

              <p className="text-xs text-muted-foreground">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              {!notification.isRead && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onRead(notification.id)
                  }
                >
                  Mark Read
                </Button>
              )}

              <NotificationDialog
                notification={notification}
                onSuccess={onRefresh}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}