"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
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

import { Search, Trash2 } from "lucide-react";

import { useTaskStore, type Task } from "@/lib/store/task.store";

import { toast } from "sonner";
import { CreateTaskDialog } from "@/components/task/CreateTaskDialog";
import { EditTaskDialog } from "@/components/task/EditTaskDialog";
import { useParams } from "next/navigation";

export default function TasksPage() {
  // useParams can return string | string[] — normalise to string
  const params = useParams();
  // console.log("ALL PARAMS:", params);
  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : (params.projectId as string);

  const { tasks, loading, getTasks, deleteTask } = useTaskStore();
  // console.log("Project ID:", projectId); // ✅ log to verify projectId is correct and not undefined
  // console.log("tasks", tasks); // ✅ log to verify projectId is correct and not undefined

  // ✅ search state was missing — added here
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (projectId) {
      getTasks(projectId);
    }
  }, [projectId]);

  const filtered = Array.isArray(tasks)
    ? tasks.filter((t: Task) =>
        t?.title?.toLowerCase()?.includes(search.toLowerCase())
      )
    : [];

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // Aligned with backend TaskStatus enum: TODO | IN_PROGRESS | DONE
  const statusColor = (status: string) => {
    if (status === "DONE") return "bg-green-100 text-green-700";
    if (status === "IN_PROGRESS") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const statusLabel = (status: string) => {
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "DONE") return "Done";
    return "To Do";
  };

  const priorityColor = (p: string) => {
    if (p === "HIGH") return "bg-red-100 text-red-700";
    if (p === "MEDIUM") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tasks</h1>
        {/* ✅ projectId is now guaranteed string */}
        <CreateTaskDialog projectId={projectId} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Loading tasks…
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No tasks found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((task: Task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColor(task.status)}`}
                      >
                        {statusLabel(task.status)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${priorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </TableCell>

                    <TableCell>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    <TableCell className="flex gap-2">
                      <EditTaskDialog task={task} />

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
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