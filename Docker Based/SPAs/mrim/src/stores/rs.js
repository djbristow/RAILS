import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const RS_COUNT = "RS_COUNT";
export const LOCOMOTIVE_LIST = "LOCOMOTIVE_LIST";
export const GET_UNIQUE_ROAD_NAMES = "GET_UNIQUE_ROAD_NAMES";
export const GET_UNIQUE_AARCODES = "GET_UNIQUE_AARCODES";
export const GET_UNIQUE_RS_STATUS = "GET_UNIQUE_RS_STATUS";
export const GET_RS_WITH_RFID = "GET_RS_WITH_RFID";
export const RS_WITH_RFID_COUNT = "RS_WITH_RFID_COUNT";
export const CHECK_ROAD_NAME_NUMBER = "CHECK_ROAD_NAME_NUMBER";
export const GET_RS = "GET_RS";
export const GET_RS_FOR_IMAGE = "GET_RS_FOR_IMAGE";
export const CHECK_LOCO = "CHECK_LOCO";
export const ADD_NEW_RS = "ADD_NEW_RS";
export const DELETE_RS = "DELETE_RS";
export const UPDATE_RS = "UPDATE_RS";
export const ADD_NEW_RS_RFID = "ADD_NEW_RS_RFID";
export const UPDATE_RS_RFID = "UPDATE_RS_RFID";
export const ADD_NEW_RFID = "ADD_NEW_RFID";
export const UPDATE_RFID = "UPDATE_RFID";

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
      /*  state.rs.forEach((rs) => {
        if (!uniqueRoadNames.includes(rs.roadName)) {
          uniqueRoadNames.push(rs.roadName);
        }
      }); */
      return uniqueRoadNames.sort();
    },
    [GET_UNIQUE_AARCODES](state) {
      let uniqueAarCodes = [...new Set(state.rs.map((rs) => rs.aarCode))];
      /*       state.rs.forEach((rs) => {
        if (!uniqueAarCodes.includes(rs.aarCode)) {
          uniqueAarCodes.push(rs.aarCode);
        }
      }); */
      return uniqueAarCodes.sort();
    },
    [GET_UNIQUE_RS_STATUS](state) {
      let uniqueRsStatus = [...new Set(state.rs.map((rs) => rs.rsStatus))];
      /* state.rs.forEach((rs) => {
        if (!uniqueRsStatus.includes(rs.rsStatus)) {
          uniqueRsStatus.push(rs.rsStatus);
        }
      });
      return uniqueRsStatus.sort();
    }, */
    },
  },
  actions: {
    [GET_RS_FOR_IMAGE](imageId) {
      return this.rs.find((rs) => rs.imageId === imageId);
    },
    [CHECK_LOCO](name, number) {
      return this.rs.find(
        (rs) => rs.roadName === name && rs.roadNumber === number
      );
    },
    async [GET_RS]() {
      let response = await RsService.fetchAllRslist();
      this.rs = response.data;
    },
    async [ADD_NEW_RS](new_rs) {
      await RsService.addRs(new_rs);
      let response = await RsService.getRsRoad(
        new_rs.roadName + "-" + new_rs.roadNumber
      );
      new_rs._id = response.data._id;
      this.rs.unshift(new_rs);
    },
    async [DELETE_RS](id) {
      await RsService.deleteRs(id);
      let rs = this.rs.find((rs) => rs._id === id);
      if (rs.rfid !== "") {
        let rfid = this.rfid.find((rfid) => rfid.rfid === rs.rfid);
        if (rfid) {
          this.rfid = this.rfid.filter((rfid) => rfid.rfid !== rs.rfid);
        }
      }
      this.rs = this.rs.filter((rs) => rs._id !== id);
    },
    async [UPDATE_RS](updated_rs) {
      await RsService.updateRs(updated_rs);
      if (updated_rs.rfid !== "") {
        let rfid = this.rfid.find((rfid) => rfid.rfid === updated_rs.rfid);
        if (rfid) {
          this.rfid = this.rfid.filter((rfid) => rfid.rfid !== updated_rs.rfid);
          this.rfid.unshift(rfid);
        }
      }
      this.rs = this.rs.filter((rs) => rs._id !== updated_rs._id);
      this.rs.unshift(updated_rs);
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
