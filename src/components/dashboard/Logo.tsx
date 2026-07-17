"use client";

import { Briefcase } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0_0_18px_rgba(16,185,129,.35)]">
        <Briefcase className="h-4 w-4 text-white" />
      </div>
      <div className="whitespace-nowrap">
        <p className="font-bold text-lg leading-none">SOM</p>
        <p className="text-[10px] text-[#7fa89a] tracking-wider">Smart Office Management</p>
      </div>
    </div>
  );
}