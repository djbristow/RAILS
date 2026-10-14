import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const STRUCTURES_COUNT = "STRUCTURES_COUNT";
export const GET_STRUCTURES = "GET_STRUCTURES";
export const ADD_NEW_STRUCTURE = "ADD_NEW_STRUCTURE";
export const DELETE_STRUCTURE = "DELETE_STRUCTURE";
export const UPDATE_STRUCTURE = "UPDATE_STRUCTURE";

export const useStructuresStore = defineStore("structures", {
  state: () => ({
    structures: [],
  }),
  getters: {
    [ STRUCTURES_COUNT](state) {
      return state.structures.length;
    },
  },
  actions: {
    async [GET_STRUCTURES]() {
        let response = await RsService.fetchAllStructlist();
        this.structures = response.data;
      },
  },
});