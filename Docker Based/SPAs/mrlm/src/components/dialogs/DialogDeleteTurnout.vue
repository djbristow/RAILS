<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete Turnout? </v-card-title>
    <v-card-actions>
      <v-card-text
        >Are you sure you want to delete <strong>{{ turnout.toID }}</strong
        >?</v-card-text
      >
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteTurnoutDialog')" text> No </v-btn>
      <v-btn @click="deleteTurnout(turnout._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { useTurnoutsStore } from "@/stores/turnouts";

const props = defineProps({
  turnout: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["closeDeleteTurnoutDialog"]);
const turnoutStore = useTurnoutsStore();
const deleteTurnout = (id) => {
  console.log("deleteTurnout");
  console.log(id);
  turnoutStore.DELETE_TURNOUT(id);
  emit("closeDeleteTurnoutDialog");
};
</script>
