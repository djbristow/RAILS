import { defineStore } from "pinia";

export const SET_SVG_CONTENT = "SET_SVG_CONTENT";
export const CLEAR_SVG_CONTENT = "CLEAR_SVG_CONTENT";

export const useSvgContentStore = defineStore("svgContent", {
  state: () => ({
    svgContent: '',
  }),

  actions: {
    [SET_SVG_CONTENT](content) {
        console.log("Setting SVG content in Store");
      this.svgContent = content;
    },
    [CLEAR_SVG_CONTENT]() {
      this.svgContent = '';
    },
      },
});