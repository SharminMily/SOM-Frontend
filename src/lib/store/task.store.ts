import { create } from "zustand";
import { taskApi } from "../api/task.api";

export type Task = {
  id: string;
  title: string;
  description?: string;
  // Aligned with backend TaskStatus enum
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  projectId?: string;
};

type TaskStore = {
  tasks: Task[];
  loading: boolean;

  getTasks: (projectId: string) => Promise<void>;
  createTask: (projectId: string, data: any) => Promise<void>;
  updateTask: (id: string, data: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,

  getTasks: async (projectId) => {
    set({ loading: true });
    try {
      const res = await taskApi.getProjectTasks(projectId);
      // Handle 3 possible shapes depending on axios interceptor:
      // 1. res = { success, data: [...] }  → res.data is the array
      // 2. res = [...]                     → res itself is the array
      // 3. res = { data: { data: [...] } } → shouldn't happen but guard anyway
      const tasks = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
        ? res.data
        : [];
      set({ tasks });
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (projectId, data) => {
    const res = await taskApi.createTask(projectId, data);
    const newTask: Task = Array.isArray(res) ? res[0] : (res.data ?? res);
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  updateTask: async (id, data) => {
    const res = await taskApi.updateTask(id, data);
    const updated: Task = Array.isArray(res) ? res[0] : (res.data ?? res);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    }));
  },

  deleteTask: async (id) => {
    await taskApi.deleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },
}));