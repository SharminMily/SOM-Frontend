import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";

import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  CalendarCheck,
  Wallet,
  KanbanSquare,
  Megaphone,
  Building2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/shared/footer/Footer";
import { Metadata } from "next";

interface Metric {
  value: string;
  label: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const METRICS: Metric[] = [
  { value: "1,248", label: "Active employees" },
  { value: "4.2 min", label: "Avg. clock-in time" },
  { value: "96%", label: "Leave requests resolved same day" },
  { value: "99.9%", label: "Platform uptime" },
];

const FEATURES: Feature[] = [
  {
    icon: Clock,
    title: "Attendance",
    description:
      "One-tap clock in/out with a live daily timer, so hours are tracked automatically — not typed in after the fact.",
  },
  {
    icon: CalendarCheck,
    title: "Leave management",
    description:
      "Employees apply, managers approve — with real-time balances so nobody has to guess how many days are left.",
  },
  {
    icon: Wallet,
    title: "Payroll",
    description:
      "Generate monthly payroll from attendance data automatically, and keep every payslip in one searchable place.",
  },
  {
    icon: KanbanSquare,
    title: "Projects & tasks",
    description:
      "Assign work, track status from to-do to done, and keep the conversation attached to the task, not buried in chat.",
  },
  {
    icon: Megaphone,
    title: "Announcements",
    description:
      "Pin what matters to the whole company, and know it reached every desk instead of getting lost in email.",
  },
  {
    icon: Building2,
    title: "Departments & teams",
    description:
      "Organize people into departments and reporting lines that mirror how your office actually works.",
  },
];

export const metadata: Metadata = { title: "Home — SOM" }; 

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>

      {/* ---------- Hero ---------- */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side */}
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
              Smart Office Management
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                Modern Office
                <br />
                Management
              </h1>

              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Manage employees, workflow, meetings, productivity,
                and office operations from one smart dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-slate-200 h-12 px-8 rounded-2xl font-semibold"
              >
                Get Started
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white h-12 px-8 rounded-2xl"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-6">
              <div>
                <h2 className="text-3xl font-bold">10K+</h2>
                <p className="text-slate-500">Users</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">99%</h2>
                <p className="text-slate-500">Efficiency</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">24/7</h2>
                <p className="text-slate-500">Support</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="relative">
            <Card className="border border-border shadow-xl backdrop-blur-2xl rounded-3xl overflow-hidden bg-card">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Employees</p>
                    <h2 className="text-5xl font-bold mt-2 text-foreground">1,248</h2>
                  </div>

                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-3xl">
                    ⚡
                  </div>
                </div>

                <div className="space-y-6">
                  <ProgressRow label="Productivity" value={86} />
                  <ProgressRow label="Task Completion" value={72} />
                  <ProgressRow label="Team Performance" value={91} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ---------- Metrics strip ---------- */}
      <section className="border-y border-border bg-card/40">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {METRICS.map((metric) => (
              <div key={metric.label} className="space-y-1">
                <p className="font-mono text-3xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="max-w-2xl space-y-4 mb-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Everything, in one place
          </p>
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight">
            Run the whole office from one dashboard
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            SOM replaces the spreadsheet-and-email patchwork most offices run
            on with a single system your team already knows how to use.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border border-border bg-card rounded-2xl transition-colors hover:border-primary/50"
              >
                <CardContent className="p-7 space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container mx-auto px-6 py-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_55%)]" />
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight">
            Ready to run a smarter office?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400 text-lg">
            Set up attendance, leave, and payroll in one afternoon — and give
            your team back the hours they spend chasing admin.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-slate-200 h-12 px-8 rounded-2xl font-semibold"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white h-12 px-8 rounded-2xl gap-2"
            >
              Talk to sales
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {value}%
        </span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}