'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, Users, Calendar, FileText, 
  Briefcase, Bell, Menu, X, Sun, Moon 
} from 'lucide-react';
import { useTheme } from 'next-themes';

type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;          
  userName?: string;
  avatarUrl?: string;
}

export default function DashboardLayout({
  children,
  userRole = 'EMPLOYEE',        
  userName = "Ayesa",
  avatarUrl,
}: DashboardLayoutProps) {


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const adminMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admin' },
    { icon: Users, label: 'All Users', href: '/dashboard/users' },
    { icon: Users, label: 'Departments', href: '/dashboard/departments' },
    { icon: Calendar, label: 'Leave Requests', href: '/dashboard/leaves' },
    { icon: Briefcase, label: 'All Projects', href: '/dashboard/projects' },
    { icon: Bell, label: 'Announcements', href: '/dashboard/announcements' },
  ];

  const managerMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/manager' },
    { icon: Users, label: 'My Team', href: '/dashboard/team' },
    { icon: Calendar, label: 'Leave Requests', href: '/dashboard/leaves' },
    { icon: Briefcase, label: 'Projects', href: '/dashboard/projects' },
    { icon: Bell, label: 'Announcements', href: '/dashboard/announcements' },
  ];

  const employeeMenu = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/employee' },
    { icon: Calendar, label: 'Attendance', href: '/dashboard/attendance' },
    { icon: FileText, label: 'My Leaves', href: '/dashboard/my-leaves' },
    { icon: Briefcase, label: 'My Tasks', href: '/dashboard/tasks' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  ];

  // Role menu
  const menuItems = 
    userRole === 'ADMIN' ? adminMenu :
    userRole === 'MANAGER' ? managerMenu : 
    employeeMenu;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 
        border-r border-zinc-200 dark:border-zinc-800 
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">SOM</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Separator />

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start gap-3 h-11"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-medium text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-zinc-50 dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}