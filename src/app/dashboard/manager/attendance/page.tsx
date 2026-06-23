"use client";

import MyAttendanceTab from "@/components/attendance/MyAttendanceTab";
import TeamAttendanceTab from "@/components/attendance/TeamAttendanceTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AttendancePage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Attendance Management
        </h1>

        <p className="text-muted-foreground">
          Track your attendance and monitor your team.
        </p>
      </div>

      <Tabs
        defaultValue="my-attendance"
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="my-attendance">
            My Attendance
          </TabsTrigger>

          <TabsTrigger value="team-attendance">
            Team Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-attendance">
          <MyAttendanceTab />
        </TabsContent>

        <TabsContent value="team-attendance">
          <TeamAttendanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}