import { defineStore } from "pinia";
import PpService from "@/services/PpService";

export const MRCOS_COUNT = "MRCOS_COUNT";
export const GET_MRCOS = "GET_MRCOS";
export const ADD_MRCO = "ADD_MRCO";
export const UPDATE_MRCO = "UPDATE_MRCO";
export const DELETE_MRCO = "DELETE_MRCO";

export const useMrcosStore = defineStore("mrcos", {
  state: () => ({
    mrcos: [],
  }),

  getters: {
    [MRCOS_COUNT](state) {
      return state.mrcos.length;
    },
  },

  actions: {
    async [GET_MRCOS]() {
      const res = await PpService.fetchMcolist();
      this.mrcos = res.data.mrcos;  // possible issue here Mongoose should be returning an array but is returning an object
    },
    async [ADD_MRCO](newMrco) {
      await PpService.addMco(newMrco);
      let res = await PpService.getMcoByName(newMrco.name);
      console.log(res.data)
      this.mrcos.unshift(res.data);
    },
    async [UPDATE_MRCO](mrco) {
      await PpService.updateMco(mrco);
      this.mrcos = this.mrcos.filter((mrcos) => mrcos._id !== mrco._id);
      this.mrcos.unshift(mrco);
    },
    async [DELETE_MRCO](id) {
      await PpService.deleteMco(id);
      this.mrcos = this.mrcos.filter((mrcos) => mrcos._id !== id);
    },
  },
});
