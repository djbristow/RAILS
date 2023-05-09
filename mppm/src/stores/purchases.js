import { defineStore } from "pinia";
import PpService from "@/services/PpService";

export const PURCHASES_COUNT = "PURCHASES_COUNT";
export const GET_UNIQUE_PUR_PROJECTS = "GET_UNIQUE_PUR_PROJECTS";
export const GET_UNIQUE_PUR_STORES = "GET_UNIQUE_PUR_STORES";
export const GET_UNIQUE_PUR_MANUFACTURERS = "GET_UNIQUE_PUR_MANUFACTURERS";
export const GET_PURCHASE_BY_ID = "GET_PURCHASE_BY_ID";
export const GET_PURCHASES_BY_PROJECT = "GET_PURCHASES_BY_PROJECT";
export const GET_PURCHASES_BY_STORE = "GET_PURCHASES_BY_STORE";
export const GET_PURCHASES_BY_MANUFACTURER = "GET_PURCHASES_BY_MANUFACTURER";
export const GET_PURCHASES = "GET_PURCHASES";
export const ADD_PURCHASE = "ADD_PURCHASE";
export const UPDATE_PURCHASE = "UPDATE_PURCHASE";
export const DELETE_PURCHASE = "DELETE_PURCHASE";

export const usePurchasesStore = defineStore("purchases", {
  state: () => ({
    purchases: [],
  }),

  getters: {
    [PURCHASES_COUNT](state) {
      return state.purchases.length;
    },
    [GET_UNIQUE_PUR_PROJECTS](state) {
      let uniqueProjects = [
        ...new Set(state.purchases.map((purchases) => purchases.project)),
      ];
      return uniqueProjects.sort();
    },
    [GET_UNIQUE_PUR_STORES](state) {
      let uniqueStores = [
        ...new Set(state.purchases.map((purchases) => purchases.store)),
      ];
      return uniqueStores.sort();
    },
    [GET_UNIQUE_PUR_MANUFACTURERS](state) {
      let uniqueManufacturers = [
        ...new Set(state.purchases.map((purchases) => purchases.manufacturer)),
      ];
      return uniqueManufacturers.sort();
    },
  },

  actions: {
    [GET_PURCHASE_BY_ID](id) {
      return this.purchases.find((purchases) => purchases._id === id);
    },
    [GET_PURCHASES_BY_PROJECT](project) {
      return this.purchases.filter(
        (purchases) => purchases.project === project
      );
    },
    [GET_PURCHASES_BY_STORE](store) {
      return this.purchases.filter((purchases) => purchases.store === store);
    },
    [GET_PURCHASES_BY_MANUFACTURER](manufacturer) {
      return this.purchases.filter(
        (purchases) => purchases.manufacturer === manufacturer
      );
    },
    async [GET_PURCHASES]() {
      const res = await PpService.fetchPurlist();
      this.purchases = res.data;
    },
    async [ADD_PURCHASE](newPurchase) {
      await PpService.addPur(newPurchase);
      let res = await PpService.getPurByNumber(newPurchase.num);
      this.purchases.unshift(res.data);
    },
    async [UPDATE_PURCHASE](purchase) {
      await PpService.updatePur(purchase);
      this.purchases = this.purchases.filter(
        (purchases) => purchases._id !== purchase._id
      );
      this.purchases.unshift(purchase);
    },
    async [DELETE_PURCHASE](id) {
      await PpService.deletePur(id);
      this.purchases = this.purchases.filter(
        (purchases) => purchases._id !== id
      );
    },
  },
});
