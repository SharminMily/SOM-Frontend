"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Trash2, Search, ListTodo } from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useProjectStore } from "@/lib/store/project.store";
import { CreateProjectDialog } from "@/components/projects/createProjectModal";
import { EditProjectDialog } from "@/components/projects/editProjectModal";

export default function ProjectsPage() {
  const { projects, getProjects, deleteProject } = useProjectStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getProjects();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    if (status === "ACTIVE") return "bg-blue-100 text-blue-700";
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "PLANNING") return "bg-purple-100 text-purple-700";
    if (status === "ON_HOLD") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage company projects</p>
        </div>
        <CreateProjectDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search project..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          {filteredProjects.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No projects found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.title}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${project.progress ?? 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {project.progress ?? 0}%
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {/* ✅ Navigate to tasks for this project */}
                        <Link
                          href={`/dashboard/admin/projects/${project.id}/tasks`}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            title="View Tasks"
                          >
                            <ListTodo size={16} />
                          </Button>
                        </Link>

                        <EditProjectDialog project={project} />

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteProject(project.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}