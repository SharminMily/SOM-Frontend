"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { sidebarItems } from "@/config/sidebar-items";

interface Props {
  role: string;
}

export default function Sidebar({ role }: Props) {
  const pathname = usePathname();

  const items =
    sidebarItems[role as keyof typeof sidebarItems] || [];

  return (
    <aside className="w-72 h-screen border-r border-emerald-900/20 bg-[#081811]">
      <div className="p-6">
        <Logo />
      </div>

      <nav className="px-3 space-y-2">
      {items.map((item) => {
  const active =
    pathname === item.href ||
    pathname.startsWith(item.href + "/");

  const Icon = item.icon;

  return (
    <Link key={item.href} href={item.href}>
      <div
        className={`flex items-center gap-3 my-2 px-4 py-2 rounded-xl transition-all
        ${
          active
            ? "bg-emerald-500 text-white"
            : "text-[#9cb8ae] hover:bg-emerald-500/10"
        }`}
      >
        {Icon ? <Icon className="w-5 h-5" /> : null}
        <span>{item.title}</span>
      </div>
    </Link>
  );
})}
      </nav>
    </aside>
  );
}