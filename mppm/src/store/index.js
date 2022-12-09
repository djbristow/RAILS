import { createStore } from "vuex";
import PpService from "../services/PpService";

const store = createStore({
  modules: {},
  state() {
    return {
      purchases: [],
      projects: [],
      mrcos: [],
    };
  },
  getters: {
    // Project getters
    getUniqueProjectTypes: (state) => {
      let i = 0;
      let uniqueProjType = [];
      let uniqueProj = state.projects.filter((obj, pos, arr) => {
        return arr.map((mapObj) => mapObj["type"]).indexOf(obj["type"]) === pos;
      });
      for (i in uniqueProj) {
        uniqueProjType.push(uniqueProj[i].type);
      }
      return uniqueProjType.sort();
    },
    // Purchase getters
    getUniquePurProjects: (state) => {
      let i = 0;
      let uniquePurProj = [];
      let uniquePur = state.purchases.filter((obj, pos, arr) => {
        return (
          arr.map((mapObj) => mapObj["project"]).indexOf(obj["project"]) === pos
        );
      });
      for (i in uniquePur) {
        uniquePurProj.push(uniquePur[i].project);
      }
      return uniquePurProj.sort(function (a, b) {
        var purTypeA = a.toLowerCase();
        var purTypeB = b.toLowerCase();
        if (purTypeA < purTypeB) {
          return -1;
        }
        if (purTypeA > purTypeB) {
          return 1;
        }
        return 0;
      });
    },
    getPurListByProject: (state) => (project) => {
      return state.purchases.filter(
        (purchases) => purchases.project === project
      );
    },
    getUniquePurStore: (state) => {
      let i = 0;
      let uniquePurStore = [];
      let uniquePur = state.purchases.filter((obj, pos, arr) => {
        return (
          arr.map((mapObj) => mapObj["store"]).indexOf(obj["store"]) === pos
        );
      });
      for (i in uniquePur) {
        uniquePurStore.push(uniquePur[i].store);
      }
      return uniquePurStore.sort(function (a, b) {
        var purTypeA = a.toLowerCase();
        var purTypeB = b.toLowerCase();
        if (purTypeA < purTypeB) {
          return -1;
        }
        if (purTypeA > purTypeB) {
          return 1;
        }
        return 0;
      });
    },
    getUniquePurManufacturer: (state) => {
      let i = 0;
      let uniquePurManufacturer = [];
      let uniquePur = state.purchases.filter((obj, pos, arr) => {
        return (
          arr
            .map((mapObj) => mapObj["manufacturer"])
            .indexOf(obj["manufacturer"]) === pos
        );
      });
      for (i in uniquePur) {
        uniquePurManufacturer.push(uniquePur[i].manufacturer);
      }
      return uniquePurManufacturer.sort(function (a, b) {
        var purTypeA = a.toLowerCase();
        var purTypeB = b.toLowerCase();
        if (purTypeA < purTypeB) {
          return -1;
        }
        if (purTypeA > purTypeB) {
          return 1;
        }
        return 0;
      });
    },
    getPurListByStore: (state) => (store) => {
      return state.purchases.filter((purchases) => purchases.store === store);
    },
    getPurListByManufacturer: (state) => (manufacturer) => {
      return state.purchases.filter(
        (purchases) => purchases.manufacturer === manufacturer
      );
    },
    getPurById: (state) => (id) => {
      return state.purchases.find((purchases) => purchases._id === id);
    },
  },
  mutations: {
    // Purchases mutations set add update delete
    setPurchases(state, purchases) {
      state.purchases = purchases;
    },
    addPurchase(state, purchase) {
      state.purchases.unshift(purchase);
    },
    deletePurchase(state, id) {
      state.purchases = state.purchases.filter(
        (purchases) => purchases._id !== id
      );
    },
    updatePurchase(state, purchase) {
      state.purchases = state.purchases.filter(
        (purchases) => purchases._id !== purchase._id
      );
      state.purchases.unshift(purchase);
    },
    // Projects mutations
    setProjects(state, projects) {
      state.projects = projects;
    },
    addProject(state, project) {
      state.projects.unshift(project);
    },
    deleteProject(state, id) {
      state.projects = state.projects.filter((projects) => projects._id !== id);
    },
    updateProject(state, project) {
      state.projects = state.projects.filter(
        (projects) => projects._id !== project._id
      );
      state.projects.unshift(project);
    },
    // MR Companies mutations
    setMrcos(state, mrcos) {
      state.mrcos = mrcos;
    },
    addMrco(state, mrco) {
      state.mrcos.unshift(mrco);
    },
    deleteMrco(state, id) {
      state.mrcos = state.mrcos.filter((mrcos) => mrcos._id !== id);
    },
    updateMrco(state, mrco) {
      state.mrcos = state.mrcos.filter((mrcos) => mrcos._id !== mrco._id);
      state.mrcos.unshift(mrco);
    },
  },
  actions: {
    // Actions associated with the Purchases collection
    getPurchases({ commit }) {
      PpService.fetchPurlist().then((response) => {
        var purchases = response.data.purchases;
        commit("setPurchases", purchases);
      });
    },
    async addNewPurchase({ commit }, newPurchase) {
      await PpService.addPur(newPurchase);
      let res = await PpService.getPurByNumber(newPurchase.num);
      newPurchase._id = res.data._id;
      commit("addPurchase", newPurchase);
    },
    deletePurchase({ commit }, id) {
      commit("deletePurchase", id);
      PpService.deletePur(id);
    },
    updatePurchase({ commit }, purchase) {
      commit("updatePurchase", purchase);
      PpService.updatePur(purchase);
    },
    // Actions associated with the Project collection
    getProjects({ commit }) {
      PpService.fetchProjlist().then((response) => {
        var projects = response.data.projects;
        commit("setProjects", projects);
      });
    },
    async addNewProject({ commit }, newProject) {
      await PpService.addProj(newProject);
      let res = await PpService.getProjByTitle(newProject.title); //====
      newProject._id = res.data._id;
      commit("addProject", newProject);
    },
    deleteProject({ commit }, id) {
      commit("deleteProject", id);
      PpService.deleteProj(id);
    },
    updateProject({ commit }, project) {
      commit("updateProject", project);
      PpService.updateProj(project);
    },
    // Actions associated with the MR Companies collection
    getMrcos({ commit }) {
      PpService.fetchMcolist().then((response) => {
        var mrcos = response.data.mrcompanies;
        commit("setMrcos", mrcos);
      });
    },
    async addNewMrco({ commit }, newMrco) {
      await PpService.addMco(newMrco);
      let res = await PpService.getMcoByName(newMrco.name);
      newMrco._id = res.data._id;
      commit("addMrco", newMrco);
    },
    deleteMrco({ commit }, id) {
      commit("deleteMrco", id);
      PpService.deleteMco(id);
    },
    updateMrco({ commit }, mrco) {
      commit("updateMrco", mrco);
      PpService.updateMco(mrco);
    },
  },
});
export default store;
