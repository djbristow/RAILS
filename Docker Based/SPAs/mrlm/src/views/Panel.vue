<template>
  <div class="xx">
    <h1>MR Layout</h1>
    
    <!-- Layout selector -->
    <v-container fluid class="mb-4">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="selectedLayout"
            :items="availableLayouts"
            label="Select Panel Layout"
            @update:model-value="onLayoutSelected"
            :disabled="isLoadingLayouts"
            :loading="isLoadingLayouts"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-btn 
            @click="refreshLayouts"
            :loading="isLoadingLayouts"
            icon
            title="Refresh layouts"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      
      <!-- Error messages -->
      <v-row v-if="layoutError">
        <v-col cols="12">
          <v-alert type="error" dismissible @update:model-value="layoutError = ''">
            {{ layoutError }}
          </v-alert>
        </v-col>
      </v-row>
      
      <!-- Loading indicator -->
      <v-row v-if="isLoadingLayouts && !svgContent">
        <v-col cols="12">
          <v-progress-linear indeterminate></v-progress-linear>
        </v-col>
      </v-row>
    </v-container>

    <!-- SVG Display -->
    <div v-if="svgContent" class="svg-container">
      <div v-html="svgContent" ref="svgWrapper" class="svg-wrapper"></div>
    </div>
    
    <div v-else-if="!isLoadingLayouts" class="text-center pa-8">
      <p>No layout selected. Please select a layout from the dropdown above.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useSvgContentStore } from "@/stores/svgContent";
import { useTurnoutsStore } from "@/stores/turnouts";

const svgContentStore = useSvgContentStore();
const turnoutsStore = useTurnoutsStore();

const svgContent = ref("");
const svgWrapper = ref(null);
const availableLayouts = ref([]);
const selectedLayout = ref(null);
const isLoadingLayouts = ref(false);
const layoutError = ref("");

// Watch for changes to turnouts or SVG content
watch(
  () => [svgContent.value, turnoutsStore.turnouts],
  async () => {
    await nextTick();
    const container = svgWrapper.value;
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) return;

    turnoutsStore.turnouts.forEach((turnout) => {
      console.log(`Processing turnout:`, turnout);
      
      // Try exact match first
      let turnoutGroup = svg.querySelector(`g[id="${turnout.toID}"]`);
      
      // If not found, try searching by ID contains
      if (!turnoutGroup) {
        turnoutGroup = svg.querySelector(`g[id*="${turnout.toID}"]`);
      }
      
      console.log(`Found turnout group for toID ${turnout.toID}:`, turnoutGroup);
      if (turnout.state === "CLOSED") {
        for (let i = 1; i <= 2; i++) {
          let segment = turnoutGroup.querySelector(`[id$='c${i}']`);
          if (segment) {
            segment.setAttribute("stroke", "white");
          }
        }
        for (let i = 1; i <= 3; i++) {
          let segment = turnoutGroup.querySelector(`[id$='t${i}']`);
          if (segment) {
            segment.setAttribute("stroke", "gray");
          }
        }
      }
      if (turnout.state === "THROWN") {
        for (let i = 1; i <= 2; i++) {
          let segment = turnoutGroup.querySelector(`[id$='c${i}']`);
          if (segment) {
            segment.setAttribute("stroke", "gray");
          }
        }
        for (let i = 1; i <= 3; i++) {
          let segment = turnoutGroup.querySelector(`[id$='t${i}']`);
          if (segment) {
            segment.setAttribute("stroke", "white");
          }
        }
      }
    });
  },
  { immediate: true, deep: true }
);

// Sync svgContent when store changes
watch(
  () => svgContentStore.svgContent,
  (newVal) => {
    svgContent.value = newVal;
  }
);

onMounted(async () => {
  await loadAvailableLayouts();
  
  // Try to load last selected layout from localStorage
  const lastLayout = localStorage.getItem("lastSelectedLayout");
  if (lastLayout && availableLayouts.value.includes(lastLayout)) {
    selectedLayout.value = lastLayout;
    await onLayoutSelected(lastLayout);
  }
});

const loadAvailableLayouts = async () => {
  try {
    isLoadingLayouts.value = true;
    layoutError.value = "";
    await svgContentStore.fetchAvailableLayouts();
    availableLayouts.value = svgContentStore.availableLayouts;
  } catch (err) {
    console.error("Error loading layouts:", err);
    layoutError.value = "Failed to load available layouts: " + (err.message || "Unknown error");
  } finally {
    isLoadingLayouts.value = false;
  }
};

const onLayoutSelected = async (layout) => {
  if (!layout) {
    svgContent.value = "";
    return;
  }
  
  try {
    isLoadingLayouts.value = true;
    layoutError.value = "";
    await svgContentStore.loadSvgLayout(layout);
    svgContent.value = svgContentStore.svgContent;
    selectedLayout.value = layout;
    // Save selection to localStorage
    localStorage.setItem("lastSelectedLayout", layout);
  } catch (err) {
    console.error("Error loading layout:", err);
    layoutError.value = "Failed to load layout: " + (err.message || "Unknown error");
    selectedLayout.value = null;
  } finally {
    isLoadingLayouts.value = false;
  }
};

const refreshLayouts = async () => {
  await loadAvailableLayouts();
};
</script>

<style scoped>
.svg-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
  margin-top: 20px;
}

.svg-wrapper {
  flex: 1;
}
</style>
