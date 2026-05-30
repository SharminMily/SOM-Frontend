"use client";

import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";


export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-[#10B981] flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight ">
              SOM
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Smart Office Management</p>
          </div>
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

           <Button
              variant="ghost"
              size="icon"
              className=" lg:inline-flex border border-primary text-primary bg-primary hover:bg-white text-white  hover:text-primary px-6 py-2 rounded font-semibold"
            >         login
              
            </Button>

        </div>
      </div>
    </nav>
  );
}