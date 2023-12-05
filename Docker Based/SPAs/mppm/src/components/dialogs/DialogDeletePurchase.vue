<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete MR Purchase? </v-card-title>
    <v-card-actions>
      <v-card-text
        >Are you sure you want to delete
        <strong>{{ purchase.num }} {{ purchase.desciption }}</strong
        >?</v-card-text
      >
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeletePurchaseDialog')" text> No </v-btn>
      <v-btn @click="deletePurchase(purchase._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { usePurchasesStore } from "@/stores/purchases";

const props = defineProps({
  purchase: {
    type: Object,
    required: true,
  },
});
const purchasesStore = usePurchasesStore();
const emit = defineEmits(["closeDeletePurchaseDialog"]);

const deletePurchase = (id) => {
  purchasesStore.DELETE_PURCHASE(id);
  emit("closeDeletePurchaseDialog");
};
</script>
