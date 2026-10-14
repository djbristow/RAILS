import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const ADD_NEW_RFID = "ADD_NEW_RFID";
export const RS_COUNT = "RS_COUNT";
export const LOCOMOTIVE_LIST = "LOCOMOTIVE_LIST";
export const GET_UNIQUE_ROAD_NAMES = "GET_UNIQUE_ROAD_NAMES";
export const GET_UNIQUE_AARCODES = "GET_UNIQUE_AARCODES";
export const GET_UNIQUE_RS_STATUS = "GET_UNIQUE_RS_STATUS";
export const GET_RS_WITH_RFID = "GET_RS_WITH_RFID";
export const RS_WITH_RFID_COUNT = "RS_WITH_RFID_COUNT";
export const CHECK_ROAD_NAME_NUMBER = "CHECK_ROAD_NAME_NUMBER";
export const GET_RS = "GET_RS";
export const CHECK_LOCO = "CHECK_LOCO";

export const useRSStore = defineStore("rs", {
  state: () => ({
    rs: [],
    rfid: [],
  }),
  getters: {
    [RS_COUNT](state) {
      return state.rs.length;
    },
    [LOCOMOTIVE_LIST](state) {
      let locos = state.rs.filter(
        (rs) => rs.aarCode === "DE" || rs.aarCode === "SE"
      );
      return locos.sort();
    },
    [GET_UNIQUE_ROAD_NAMES](state) {
      let uniqueRoadNames = [...new Set(state.rs.map((rs) => rs.roadName))];
      return uniqueRoadNames.sort();
    },
    [GET_UNIQUE_AARCODES](state) {
      let uniqueAarCodes = [...new Set(state.rs.map((rs) => rs.aarCode))];
      return uniqueAarCodes.sort();
    },
    [GET_UNIQUE_RS_STATUS](state) {
      let uniqueRsStatus = [...new Set(state.rs.map((rs) => rs.rsStatus))];
      return uniqueRsStatus.sort();
    },
  },
  actions: {
    [CHECK_LOCO](name, number) {
      return this.rs.find(
        (rs) => rs.roadName === name && rs.roadNumber === number
      );
    },
    async [GET_RS]() {
      let response = await RsService.fetchAllRslist();
      this.rs = response.data;
    },
    [GET_RS_WITH_RFID](rfid) {
      return this.rs.find((rs) => rs.rfid === rfid);
    },
        [ADD_NEW_RFID](new_rfid) {
      this.rfid.unshift(new_rfid);
    },
    [CHECK_ROAD_NAME_NUMBER](roadNameNumber) {
      let rn = roadNameNumber.split("-");
      let roadName = rn[0];
      let roadNumber = rn[1];
      return this.rs.find(
        (rs) => rs.roadName === roadName && rs.roadNumber === roadNumber
      );
    },
  },
});
