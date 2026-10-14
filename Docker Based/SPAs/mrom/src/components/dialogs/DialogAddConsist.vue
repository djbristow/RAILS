<template>
  <v-card width="600">
    <v-card-title class="headline">New Consist</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
      <v-text-field
        v-model="name"
        label="Consist Name"
        :rules="[(v) => !!v?.trim() || 'Name is required']"
        density="compact"
        variant="outlined"
      />
      <v-text-field
        v-model="trainNumber"
        label="Train Number"
        density="compact"
        variant="outlined"
      />
      <v-textarea
        v-model="notes"
        label="Notes"
        rows="3"
        density="compact"
        variant="outlined"
      />
      <consist-cars-editor v-model="cars" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn :disabled="saving" @click="emit('closeAddConsistDialog')">Cancel</v-btn>
      <v-btn
        color="primary"
        :loading="saving"
        :disabled="!name.trim() || !leadIsLoco"
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useConsistsStore, ADD_NEW_CONSIST } from "@/stores/consists";
import { useRSStore } from "@/stores/rs";
import { firstCarIsLocomotive } from "@/utils/consistRules";
import ConsistCarsEditor from "@/components/ConsistCarsEditor.vue";

const emit = defineEmits(["closeAddConsistDialog"]);
const consistsStore = useConsistsStore();
const rsStore = useRSStore();

const name = ref("");
const trainNumber = ref("");
const notes = ref("");
const cars = ref([]);
const leadIsLoco = computed(() => firstCarIsLocomotive(cars.value, rsStore.rs));
const saving = ref(false);
const error = ref("");

const save = async () => {
  saving.value = true;
  error.value = "";
  try {
    await consistsStore[ADD_NEW_CONSIST]({
      name: name.value.trim(),
      trainNumber: trainNumber.value.trim(),
      notes: notes.value,
      cars: cars.value,
    });
    emit("closeAddConsistDialog");
  } catch (e) {
    console.error("Unable to add consist:", e);
    error.value = "Unable to add consist. Please try again.";
  } finally {
    saving.value = false;
  }
};
</script>
