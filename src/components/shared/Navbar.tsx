"use client";

import { useState } from "react";
import { Building2, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import Link from "next/link";


export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
              className="pl-11 bg-muted focus-visible:ring-[#10B981]"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-auto">
          <NotificationBell />
          <ThemeToggle />
           

          {/* <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button> */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="lg:hidden md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <Search className="h-5 w-5" />
          </Button> */}

         <Link href="/login">
  <Button
    variant="ghost"
    size="icon"
    className="lg:inline-flex border border-primary text-primary bg-primary hover:bg-white text-white hover:text-primary px-6 py-2 rounded font-semibold"
  >
    Login
  </Button>
</Link>

        </div>
      </div>
    </nav>
  );
}