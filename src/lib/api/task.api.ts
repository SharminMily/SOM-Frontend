import { Task } from "@/app/types/task";
import api from "./axios";


export const taskApi = {
  getMyTasks: async () => {
    const res = await api.get("/tasks/my");
    return res.data;
  },

  getTaskById: async (id: string) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },
};