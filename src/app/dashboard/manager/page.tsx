"use client";

import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api/dashboard.api";
import {
  Users,
  Briefcase,
  CalendarDays,
  TrendingUp,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

type DashboardData = {
  manager: {
    firstName: string;
    lastName: string;
  };

  stats: {
    teamMembers: number;
    activeProjects: number;
    pendingLeaveRequests: number;
    teamPerformance: number;

    presentToday: number;
    lateToday: number;
    absentToday: number;
  };

  announcements: any[];

  recentLeaves: any[];

  recentTasks: any[];
};

const statusColor = (status: string) => {
  const s = status?.toLowerCase();
  if (["approved", "completed", "done"].includes(s)) {
    return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  }
  if (["pending", "in-progress", "in progress"].includes(s)) {
    return "bg-amber-100 text-amber-700 hover:bg-amber-100";
  }
  if (["rejected", "cancelled"].includes(s)) {
    return "bg-red-100 text-red-700 hover:bg-red-100";
  }
  return "bg-slate-100 text-slate-700 hover:bg-slate-100";
};

const initials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string | number;
  icon: any;
  gradient: string;
}) {
  return (
    <Card className="relative overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-200">
      <div
        className={`absolute inset-0 opacity-[0.06] ${gradient}`}
        aria-hidden
      />
      <CardContent className="pt-6 flex justify-between items-center relative">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {label}
          </p>
          <h2 className="text-3xl font-bold mt-1 tracking-tight">
            {value}
          </h2>
        </div>

        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-md ${gradient}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 rounded-md" />
        <div className="h-4 w-48 bg-slate-100 rounded-md" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-100 rounded-xl" />
        ))}
      </div>

      <div className="h-40 bg-slate-100 rounded-xl" />
      <div className="h-40 bg-slate-100 rounded-xl" />
    </div>
  );
}

export default function ManagerDashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await dashboardApi.getManagerDashboard();
        setDashboard(res.data);
      } catch (err) {
        // console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboard) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {dashboard.manager.firstName} 👋
        </h1>

        <p className="text-muted-foreground">
          Here's an overview of your team today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Team Members"
          value={dashboard.stats.teamMembers}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          label="Active Projects"
          value={dashboard.stats.activeProjects}
          icon={Briefcase}
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
        />
        <StatCard
          label="Pending Leaves"
          value={dashboard.stats.pendingLeaveRequests}
          icon={CalendarDays}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <StatCard
          label="Team Performance"
          value={`${dashboard.stats.teamPerformance}%`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Attendance */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Today's Attendance
          </CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                Present
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {dashboard.stats.presentToday}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-4">
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">
                Late
              </p>
              <p className="text-2xl font-bold text-amber-700">
                {dashboard.stats.lateToday}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-xs font-medium text-red-700 uppercase tracking-wide">
                Absent
              </p>
              <p className="text-2xl font-bold text-red-700">
                {dashboard.stats.absentToday}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leave */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <CalendarDays size={18} className="text-muted-foreground" />
              Recent Leave Requests
            </CardTitle>
          </CardHeader>

          <CardContent>
            {dashboard.recentLeaves.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No leave requests
              </p>
            ) : (
              <div className="divide-y">
                {dashboard.recentLeaves.map((leave: any) => (
                  <div
                    key={leave.id}
                    className="flex justify-between items-center py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                        {initials(leave.user.firstName, leave.user.lastName)}
                      </div>
                      <span className="text-sm font-medium">
                        {leave.user.firstName} {leave.user.lastName}
                      </span>
                    </div>

                    <Badge className={statusColor(leave.status)}>
                      {leave.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Clock size={18} className="text-muted-foreground" />
              Recent Tasks
            </CardTitle>
          </CardHeader>

          <CardContent>
            {dashboard.recentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No tasks
              </p>
            ) : (
              <div className="divide-y">
                {dashboard.recentTasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {task.project.title}
                      </p>
                    </div>

                    <Badge className={statusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Bell size={18} className="text-muted-foreground" />
            Announcements
          </CardTitle>
        </CardHeader>

        <CardContent>
          {dashboard.announcements.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No announcements
            </p>
          ) : (
            <div className="divide-y">
              {dashboard.announcements.map((item: any) => (
                <div key={item.id} className="py-3">
                  <p className="text-sm font-medium">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}