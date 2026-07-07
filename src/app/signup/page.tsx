import type { Metadata } from "next";

import { SignupForm } from "../Auth/SignupForm";
import { AuthLeftPanel } from "../Auth/AuthLeftPanel";

export const metadata: Metadata = { title: "Create account — SOM" };

export default function SignupPage() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-emerald-500/20 dark:border-emerald-400/20 shadow-xl shadow-black/10 dark:shadow-black/70 bg-background">
        <AuthLeftPanel
          headline={<>Join <em className="not-italic text-emerald-600 dark:text-[#10B981]">thousands</em> of teams already running smarter</>}
          subtext="Set up your workspace in minutes. Choose your role and start managing from day one."
          features={[
            { icon: "👥", label: "Four access levels",  value: "Admin · HR · Manager · Employee" },
            { icon: "🔐", label: "Enterprise security",  value: "JWT + bcrypt + httpOnly cookies"        },
            { icon: "⚡", label: "Production-ready",     value: "Next.js 16 + Node + PostgreSQL"         },
          ]}
        />
        <SignupForm />
      </div>
    </div>
  );
}