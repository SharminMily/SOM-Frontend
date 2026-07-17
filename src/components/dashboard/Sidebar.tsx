"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Logo from "./Logo";
import { sidebarItems } from "@/config/sidebar-items";

interface Props {
  role: string;
  isOpen?: boolean;        // controls mobile drawer visibility
  onClose?: () => void;    // called to close mobile drawer
}

export default function Sidebar({ role, isOpen = false, onClose = () => {} }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const firstRender = useRef(true);

  // read saved collapse-state only after mount (avoids SSR mismatch)
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  // auto-close mobile drawer on route change (skip the very first mount)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // lock body scroll while mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const allItems = sidebarItems[role as keyof typeof sidebarItems] || [];
  const homeItem = allItems.find((i) => i.title.toLowerCase() === "home");
  const items = allItems.filter((i) => i.title.toLowerCase() !== "home");

  const isCollapsed = mounted && collapsed;

 const isActive = (href: string) => pathname === href;

  const renderItem = (item: (typeof allItems)[number]) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
        <div
          title={isCollapsed ? item.title : undefined}
          className={`group flex items-center gap-3 my-1 rounded-xl py-2 px-3 transition-colors duration-200
          ${isCollapsed ? "lg:justify-center lg:px-3" : "px-4"}
          ${
            active
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-[#4b5f57] dark:text-[#9cb8ae] hover:bg-emerald-00/10"
          }`}
        >
          {Icon && <Icon className="w-5 h-5 shrink-0" />}
          <span
            className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-200
            ${isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"}`}
          >
            {item.title}
          </span>
        </div>
      </Link>
    );
  };

  const sidebarBody = (isMobile: boolean) => (
    <aside
      className={`h-full flex flex-col
      bg-white dark:bg-[#081811]
      ${isMobile ? "w-72" : `border-r border-emerald-900/10 dark:border-emerald-900/20 transition-[width] duration-300 ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      w-72 overflow-x-hidden`}
    >
      <div
        className={`flex items-center justify-between px-5 py-5 shrink-0
        ${!isMobile && isCollapsed ? "lg:justify-center lg:px-2" : ""}`}
      >
        <div
          className={`overflow-hidden transition-all duration-200
          ${!isMobile && isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"}`}
        >
          <Logo />
        </div>

        {isMobile ? (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 rounded-lg text-[#4b5f57] dark:text-[#9cb8ae] hover:bg-emerald-500/10 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:inline-flex p-2 rounded-lg text-[#4b5f57] dark:text-[#9cb8ae] hover:bg-emerald-500/10 shrink-0"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}
      </div>

      <nav className="px-3 flex-1 overflow-y-auto overflow-x-hidden">{items.map(renderItem)}</nav>

      {homeItem && (
        <div className="px-3 pb-4 pt-3 border-t border-emerald-900/10 dark:border-emerald-900/20 shrink-0">
          {renderItem(homeItem)}
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop / tablet persistent sidebar */}
      <div className="hidden lg:block h-full">{sidebarBody(false)}</div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300
        ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden={!isOpen}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          className={`absolute left-0 top-0 h-full shadow-xl transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {sidebarBody(true)}
        </div>
      </div>
    </>
  );
}