import { defineStore } from "pinia";
import PpService from "@/services/PpService";

export const PROJECTS_COUNT = "PROJECTS_COUNT";
export const GET_UNIQUE_PROJECT_TYPES = "GET_UNIQUE_PROJECT_TYPES";
export const GET_PROJECTS = "GET_PROJECTS";
export const ADD_PROJECT = "ADD_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: [],
  }),

  getters: {
    [PROJECTS_COUNT](state) {
      return state.projects.length;
    },
    [GET_UNIQUE_PROJECT_TYPES](state) {
      return [...new Set(state.projects.map((projects) => projects.type))];
    },
  },

  actions: {
    async [GET_PROJECTS]() {
      const response = await PpService.fetchProjlist();
      this.projects = response.data.projects; // possible issue here Mongoose should be returning an array but is returning an object
    },
    async [ADD_PROJECT](newProject) {
      await PpService.addProj(newProject);
      let res = await PpService.getProjByTitle(newProject.title);
      this.projects.unshift(res.data);
    },
    async [UPDATE_PROJECT](project) {
      console.log("store update project", project);
      await PpService.updateProj(project);
      this.projects = this.projects.filter(
        (projects) => projects._id !== project._id
      );
      this.projects.unshift(project);
    },
    async [DELETE_PROJECT](id) {
      await PpService.deleteProj(id);
      this.projects = this.projects.filter((projects) => projects._id !== id);
    },
  },
});
