"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "./Logo";
import { sidebarItems } from "@/config/sidebar-items";

interface Props {
  role: string;
}

export default function Sidebar({ role }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

 
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const allItems = sidebarItems[role as keyof typeof sidebarItems] || [];

 
  const homeItem = allItems.find((item) => item.title.toLowerCase() === "home");
  const items = allItems.filter((item) => item.title.toLowerCase() !== "home");

  // FIX: root ("/") href er jonno exact match, baki gulor jonno startsWith
  const isActive = (href: string) => pathname === href;

  const renderItem = (item: (typeof allItems)[number]) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.title : undefined}
      >
        <div
          className={`flex items-center my-2 rounded-xl transition-all duration-200
          ${collapsed ? "justify-center px-2 py-2" : "gap-3 px-4 py-2"}
          ${
            active
              ? "bg-emerald-500 text-white"
              : "text-[#4b5f57] dark:text-[#9cb8ae] hover:bg-emerald-500/10"
          }`}
        >
          {Icon ? <Icon className="w-5 h-5 shrink-0" /> : null}
          {!collapsed && (
            <span className="whitespace-nowrap">{item.title}</span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <aside
      className={`h-screen flex flex-col border-r transition-all duration-300
      border-emerald-900/10 dark:border-emerald-900/20
      bg-white dark:bg-[#081811]
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Top: Logo + collapse toggle */}
      <div
        className={`flex items-center p-4 ${
          collapsed ? "justify-center" : "justify-between px-6 py-6"
        }`}
      >
        {!collapsed && <Logo />}
       <button
  onClick={toggleCollapsed}
  className="hidden lg:inline-flex p-2 rounded-lg text-[#4b5f57] dark:text-[#9cb8ae] hover:bg-emerald-500/10 transition-colors"
  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
>
  {collapsed ? (
    <ChevronRight className="w-5 h-5" />
  ) : (
    <ChevronLeft className="w-5 h-5" />
  )}
</button>
      </div>

      {/* Main nav items */}
      <nav className="px-3 space-y-2 flex-1 overflow-y-auto">
        {items.map(renderItem)}
      </nav>

      {/* Home always pinned at the bottom */}
      {homeItem && (
        <div className="px-3 pb-4 pt-3 border-t border-emerald-900/10 dark:border-emerald-900/20">
          {renderItem(homeItem)}
        </div>
      )}
    </aside>
  );
}