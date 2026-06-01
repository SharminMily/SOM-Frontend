
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Clock, TrendingUp, Calendar, Award } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <nav className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-bold text-2xl">SOM</h1>
        </div>

        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Search employees, tasks..."
            className="w-80 bg-muted px-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">🛎️</Button>
            <Button variant="ghost" size="icon">📅</Button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium">Rahim Khan</p>
                <p className="text-xs text-emerald-600">Admin</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-lg">
                👨‍💼
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card h-[calc(100vh-73px)] p-5">
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 text-emerald-600 font-medium">
              <TrendingUp className="h-5 w-5" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted text-muted-foreground hover:text-foreground transition">
              👥 Employees
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted text-muted-foreground hover:text-foreground transition">
              ⏰ Attendance
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted text-muted-foreground hover:text-foreground transition">
              💰 Payroll
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted text-muted-foreground hover:text-foreground transition">
              📋 Projects
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-muted text-muted-foreground hover:text-foreground transition">
              📊 Reports
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
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
                <p className="text-4xl font-bold">1,248</p>
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
                <p className="text-4xl font-bold">892</p>
                <p className="text-emerald-600 text-sm mt-1">71% attendance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  📋 Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">47</p>
                <p className="text-amber-600 text-sm mt-1">12 overdue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" /> Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">92%</p>
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
                  {[
                    { time: "10:32 am", event: "Sarah Ahmed checked in", dept: "Marketing" },
                    { time: "09:45 am", event: "Salary processed for 45 employees", dept: "Finance" },
                    { time: "09:20 am", event: "Project 'Website Redesign' milestone completed", dept: "IT" },
                    { time: "08:55 am", event: "New employee joined - Tanvir Hossain", dept: "HR" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">{item.dept}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links / Today's Schedule */}
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
        </main>
      </div>
    </div>
  );
}