"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  CalendarCheck,
  Wallet,
  KanbanSquare,
  Megaphone,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { useSearch } from "@/components/context/SearchContext";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

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

export function FeaturesSection() {
  const { searchQuery } = useSearch();
  const query = searchQuery.trim().toLowerCase();
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  // যখনই search query খালি থেকে অ-খালি হয়, তখন একবার scroll করবে
  useEffect(() => {
    if (query && !hasScrolledRef.current) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      hasScrolledRef.current = true;
    }

    if (!query) {
      hasScrolledRef.current = false;
    }
  }, [query]);

  const filteredFeatures = FEATURES.filter((feature) => {
    if (!query) return true;
    return (
      feature.title.toLowerCase().includes(query) ||
      feature.description.toLowerCase().includes(query)
    );
  });

  return (
    <div ref={sectionRef} className="scroll-mt-24">
      {query && filteredFeatures.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No match found</p>
          <p className="text-sm mt-1">Try searching with a different keyword.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isMatch =
              query.length > 0 &&
              (feature.title.toLowerCase().includes(query) ||
                feature.description.toLowerCase().includes(query));

            return (
              <Card
                key={feature.title}
                className={`border rounded-2xl transition-colors ${
                  isMatch
                    ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                    : query
                    ? "border-border bg-card opacity-40"
                    : "border-border bg-card hover:border-primary/50"
                }`}
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
      )}
    </div>
  );
}