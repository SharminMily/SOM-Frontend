'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  Briefcase, 
  SquareCheck, 
  DollarSign, 
  Bell, 
  Menu, 
  X, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from 'next-themes';

type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  roles: UserRole[];        // Which roles can see this item
}

// ==================== DYNAMIC MENU CONFIG ====================
const menuConfig: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    icon: Users,
    label: 'All Users',
    href: '/dashboard/users',
    roles: ['ADMIN'],
  },
  {
    icon: Users,
    label: 'My Team',
    href: '/dashboard/team',
    roles: ['MANAGER'],
  },
  {
    icon: Building2,
    label: 'Departments',
    href: '/dashboard/departments',
    roles: ['ADMIN'],
  },
  {
    icon: Calendar,
    label: 'Attendance Overview',
    href: '/dashboard/attendance',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    icon: Calendar,
    label: 'My Attendance',
    href: '/dashboard/attendance',
    roles: ['EMPLOYEE'],
  },
  {
    icon: FileText,
    label: 'Leave Management',
    href: '/dashboard/leaves',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    icon: FileText,
    label: 'My Leaves',
    href: '/dashboard/my-leaves',
    roles: ['EMPLOYEE'],
  },
  {
    icon: DollarSign,
    label: 'Payroll',
    href: '/dashboard/payroll',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    icon: DollarSign,
    label: 'My Payroll',
    href: '/dashboard/payroll',
    roles: ['EMPLOYEE'],
  },
  {
    icon: Briefcase,
    label: 'All Projects',
    href: '/dashboard/projects',
    roles: ['ADMIN'],
  },
  {
    icon: Briefcase,
    label: 'My Projects',
    href: '/dashboard/projects',
    roles: ['MANAGER', 'EMPLOYEE'],
  },
  {
    icon: SquareCheck,
    label: 'Team Tasks',
    href: '/dashboard/tasks',
    roles: ['MANAGER'],
  },
  {
    icon: SquareCheck,
    label: 'My Tasks',
    href: '/dashboard/tasks',
    roles: ['EMPLOYEE'],
  },
  {
    icon: Bell,
    label: 'Announcements',
    href: '/dashboard/announcements',
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    icon: Bell,
    label: 'Notifications',
    href: '/dashboard/notifications',
    roles: ['EMPLOYEE'],
  },
];

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

  // Filter menu items based on current user role
  const menuItems = menuConfig.filter(item => 
    item.roles.includes(userRole)
  );

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
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
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
                <AvatarFallback>{userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="font-medium text-sm">{userName}</p>
              
                <p className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</p>
              </div>
            </div>
          </div>

            <Button className='bg-red-500'>Logout</Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-zinc-50 dark:bg-black">
          {children}
        </main>        
      </div>
    </div>
  );
}