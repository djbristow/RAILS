import { defineStore } from "pinia";
import ConsistService from "@/services/ConsistService";

const withCount = (consist) => ({
  ...consist,
  carCount: Array.isArray(consist.cars) ? consist.cars.length : 0,
});

export const CONSISTS_COUNT = "CONSISTS_COUNT";
export const GET_CONSISTS = "GET_CONSISTS";
export const ADD_NEW_CONSIST = "ADD_NEW_CONSIST";
export const DELETE_CONSIST = "DELETE_CONSIST";
export const UPDATE_CONSIST = "UPDATE_CONSIST";

export const useConsistsStore = defineStore("consists", {
  state: () => ({
    consists: [],
  }),

  getters: {
    [CONSISTS_COUNT](state) {
      return state.consists.length;
    },
  },

  actions: {
    async [GET_CONSISTS]() {
      let response = await ConsistService.fetchConsistlist();
      this.consists = response.data.map(withCount);
    },
    async [ADD_NEW_CONSIST](consist) {
      let response = await ConsistService.add(consist);
      this.consists.push(withCount(response.data));
    },
    async [DELETE_CONSIST](consistId) {
      await ConsistService.delete(consistId);
      this.consists = this.consists.filter(c => c._id !== consistId);
    },
    async [UPDATE_CONSIST](consist) {
      let response = await ConsistService.update(consist);
      const index = this.consists.findIndex(c => c._id === consist._id);
      if (index !== -1) {
        this.consists.splice(index, 1, withCount(response.data));
      }
    },
  },
});