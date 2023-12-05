<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete MR Company? </v-card-title>
    <v-card-actions>
      <v-card-text
        >Are you sure you want to delete <strong>{{ mrco.name }}</strong
        >?</v-card-text
      >
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteMrCompanyDialog')" text> No </v-btn>
      <v-btn @click="deleteMrCompany(mrco._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useMrcosStore } from "@/stores/mrcos";

const props = defineProps({
  mrco: {
    type: Object,
    required: true,
  },
});
const mrcosStore = useMrcosStore();
const emit = defineEmits(["closeDeleteMrCompanyDialog"]);

const deleteMrCompany = (id) => {
  mrcosStore.DELETE_MRCO(id);
  emit("closeDeleteMrCompanyDialog");
};
</script>
