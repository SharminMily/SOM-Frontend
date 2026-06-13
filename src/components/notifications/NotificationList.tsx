"use client";

import { Notification } from "@/app/types/notification";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

interface Props {
  notifications: Notification[];

  onRead: (
    notificationId: string
  ) => void;
}

export default function NotificationList({
  notifications,
  onRead,
}: Props) {
  return (
    <div className="space-y-4">
      {notifications.map(
        (notification) => (
          <div
            key={notification.id}
            className={`
            rounded-lg
            border
            p-4
            flex
            justify-between
            items-start
            ${
              notification.isRead
                ? "bg-muted/20"
                : "bg-background"
            }
            `}
          >
            <div>
              <div className="flex gap-2 items-center">

                <h3 className="font-semibold">
                  {notification.title}
                </h3>

                {!notification.isRead && (
                  <Badge>
                    New
                  </Badge>
                )}

              </div>

              <p className="text-muted-foreground text-sm mt-1">
                {notification.message}
              </p>

              <p className="text-xs text-muted-foreground mt-2">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </p>
            </div>

            {!notification.isRead && (
              <Button
                size="sm"
                onClick={() =>
                  onRead(
                    notification.id
                  )
                }
              >
                Mark Read
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}