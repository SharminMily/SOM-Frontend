import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Replace with real DB queries based on user.role
  const data = {
    totalEmployees: 1248,
    presentToday: 892,
    attendanceRate: 71,
    pendingTasks: user.role === 'ADMIN' ? 47 : 12,
    overdueTasks: 12,
    performance: 92,
    recentActivities: [
      { time: "10:32 am", event: "Sarah Ahmed checked in", department: "Marketing" },
      { time: "09:45 am", event: "Salary processed for 45 employees", department: "Finance" },
      { time: "09:20 am", event: "Project 'Website Redesign' milestone completed", department: "IT" },
    ]
  };

  return NextResponse.json(data);
}