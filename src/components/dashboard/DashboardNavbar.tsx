"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import UserDropdown from "./UserDropdown";

interface Props {
  onMenuClick: () => void;
  name: string;
  role: string;
}

export default function Navbar({ onMenuClick, name, role }: Props) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="h-16 border-b bg-background px-6 flex items-center">

      {/* LEFT SIDE (Menu + Theme + User) */}
      <div className="flex items-center gap-4">

        {/* MENU */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu />
        </Button>

        {/* THEME */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>

        {/* USER */}
        <UserDropdown name={name} role={role} />
     
      </div>

      {/* RIGHT SIDE (Logout only) */}
      <div className="ml-auto">
        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

    </header>
  );
}