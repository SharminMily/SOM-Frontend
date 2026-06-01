'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, TrendingUp } from 'lucide-react';

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome Back, Ayesa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attendance Card */}
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" /> Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">09:15 AM</div>
            <Badge variant="secondary" className="mt-2">PRESENT</Badge>
            <Button className="w-full mt-4">Clock Out</Button>
          </CardContent>
        </Card>

        {/* Leave Balance */}
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Annual</span>
              <span className="font-medium">18/20</span>
            </div>
            <div className="flex justify-between">
              <span>Sick</span>
              <span className="font-medium">7/10</span>
            </div>
            <div className="flex justify-between">
              <span>Casual</span>
              <span className="font-medium">4/5</span>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>UI Design for Dashboard</span>
                <Badge>High</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>API Integration</span>
                <Badge variant="secondary">In Progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll */}
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Last Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">৳65,400</div>
            <p className="text-sm text-green-600">Paid on May 30, 2026</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table or list */}
          </CardContent>
        </Card>

        <Card className="dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Company picnic on June 15th</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}