import { defineStore } from "pinia";

export const SET_CONN_STATUS = "SET_CONN_STATUS";
export const useConnStatusStore = defineStore("connStatus", {
  state: () => ({
    connStatus: "Disconnected",
  }),

  actions: {
    [SET_CONN_STATUS](status) {
      this.connStatus = status;
    },
  },
});
