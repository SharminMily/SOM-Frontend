"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import UserDropdown from "./UserDropdown";

interface Props {
  onMenuClick: () => void;
  name: string;
  role: string;
  avatarUrl?: string;
}

export default function Navbar({ onMenuClick, name, role, avatarUrl }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
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

  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 flex items-center justify-between gap-2 px-3 sm:px-6 border-b border-emerald-900/10 dark:border-emerald-900/20 bg-white/80 dark:bg-[#081811]/80 backdrop-blur-md">
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 text-[#4b5f57] dark:text-[#9cb8ae]"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-[#4b5f57] dark:text-[#9cb8ae]"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
          ) : (
            <span className="w-5 h-5 block" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <UserDropdown name={name} role={role} avatarUrl={avatarUrl} />
        <Button
          variant="destructive"
          size="sm"
          onClick={handleLogout}
          className="rounded-lg font-medium shrink-0"
        >
          <span className="hidden sm:inline">Logout</span>
          <LogOut className="w-4 h-4 sm:hidden" />
        </Button>
      </div>
    </header>
  );
}