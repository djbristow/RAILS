import { createStore } from "vuex";
import RsService from "../services/RsService";

const store = createStore({
  modules: {},
  state() {
    return {
      rs: [],
      aarCodes: [],
      structures: [],
      companies: [],
      decoders: [],
      images: [],
    };
  },
  getters: {
    checkRoadNameNumber: (state) => (roadNameNumber) => {
      let rn = roadNameNumber.split("-");
      let roadName = rn[0];
      let roadNumber = rn[1];
      return state.rs.find(
        (rs) => rs.roadName === roadName && rs.roadNumber === roadNumber
      );
    },
    checkLoco: (state) => (name, number) => {
      return state.rs.find(
        (rs) => rs.roadName === name && rs.roadNumber === number
      );
    },
    listLocomotives: (state) => {
      return state.rs.filter(
        (rs) => rs.aarCode === "DE" || rs.aarCode === "SE"
      );
    },
    getUniqueRsRoadName: (state) => {
      let i = 0;
      let uniqueRsRN = [];
      let uniqueRs = state.rs.filter((obj, pos, arr) => {
        return (
          arr.map((mapObj) => mapObj["roadName"]).indexOf(obj["roadName"]) ===
          pos
        );
      });
      for (i in uniqueRs) {
        uniqueRsRN.push(uniqueRs[i].roadName);
      }
      return uniqueRsRN.sort();
    },
    getUniqueRsAarCode: (state) => {
      let i = 0;
      let uniqueAar = [];
      let uniqueRs = state.rs.filter((obj, pos, arr) => {
        return (
          arr.map((mapObj) => mapObj["aarCode"]).indexOf(obj["aarCode"]) === pos
        );
      });
      for (i in uniqueRs) {
        uniqueAar.push(uniqueRs[i].aarCode);
      }
      return uniqueAar.sort();
    },
    getUniqueRsStatus: (state) => {
      let i = 0;
      let uniqueStat = [];
      let uniqueRs = state.rs.filter((obj, pos, arr) => {
        return (
          arr.map((mapObj) => mapObj["rsStatus"]).indexOf(obj["rsStatus"]) === pos
        );
      });
      for (i in uniqueRs) {
        uniqueStat.push(uniqueRs[i].rsStatus);
      }
      return uniqueStat.sort();
    },
    getRsForImage: (state) => (imageId) => {
      return state.rs.filter((rs) => rs.imageID === imageId);
    },
    getUniqueCatImage: (state) => {
      let i = 0;
      let uniqueCat = [];
      let uniqueImage = state.images.filter((obj, pos, arr) => {
        return (
          arr.map((mapObj) => mapObj["category"]).indexOf(obj["category"]) === pos
        );
      });
      for (i in uniqueImage) {
        uniqueCat.push(uniqueImage[i].category);
      }
      return uniqueCat.sort();
    },
  },
  mutations: {
    // Rollingstock mutations
    setRollingstocks(state, rs) {
      state.rs = rs;
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
    // Structures mutations
    setStructures(state, structures) {
      state.structures = structures;
    },
    addStructure(state, structure) {
      state.structures.unshift(structure);
    },
    deleteStructure(state, id) {
      state.structures = state.structures.filter(
        (structures) => structures._id !== id
      );
    },
    updateStructure(state, structure) {
      state.structures = state.structures.filter(
        (structures) => structures._id !== structure._id
      );
      state.structures.unshift(structure);
    },
    // Companies mutations
    setCompanies(state, companies) {
      state.companies = companies;
    },
    addNewCompany(state, company) {
      state.companies.unshift(company);
    },
    deleteCompany(state, id) {
      state.companies = state.companies.filter(
        (companies) => companies._id !== id
      );
    },
    updateCompany(state, company) {
      state.companies = state.companies.filter(
        (companies) => companies._id !== company._id
      );
      state.companies.unshift(company);
    },
    // Decoders mutations
    setDecoders(state, decoders) {
      state.decoders = decoders;
    },
    addNewDecoder(state, newDecoder) {
      state.decoders.unshift(newDecoder);
    },
    deleteDecoder(state, id) {
      state.decoders = state.decoders.filter((decoders) => decoders._id !== id);
    },
    updateDecoder(state, decoder) {
      state.decoders = state.decoders.filter(
        (decoders) => decoders._id !== decoder._id
      );
      state.decoders.unshift(decoder);
    },
    // Images mutations
    setImages(state, images) {
      state.images = images;
    },
    addNewImage(state, newImage) {
      state.images.unshift(newImage);
    },
    updateImage(state, image) {
      state.images = state.images.filter((images) => images._id !== image._id);
      state.images.unshift(image);
    },
    deleteImage(state, id) {
      state.images = state.images.filter((images) => images._id !== id);
    },
  },
  actions: {
    // Actions associated with the Rolling Stock collection
    getRollingstocks({ commit }) {
      RsService.fetchAllRslist().then((response) => {
        var rollingstocks = response.data.rollingstocks;
        commit("setRollingstocks", rollingstocks);
      });
    },
    async addNewRs({ commit }, newRs) {
      await RsService.addRs(newRs);
      let res = await RsService.getRsRoad(
        newRs.roadName + "-" + newRs.roadNumber
      );
      newRs._id = res.data._id;
      commit("addRs", newRs);
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
    // Actions associated with the AarCodes collection
    getAarCodes({ commit }) {
      RsService.fetchAarlist().then((response) => {
        var aarCodes = response.data.aarCodes;
        commit("setAarCodes", aarCodes);
      });
    },
    async addNewAarCode({ commit }, newAarCode) {
      await RsService.addAar(newAarCode);
      let res = await RsService.getAarByCode(newAarCode.aarCode);
      newAarCode._id = res.data._id;
      commit("addAarCode", newAarCode);
    },
    deleteAarCode({ commit }, id) {
      commit("deleteAarCode", id);
      RsService.deleteAarCode(id);
    },
    updateAarCode({ commit }, aar) {
      commit("updateAarCode", aar);
      RsService.updateAar(aar);
    },
    // Actions associated with the Structures collection
    getStructures({ commit }) {
      RsService.fetchAllStructlist().then((response) => {
        var structures = response.data.structures;
        commit("setStructures", structures);
      });
    },
    async addNewStructure({ commit }, newStructure) {
      await RsService.addStruct(newStructure);
      let res = await RsService.getStructByTitle(newStructure.title);
      newStructure._id = res.data._id;
      commit("addStructure", newStructure);
    },
    deleteStructure({ commit }, id) {
      commit("deleteStructure", id);
      RsService.deleteStruct(id);
    },
    updateStructure({ commit }, structure) {
      commit("updateStructure", structure);
      RsService.updateStruct(structure);
    },
    // Actions associated with the Companies collection
    getCompanies({ commit }) {
      RsService.fetchCoList().then((response) => {
        var companies = response.data.industries;
        commit("setCompanies", companies);
      });
    },
    async addNewCompany({ commit }, newCompany) {
      await RsService.addCo(newCompany);
      let res = await RsService.getCoByName(newCompany.shortName);
      newCompany._id = res.data._id;
      commit("addNewCompany", newCompany);
    },
    deleteCompany({ commit }, id) {
      commit("deleteCompany", id);
      RsService.deleteCo(id);
    },
    updateCompany({ commit }, company) {
      commit("updateCompany", company);
      RsService.updateCo(company);
    },
    // Actions associated with the Decoders collection
    getDecoders({ commit }) {
      RsService.fetchDcclist().then((response) => {
        var decoders = response.data.dccs;
        commit("setDecoders", decoders);
      });
    },
    async addNewDecoder({ commit }, newDecoder) {
      await RsService.addDcc(newDecoder);
      let res = await RsService.getDccByAddr(newDecoder.address);
      newDecoder._id = res.data._id;
      commit("addNewDecoder", newDecoder);
    },
    deleteDecoder({ commit }, id) {
      commit("deleteDecoder", id);
      RsService.deleteDcc(id);
    },
    updateDecoder({ commit }, decoder) {
      commit("updateDecoder", decoder);
      RsService.updateDcc(decoder);
    },
    // Actions associated with Images collection
    getImages({ commit }) {
      RsService.fetchImglist().then((response) => {
        var images = response.data.images;
        commit("setImages", images);
      });
    },
    async addNewImage({ commit }, newImage) {
      await RsService.addImg(newImage);
      let res = await RsService.getImgByFile(newImage.fileName);
      newImage._id = res.data._id;
      commit("addNewImage", newImage);
    },
    updateImage({ commit }, image) {
      commit("updateImage", image);
      RsService.updateImg(image);
    },
    deleteImage({ commit }, id) {
      commit("deleteImage", id);
      RsService.deleteImg(id);
    },
  },
});
export default store;

// need to get id after adding any new item t oa collection!
