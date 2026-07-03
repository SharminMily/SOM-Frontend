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
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

type Announcement = {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isCompanyWide: boolean;
};

type Leave = {
  id: string;
  leaveType: string;
  status: string;

  user: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
};

type Task = {
  id: string;
  title: string;
  status: string;

  assignedTo: {
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };

  project: {
    id: string;
    title: string;
    progress: number;
    status: string;
  };
};

type DashboardData = {
  manager: {
    firstName: string;
    lastName: string;
  };

  stats: {
    teamMembers: number;
    activeProjects: number;
    pendingLeaveRequests: number;
    totalAttendance: number;
    presentToday: number;
    lateToday: number;
    absentToday: number;
    teamPerformance: number;
  };

  announcements: Announcement[];

  recentLeaves: Leave[];

  recentTasks: Task[];
};

export default function ManagerDashboard() {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
 const loadDashboard = async () => {
  try {
    const data = await dashboardApi.getManagerDashboard();

    console.log(data);

    setDashboard(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dashboard) {
    return <div>No data found.</div>;
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Welcome Back,
          {" "}
          {dashboard.manager.firstName} 👋
        </h1>

        <p className="text-muted-foreground">
          Here's an overview of your team today.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Team Members
              </p>

              <h2 className="text-3xl font-bold">
                {dashboard.stats.teamMembers}
              </h2>
            </div>

            <Users className="h-9 w-9" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Active Projects
              </p>

              <h2 className="text-3xl font-bold">
                {dashboard.stats.activeProjects}
              </h2>
            </div>

            <Briefcase className="h-9 w-9" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Leaves
              </p>

              <h2 className="text-3xl font-bold">
                {dashboard.stats.pendingLeaveRequests}
              </h2>
            </div>

            <CalendarDays className="h-9 w-9" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Team Performance
              </p>

              <h2 className="text-3xl font-bold">
                {dashboard.stats.teamPerformance}%
              </h2>
            </div>

            <TrendingUp className="h-9 w-9" />
          </CardContent>
        </Card>

      </div>

      {/* Attendance */}

      <Card>
        <CardHeader>
          <CardTitle>
            Today's Attendance
          </CardTitle>
        </CardHeader>

        <CardContent className="flex gap-4 flex-wrap">

          <Badge>
            Present :
            {" "}
            {dashboard.stats.presentToday}
          </Badge>

          <Badge variant="secondary">
            Late :
            {" "}
            {dashboard.stats.lateToday}
          </Badge>

          <Badge variant="destructive">
            Absent :
            {" "}
            {dashboard.stats.absentToday}
          </Badge>

        </CardContent>
      </Card>

      {/* Leave */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays size={18} />
            Recent Leave Requests
          </CardTitle>
        </CardHeader>

        <CardContent>

          {dashboard.recentLeaves.length === 0 ? (
            <p>No Leave Requests</p>
          ) : (
            dashboard.recentLeaves.map((leave: any) => (
              <div
                key={leave.id}
                className="flex justify-between py-2 border-b"
              >
                <span>
                  {leave.user.firstName}
                  {" "}
                  {leave.user.lastName}
                </span>

                <Badge>{leave.status}</Badge>
              </div>
            ))
          )}

        </CardContent>
      </Card>

      {/* Tasks */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={18} />
            Recent Tasks
          </CardTitle>
        </CardHeader>

        <CardContent>

          {dashboard.recentTasks.length === 0 ? (
            <p>No Tasks</p>
          ) : (
            dashboard.recentTasks.map((task: any) => (
              <div
                key={task.id}
                className="flex justify-between py-2 border-b"
              >
                <div>
                  <p className="font-medium">
                    {task.title}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {task.project.title}
                  </p>
                </div>

                <Badge>{task.status}</Badge>
              </div>
            ))
          )}

        </CardContent>
      </Card>

      {/* Announcements */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} />
            Announcements
          </CardTitle>
        </CardHeader>

        <CardContent>

          {dashboard.announcements.length === 0 ? (
            <p>No Announcements</p>
          ) : (
            dashboard.announcements.map((item: any) => (
              <div
                key={item.id}
                className="py-2 border-b"
              >
                <p className="font-medium">
                  {item.title}
                </p>

                <p className="text-sm text-muted-foreground">
                  {item.content}
                </p>
              </div>
            ))
          )}

        </CardContent>
      </Card>

    </div>
  );
}