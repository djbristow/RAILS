<template>
  <v-card width="500">
    <v-card-title class="headline">Delete Consist</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
      <p>Are you sure you want to delete this consist?</p>
      <p class="mt-3">
        <strong>Name:</strong> {{ consist?.name }}<br />
        <strong>Train Number:</strong> {{ consist?.trainNumber || "—" }}
      </p>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="deleting" @click="emit('closeDeleteConsistDialog')">
        Cancel
      </v-btn>
      <v-btn color="red" :loading="deleting" @click="confirmDelete">
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useConsistsStore, DELETE_CONSIST } from "@/stores/consists";

const props = defineProps({
  consist: { type: Object, default: null },
});
const emit = defineEmits(["closeDeleteConsistDialog"]);

const consistsStore = useConsistsStore();
const deleting = ref(false);
const error = ref("");

const confirmDelete = async () => {
  deleting.value = true;
  error.value = "";
  try {
    await consistsStore[DELETE_CONSIST](props.consist._id);
    emit("closeDeleteConsistDialog");
  } catch (e) {
    console.error("Unable to delete consist:", e);
    error.value = "Unable to delete consist. Please try again.";
  } finally {
    deleting.value = false;
  }
};
</script>
