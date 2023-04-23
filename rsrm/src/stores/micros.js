import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const RFID_READER_COUNT = "RFID_READER_COUNT";
export const MICRO_COUNT = "MICRO_COUNT";
export const GET_MICROS = "GET_MICROS";
export const ADD_NEW_MICRO = "ADD_NEW_MICRO";
export const DELETE_MICRO = "DELETE_MICRO";
export const UPDATE_MICRO = "UPDATE_MICRO";

export const useMicrosStore = defineStore("micros", {
  state: () => ({
    micros: [],
  }),

  getters: {
    [RFID_READER_COUNT](state) {
      return state.micros.filter((x) => x.microID.substring(0, 4) === "Rfid")
        .length;
    },
    [MICRO_COUNT](state) {
      return state.micros.length;
    },
  },

  actions: {
    async [GET_MICROS]() {
      let response = await RsService.fetchMicroList();
      this.micros = response.data;
    },
    async [ADD_NEW_MICRO](micro) {
      await RsService.addMicro({
        microID: micro.microID,
        microIP: micro.microIP,
        et: micro.et,
        purpose: micro.purpose,
        sensorLoc: micro.sensorLoc,
        status: micro.status,
      });
      this.micros.unshift(micro);
    },
    async [DELETE_MICRO](id) {
      await RsService.deleteMicro(id);
      this.micros = this.micros.filter((micro) => micro._id !== id);
    },
    async [UPDATE_MICRO](micro) {
      await RsService.updateMicro(micro);
      this.micros = this.micros.filter((micros) => micros._id !== micro._id);
      this.micros.unshift(micro);
    },
  },
});
