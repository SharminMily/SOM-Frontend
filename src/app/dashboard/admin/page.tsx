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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white">
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const { stats, departments, pendingApprovals, recentActivity } = data;

  // Some department rows can come back without a real id/name (e.g. users
  // with no department assigned) — hide those from the summary grid.
  const validDepartments = departments.filter((d) => d.id && d.name);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">
              System Overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              System Healthy
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Total Employees
                </p>
                <p className="text-4xl font-bold mt-3">
                  {stats.totalEmployees}
                </p>
              </div>
              <Users className="h-10 w-10 text-blue-600 dark:text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Departments
                </p>
                <p className="text-4xl font-bold mt-3">
                  {stats.totalDepartments}
                </p>
              </div>
              <Building2 className="h-10 w-10 text-purple-600 dark:text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Present Today
                </p>
                <p className="text-4xl font-bold mt-3">
                  {stats.presentToday}
                </p>
                <p className="text-emerald-600 dark:text-emerald-500 text-sm mt-1">
                  {stats.attendancePercentage}% attendance
                </p>
              </div>
              <Clock className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Pending Leaves
                </p>
                <p className="text-4xl font-bold mt-3">
                  {stats.pendingLeaves}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-orange-600 dark:text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" /> Recent Activity
              </h2>
            </div>

            <div className="space-y-5">
              {recentActivity.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No recent activity.
                </p>
              )}

              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start border-b border-gray-100 dark:border-[#1f2a3f] pb-5 last:border-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mt-0.5">
                    {item.type === "user" && (
                      <Users className="h-4 w-4 text-emerald-600" />
                    )}
                    {item.type === "leave" && (
                      <Calendar className="h-4 w-4 text-orange-600" />
                    )}
                    {item.type === "project" && (
                      <Award className="h-4 w-4 text-purple-600" />
                    )}
                    {item.type === "payroll" && (
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px]">{item.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {timeAgo(item.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Overview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pending Approvals */}
            <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Pending Approvals
              </h2>
              <div className="space-y-4">
                {pendingApprovals.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {leave.totalDays} Day
                        {leave.totalDays > 1 ? "s" : ""} •{" "}
                        {leave.leaveType.charAt(0) +
                          leave.leaveType.slice(1).toLowerCase()}{" "}
                        Leave
                      </p>
                    </div>
                    <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg">
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Summary */}
            <div className="bg-white dark:bg-[#111d2b] border border-gray-200 dark:border-[#1f2a3f] rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Departments</h2>
              <div className="grid grid-cols-2 gap-4">
                {validDepartments.map((dept) => (
                  <div
                    key={dept.id}
                    className="bg-gray-50 dark:bg-[#1a2538] p-4 rounded-xl"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dept.name}
                    </p>
                    <p className="text-2xl font-bold">
                      {dept.employeeCount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}