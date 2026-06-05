"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Build Employee Dashboard UI",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2026-06-10",
  },
  {
    id: 2,
    title: "Fix Authentication Bug",
    status: "TODO",
    priority: "URGENT",
    dueDate: "2026-06-08",
  },
  {
    id: 3,
    title: "Design Leave Request Page",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2026-06-05",
  },
];

export default function EmployeeTasksPage() {
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage your assigned tasks
          </p>
        </div>

        <Button variant="default">+ New Task</Button>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9" />
        </div>
      </div>

      {/* FILTER TABS */}
      <Tabs defaultValue="all" className="space-y-4">

        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>

        {/* ALL TASKS */}
        <TabsContent value="all">
          <div className="grid gap-4">

            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

          </div>
        </TabsContent>

        {/* TODO */}
        <TabsContent value="todo">
          <div className="grid gap-4">
            {tasks
              .filter((t) => t.status === "TODO")
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </TabsContent>

        {/* IN PROGRESS */}
        <TabsContent value="progress">
          <div className="grid gap-4">
            {tasks
              .filter((t) => t.status === "IN_PROGRESS")
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </TabsContent>

        {/* DONE */}
        <TabsContent value="done">
          <div className="grid gap-4">
            {tasks
              .filter((t) => t.status === "DONE")
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}

/* TASK CARD COMPONENT */
function TaskCard({ task }: any) {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{task.title}</CardTitle>

        <div className="flex gap-2">
          <Badge
            variant={
              task.status === "DONE"
                ? "default"
                : task.status === "IN_PROGRESS"
                ? "secondary"
                : "outline"
            }
          >
            {task.status}
          </Badge>

          <Badge variant="destructive">{task.priority}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Due: {task.dueDate}
        </p>

        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            View
          </Button>

          <Button size="sm">
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}