<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Micro? </v-card-title>
    <v-card-actions>
      <v-card-text>Are you sure you want to delete <strong>{{ micro.microID }}</strong>?</v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteMicroDialog')" text> No </v-btn>
      <v-btn @click="deleteMicro(micro._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useMicrosStore } from "@/stores/micros";

const props = defineProps({
  micro: {
    type: Object,
    required: true,
  },
});
const microStore = useMicrosStore();
const emit = defineEmits(["closeDeleteMicroDialog"]);

const deleteMicro = (id) => {
  microStore.DELETE_MICRO(id);
  emit("closeDeleteMicroDialog");
};
</script>