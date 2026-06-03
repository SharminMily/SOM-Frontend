'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Clock, Award, TrendingUp, Calendar, Briefcase 
} from "lucide-react";

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  attendanceRate: number;
  pendingTasks: number;
  overdueTasks: number;
  performance: number;
}

interface Activity {
  time: string;
  event: string;
  department: string;
  type?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    attendanceRate: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    performance: 0,
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data = await res.json();
      
      setStats({
        totalEmployees: data.totalEmployees || 1248,
        presentToday: data.presentToday || 892,
        attendanceRate: data.attendanceRate || 71,
        pendingTasks: data.pendingTasks || 47,
        overdueTasks: data.overdueTasks || 12,
        performance: data.performance || 92,
      });

      setActivities(data.recentActivities || [
        { time: "10:32 am", event: "Sarah Ahmed checked in", department: "Marketing" },
        { time: "09:45 am", event: "Salary processed for 45 employees", department: "Finance" },
      ]);
    } catch (error) {
      console.error("Dashboard data fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Good morning, Rahim 👋</h2>
          <p className="text-muted-foreground">Here's what's happening in your office today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" /> Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalEmployees.toLocaleString()}</p>
              <p className="text-emerald-600 text-sm mt-1">↑ 12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" /> Present Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.presentToday}</p>
              <p className="text-emerald-600 text-sm mt-1">{stats.attendanceRate}% attendance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                📋 Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.pendingTasks}</p>
              <p className="text-amber-600 text-sm mt-1">{stats.overdueTasks} overdue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Award className="h-4 w-4" /> Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.performance}%</p>
              <p className="text-emerald-600 text-sm mt-1">↑ 3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-7 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.department}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start bg-muted/50 p-4 rounded-2xl">
                <div className="text-2xl">🕘</div>
                <div>
                  <p className="font-semibold">Team Meeting</p>
                  <p className="text-sm text-muted-foreground">11:00 AM • Conference Room A</p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-muted/50 p-4 rounded-2xl">
                <div className="text-2xl">📍</div>
                <div>
                  <p className="font-semibold">Payroll Approval</p>
                  <p className="text-sm text-muted-foreground">Deadline: Today 5:00 PM</p>
                </div>
              </div>

              <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">
                View Full Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}