"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useTaskStore } from "@/lib/store/task.store";

interface CreateTaskDialogProps {
  projectId: string;
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
  const { createTask } = useTaskStore();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultForm = {
    title: "",
    description: "",
    priority: "MEDIUM" as const,
    status: "TODO" as const,
    dueDate: "",
  };

  const [form, setForm] = useState(defaultForm);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      await createTask(projectId, {
        ...form,
        dueDate: form.dueDate || undefined,
      });

      toast.success("Task created successfully");
      setOpen(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <Textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Select
            value={form.priority}
            onValueChange={(val) =>
              setForm({ ...form, priority: val as typeof form.priority })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.status}
            onValueChange={(val) =>
              setForm({ ...form, status: val as typeof form.status })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />

          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}