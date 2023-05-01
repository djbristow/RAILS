<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Structure? </v-card-title>
    <v-card-actions>
      <v-card-text>Are you sure you want to delete <strong>{{ structure.title }}</strong>?</v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteStructureDialog')" text> No </v-btn>
      <v-btn @click="deleteStructure(structure._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useStructuresStore } from "@/stores/structures";

const props = defineProps({
  structure: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["closeDeleteStructureDialog"]);
const structureStore = useStructuresStore();
const deleteStructure = (id) => {
  structureStore.DELETE_STRUCTURE(id);
  emit("closeDeleteStructureDialog");
};
</script>