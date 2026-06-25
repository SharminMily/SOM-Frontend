"use client";

import { useEffect, useState } from "react";
import { projectApi } from "@/lib/api/project.api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Search, FolderOpen } from "lucide-react";

// ─── types ───────────────────────────────────────────────────────────────────

type ProjectStatus = "ACTIVE" | "PLANNING" | "ON_HOLD" | "COMPLETED";

interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress?: number;
  deadline?: string;
  startDate?: string;
  members?: { id: string; name: string }[];
}

type StatusConfigItem = {
  label: string;
  badge: string;
  accent: string;
  fill: string;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function extractArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.projects)) return res.data.projects;
  if (Array.isArray(res?.projects)) return res.projects;
  return [];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  { bg: "#CECBF6", text: "#534AB7" },
  { bg: "#9FE1CB", text: "#0F6E56" },
  { bg: "#FAC775", text: "#854F0B" },
  { bg: "#F5C4B3", text: "#993C1D" },
  { bg: "#B5D4F4", text: "#185FA5" },
  { bg: "#C0DD97", text: "#3B6D11" },
];

const STATUS_CONFIG: { [key in ProjectStatus]: StatusConfigItem } = {
  ACTIVE: {
    label: "Active",
    badge: "bg-[#E1F5EE] text-[#0F6E56] border-[#5DCAA5]",
    accent: "#1D9E75",
    fill: "#1D9E75",
  },
  PLANNING: {
    label: "Planning",
    badge: "bg-[#E6F1FB] text-[#185FA5] border-[#85B7EB]",
    accent: "#378ADD",
    fill: "#378ADD",
  },
  ON_HOLD: {
    label: "On hold",
    badge: "bg-[#FAEEDA] text-[#854F0B] border-[#EF9F27]",
    accent: "#EF9F27",
    fill: "#EF9F27",
  },
  COMPLETED: {
    label: "Completed",
    badge: "bg-[#EEEDFE] text-[#534AB7] border-[#AFA9EC]",
    accent: "#7F77DD",
    fill: "#7F77DD",
  },
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All",       value: "ALL"       },
  { label: "Active",    value: "ACTIVE"    },
  { label: "Planning",  value: "PLANNING"  },
  { label: "On hold",   value: "ON_HOLD"   },
  { label: "Completed", value: "COMPLETED" },
];

// ─── sub-components ───────────────────────────────────────────────────────────

function MemberAvatars({
  members,
}: {
  members: { id: string; name: string }[];
}) {
  const visible = members.slice(0, 3);
  const extra = members.length - visible.length;
  return (
    <div className="flex items-center">
      {visible.map((m, i) => {
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
        return (
          <div
            key={m.id}
            title={m.name}
            className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-medium"
            style={{
              background: color.bg,
              color: color.text,
              marginLeft: i === 0 ? 0 : -6,
            }}
          >
            {initials(m.name)}
          </div>
        );
      })}
      {extra > 0 && (
        <div
          className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] text-muted-foreground bg-muted"
          style={{ marginLeft: -6 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const cfg: StatusConfigItem =
    STATUS_CONFIG[project.status] ?? STATUS_CONFIG["PLANNING"];
  const progress = project.progress ?? 0;
  const members = project.members ?? [];

  return (
    <Card className="rounded-xl border shadow-none overflow-hidden flex flex-col">
      <div className="h-[3px]" style={{ background: cfg.accent }} />

      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="p-4 flex flex-col gap-3 flex-1">

          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug line-clamp-2">
              {project.name}
            </p>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0 ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>

          {project.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: cfg.fill }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {project.deadline
                ? new Date(project.deadline).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No deadline"}
            </div>
            {members.length > 0 && <MemberAvatars members={members} />}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function MyProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getAllProjects();
      setProjects(extractArray(res));
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const total     = projects.length;
  const active    = projects.filter((p) => p.status === "ACTIVE").length;
  const completed = projects.filter((p) => p.status === "COMPLETED").length;

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === "ALL" || p.status === filter;
    const matchesSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-muted/30 p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-medium">My projects</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Projects you are assigned to
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total",     value: total,     color: "text-foreground"  },
          { label: "Active",    value: active,    color: "text-[#0F6E56]"   },
          { label: "Completed", value: completed, color: "text-[#534AB7]"   },
        ].map(({ label, value, color }) => (
          <Card key={label} className="rounded-xl border shadow-none">
            <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                {label}
              </p>
              <p className={`text-2xl font-medium ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filter === f.value
                  ? "bg-[#E6F1FB] text-[#185FA5] border-[#85B7EB]"
                  : "bg-background text-muted-foreground border-border hover:bg-muted/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-10">
          <Clock className="w-4 h-4 animate-spin" />
          Loading projects…
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 border rounded-xl bg-background text-muted-foreground">
          <FolderOpen className="w-10 h-10" />
          <p className="text-sm">
            {search || filter !== "ALL"
              ? "No projects match your search"
              : "You have no projects yet"}
          </p>
          {(search || filter !== "ALL") && (
            <button
              onClick={() => { setSearch(""); setFilter("ALL"); }}
              className="text-xs text-[#185FA5] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

    </div>
  );
}