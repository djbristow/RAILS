<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Micro Controller? </v-card-title>
    <v-card-actions>
      <v-card-text
        >Are you sure you want to delete <strong>{{ micro.microID }}</strong
        >?</v-card-text
      >
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteMicroContlrDialog')" text> No </v-btn>
      <v-btn @click="deleteMicroContlr(micro._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useMicrosStore } from "@/stores/micros";

const emit = defineEmits(["closeDeleteMicroContlrDialog"]);

const props = defineProps({
  micro: {
    type: Object,
    required: true,
  },
});
const microStore = useMicrosStore();
const deleteMicroContlr = (id) => {
  microStore.DELETE_MICRO(id);
  emit("closeDeleteMicroContlrDialog");
};
</script>
