import { defineStore } from "pinia";
import RlService from "@/services/RlService";
import { useTurnoutsStore } from "./turnouts";

export const TPLIGHT_COUNT = "TPLIGHT_COUNT";
export const TO_TPLIGHTS = "TO_TPLIGHTS";
export const GET_TPLIGHT_BY_CNT_TPLNUM = "GET_TPLIGHT_BY_CNT_TPLNUM";
export const GET_TPLIGHT_BY_TO_ID = "GET_TPLIGHT_BY_TO_ID";
export const GET_TPLIGHTS = "GET_TPLIGHTS";
export const GET_TPLIGHTS_FOR_CONTROLLER = "GET_TPLIGHTS_FOR_CONTROLLER";
export const GET_TPLIGHTS_CONTROLLERS = "GET_TPLIGHTS_CONTROLLERS";
export const ADD_NEW_TPLIGHT = "ADD_NEW_TPLIGHT";
export const DELETE_TPLIGHT = "DELETE_TPLIGHT";
export const UPDATE_TPLIGHT = "UPDATE_TPLIGHT";

export const useTplightsStore = defineStore("tplights", {
  state: () => ({
    tplights: [],
  }),

  getters: {
    [TPLIGHT_COUNT](state) {
      return state.tplights.length;
    },
    [TO_TPLIGHTS](state) {
      const turnoutsStore = useTurnoutsStore();
      let tpls = [];
      for (let i = 0; i < state.tplights.length; i++) {
        var tpl = {
          _id: null,
          to_id: null,
          controller: "",
          tplNum: "",
          controller: "",
          panelName: "",
          panelNum: "",
          turnout: "",
          color: "",
        }
        let turnout = turnoutsStore.GET_TURNOUT(state.tplights[i].to_id);
        tpl._id = state.tplights[i]._id;
        tpl.to_id = state.tplights[i].to_id;
        tpl.controller = state.tplights[i].controller;
        tpl.tplNum = state.tplights[i].tplNum;
        tpl.controller = state.tplights[i].controller;
        tpl.panelName = state.tplights[i].panelName;
        tpl.panelNum = state.tplights[i].panelNum;
        tpl.turnout = turnout.toID;
        if (turnout.lock !== "") {
          tpl.color = "red";
        } else {
          if (turnout.state === "CLOSED") {
            tpl.color = "green";
          } else {
            tpl.color = "blue";
          }
        }
        tpls.push(tpl);
        }
      return tpls;
    }
  },
  
  actions: {
    [GET_TPLIGHT_BY_CNT_TPLNUM](controller, tplNum) {
        return this.tplights.find((tplight) => tplight.controller === controller && tplight.tplNum === tplNum);
    },
    [GET_TPLIGHT_BY_TO_ID](id) {
        return this.tplights.find((tplight) => tplight.to_id === id);
    },
    async [GET_TPLIGHTS]() {
      let response = await RlService.fetchTPLightList();
      this.tplights = response.data;
    },
    async [GET_TPLIGHTS_FOR_CONTROLLER](controller) {
      let response = await RlService.fetchTPLightListForController(controller);
      this.tplights = response.data;
    },
    GET_TPLIGHTS_CONTROLLERS() {
      const uniqueControllers = new Set();    
      this.tplights.forEach(light => {
        // Add each controller to the Set.
        uniqueControllers.add(light.controller);
      });
      return Array.from(uniqueControllers);
    },
    async [ADD_NEW_TPLIGHT](tplight) {
      await RlService.addTPL(tplight);
      this.tplights.unshift(tplight);
    },
    async [DELETE_TPLIGHT](id) {
      await RlService.deleteTPL(id);
      this.tplights = this.tplights.filter((tplight) => tplight._id !== id);
    },
    async [UPDATE_TPLIGHT](tplight) {
      await RlService.updateTPL(tplight);
      this.tplights = this.tplights.filter(
        (tplights) => tplights._id !== tplight._id
      );
      this.tplights.unshift(tplight);
    },
  },
});
