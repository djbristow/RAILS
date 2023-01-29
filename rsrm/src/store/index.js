import { createStore } from "vuex";
import RsService from "../services/RsService";

const store = createStore({
  modules: {},
  state() {
    return {
      rs: [],
      rsRfid: [],
      connStatus: "Disconnected",
      micros: [],
      aarCodes: [],
    };
  },
  getters: {
    getRsByRfid: (state) => (rfid) => {
      return state.rs.find((rs) => rs.rfid === rfid);
    },
    checkRoadNameNumber: (state) => (roadNameNumber) => {
      let rn = roadNameNumber.split("-");
      let roadName = rn[0];
      let roadNumber = rn[1];
      return state.rs.find(
        (rs) => rs.roadName === roadName && rs.roadNumber === roadNumber
      );
    },
    listRsWithRfids: (state) => {
      return state.rs.filter((rs) => rs.rfid !== "");
    },
    listRfidReaders: (state) => {
        return state.micros.filter((micros) => micros.microID.substring(0,4) === "Rfid")
    }
  },
  mutations: {
    // Rollingstock mutations
    setRollingstocks(state, rs) {
      state.rs = rs;
    },
    setConnStatus(state, status) {
      state.connStatus = status;
    },
    addRsRfid(state, NewRsRfid) {
      state.rsRfid.unshift(NewRsRfid);
    },
    updateRsRfid(state, new_rs) {
      console.log(new_rs);
      let rsRfid = state.rsRfid.filter(
        (rsRfid) => rsRfid.rfid === new_rs.rfid
      )[0];
      let roadNameNumber = new_rs.roadName + " " + new_rs.roadNumber;
      rsRfid.roadNameNumber = roadNameNumber;
      rsRfid.color = new_rs.color;
      rsRfid.aarCode = new_rs.aarCode;
    },
    updateRs(state, new_rs) {
      let rs = state.rs.filter((rs) => rs._id === new_rs._id)[0];
      rs.rfid = new_rs.rfid;
    },
    updateWholeRs(state, updatedRs) {
      state.rs = state.rs.filter((rs) => rs._id !== updatedRs._id);
      state.rs.unshift(updatedRs);
    },
    addRs(state, rs) {
      state.rs.unshift(rs);
    },
    deleteRs(state, id) {
      state.rs = state.rs.filter((rs) => rs._id !== id);
    },
    // Micros mutations
    setMicros(state, micros) {
      state.micros = micros;
    },
    deleteMicro(state, id) {
      state.micros = state.micros.filter((micros) => micros._id !== id);
    },
    addMicro(state, new_micro) {
      state.micros.unshift(new_micro);
    },
    updateMicro(state, micro) {
      state.micros = state.micros.filter((micros) => micros._id !== micro._id);
      state.micros.unshift(micro);
    },
    // AarCodes mutations
    setAarCodes(state, aarCodes) {
      state.aarCodes = aarCodes;
    },
    addAarCode(state, aarCode) {
      state.aarCodes.unshift(aarCode);
    },
    deleteAarCode(state, id) {
      state.aarCodes = state.aarCodes.filter((aarCodes) => aarCodes._id !== id);
    },
    updateAarCode(state, aar) {
      state.aarCodes = state.aarCodes.filter(
        (aarCodes) => aarCodes._id !== aar._id
      );
      state.aarCodes.unshift(aar);
    },
  },
  actions: {
    setConnStatus({ commit }, status) {
      commit("setConnStatus", status);
    },
    getRollingstocks({ commit }) {
      RsService.fetchAllRslist().then((response) => {
        var rollingstocks = response.data.rollingstocks;
        commit("setRollingstocks", rollingstocks);
      });
    },
    addRsRfid({ commit }, NewRsRfid) {
      commit("addRsRfid", NewRsRfid);
    },
    updateRsRfid({ commit }, new_rs) {
      commit("updateRsRfid", new_rs);
      commit("updateRs", new_rs);
      RsService.getRs({ id: new_rs._id }).then((response) => {
        RsService.updateRs({
          id: new_rs.rsId,
          roadName: response.data.roadName,
          roadNumber: response.data.roadNumber,
          color: response.data.color,
          aarCode: response.data.aarCode,
          description: response.data.description,
          numberBlt: response.data.numberBlt,
          inSvcDate: response.data.inSvcDate,
          insideLength: response.data.insideLength,
          insideHeight: response.data.insideHeight,
          insideWidth: response.data.insideWidth,
          loadTypes: response.data.loadTypes,
          capacity: response.data.capacity,
          bldr: response.data.bldr,
          bltDate: response.data.bltDate,
          notes: response.data.notes,
          ltWeight: response.data.ltWeight,
          loadLimit: response.data.loadLimit,
          lastMaintDate: response.data.lastMaintDate,
          locationNow: response.data.locationNow,
          homeLocation: response.data.homeLocation,
          rsStatus: response.data.rsStatus,
          imageID: response.data.imageID,
          modelWeight: response.data.modelWeight,
          modelLength: response.data.modelLength,
          rfid: new_rs.rfid,
        });
      });
    },
    addNewRsRfid({ commit }, new_rs) {
      console.log(new_rs);
      commit("updateRsRfid", {
        roadName: new_rs.roadName,
        roadNumber: new_rs.roadNumber,
        aarCode: new_rs.aarCode,
        color: new_rs.color,
        rfid: new_rs.rfid,
      });
      commit("addRs", {
        roadName: new_rs.roadName,
        roadNumber: new_rs.roadNumber,
        aarCode: new_rs.aarCode,
        color: new_rs.color,
        rfid: new_rs.rfid,
      });
      RsService.addRs({
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
    },
    async addNewRs({ commit }, new_rs) {
      await RsService.addRs({
        roadName: new_rs.roadName,
        roadNumber: new_rs.roadNumber,
        color: new_rs.color,
        aarCode: new_rs.aarCode,
        description: new_rs.description,
        numberBlt: new_rs.numberBlt,
        inSvcDate: new_rs.inSvcDate,
        insideLength: new_rs.insideLength,
        insideHeight: new_rs.insideHeight,
        insideWidth: new_rs.insideWidth,
        loadTypes: new_rs.loadTypes,
        capacity: new_rs.capacity,
        bldr: new_rs.bldr,
        bltDate: new_rs.bltDate,
        notes: new_rs.notes,
        ltWeight: new_rs.ltWeight,
        loadLimit: new_rs.loadLimit,
        lastMaintDate: new_rs.lastMaintDate,
        locationNow: new_rs.locationNow,
        homeLocation: new_rs.homeLocation,
        rsStatus: new_rs.rsStatus,
        imageID: new_rs.imageID,
        modelWeight: new_rs.modelWeight,
        modelLength: new_rs.modelLength,
        rfid: new_rs.rfid,
      });
      RsService.getRsRoad(new_rs.roadName + "-" + new_rs.roadNumber).then(
        (response) => {
          new_rs._id = response.data._id;
        }
      );
      console.log(new_rs._id);
      commit("addRs", {
        _id: new_rs._id,
        roadName: new_rs.roadName,
        roadNumber: new_rs.roadNumber,
        aarCode: new_rs.aarCode,
        color: new_rs.color,
        description: new_rs.description,
        numberBlt: new_rs.numberBlt,
        inSvcDate: new_rs.inSvcDate,
        insideLength: new_rs.insideLength,
        insideHeight: new_rs.insideHeight,
        insideWidth: new_rs.insideWidth,
        loadTypes: new_rs.loadTypes,
        capacity: new_rs.capacity,
        bldr: new_rs.bldr,
        bltDate: new_rs.bltDate,
        notes: new_rs.notes,
        ltWeight: new_rs.ltWeight,
        loadLimit: new_rs.loadLimit,
        lastMaintDate: new_rs.lastMaintDate,
        locationNow: new_rs.locationNow,
        homeLocation: new_rs.homeLocation,
        rsStatus: new_rs.rsStatus,
        imageID: new_rs.imageID,
        modelWeight: new_rs.modelWeight,
        modelLength: new_rs.modelLength,
        rfid: new_rs.rfid,
      });
    },
    deleteRs({ commit }, id) {
      commit("deleteRs", id);
      RsService.deleteRs(id);
    },
    updateRs({ commit }, rs) {
      commit("updateWholeRs", rs);
      if (!rs._id) {
        RsService.getRsRoad(rs.roadName + "-" + rs.roadNumber).then(
          (response) => {
            rs._id = response.data._id;
          }
        );
      } else {
        RsService.updateRs(rs);
      }
    },
    // Actions associated with the Micros collection
    getMicros({ commit }) {
      RsService.fetchMicroList().then((response) => {
        var micros = response.data.micros;
        commit("setMicros", micros);
      });
    },
    addNewMicro({ commit }, micro) {
      commit("addMicro", micro);
      RsService.addMicro({
        microID: micro.microID,
        microIP: micro.microIP,
        et: micro.et,
        purpose: micro.purpose,
        sensorLoc: micro.sensorLoc,
        status: micro.status,
      });
    },
    deleteMicro({ commit }, id) {
      commit("deleteMicro", id);
      RsService.deleteMicro(id);
    },
    updateMicro({ commit }, micro) {
      commit("updateMicro", micro);
      RsService.updateMicro(micro);
    },
    // Actions associated with the AarCodes collection
    getAarCodes({ commit }) {
      RsService.fetchAarlist().then((response) => {
        var aarCodes = response.data.aarCodes;
        commit("setAarCodes", aarCodes);
      });
    },
    addNewAarCode({ commit }, aarCode) {
      commit("addAarCode", aarCode);
      RsService.addAar({
        aarCode: aarCode.aarCode,
        rolingstockType: aarCode.rolingstockType,
        description: aarCode.description,
      });
    },
    deleteAarCode({ commit }, id) {
      commit("deleteAarCode", id);
      RsService.deleteAarCode(id);
    },
    updateAarCode({ commit }, aar) {
      commit("updateAarCode", aar);
      RsService.updateAar(aar);
    },
  },
});
export default store;
