import { defineStore } from "pinia";
import SvgLayoutService from "@/services/SvgLayoutService";

export const SET_SVG_CONTENT = "SET_SVG_CONTENT";
export const CLEAR_SVG_CONTENT = "CLEAR_SVG_CONTENT";
export const SET_AVAILABLE_LAYOUTS = "SET_AVAILABLE_LAYOUTS";
export const SET_CURRENT_LAYOUT = "SET_CURRENT_LAYOUT";

export const useSvgContentStore = defineStore("svgContent", {
  state: () => ({
    svgContent: '',
    availableLayouts: [],
    currentLayout: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    [SET_SVG_CONTENT](content) {
      console.log("Setting SVG content in Store");
      this.svgContent = content;
    },
    [CLEAR_SVG_CONTENT]() {
      this.svgContent = '';
      this.currentLayout = null;
    },
    [SET_AVAILABLE_LAYOUTS](layouts) {
      this.availableLayouts = layouts;
    },
    [SET_CURRENT_LAYOUT](layout) {
      this.currentLayout = layout;
    },
    async fetchAvailableLayouts() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await SvgLayoutService.getSvgLayouts();
        if (response.data && response.data.layouts) {
          this[SET_AVAILABLE_LAYOUTS](response.data.layouts);
        }
      } catch (err) {
        console.error("Error fetching SVG layouts:", err);
        this.error = err.message || "Failed to fetch layouts";
      } finally {
        this.isLoading = false;
      }
    },
    async loadSvgLayout(filename) {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await SvgLayoutService.getSvgLayoutAsText(filename);
        this[SET_SVG_CONTENT](response.data);
        this[SET_CURRENT_LAYOUT](filename);
      } catch (err) {
        console.error("Error loading SVG layout:", err);
        this.error = err.message || "Failed to load layout";
      } finally {
        this.isLoading = false;
      }
    },
    async uploadSvgLayout(file) {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await SvgLayoutService.uploadSvgLayout(file);
        // Refresh the list of available layouts
        await this.fetchAvailableLayouts();
        return response.data;
      } catch (err) {
        console.error("Error uploading SVG layout:", err);
        this.error = err.message || "Failed to upload layout";
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async deleteSvgLayout(filename) {
      try {
        this.isLoading = true;
        this.error = null;
        await SvgLayoutService.deleteSvgLayout(filename);
        // Refresh the list of available layouts
        await this.fetchAvailableLayouts();
        // If the deleted layout was the current one, clear it
        if (this.currentLayout === filename) {
          this[CLEAR_SVG_CONTENT]();
        }
      } catch (err) {
        console.error("Error deleting SVG layout:", err);
        this.error = err.message || "Failed to delete layout";
        throw err;
      } finally {
        this.isLoading = false;
      }
    }
  },
});
