"use client";

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

interface ManagerDashboardProps {
  user?: {
    name?: string;
  };
}

// console.log("Rendering Manager Dashboard with user:", user);

export default function ManagerDashboard({
  user,
}: ManagerDashboardProps) {
  const managerName = user?.name || "Manager0";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome Back, {managerName} 👋
        </h1>

        <p className="text-muted-foreground mt-2">
          Here's an overview of your team and organization today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Team Members
                </p>
                <h2 className="text-3xl font-bold">
                  No Information
                </h2>
              </div>

              <Users className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Projects
                </p>
                <h2 className="text-3xl font-bold">
                  No Information
                </h2>
              </div>

              <Briefcase className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Pending Leave Requests
                </p>
                <h2 className="text-3xl font-bold">
                  No Information
                </h2>
              </div>

              <CalendarDays className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Team Performance
                </p>
                <h2 className="text-3xl font-bold">
                  No Information
                </h2>
              </div>

              <TrendingUp className="h-10 w-10 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Team Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={18} />
              Team Updates
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No Information Available
            </div>
          </CardContent>
        </Card>

        {/* Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays size={18} />
              Leave Requests
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No Information Available
            </div>
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
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No Information Available
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} />
              Recent Activities
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No Information Available
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Manager Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <Badge variant="secondary">
            No Information Available
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}