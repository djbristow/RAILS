import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const RS_COUNT = "RS_COUNT";
export const GET_RS_WITH_RFID = "GET_RS_WITH_RFID";
export const RS_WITH_RFID_COUNT = "RS_WITH_RFID_COUNT";
export const CHECK_ROAD_NAME_NUMBER = "CHECK_ROAD_NAME_NUMBER";
export const GET_RS = "GET_RS";
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
    [RS_WITH_RFID_COUNT](state) {
      return state.rs.filter((rs) => rs.rfid !== "").length;
    },
  },
  actions: {
    async [GET_RS]() {
      let response = await RsService.fetchAllRslist();
      this.rs = response.data;
    },
    async [ADD_NEW_RS](new_rs) {
      await RsService.addRs(new_rs)
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
    async [ADD_NEW_RS_RFID](new_rs) {
      await RsService.addRs({
        roadName: new_rs.roadName,
        roadNumber: new_rs.roadNumber,
        color: new_rs.color,
        aarCode: new_rs.aarCode,
        description: "",
        numberBlt: "",
        inSvcDate: "",
        insideLength: "",
        insideHeight: "",
        insideWidth: "",
        loadTypes: "",
        capacity: "",
        bldr: "",
        bltDate: "",
        notes: "",
        ltWeight: "",
        loadLimit: "",
        lastMaintDate: "",
        locationNow: "",
        homeLocation: "",
        rsStatus: "",
        imageID: "",
        modelWeight: "",
        modelLength: "",
        rfid: new_rs.rfid,
      });
      let response = await RsService.getRsRoad(
        new_rs.roadName + "-" + new_rs.roadNumber
      );
      this.rs.unshift(response.data);
      this.UPDATE_RFID(new_rs);
    },
    async [UPDATE_RS_RFID](updated_rs_rfid) {
      let response = await RsService.getRsRoad(
        updated_rs_rfid.roadName + "-" + updated_rs_rfid.roadNumber
      );
      response.data.rfid = updated_rs_rfid.rfid;
      await RsService.updateRs(response.data);
      this.rs = this.rs.filter((rs) => rs._id !== updated_rs_rfid._id);
      this.rs.unshift(response.data);
      this.UPDATE_RFID(updated_rs_rfid);
    },
    [UPDATE_RFID](updated_rfid) {
      let revised_rfid = this.rfid.find(
        (rfid) => rfid.rfid === updated_rfid.rfid
      );
      revised_rfid.aarCode = updated_rfid.aarCode;
      revised_rfid.color = updated_rfid.color;
      revised_rfid.roadNameNumber =
        updated_rfid.roadName + "-" + updated_rfid.roadNumber;
      this.rfid = this.rfid.filter((rfid) => rfid.rfid !== updated_rfid.rfid);
      this.rfid.unshift(revised_rfid);
    },
    [ADD_NEW_RFID](new_rfid) {
      this.rfid.unshift(new_rfid);
    },
    [GET_RS_WITH_RFID](rfid) {
      return this.rs.find((rs) => rs.rfid === rfid);
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
