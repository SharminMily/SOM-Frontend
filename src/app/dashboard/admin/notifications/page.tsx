"use client";

import { useEffect, useState } from "react";
import {
  Bell, CheckCheck, ShoppingCart, CreditCard,
  Package, Star, Settings, Clock, Check,
} from "lucide-react";

import { notificationApi } from "@/lib/api/notification.api";
import { Notification } from "@/app/types/notification";
import NotificationDialog from "@/components/notifications/NotificationDialog";
import { Button } from "@/components/ui/button";

function NotificationIcon({ type }: { type: string }) {
  const cls = "w-4 h-4";
  const map: Record<string, React.ReactNode> = {
    Order:     <ShoppingCart className={cls} />,
    Payment:   <CreditCard className={cls} />,
    Inventory: <Package className={cls} />,
    Review:    <Star className={cls} />,
    System:    <Settings className={cls} />,
  };
  return <>{map[type] ?? <Bell className={cls} />}</>;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [list, unread] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getUnreadCount(),
      ]);
      setNotifications(list?.data?.notifications || []);
      setUnreadCount(unread?.data?.count || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRead = async (id: string) => {
    try { await notificationApi.markAsRead(id); loadData(); }
    catch (e) { console.error(e); }
  };

  const handleReadAll = async () => {
    try { await notificationApi.markAllAsRead(); loadData(); }
    catch (e) { console.error(e); }
  };

  const stats = [
    {
      label: "Total",
      value: notifications.length,
      dotCls: "bg-muted-foreground/40",
      valCls: "text-foreground",
      boxCls: "border-border bg-card",
    },
    {
      label: "Unread",
      value: unreadCount,
      dotCls: "bg-amber-400",
      valCls: "text-amber-600 dark:text-amber-400",
      boxCls: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20",
    },
    {
      label: "Read",
      value: notifications.length - unreadCount,
      dotCls: "bg-green-500",
      valCls: "text-green-700 dark:text-green-400",
      boxCls: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-5 flex flex-col gap-4">

      {/* ── Header ── */}
      <div className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-3">

          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900/40 dark:text-green-300">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.07em] text-muted-foreground leading-none mb-1">
                Notification Center
              </p>
              <h1 className="text-base sm:text-lg font-semibold leading-tight text-foreground truncate">
                Stay Updated
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <NotificationDialog onSuccess={loadData} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleReadAll}
              className="h-8 sm:h-9 gap-1.5 px-2.5 sm:px-3 text-xs whitespace-nowrap"
            >
              <CheckCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
          </div>

        </div>
      </div>

      {/* ── Stats ── */}
      <div className="flex items-center gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex flex-1 items-center gap-2 rounded-lg border px-2.5 sm:px-3.5 py-2 sm:py-2.5 ${s.boxCls}`}
          >
            <span className={`h-2 w-2 shrink-0 rounded-full ${s.dotCls}`} />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground leading-none">
              {s.label}
            </span>
            <span className={`ml-auto text-sm font-semibold leading-none ${s.valCls}`}>
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">No notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">You're all caught up.</p>
          </div>
        </div>
      )}

      {/* ── Feed ── */}
      {!loading && notifications.length > 0 && (
        <div className="flex flex-col">
          {notifications.map((n, i) => (
            <div key={n.id} className="flex gap-2.5 sm:gap-3">

              {/* Timeline */}
              <div className="flex w-3.5 sm:w-4 shrink-0 flex-col items-center pt-[18px]">
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    n.isRead
                      ? "bg-border"
                      : "bg-green-500 ring-2 ring-green-200 ring-offset-0 dark:ring-green-800"
                  }`}
                />
                {i < notifications.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-border/50" />
                )}
              </div>

              {/* Card */}
              <div className="mb-5 flex-1 min-w-0">
                <div
                  className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-3.5 transition-transform duration-150 hover:-translate-y-px ${
                    !n.isRead
                      ? "border-green-200 bg-green-50 dark:border-green-800/60 dark:bg-green-950/20"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">

                    {/* Icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        !n.isRead
                          ? "border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      <NotificationIcon type={n.type} />
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">

                      {/* Title + badges */}
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[13px] font-medium leading-snug text-foreground">
                          {n.title}
                        </span>
                        {!n.isRead && (
                          <span className="rounded-full bg-green-700 px-1.5 py-0.5 text-[10px] font-medium leading-none text-green-50">
                            New
                          </span>
                        )}
                        <span
                          className={`rounded-full border px-1.5 py-0.5 text-[10px] leading-none ${
                            !n.isRead
                              ? "border-green-300 bg-green-100 text-green-800 dark:border-green-700 dark:bg-green-900/40 dark:text-green-300"
                              : "border-border bg-muted text-muted-foreground"
                          }`}
                        >
                          {n.type}
                        </span>
                      </div>

                      {/* Message */}
                      <p
                        className={`text-[12px] sm:text-[13px] leading-relaxed ${
                          !n.isRead
                            ? "text-green-900 dark:text-green-200"
                            : "text-muted-foreground"
                        }`}
                      >
                        {n.message}
                      </p>

                      {/* Footer: time + actions */}
                      <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                        <span
                          className={`flex items-center gap-1 text-[11px] ${
                            !n.isRead
                              ? "text-green-600 dark:text-green-500"
                              : "text-muted-foreground/60"
                          }`}
                        >
                          <Clock className="h-3 w-3 shrink-0" />
                          {new Date(n.createdAt).toLocaleString()}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {!n.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRead(n.id)}
                              className="h-7 gap-1 border-green-300 px-2.5 text-[11px] text-green-800 hover:border-green-400 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/40"
                            >
                              <Check className="h-3 w-3 shrink-0" />
                              Mark read
                            </Button>
                          )}
                          <NotificationDialog
                            notification={n}
                            onSuccess={loadData}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}