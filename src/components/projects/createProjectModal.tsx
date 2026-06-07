"use client";

import { useState } from "react";
import { useProjectStore } from "@/lib/store/project.store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Plus } from "lucide-react";

export function CreateProjectDialog() {
  const { createProject, getProjects } =
    useProjectStore();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "ACTIVE",
    progress: 0,
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await createProject(form);

      await getProjects();

      setForm({
        title: "",
        description: "",
        status: "ACTIVE",
        progress: 0,
        startDate: "",
        endDate: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Create Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            placeholder="Project Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <Textarea
            placeholder="Project Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <Input
            type="number"
            placeholder="Progress"
            value={form.progress}
            onChange={(e) =>
              setForm({
                ...form,
                progress: Number(
                  e.target.value
                ),
              })
            }
          />

          <Input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
          />

          <Input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value,
              })
            }
          />

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Project"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}