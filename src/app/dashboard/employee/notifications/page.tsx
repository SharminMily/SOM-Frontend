"use client";

import { useEffect, useState } from "react";
import { notificationApi } from "@/lib/api/notification.api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCheck,
  Check,
  Inbox,
  Clock,
  LogIn,
  Megaphone,
  Info,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function extractArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.notifications)) return res.data.notifications;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.notifications)) return res.notifications;
  return [];
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_MAP: Record<string, { label: string; icon: any; colors: string }> = {
  ANNOUNCEMENT: {
    label: "Announcement",
    icon: Megaphone,
    colors: "bg-[#EEEDFE] text-[#534AB7] border-[#AFA9EC]",
  },
  ATTENDANCE: {
    label: "Attendance",
    icon: LogIn,
    colors: "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
  },
  INFO: {
    label: "Info",
    icon: Info,
    colors: "bg-[#E6F1FB] text-[#185FA5] border-[#85B7EB]",
  },
};

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_MAP[type] ?? TYPE_MAP.INFO;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${cfg.colors}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listRes, countRes] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getUnreadCount(),
      ]);
      // ✅ safe extraction regardless of API shape
      setNotifications(extractArray(listRes));
      setUnreadCount(
        countRes?.data?.count ?? countRes?.count ?? 0
      );
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      toast.success("Marked as read");
      loadData();
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);
      await notificationApi.markAllAsRead();
      toast.success("All notifications marked as read");
      loadData();
    } catch {
      toast.error("Failed to update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  const totalCount = notifications.length;

  return (
    <div className="min-h-screen bg-muted/30 p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-medium">Notifications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stay updated with company announcements and activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-xl border shadow-none">
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Total
            </p>
            <p className="text-2xl font-medium">{totalCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border shadow-none">
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Unread
            </p>
            <p className="text-2xl font-medium text-[#185FA5]">{unreadCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Notification list ── */}
      <Card className="rounded-xl border shadow-none overflow-hidden">
        <CardContent className="p-0">

          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/20">
            <div>
              <p className="text-sm font-medium">Recent notifications</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {loading ? "Loading…" : `${totalCount} total, ${unreadCount} unread`}
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E6F1FB] text-[#185FA5] text-[10px] font-medium border border-[#85B7EB]">
                {unreadCount}
              </span>
            )}
          </div>

          {/* States */}
          {loading ? (
            <div className="flex items-center gap-2 px-5 py-10 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 animate-spin" />
              Loading notifications…
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <Inbox className="w-10 h-10" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((item: any) => (
                <div
                  key={item.id}
                  className={`
                    flex items-start justify-between gap-4 px-5 py-4
                    transition-colors hover:bg-muted/20
                    ${!item.isRead ? "bg-[#E6F1FB]/30" : ""}
                  `}
                >
                  {/* Left: dot + content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Unread dot */}
                    <div className="mt-1.5 flex-shrink-0">
                      {!item.isRead ? (
                        <span className="block w-2 h-2 rounded-full bg-[#378ADD]" />
                      ) : (
                        <span className="block w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className={`text-sm ${!item.isRead ? "font-medium" : "font-normal"} text-primary truncate`}>
                          {item.title}
                        </p>
                        <TypeBadge type={item.type} />
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {item.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {timeAgo(item.createdAt)}
                        {" · "}
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Right: mark read */}
                  {!item.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkRead(item.id)}
                      className="flex-shrink-0 h-7 px-2.5 text-xs gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}