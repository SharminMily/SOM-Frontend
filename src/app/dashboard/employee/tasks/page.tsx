"use client";

import { useEffect, useMemo, useState } from "react";

import { taskApi } from "@/lib/api/task.api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Search,
  CheckCircle2,
  Clock3,
  Loader2,
  ListTodo,
} from "lucide-react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
};

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const res = await taskApi.getMyTasks();

      setTasks(res?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const todoTasks = filteredTasks.filter(
    (task) => task.status === "TODO"
  );

  const progressTasks = filteredTasks.filter(
    (task) =>
      task.status === "IN_PROGRESS" ||
      task.status === "IN_REVIEW"
  );

  const doneTasks = filteredTasks.filter(
    (task) => task.status === "DONE"
  );

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">My Tasks</h1>

        <p className="text-muted-foreground">
          Manage your assigned tasks
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={<ListTodo className="h-5 w-5" />}
        />

        <StatCard
          title="To Do"
          value={todoTasks.length}
          icon={<Clock3 className="h-5 w-5" />}
        />

        <StatCard
          title="In Progress"
          value={progressTasks.length}
          icon={<Loader2 className="h-5 w-5" />}
        />

        <StatCard
          title="Completed"
          value={doneTasks.length}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="pl-9"
        />
      </div>

      {/* TASK TABS */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All
          </TabsTrigger>

          <TabsTrigger value="todo">
            To Do
          </TabsTrigger>

          <TabsTrigger value="progress">
            In Progress
          </TabsTrigger>

          <TabsTrigger value="done">
            Done
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TaskList
            tasks={filteredTasks}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="todo">
          <TaskList
            tasks={todoTasks}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="progress">
          <TaskList
            tasks={progressTasks}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="done">
          <TaskList
            tasks={doneTasks}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TaskList({
  tasks,
  loading,
}: {
  tasks: Task[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map(
          (_, index) => (
            <Card key={index}>
              <CardContent className="h-24 animate-pulse" />
            </Card>
          )
        )}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          No tasks found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
        />
      ))}
    </div>
  );
}

function TaskCard({
  task,
}: {
  task: Task;
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">
          {task.title}
        </CardTitle>

        <div className="flex gap-2">
          <Badge
            variant={
              task.status === "DONE"
                ? "default"
                : task.status ===
                  "IN_PROGRESS"
                ? "secondary"
                : "outline"
            }
          >
            {task.status}
          </Badge>

          <Badge
            variant={
              task.priority ===
              "URGENT"
                ? "destructive"
                : "outline"
            }
          >
            {task.priority}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Due:{" "}
          {task.dueDate
            ? new Date(
                task.dueDate
              ).toLocaleDateString()
            : "N/A"}
        </p>

        <div className="flex gap-2">
          <Link href={`/dashboard/employee/tasks/${task.id}`}>
  <Button size="sm" >
    View
  </Button>
</Link>

          {/* <Button size="sm">
            Update
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            {value}
          </h2>
        </div>

        {icon}
      </CardContent>
    </Card>
  );
}