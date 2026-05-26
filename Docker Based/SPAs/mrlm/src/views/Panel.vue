<template>
  <div class="xx">
    <h1>MR Layout</h1>
    <div v-if="svgContent" class="svg-container">
      <div v-html="svgContent" ref="svgWrapper" class="svg-wrapper"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useSvgContentStore } from "@/stores/svgContent";

const svgContentStore = useSvgContentStore();
const svgContent = ref("");
const svgWrapper = ref(null);
import { useTurnoutsStore } from "@/stores/turnouts";

const turnoutsStore = useTurnoutsStore();

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
// Sync svgContent when store changes (or on mount)
onMounted(() => {
  svgContent.value = svgContentStore.svgContent;
});

// Optional: Watch in case store updates later
watch(
  () => svgContentStore.svgContent,
  (newVal) => {
    svgContent.value = newVal;
  }
);

// Load SVG from localStorage on mount
onMounted(() => {
  const storedSvg = localStorage.getItem("svgContent");
  if (storedSvg) {
    svgContent.value = storedSvg;
  } else if (svgContentStore.svgContent) {
    svgContent.value = svgContentStore.svgContent;
  }
});
</script>
