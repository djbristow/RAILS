import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const AARCODES_COUNT = "AARCODES_COUNT";
export const GET_AARCODES = "GET_AARCODES";

export const useAarCodesStore = defineStore("aarCodes", {
  state: () => ({
    aarCodes: [],
  }),

  getters: {
    [AARCODES_COUNT](state) {
      return state.aarCodes.length;
    },
  },

  actions: {
    async [GET_AARCODES]() {
      let response = await RsService.fetchAarlist();
      this.aarCodes = response.data;
    },
  },
});