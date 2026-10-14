import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const COMPANIES_COUNT = "COMPANIES_COUNT";
export const GET_COMPANIES = "GET_COMPANIES";
export const ADD_NEW_COMPANY = "ADD_NEW_COMPANY";
export const DELETE_COMPANY = "DELETE_COMPANY";
export const UPDATE_COMPANY = "UPDATE_COMPANY";

export const useCompaniesStore = defineStore("companies", {
  state: () => ({
    companies: [],
  }),
  getters: {
    [COMPANIES_COUNT](state) {
      return state.companies.length;
    },
  },
  actions: {
    async [GET_COMPANIES]() {
      let response = await RsService.fetchCoList();
      this.companies = response.data;
    },
  },
});
