"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ShoppingCart,
  CreditCard,
  Package,
  Star,
  Settings,
  Clock,
} from "lucide-react";

import { notificationApi } from "@/lib/api/notification.api";
import { Notification } from "@/app/types/notification";

import NotificationDialog from "@/components/notifications/NotificationDialog";

import { Button } from "@/components/ui/button";

function NotificationIcon({
  type,
}: {
  type: string;
}) {
  const cls = "h-4 w-4";

  const icons: Record<
    string,
    React.ReactNode
  > = {
    Order: (
      <ShoppingCart className={cls} />
    ),
    Payment: (
      <CreditCard className={cls} />
    ),
    Inventory: (
      <Package className={cls} />
    ),
    Review: (
      <Star className={cls} />
    ),
    System: (
      <Settings className={cls} />
    ),
  };

  return (
    <>
      {icons[type] || (
        <Bell className={cls} />
      )}
    </>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const [list, unread] =
        await Promise.all([
          notificationApi.getNotifications(),
          notificationApi.getUnreadCount(),
        ]);

      setNotifications(
        list?.data?.notifications || []
      );

      setUnreadCount(
        unread?.data?.count || 0
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRead = async (
    id: string
  ) => {
    try {
      await notificationApi.markAsRead(id);
      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReadAll =
    async () => {
      try {
        await notificationApi.markAllAsRead();
        loadData();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className="w-full  px-3 sm:px-6 py-5 space-y-4">

      {/* HEADER */}

      <div className="rounded-2xl border bg-card p-4 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 p-1 items-center justify-center rounded-xl  border border-primary/20 bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Notification Center
              </p>

              <h1 className="text-xl font-bold">
                Notifications
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <NotificationDialog
              onSuccess={loadData}
            />

            <Button
              variant="outline"
              onClick={handleReadAll}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          </div>

        </div>
      </div>

   
{/* STATS */}
<div className="rounded-2xl border bg-card p-3 sm:p-4">
  <div className="flex items-center justify-between gap-2 sm:gap-4 text-sm">

    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-slate-500" />
      <span className="text-muted-foreground">
        Total
      </span>
      <span className="font-bold">
        {notifications.length}
      </span>
    </div>

    <div className="h-5 w-px bg-border" />

    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-orange-500" />
      <span className="text-muted-foreground">
        Unread
      </span>
      <span className="font-bold text-orange-500">
        {unreadCount}
      </span>
    </div>

    <div className="h-5 w-px bg-border" />

    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-emerald-500" />
      <span className="text-muted-foreground">
        Read
      </span>
      <span className="font-bold text-emerald-500">
        {notifications.length - unreadCount}
      </span>
    </div>

  </div>
</div>

      {/* LOADING */}

      {loading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        notifications.length ===
          0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="rounded-2xl border bg-muted p-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-lg font-semibold">
              No Notifications
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              You're all caught up.
            </p>
          </div>
        )}

      {/* NOTIFICATION LIST */}

      {!loading &&
        notifications.length >
          0 && (
          <div className="space-y-4">

            {notifications.map(
              (
                notification,
                index
              ) => (
                <div
                  key={
                    notification.id
                  }
                  className="flex gap-3"
                >

                  {/* TIMELINE */}

                  <div className="flex flex-col items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        notification.isRead
                          ? "bg-muted"
                          : "bg-primary"
                      }`}
                    />

                    {index !==
                      notifications.length -
                        1 && (
                      <div className="w-px flex-1 bg-border mt-1" />
                    )}
                  </div>

                  {/* CARD */}

                  <div
                    className={`flex-1 rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30 ${
                      !notification.isRead
                        ? "border-primary/20 bg-primary/5"
                        : "bg-card"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                      <div className="flex gap-3">

                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                            !notification.isRead
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          <NotificationIcon
                            type={
                              notification.type
                            }
                          />
                        </div>

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {
                                notification.title
                              }
                            </h3>

                            {!notification.isRead && (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                                New
                              </span>
                            )}

                            <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                              {
                                notification.type
                              }
                            </span>

                          </div>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {
                              notification.message
                            }
                          </p>

                          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />

                            {new Date(
                              notification.createdAt
                            ).toLocaleString()}
                          </div>

                        </div>
                      </div>

                      <div className="flex gap-2">

                        {!notification.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRead(
                                notification.id
                              )
                            }
                            className="border-primary/20 text-primary hover:bg-primary/10"
                          >
                            <Check className="mr-1 h-3 w-3" />
                            Read
                          </Button>
                        )}

                        <NotificationDialog
                          notification={
                            notification
                          }
                          onSuccess={
                            loadData
                          }
                        />

                      </div>

                    </div>
                  </div>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}