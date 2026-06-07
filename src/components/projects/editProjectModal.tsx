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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Pencil } from "lucide-react";

export function EditProjectDialog({
  project,
}: {
  project: any;
}) {
  const { updateProject, getProjects } =
    useProjectStore();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: project.title || "",
    description: project.description || "",
    status: project.status || "ACTIVE",
    progress: project.progress || 0,
    startDate: project.startDate?.slice(0, 10) || "",
    endDate: project.endDate?.slice(0, 10) || "",
  });



  const statusColors: Record<string, string> = {
  ACTIVE: "text-blue-600",
  COMPLETED: "text-green-600",
  ON_HOLD: "text-yellow-600",
  CANCELLED: "text-red-600",
};




  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Auto rule (optional but recommended)
      const finalData = {
        ...form,
        progress: Number(form.progress),
        status:
          Number(form.progress) >= 100
            ? "COMPLETED"
            : form.status,
      };

      await updateProject(project.id, finalData);

      await getProjects();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* TITLE */}
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

          {/* DESCRIPTION */}
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

          {/* STATUS */}
          <Select
            value={form.status}
            onValueChange={(value) =>
              setForm({
                ...form,
                status: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>

            <SelectContent>
  <SelectItem value="ACTIVE" className="text-blue-600">
    Active
  </SelectItem>

  <SelectItem value="COMPLETED" className="text-green-600">
    Completed
  </SelectItem>

  <SelectItem value="ON_HOLD" className="text-yellow-600">
    On Hold
  </SelectItem>

  <SelectItem value="CANCELLED" className="text-red-600">
    Cancelled
  </SelectItem>
</SelectContent>
          </Select>

          {/* PROGRESS */}
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="Progress %"
            value={form.progress}
            onChange={(e) =>
              setForm({
                ...form,
                progress: Number(e.target.value),
              })
            }
          />

          {/* START DATE */}
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

          {/* END DATE */}
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

          {/* SUBMIT */}
          <Button
            className="w-full"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}