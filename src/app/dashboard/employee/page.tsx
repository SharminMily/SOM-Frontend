"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api/dashboard.api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Folder, ListTodo, Clock3, CheckCircle, Bell,
  Loader2, Calendar, ClipboardList, TrendingUp, DollarSign, Eye,
} from "lucide-react";
import { DashboardData } from "@/app/types/dashboard";

const priorityStyles: Record<string, string> = {
  HIGH:   "bg-rose-100 text-rose-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW:    "bg-emerald-100 text-emerald-700",
};

const statusStyles: Record<string, string> = {
  TODO:        "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW:      "bg-violet-100 text-violet-700",
  DONE:        "bg-emerald-100 text-emerald-700",
};

function PillBadge({ label, styleMap }: { label: string; styleMap: Record<string, string> }) {
  const cls = styleMap[label?.toUpperCase()] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function LeaveBar({ label, total, used, color }: { label: string; total: number; used: number; color: string }) {
  const remaining = total - used;
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{remaining}<span className="font-normal text-muted-foreground"> / {total}</span></span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0 border-border/60">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await dashboardApi.getEmployeeDashboard();
        setDashboard(res.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!dashboard) return null;

  const { profile, stats } = dashboard;

  const leaveTypes = [
    { label: "Annual", total: dashboard.leave?.balance?.annualTotal ?? 0, used: dashboard.leave?.balance?.annualUsed ?? 0, color: "bg-indigo-500" },
    { label: "Sick",   total: dashboard.leave?.balance?.sickTotal ?? 0,   used: dashboard.leave?.balance?.sickUsed ?? 0,   color: "bg-cyan-500" },
    { label: "Casual", total: dashboard.leave?.balance?.casualTotal ?? 0, used: dashboard.leave?.balance?.casualUsed ?? 0, color: "bg-teal-500" },
  ];

  const statCards = [
    { title: "Projects",      value: stats.totalProjects,       icon: <Folder className="h-5 w-5" />,      gradient: "from-indigo-500 to-violet-500", bg: "bg-indigo-50",  text: "text-indigo-600",  badge: "bg-indigo-100 text-indigo-700" },
    { title: "Total Tasks",   value: stats.totalTasks,          icon: <ListTodo className="h-5 w-5" />,     gradient: "from-sky-500 to-cyan-400",      bg: "bg-sky-50",     text: "text-sky-600",     badge: "bg-sky-100 text-sky-700" },
    { title: "Pending",       value: stats.todoTasks,           icon: <Clock3 className="h-5 w-5" />,       gradient: "from-amber-400 to-orange-400",  bg: "bg-amber-50",   text: "text-amber-600",   badge: "bg-amber-100 text-amber-700" },
    { title: "Completed",     value: stats.completedTasks,      icon: <CheckCircle className="h-5 w-5" />,  gradient: "from-emerald-500 to-teal-400",  bg: "bg-emerald-50", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
    { title: "In Progress",   value: stats.inProgressTasks,     icon: <Loader2 className="h-5 w-5" />,      gradient: "from-blue-500 to-indigo-400",   bg: "bg-blue-50",    text: "text-blue-600",    badge: "bg-blue-100 text-blue-700" },
    { title: "In Review",     value: stats.reviewTasks,         icon: <TrendingUp className="h-5 w-5" />,   gradient: "from-violet-500 to-purple-500", bg: "bg-violet-50",  text: "text-violet-600",  badge: "bg-violet-100 text-violet-700" },
    { title: "Unread Alerts", value: stats.unreadNotifications, icon: <Bell className="h-5 w-5" />,         gradient: "from-rose-500 to-pink-400",     bg: "bg-rose-50",    text: "text-rose-600",    badge: "bg-rose-100 text-rose-700" },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 sm:p-6 lg:p-8">

      {/* PROFILE HERO */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-background shadow-md">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="text-2xl font-bold bg-indigo-100 text-indigo-700">
                    {profile.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-1 right-1 block h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{profile.firstName} {profile.lastName}</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">{profile.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{profile.role}</span>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${profile.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{profile.status}</span>
                  {profile.emailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                      <Eye className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:flex-col sm:items-end sm:gap-2">
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Department</p>
                <p className="mt-0.5 font-semibold">{profile.department?.name || "—"}</p>
              </div>
              {profile.manager && (
                <div className="text-right">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Manager</p>
                  <p className="mt-0.5 font-semibold">{profile.manager.firstName} {profile.manager.lastName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ title, value, icon, gradient, bg, text, badge }) => (
          <div key={title} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${gradient}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${text}`}>{icon}</span>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />{title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ATTENDANCE · LEAVE · PAYROLL */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600"><Calendar className="h-4 w-4" /></span>
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.attendance?.today ? (
              <div className="divide-y divide-border/60">
                <InfoRow label="Status"><PillBadge label={dashboard.attendance.today.status} styleMap={{ PRESENT: "bg-emerald-100 text-emerald-700", ABSENT: "bg-rose-100 text-rose-700", LATE: "bg-amber-100 text-amber-700" }} /></InfoRow>
                <InfoRow label="Clock In">{dashboard.attendance.today.clockIn ? new Date(dashboard.attendance.today.clockIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</InfoRow>
                <InfoRow label="Clock Out">{dashboard.attendance.today.clockOut ? new Date(dashboard.attendance.today.clockOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</InfoRow>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Calendar className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No attendance recorded today</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600"><Clock3 className="h-4 w-4" /></span>
              Leave Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveTypes.map((lt) => <LeaveBar key={lt.label} {...lt} />)}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"><DollarSign className="h-4 w-4" /></span>
              Latest Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard.payroll ? (
              <div className="divide-y divide-border/60">
                <InfoRow label="Period">{dashboard.payroll.month} / {dashboard.payroll.year}</InfoRow>
                <InfoRow label="Status"><PillBadge label={dashboard.payroll.status} styleMap={{ PAID: "bg-emerald-100 text-emerald-700", PENDING: "bg-amber-100 text-amber-700", DRAFT: "bg-slate-100 text-slate-600" }} /></InfoRow>
                <InfoRow label="Net Salary"><span className="text-base font-bold text-emerald-600">৳{Number(dashboard.payroll.netSalary).toLocaleString()}</span></InfoRow>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <DollarSign className="mb-2 h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No payroll record yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RECENT TASKS */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-600"><ClipboardList className="h-4 w-4" /></span>
            Recent Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {dashboard.tasks?.recent?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="pl-6 font-semibold">Task</TableHead>
                    <TableHead className="font-semibold">Project</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="pr-6 font-semibold">Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.tasks.recent.map((task: any) => (
                    <TableRow key={task.id} className="hover:bg-muted/30">
                      <TableCell className="pl-6 font-medium">{task.title}</TableCell>
                      <TableCell className="text-muted-foreground">{task.project?.title ?? "—"}</TableCell>
                      <TableCell><PillBadge label={task.status} styleMap={statusStyles} /></TableCell>
                      <TableCell><PillBadge label={task.priority} styleMap={priorityStyles} /></TableCell>
                      <TableCell className="pr-6 text-muted-foreground">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <ClipboardList className="mb-2 h-10 w-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No recent tasks assigned</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}