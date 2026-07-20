"use client";

import { useState, useEffect } from "react";
import { Building2, Search, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { USER_ROLE } from "@/constants/roles";
import { useSearch } from "../context/SearchContext";

export function Navbar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();

  const user = useAuthStore((s) => s.user);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);


  const PROFILE_ROUTES: Record<string, string> = {
    [USER_ROLE.ADMIN]: "/dashboard/admin",
    [USER_ROLE.MANAGER]: "/dashboard/manager",
    [USER_ROLE.EMPLOYEE]: "/dashboard/employee",
  }

  // avoid hydration mismatch: auth state SSR-e undefined thake
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "U";

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-bold text-foreground tracking-tight">SOM</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-11 bg-muted focus-visible:ring-[#10B981]"
  />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* <NotificationBell /> */}
          <ThemeToggle />

          {!mounted ? (
            // avoid flash / mismatch during initial hydration
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[#10B981]">
                  <Avatar className="h-9 w-9 border border-primary/30">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.firstName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href={PROFILE_ROUTES[user.role] ?? "/dashboard"} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                size="icon"
                className="lg:inline-flex border border-primary text-primary bg-primary hover:bg-white text-white hover:text-primary px-6 py-2 rounded font-semibold"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}