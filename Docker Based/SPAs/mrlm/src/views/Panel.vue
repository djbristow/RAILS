<template>
  <div class="xx">
    <h1>MR Panel</h1>
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
      // Display CLOSED turnouts routes in white
      if (turnout.state === "CLOSED") {
        let line = svg.querySelector(`#to${turnout.toID.slice(-2)}c`);
        if (line) {
          line.setAttribute("stroke", "white");
          line.setAttribute("stroke-width", "0.1");
        }
        line = svg.querySelector(`#to${turnout.toID.slice(-2)}t1`);
        if (line) {
          line.setAttribute("stroke", "gray");
          line.setAttribute("stroke-width", "0.1");
        }
        line = svg.querySelector(`#to${turnout.toID.slice(-2)}t2`);
        if (line) {
          line.setAttribute("stroke", "gray");
          line.setAttribute("stroke-width", "0.1");
        }
        line = svg.querySelector(`#to${turnout.toID.slice(-2)}t3`);
        if (line) {
          line.setAttribute("stroke", "gray");
          line.setAttribute("stroke-width", "0.1");
        }
      }
      if (turnout.state === "THROWN") {
        let line = svg.querySelector(`#to${turnout.toID.slice(-2)}c`);
        if (line) {
          line.setAttribute("stroke", "gray");
          line.setAttribute("stroke-width", "0.1");
        }
        line = svg.querySelector(`#to${turnout.toID.slice(-2)}t1`);
        if (line) {
          line.setAttribute("stroke", "white");
          line.setAttribute("stroke-width", "0.1");
        }
        line = svg.querySelector(`#to${turnout.toID.slice(-2)}t2`);
        if (line) {
          line.setAttribute("stroke", "white");
          line.setAttribute("stroke-width", "0.1");
        }
        line = svg.querySelector(`#to${turnout.toID.slice(-2)}t3`);
        if (line) {
          line.setAttribute("stroke", "white");
          line.setAttribute("stroke-width", "0.1");
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
</script>
