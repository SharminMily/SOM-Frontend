"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Calendar,
  Clock,
  Award,
  Bell,
  DollarSign,
  Loader2,
  ArrowUpRight,
  UserPlus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { dashboardApi } from "@/lib/api/dashboard.api";

interface DepartmentSummary {
  id: string;
  name: string;
  employeeCount: number;
}

interface PendingApproval {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  user: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    department: { name: string } | null;
  };
}

interface ActivityItem {
  type: "user" | "leave" | "project" | "payroll";
  text: string;
  date: string;
}

interface AdminDashboardData {
  stats: {
    totalEmployees: number;
    totalDepartments: number;
    presentToday: number;
    lateToday: number;
    absentToday: number;
    totalAttendanceToday: number;
    attendancePercentage: number;
    pendingLeaves: number;
  };
  departments: DepartmentSummary[];
  pendingApprovals: PendingApproval[];
  recentActivity: ActivityItem[];
}

// Turns an ISO date into "2 min ago" / "3 hours ago" / "5 days ago"
function timeAgo(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
}

function initials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

// Deterministic accent color per person, so the same name always gets the
// same avatar color instead of a random one on every render.
const AVATAR_PALETTE = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
];
function avatarColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

const ACTIVITY_STYLES: Record<
  ActivityItem["type"],
  { icon: typeof Users; wrap: string }
> = {
  user: {
    icon: UserPlus,
    wrap: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  leave: {
    icon: Calendar,
    wrap: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  project: {
    icon: Award,
    wrap: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  payroll: {
    icon: DollarSign,
    wrap: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
};

// Small radial progress ring for today's attendance rate.
function AttendanceRing({ percentage }: { percentage: number }) {
  const size = 88;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="fill-none stroke-emerald-500 transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none">{percentage}%</span>
      </div>
    </div>
  );
}

const activityIconWrap =
  "w-8 h-8 rounded-full flex items-center justify-center mt-0.5 shrink-0";

const statCards = [
  {
    key: "totalEmployees" as const,
    label: "Total Employees",
    icon: Users,
    accent: "text-blue-600 dark:text-blue-500",
    chip: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    key: "totalDepartments" as const,
    label: "Departments",
    icon: Building2,
    accent: "text-purple-600 dark:text-purple-500",
    chip: "bg-purple-50 dark:bg-purple-950/40",
  },
  {
    key: "presentToday" as const,
    label: "Present Today",
    icon: Clock,
    accent: "text-emerald-600 dark:text-emerald-500",
    chip: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    key: "pendingLeaves" as const,
    label: "Pending Leaves",
    icon: Calendar,
    accent: "text-orange-600 dark:text-orange-500",
    chip: "bg-orange-50 dark:bg-orange-950/40",
  },
];

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await dashboardApi.getAdminDashboard();
        if (!cancelled) setData(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const { stats, departments, pendingApprovals, recentActivity } = data;

  // Some department rows can come back without a real id/name (e.g. users
  // with no department assigned) — hide those from the summary grid.
  const validDepartments = departments.filter((d) => d.id && d.name);
  const maxDeptCount = Math.max(1, ...validDepartments.map((d) => d.employeeCount));

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {today}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            System Healthy
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map(({ key, label, icon: Icon, accent, chip }) => (
            <Card
              key={key}
              className="group hover:border-emerald-500/30 hover:shadow-sm transition-all"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-4xl font-bold tabular-nums tracking-tight">
                      {stats[key]}
                    </p>
                    {key === "presentToday" && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {stats.attendancePercentage}% attendance
                      </p>
                    )}
                    {key === "pendingLeaves" && (
                      <p className="text-sm text-muted-foreground">
                        Awaiting review
                      </p>
                    )}
                  </div>
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center ${chip} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className={`h-5 w-5 ${accent}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentActivity.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No recent activity.
                  </p>
                )}

                {recentActivity.map((item, i) => {
                  const { icon: Icon, wrap } = ACTIVITY_STYLES[item.type];
                  return (
                    <div
                      key={i}
                      className="flex gap-4 items-start border-b border-border pb-5 last:border-0 last:pb-0"
                    >
                      <div className={`${activityIconWrap} ${wrap}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] leading-snug">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {timeAgo(item.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Overview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Attendance snapshot */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <AttendanceRing percentage={stats.attendancePercentage} />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Present
                      </span>
                      <span className="font-semibold tabular-nums">
                        {stats.presentToday}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Late
                      </span>
                      <span className="font-semibold tabular-nums">
                        {stats.lateToday}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                        Absent
                      </span>
                      <span className="font-semibold tabular-nums">
                        {stats.absentToday}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No pending leave requests.
                    </p>
                  )}

                  {pendingApprovals.map((leave) => {
                    const fullName = `${leave.user.firstName} ${leave.user.lastName}`;
                    return (
                      <div
                        key={leave.id}
                        className="flex justify-between items-center gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColor(
                              fullName
                            )}`}
                          >
                            {initials(leave.user.firstName, leave.user.lastName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{fullName}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {leave.totalDays} day
                              {leave.totalDays > 1 ? "s" : ""} ·{" "}
                              {leave.leaveType.charAt(0) +
                                leave.leaveType.slice(1).toLowerCase()}{" "}
                              leave
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                        >
                          Approve
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Department Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {validDepartments.map((dept) => (
                    <div key={dept.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          {dept.name}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {dept.employeeCount}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-purple-500/70 transition-all"
                          style={{
                            width: `${(dept.employeeCount / maxDeptCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}