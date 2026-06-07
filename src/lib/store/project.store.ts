import { create } from "zustand";
import { projectApi } from "../api/project.api";

interface ProjectStore {
  projects: any[];
  loading: boolean;

  getProjects: () => Promise<void>;

  createProject: (data: any) => Promise<void>;

  updateProject: (
    id: string,
    data: any
  ) => Promise<void>;

  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>(
  (set) => ({
    projects: [],
    loading: false,

    getProjects: async () => {
      set({ loading: true });

      const res = await projectApi.getAllProjects();

      set({
        projects: res.data || res,
        loading: false,
      });
    },

    createProject: async (data) => {
      await projectApi.createProject(data);
    },

    updateProject: async (id, data) => {
      await projectApi.updateProject(id, data);
    },

    deleteProject: async (id) => {
      await projectApi.deleteProject(id);

      set((state) => ({
        projects: state.projects.filter(
          (p) => p.id !== id
        ),
      }));
    },
  })
);