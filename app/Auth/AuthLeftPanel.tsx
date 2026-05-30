import React from "react";
import { Briefcase } from "lucide-react";

interface Feature {
  icon: string;
  label: string;
  value: string;
}

interface AuthLeftPanelProps {
  headline: React.ReactNode;
  subtext: string;
  features: Feature[];
}

export function AuthLeftPanel({ headline, subtext, features }: AuthLeftPanelProps) {
  return (
    <div
      className="hidden md:flex flex-col justify-between relative overflow-hidden p-12"
      style={{
        background: "linear-gradient(160deg, #0a1f18 0%, #082618 60%, #061a10 100%)",
      }}
    >
      {/* Radial glows */}
      <div
        className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(16,185,129,.12),transparent 70%)" }}
      />
      <div
        className="absolute -bottom-16 -left-10 w-[220px] h-[220px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(16,185,129,.07),transparent 70%)" }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,1) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,1) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] shadow-[0_0_18px_rgba(16,185,129,.35)]">
          <Briefcase className="h-4 w-4 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <p className="font-display font-bold text-white text-[17px] leading-none">SOM</p>
          <p className="text-[9.5px] text-[#3d6055] uppercase tracking-[.12em] mt-0.5">
            Super Office Mgmt
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
        <h2 className="font-display text-[26px] font-bold leading-[1.2] tracking-[-0.6px] text-white mb-3">
          {headline}
        </h2>
        <p className="text-[13.5px] text-[#7fa89a] leading-relaxed mb-8">{subtext}</p>

        <div className="flex flex-col gap-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
              style={{
                background: "rgba(16,185,129,.07)",
                border: "1px solid rgba(16,185,129,.12)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0"
                style={{
                  background: "rgba(16,185,129,.15)",
                  border: "1px solid rgba(16,185,129,.2)",
                }}
              >
                {f.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-[#7fa89a]">{f.label}</p>
                <p className="font-display text-[13px] font-semibold text-white leading-tight">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 text-[11px] text-[#3d6055]">
        © {new Date().getFullYear()} SOM — All rights reserved
      </p>
    </div>
  );
}