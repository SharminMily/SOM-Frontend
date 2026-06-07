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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Pencil,
  Trash2,
  Search,
  Plus,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useProjectStore } from "@/lib/store/project.store";
import { CreateProjectDialog } from "@/components/projects/createProjectModal";
import { EditProjectDialog } from "@/components/projects/editProjectModal";

export default function ProjectsPage() {
  const {
    projects,
    getProjects,
    deleteProject,
  } = useProjectStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getProjects();
  }, []);

  const filteredProjects = projects.filter(
    (p) =>
      p.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Projects
          </h1>

          <p className="text-muted-foreground">
            Manage company projects
          </p>
        </div>

        <CreateProjectDialog />
      </div>

      <div className="relative">

        <Search className="absolute left-3 top-3 w-4 h-4" />

        <Input
          placeholder="Search project..."
          className="pl-10"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <Card>
        <CardContent className="pt-6">

          <Table>

            <TableHeader className="bg-primary ">
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

                  <TableCell>
                    {project.title}
                  </TableCell>

                  <TableCell>
                    {project.status}
                  </TableCell>

                  <TableCell>
                    {project.progress}%
                  </TableCell>

                  <TableCell>

                    <div className="flex gap-2">

                      <EditProjectDialog
                        project={project}
                      />

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          deleteProject(
                            project.id
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </Button>

                    </div>

                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </div>
  );
}