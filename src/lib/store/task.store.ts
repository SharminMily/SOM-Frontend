import { create } from "zustand";

import { taskApi } from "@/lib/api/task.api";
import { Task } from "@/app/types/task";

export const useTaskStore = create((set) => ({
  tasks: [],
  selectedTask: null,
  loading: false,

  getMyTasks: async () => {
    set({ loading: true });
    const res = await taskApi.getMyTasks();
    set({ tasks: res.data, loading: false });
  },

  fetchTaskById: async (id: string) => {
    set({ loading: true });
    const res = await taskApi.getTaskById(id);

    set({
      selectedTask: res.data,
      loading: false,
    });
  },
}));