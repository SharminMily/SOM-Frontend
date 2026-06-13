"use client";

import { useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { useTaskStore, type Task } from "@/lib/store/task.store";

export function EditTaskDialog({ task }: { task: Task }) {
  const { updateTask } = useTaskStore();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate?.slice(0, 10) ?? "",
  });

  const handleUpdate = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      await updateTask(task.id, {
        ...form,
        dueDate: form.dueDate || undefined,
      });

      toast.success("Task updated successfully");
      setOpen(false);
    } catch {
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
          />

          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
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

          <Button className="w-full" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}