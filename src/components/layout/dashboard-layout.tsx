'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';

import { sidebarItems } from '@/config/sidebar-items';
import type { USER_ROLE } from '@/constants/roles';

type UserRole = keyof typeof sidebarItems;

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  userName: string;
  avatarUrl?: string | null;
}

export default function DashboardLayout({
  children,
  userRole,
  userName,
  avatarUrl,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // role-based menu
  const menuItems = sidebarItems[userRole] || [];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black">

      {/* SIDEBAR */}
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
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + '/');

            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-11"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
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

            {/* THEME */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* USER */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarUrl ?? undefined} />
                <AvatarFallback>
                  {userName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:block">
                <p className="font-medium text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole.toLowerCase()}
                </p>
              </div>
            </div>

          </div>

          <Button className="bg-red-500">Logout</Button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-zinc-50 dark:bg-black">
          {children}
        </main>

      </div>
    </div>
  );
}