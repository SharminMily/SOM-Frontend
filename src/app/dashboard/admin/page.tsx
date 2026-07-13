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

const activityIconWrap =
  "w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-0.5";

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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">System Overview</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            System Healthy
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="hover:border-emerald-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Total Employees
                  </p>
                  <p className="text-4xl font-bold mt-3">
                    {stats.totalEmployees}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-600 dark:text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Departments
                  </p>
                  <p className="text-4xl font-bold mt-3">
                    {stats.totalDepartments}
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-purple-600 dark:text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Present Today
                  </p>
                  <p className="text-4xl font-bold mt-3">
                    {stats.presentToday}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">
                    {stats.attendancePercentage}% attendance
                  </p>
                </div>
                <Clock className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-emerald-500/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Pending Leaves
                  </p>
                  <p className="text-4xl font-bold mt-3">
                    {stats.pendingLeaves}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-orange-600 dark:text-orange-500" />
              </div>
            </CardContent>
          </Card>
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

                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start border-b border-border pb-5 last:border-0 last:pb-0"
                  >
                    <div className={activityIconWrap}>
                      {item.type === "user" && (
                        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {item.type === "leave" && (
                        <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      )}
                      {item.type === "project" && (
                        <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      )}
                      {item.type === "payroll" && (
                        <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px]">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Overview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No pending leave requests.
                    </p>
                  )}

                  {pendingApprovals.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          Leave Request - {leave.user.firstName}{" "}
                          {leave.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {leave.totalDays} Day
                          {leave.totalDays > 1 ? "s" : ""} •{" "}
                          {leave.leaveType.charAt(0) +
                            leave.leaveType.slice(1).toLowerCase()}{" "}
                          Leave
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Approve
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Departments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {validDepartments.map((dept) => (
                    <div
                      key={dept.id}
                      className="bg-muted p-4 rounded-xl"
                    >
                      <p className="text-sm text-muted-foreground">
                        {dept.name}
                      </p>
                      <p className="text-2xl font-bold">
                        {dept.employeeCount}
                      </p>
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