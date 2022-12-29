import { createStore } from "vuex";
import RlService from "../services/RlService";
const store = createStore({
  modules: {},
  state() {
    return {
      micros: [],
      turnouts: [],
      tplights: [],
      connToStatus: "Disconnected",
      connBtnStatus: "Disconnected",
    };
  },
  getters: {
    // Turnout getters
    getTurnoutById: (state) => (id) => {
      return state.turnouts.find((turnout) => turnout.toID === id);
    },
    getTurnoutBy_Id: (state) => (id) => {
      return state.turnouts.find((turnout) => turnout._id === id);
    },
    getTurnoutByCntrlrTo: (state) => (id, to) => {
      return state.turnouts.find(
        (turnout) => turnout.controller === id && turnout.toNum === to
      );
    },
    // Micro getters
    getMicroById: (state) => (id) => {
      return state.micros.find((micro) => micro.microID === id);
    },
    // TPLight getters
    getTplightByTo_Id: (state) => (id) => {
      return state.tplights.find((tplight) => tplight.to_id === id);
    },
    getTpLightByCntTplNum: (state) => (controller, tplNum) => {
      return state.tplights.find(
        (tplight) =>
          tplight.controller === controller && tplight.tplNum === tplNum
      );
    },
  },
  mutations: {
    // Connection mutations
    setToConnStatus(state, status) {
      state.connToStatus = status;
    },
    setBtnConnStatus(state, status) {
      state.connBtnStatus = status;
    },
    // Micro mutations
    setMicros(state, micros) {
      state.micros = micros;
    },
    addMicro(state, micro) {
      state.micros.unshift(micro);
    },
    updateMicro(state, micro) {
      state.micros = state.micros.filter((micros) => micros._id !== micro._id);
      state.micros.unshift(micro);
    },
    deleteMicro(state, micro) {
      state.micros = state.micros.filter((micros) => micros._id !== micro._id);
    },
    // Turnout mutations
    setTurnouts(state, turnouts) {
      state.turnouts = turnouts;
    },
    addTurnout(state, turnout) {
      state.turnouts.unshift(turnout);
    },
    updateTurnout(state, turnout) {
      state.turnouts = state.turnouts.filter(
        (turnouts) => turnouts._id !== turnout._id
      );
      state.turnouts.unshift(turnout);
    },
    deleteTurnout(state, turnout) {
      state.turnouts = state.turnouts.filter(
        (turnouts) => turnouts._id !== turnout._id
      );
    },
    // TPLight mutations
    setTplights(state, tplights) {
      state.tplights = tplights;
    },
    addTplight(state, tplight) {
      state.tplights.unshift(tplight);
    },
    updateTplight(state, tplight) {
      state.tplights = state.tplights.filter(
        (tplights) => tplights._id !== tplight._id
      );
      state.tplights.unshift(tplight);
    },
    deleteTplight(state, tplight) {
      state.tplights = state.tplights.filter(
        (tplights) => tplights._id !== tplight._id
      );
    },
  },
  actions: {
    // Connection actions
    setToConnStatus({ commit }, status) {
      commit("setToConnStatus", status);
    },
    setBtnConnStatus({ commit }, status) {
      commit("setBtnConnStatus", status);
    },
    // Micro actions
    getMicros({ commit }) {
      RlService.fetchMicroList().then((response) => {
        let micros = response.data.micros;
        commit("setMicros", micros);
      });
    },
    updateMicro({ commit }, micro) {
      RlService.updateMicro(micro);
      commit("updateMicro", micro);
    },
    async addNewMicro({ commit }, newMicro) {
      await RlService.addMicro(newMicro);
      let res = await RlService.getMicroByName(newMicro.microID);
      newMicro._id = res.data._id;
      commit("addMicro", newMicro);
    },
    deleteMicro({ commit }, micro) {
      RlService.deleteMicro(micro._id);
      commit("deleteMicro", micro);
    },
    // Turnout actions
    getTurnouts({ commit }) {
      RlService.fetchToList().then((response) => {
        let turnouts = response.data.turnouts;
        commit("setTurnouts", turnouts);
      });
    },
    updateTurnout({ commit }, turnout) {
      RlService.updateTo(turnout);
      commit("updateTurnout", turnout);
    },
    async addNewTurnout({ commit }, newTurnout) {
      await RlService.addTo(newTurnout);
      let res = await RlService.getToByName(newTurnout.turnoutID);
      newTurnout._id = res.data._id;
      commit("addTurnout", newTurnout);
    },
    deleteTurnout({ commit }, turnout) {
      RlService.deleteTo(turnout._id);
      commit("deleteTurnout", turnout);
    },
    // TPLight actions
    getTplights({ commit }) {
      RlService.fetchTPLightList().then((response) => {
        let tplights = response.data.tplights;
        commit("setTplights", tplights);
      });
    },
    updateTplight({ commit }, tplight) {
      RlService.updateTPL(tplight);
      commit("updateTplight", tplight);
    },
    async addNewTplight({ commit }, newTplight) {
      await RlService.addTPL(newTplight);
      let res = await RlService.getTPLByTplnum(newTplight.tplNum);
      newTplight._id = res.data._id;
      commit("addTplight", newTplight);
    },
    deleteTplight({ commit }, tplight) {
      RlService.deleteTPL(tplight._id);
      commit("deleteTplight", tplight);
    },
  },
});
export default store;
