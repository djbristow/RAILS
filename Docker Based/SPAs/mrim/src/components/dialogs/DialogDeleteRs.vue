<template>
    <v-card width="400">
      <v-card-title class="headline"> Delete Rollingstock? </v-card-title>
      <v-card-actions>
        <v-card-text
        >Are you sure you {{ rollingstock.roadName }}
        {{ rollingstock.roadNumber }}?</v-card-text
      >
        <v-spacer></v-spacer>
        <v-btn @click="$emit('closeDeleteRsDialog')" text> No </v-btn>
        <v-btn @click="deleteRs(rollingstock._id)" color="red darken-1" text>
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
</template>
<script setup>
import { useRSStore } from "@/stores/rs";

const props = defineProps({
  rollingstock: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["closeDeleteRsDialog"]);
const rsStore = useRSStore();
const deleteRs = (id) => {
  rsStore.DELETE_RS(id);
  emit("closeDeleteRsDialog");
};
</script>