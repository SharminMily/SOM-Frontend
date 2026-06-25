"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { attendanceApi } from "@/lib/api/attendance.api";
import { notificationApi } from "@/lib/api/notification.api";
import { projectApi } from "@/lib/api/project.api";
import {
  LogIn,
  LogOut,
  Calendar,
  Bell,
  Briefcase,
  CheckCircle2,
  Circle,
  Mail,
  Building2,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

function extractArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  return [];
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calcDuration(clockIn: string | null, clockOut: string | null) {
  if (!clockIn || !clockOut) return null;
  const mins = Math.round(
    (new Date(clockOut).getTime() - new Date(clockIn).getTime()) / 60000
  );
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

// ─── sub-components ───────────────────────────────────────────────────────────

type BadgeVariant = "green" | "blue" | "amber" | "red" | "purple" | "gray";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  green:  "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
  blue:   "bg-[#E6F1FB] text-[#185FA5] border-[#85B7EB]",
  amber:  "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
  red:    "bg-[#FCEBEB] text-[#A32D2D] border-[#F09595]",
  purple: "bg-[#EEEDFE] text-[#534AB7] border-[#AFA9EC]",
  gray:   "bg-[#F1EFE8] text-[#5F5E5A] border-[#B4B2A9]",
};

function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${BADGE_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number | string;
  sub: string;
  color: string;
}) {
  return (
    <Card className="rounded-xl border shadow-none">
      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          {label}
        </p>
        <p className={`text-2xl font-medium ${color}`}>{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function SectionCard({
  title,
  sub,
  badge,
  children,
}: {
  title: string;
  sub?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl border shadow-none overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
        <div>
          <p className="text-sm font-medium">{title}</p>
          {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
        </div>
        {badge}
      </div>
      {children}
    </Card>
  );
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {label}
      </p>
      <p className="text-[11px] text-foreground">{value}</p>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Employee() {
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const now = new Date();

        const [attRes, notiRes, notiCountRes, projRes] = await Promise.allSettled([
          attendanceApi.getMyAttendance(now.getMonth() + 1, now.getFullYear()),
          notificationApi.getNotifications(),
          notificationApi.getUnreadCount(),
          projectApi.getAllProjects(),
        ]);

        if (attRes.status === "fulfilled") {
          const data = extractArray(attRes.value);
          setAttendanceHistory(data);
          const todayDate = now.toISOString().split("T")[0];
          setTodayAttendance(
            data.find((x: any) => (x.date ?? "").slice(0, 10) === todayDate) ?? null
          );
        }

        if (notiRes.status === "fulfilled") {
          setNotifications(extractArray(notiRes.value).slice(0, 4));
        }

        if (notiCountRes.status === "fulfilled") {
          setUnreadCount(
            notiCountRes.value?.data?.count ?? notiCountRes.value?.count ?? 0
          );
        }

        if (projRes.status === "fulfilled") {
          setProjects(extractArray(projRes.value).slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // derived stats
  const presentDays = attendanceHistory.filter((r) => r.status === "PRESENT").length;
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").length;
  const dur = calcDuration(todayAttendance?.clockIn, todayAttendance?.clockOut);
  const workedMins = todayAttendance?.clockIn
    ? Math.round((Date.now() - new Date(todayAttendance.clockIn).getTime()) / 60000)
    : 0;
  const progressPct = Math.min(Math.round((workedMins / 480) * 100), 100);

  const STATUS_BADGE: Record<string, BadgeVariant> = {
    ACTIVE: "green",
    PLANNING: "blue",
    ON_HOLD: "amber",
    COMPLETED: "purple",
  };
  const STATUS_LABEL: Record<string, string> = {
    ACTIVE: "Active",
    PLANNING: "Planning",
    ON_HOLD: "On hold",
    COMPLETED: "Completed",
  };
  const STATUS_FILL: Record<string, string> = {
    ACTIVE: "#1D9E75",
    PLANNING: "#378ADD",
    ON_HOLD: "#EF9F27",
    COMPLETED: "#7F77DD",
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-muted/30 p-6 space-y-6">

      {/* ── Greeting ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#CECBF6] text-[#534AB7] flex items-center justify-center text-base font-medium flex-shrink-0">
            RH
          </div>
          <div>
            <p className="text-lg font-medium">Good morning, Rahim</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Software Engineer · Engineering Dept
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <p className="text-xs text-muted-foreground">{today}</p>
          {todayAttendance?.clockIn && (
            <Badge variant="green">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
              Clocked in · {fmt(todayAttendance.clockIn)}
            </Badge>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Attendance"    value={presentDays}    sub="days present"       color="text-[#0F6E56]" />
        <StatCard label="Leave balance" value={8}              sub="days remaining"     color="text-[#185FA5]" />
        <StatCard label="Active projects" value={activeProjects} sub="assigned to you"  color="text-[#534AB7]" />
        <StatCard label="Tasks due"     value={5}              sub="this week"          color="text-[#854F0B]" />
      </div>

      {/* ── Attendance + Leave ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <SectionCard
          title="Today's attendance"
          sub={new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
          badge={
            todayAttendance?.status ? (
              <Badge variant={todayAttendance.status === "PRESENT" ? "green" : todayAttendance.status === "LATE" ? "amber" : "red"}>
                {todayAttendance.status.charAt(0) + todayAttendance.status.slice(1).toLowerCase()}
              </Badge>
            ) : (
              <Badge variant="gray">Not marked</Badge>
            )
          }
        >
          <div className="p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <LogIn className="w-3 h-3 text-[#0F6E56]" /> Clock in
                </p>
                <p className="text-base font-medium">{fmt(todayAttendance?.clockIn ?? null)}</p>
              </div>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <LogOut className="w-3 h-3 text-[#A32D2D]" /> Clock out
                </p>
                <p className={`text-base font-medium ${!todayAttendance?.clockOut ? "text-muted-foreground" : ""}`}>
                  {fmt(todayAttendance?.clockOut ?? null)}
                </p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hours worked</p>
                <p className="text-xs font-medium">
                  {dur ?? `${Math.floor(workedMins / 60)}h ${workedMins % 60}m`} / 8h
                </p>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progressPct}%`, background: "#1D9E75" }}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Leave summary" sub="Annual 2026">
          <div className="p-4 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total",     val: 14, bg: "#E1F5EE", color: "#0F6E56" },
                { label: "Used",      val: 6,  bg: "#E6F1FB", color: "#185FA5" },
                { label: "Remaining", val: 8,  bg: "#FAEEDA", color: "#854F0B" },
              ].map(({ label, val, bg, color }) => (
                <div key={label} className="rounded-lg p-2.5 text-center" style={{ background: bg }}>
                  <p className="text-lg font-medium" style={{ color }}>{val}</p>
                  <p className="text-[10px] mt-0.5" style={{ color }}>{label}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border/50 pt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Pending requests</p>
                <Badge variant="amber">2 pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Last approved</p>
                <p className="text-xs">Jun 12 – 14</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ── Projects + Notifications ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4">

        <SectionCard
          title="My projects"
          sub="Assigned to you"
          badge={<Badge variant="purple">{activeProjects} active</Badge>}
        >
          <div className="divide-y">
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : projects.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">No projects assigned.</p>
            ) : (
              projects.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <div className="h-1 bg-muted rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.progress ?? 0}%`,
                          background: STATUS_FILL[p.status] ?? "#888780",
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant={STATUS_BADGE[p.status] ?? "gray"}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground">{p.progress ?? 0}%</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Notifications"
          sub="Recent updates"
          badge={unreadCount > 0 ? <Badge variant="red">{unreadCount} unread</Badge> : undefined}
        >
          <div className="divide-y">
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-muted-foreground">
                <Bell className="w-8 h-8" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 px-4 py-3 hover:bg-muted/20 transition-colors">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: n.isRead ? "#B4B2A9" : "#E24B4A" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${n.isRead ? "text-muted-foreground" : "font-medium"} truncate`}>
                      {n.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      {/* ── Tasks + Profile ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <SectionCard
          title="My tasks"
          sub="Due this week"
          badge={<Badge variant="amber">5 pending</Badge>}
        >
          <div className="divide-y">
            {[
              { title: "Fix login redirect bug",      project: "SOM Frontend", due: "Jun 25", done: false, priority: "high"   },
              { title: "Write API documentation",     project: "Leave API",    due: "Jun 26", done: false, priority: "medium" },
              { title: "Update dashboard layout",     project: "SOM Frontend", due: "Done",   done: true,  priority: "done"   },
              { title: "Review payroll integration",  project: "Payroll",      due: "Jun 27", done: false, priority: "medium" },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                {task.done
                  ? <CheckCircle2 className="w-4 h-4 text-[#1D9E75] flex-shrink-0" />
                  : <Circle className="w-4 h-4 text-[#EF9F27] flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${task.done ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {task.project} · {task.due}
                  </p>
                </div>
                <Badge
                  variant={task.priority === "high" ? "red" : task.priority === "done" ? "green" : "amber"}
                >
                  {task.priority === "high" ? "High" : task.priority === "done" ? "Done" : "Med"}
                </Badge>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Profile snapshot" sub="Your information">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-3 border-b border-border/50">
              <div className="w-11 h-11 rounded-full bg-[#CECBF6] text-[#534AB7] flex items-center justify-center text-sm font-medium flex-shrink-0">
                RH
              </div>
              <div>
                <p className="text-sm font-medium">Rahim Hossain</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">EMP-00124 · Full-time</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <InfoRow icon={Mail}      label="Email"      value="rahim@company.com"   />
              <InfoRow icon={Building2} label="Department" value="Engineering"          />
              <InfoRow icon={MapPin}    label="Location"   value="Dhaka, BD"            />
              <InfoRow icon={Calendar}  label="Joined"     value="Mar 15, 2023"         />
              <InfoRow icon={Phone}     label="Phone"      value="+880 1700-000000"     />
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}