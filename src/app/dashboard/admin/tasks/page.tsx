"use client";

import { useState } from "react";

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

import {
  Search,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

export default function TasksPage() {
  const [search, setSearch] = useState("");

  const tasks = [
    {
      id: "1",
      title: "Create Login Page",
      status: "TODO",
      priority: "HIGH",
      dueDate: "2026-06-20",
      assignedTo: "John",
    },
    {
      id: "2",
      title: "Dashboard UI",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      dueDate: "2026-06-25",
      assignedTo: "Sarah",
    },
  ];

  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Tasks
          </h1>

          <p className="text-muted-foreground">
            Manage project tasks
          </p>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4" />

        <Input
          className="pl-10"
          placeholder="Search Task..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    {task.title}
                  </TableCell>

                  <TableCell>
                    {task.assignedTo}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        task.status ===
                        "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : task.status ===
                            "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        task.priority ===
                        "HIGH"
                          ? "bg-red-100 text-red-700"
                          : task.priority ===
                            "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </TableCell>

                  <TableCell>
                    {task.dueDate}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
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