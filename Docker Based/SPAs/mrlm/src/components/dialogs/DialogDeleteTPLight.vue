<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Turnout Panel Light? </v-card-title>
    <v-card-actions>
      <v-card-text
        >Are you sure you want to delete <strong>{{ tplight.controller }} {{ tplight.tplNum }}</strong
        >?</v-card-text
      >
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteTPLightDialog')" text> No </v-btn>
      <v-btn @click="deleteTPLight(tplight._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useTplightsStore } from "@/stores/tplights";

const emit = defineEmits(["closeDeleteTPLightDialog"]);

const props = defineProps({
  tplight: {
    type: Object,
    required: true,
  },
});
const tplightStore = useTplightsStore();
const deleteTPLight = (id) => {
  tplightStore.DELETE_TPLIGHT(id);
  emit("closeDeleteTPLightDialog");
};
</script>
