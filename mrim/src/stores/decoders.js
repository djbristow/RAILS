import { defineStore } from "pinia";
import RsService from "@/services/RsService";
import { useRSStore } from "@/stores/rs";

export const DECODERS_COUNT = "DECODERS_COUNT";
export const DECODER_LOCOS = "DECODER_LOCOS";
export const GET_DECODERS = "GET_DECODERS";
export const ADD_NEW_DECODER = "ADD_NEW_DECODER";
export const DELETE_DECODER = "DELETE_DECODER";
export const UPDATE_DECODER = "UPDATE_DECODER";

export const useDecodersStore = defineStore("decoders", {
  state: () => ({
    decoders: [],
  }),
  getters: {
    [DECODERS_COUNT](state) {
      return state.decoders.length;
    },
    [DECODER_LOCOS](state) {
      const rsStore = useRSStore();
      let decoderLocos = [];
      for (let i = 0; i < this.decoders.length; i++) {
        var decoderLoco = {
          _id: null,
          locomotiveID: null,
          roadName: "",
          roadNumber: "",
          mfg: "",
          family: "",
          model: "",
          address: "",
        };
        decoderLoco._id = this.decoders[i]._id;
        decoderLoco.mfg = this.decoders[i].mfg;
        decoderLoco.family = this.decoders[i].family;
        decoderLoco.model = this.decoders[i].model;
        decoderLoco.address = this.decoders[i].address;
        decoderLoco.locomotiveID = this.decoders[i].locomotiveID;
        let loco = rsStore.LOCOMOTIVE_LIST.find(
          (l) => l._id === decoderLoco.locomotiveID
        );
        decoderLoco.roadName = loco.roadName;
        decoderLoco.roadNumber = loco.roadNumber;
        decoderLocos.push(decoderLoco);
      }
      return decoderLocos;
    },
  },
  actions: {
    async [GET_DECODERS]() {
      let response = await RsService.fetchDcclist();
      this.decoders = response.data;
    },
    async [ADD_NEW_DECODER](newDecoder) {
      await RsService.addDcc(newDecoder);
      let response = await RsService.getDccByAddr(newDecoder.address);
      this.decoders.unshift(response.data);
    },
    async [DELETE_DECODER](id) {
      await RsService.deleteDcc(id);
      this.decoders = this.decoders.filter((decoders) => decoders._id !== id);
    },
    async [UPDATE_DECODER](decoder) {
      await RsService.updateDcc(decoder);
      this.decoders = this.decoders.filter(
        (decoders) => decoders._id !== decoder._id
      );
      this.decoders.unshift(decoder);
    },
  },
});
