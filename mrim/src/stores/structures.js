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
      async [ADD_NEW_STRUCTURE](newStructure) {
        await RsService.addStruct(newStructure);
        let response = await RsService.getStructByTitle(newStructure.title);
        this.structures.unshift(response.data);
      },
      async [DELETE_STRUCTURE](id) {
        await RsService.deleteStruct(id);
        this.structures = this.structures.filter((structures) => structures._id !== id);
      },
      async [UPDATE_STRUCTURE](structure) {
        await RsService.updateStruct(structure);
        console.log("structure: ", structure);
        this.structures = this.structures.filter(
          (structures) => structures._id !== structure._id
        );
        this.structures.unshift(structure);
      },
  },
});