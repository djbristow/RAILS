import { defineStore } from "pinia";
import RlService from "@/services/RlService";

export const MICRO_COUNT = "MICRO_COUNT";
export const GET_MICRO_BY_ID = "GET_MICRO_BY_ID";
export const GET_MICROS = "GET_MICROS";
export const ADD_NEW_MICRO = "ADD_NEW_MICRO";
export const DELETE_MICRO = "DELETE_MICRO";
export const UPDATE_MICRO = "UPDATE_MICRO";

export const useMicrosStore = defineStore("micros", {
  state: () => ({
    micros: [],
  }),

  getters: {
    [MICRO_COUNT](state) {
      return state.micros.length;
    },
  },

  actions: {
    [GET_MICRO_BY_ID](id) {
        return this.micros.find((micro) => micro.microID === id);
    },
    async [GET_MICROS]() {
      let response = await RlService.fetchMicroList();
      this.micros = response.data;
    },
    async [ADD_NEW_MICRO](micro) {
      await RlService.addMicro(micro);
      let response = await RlService.getMicroByName(micro.microID);
      this.micros.unshift(response.data);
    },
    async [DELETE_MICRO](id) {
      await RlService.deleteMicro(id);
      this.micros = this.micros.filter((micro) => micro._id !== id);
    },
    async [UPDATE_MICRO](micro) {
      await RlService.updateMicro(micro);
      this.micros = this.micros.filter((micros) => micros._id !== micro._id);
      this.micros.unshift(micro);
    },
  },
});
