import { create } from "zustand";
import { taskApi } from "../api/task.api";

export const useTaskStore = create(
  (set) => ({
    tasks: [],

    getTasks: async (
      projectId: string
    ) => {
      const res =
        await taskApi.getProjectTasks(
          projectId
        );

      set({
        tasks: res.data || res,
      });
    },

    createTask: async (
      projectId: string,
      data: any
    ) => {
      await taskApi.createTask(
        projectId,
        data
      );
    },

    updateTask: async (
      id: string,
      data: any
    ) => {
      await taskApi.updateTask(
        id,
        data
      );
    },

    deleteTask: async (id: string) => {
      await taskApi.deleteTask(id);

      set((state: any) => ({
        tasks: state.tasks.filter(
          (t: any) => t.id !== id
        ),
      }));
    },
  })
);