import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const AARCODES_COUNT = "AARCODES_COUNT";
export const GET_AARCODES = "GET_AARCODES";
export const ADD_NEW_AARCODE = "ADD_NEW_AARCODE";
export const DELETE_AARCODE = "DELETE_AARCODE";
export const UPDATE_AARCODE = "UPDATE_AARCODE";

export const useAarCodesStore = defineStore("aarCodes", {
  state: () => ({
    aarCodes: [],
  }),

  getters: {
    [AARCODES_COUNT](state) {
      return state.aarCodes.length;
    },
  },

  actions: {
    async [GET_AARCODES]() {
      let response = await RsService.fetchAarlist();
      this.aarCodes = response.data;
    },
    async [ADD_NEW_AARCODE](aarCode) {
      await RsService.addAar({
        aarCode: aarCode.aarCode,
        rollingstockType: aarCode.rollingstockType,
        description: aarCode.description,
      });
      let response = await RsService.getAarByCode(aarCode.aarCode);
      this.aarCodes.unshift(response.data);
    },
    async [DELETE_AARCODE](id) {
      await RsService.deleteAarCode(id);
      this.aarCodes = this.aarCodes.filter((aar) => aar._id !== id);
    },
    async [UPDATE_AARCODE](aarCode) {
      await RsService.updateAar(aarCode);
      this.aarCodes = this.aarCodes.filter(
        (aarCodes) => aarCodes._id !== aarCode._id
      );
      this.aarCodes.unshift(aarCode);
    },
  },
});
