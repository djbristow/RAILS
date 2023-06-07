import { defineStore } from "pinia";
import RsService from "@/services/RsService";

export const IMAGES_COUNT = "IMAGES_COUNT";
export const GET_IMAGES = "GET_IMAGES";
export const ADD_NEW_IMAGE = "ADD_NEW_IMAGE";
export const DELETE_IMAGE = "DELETE_IMAGE";
export const UPDATE_IMAGE = "UPDATE_IMAGE";
export const GET_UNIQUE_IMAGE_CATEGORY = "GET_UNIQUE_IMAGE_CATEGORY";

export const useImagesStore = defineStore("images", {
  state: () => ({
    images: [],
  }),
  getters: {
    [IMAGES_COUNT](state) {
      return state.images.length;
    },
    [GET_UNIQUE_IMAGE_CATEGORY](state) {
      return [...new Set(state.images.map((images) => images.category))];
    }
  },
  actions: {
    async [GET_IMAGES]() {
      let response = await RsService.fetchImglist();
      this.images = response.data;
    },
    async [ADD_NEW_IMAGE](newImage) {
      await RsService.addImg(newImage);
      let response = await RsService.getDccByAddr(newImage.fileName);
      this.images.unshift(response.data);
    },
    async [DELETE_IMAGE](id) {
      await RsService.deleteImg(id);
      this.images = this.images.filter((images) => images._id !== id);
    },
    async [UPDATE_IMAGE](image) {
      await RsService.updateDImg(image);
      this.images = this.images.filter((images) => images._id !== image._id);
      this.images.unshift(image);
    },
  },
});
