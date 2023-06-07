import { defineStore } from "pinia";

export const SET_CONN_TO_STATUS = "SET_CONN_TO_STATUS";
export const SET_CONN_BTN_STATUS = "SET_CONN_BTN_STATUS";

export const useConnStatsStore = defineStore("connStats", {
  state: () => ({
    connToStatus: "Disconnected",
    connBtnStatus: "Disconnected",
  }),

  actions: {
    [SET_CONN_TO_STATUS](status) {
      this.connToStatus = status;
    },
    [SET_CONN_BTN_STATUS](status) {
      this.connBtnStatus = status;
    },
  },
});
