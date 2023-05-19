import { defineStore } from "pinia";
import RlService from "@/services/RlService";

export const TURNOUT_COUNT = "TURNOUT_COUNT";
export const GET_TURNOUT_BY_ID = "GET_TURNOUT_BY_ID";
export const GET_TURNOUT_BY_CNTRLR_TO = "GET_TURNOUT_BY_CNTRLR_TO";
export const GET_TURNOUT = "GET_TURNOUT";
export const GET_TURNOUTS = "GET_TURNOUTS";
export const ADD_NEW_TURNOUT = "ADD_NEW_TURNOUT";
export const DELETE_TURNOUT = "DELETE_TURNOUT";
export const UPDATE_TURNOUT = "UPDATE_TURNOUT";

export const useTurnoutsStore = defineStore("turnouts", {
  state: () => ({
    turnouts: [],
  }),

  getters: {
    [TURNOUT_COUNT](state) {
      return state.turnouts.length;
    },
  },

  actions: {
    [GET_TURNOUT_BY_ID](id) {
      return this.turnouts.find((turnout) => turnout.toID === id);
    },
    [GET_TURNOUT_BY_CNTRLR_TO](cntrlr, to) {
      return this.turnouts.find(
        (turnout) => turnout.controller === cntrlr && turnout.toNum === to
      );
    },
    [GET_TURNOUT] (id) {
      return this.turnouts.find((turnout) => turnout._id === id);
    },
    
    async [GET_TURNOUTS]() {
      let response = await RlService.fetchToList();
      this.turnouts = response.data;
    },
    async [ADD_NEW_TURNOUT](turnout) {
      await RlService.addTo(turnout);
      let response = await RlService.getToByName(turnout.toID);
      this.turnouts.unshift(response.data);
    },
    async [DELETE_TURNOUT](id) {
      await RlService.deleteTo(id);
      this.turnouts = this.turnouts.filter((turnout) => turnout._id !== id);
    },
    async [UPDATE_TURNOUT](turnout) {
      await RlService.updateTo(turnout);
      this.turnouts = this.turnouts.filter(
        (turnouts) => turnouts._id !== turnout._id
      );
      this.turnouts.unshift(turnout);
    },
  },
});
