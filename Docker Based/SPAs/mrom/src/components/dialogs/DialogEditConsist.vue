<template>
  <v-card width="600">
    <v-card-title class="headline">Edit Consist</v-card-title>
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
      <v-select
        v-model="type"
        :items="consistTypes"
        label="Type"
        :rules="[(v) => !!v || 'Type is required']"
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
      <v-btn :disabled="saving" @click="emit('closeEditConsistDialog')">
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        :loading="saving"
        :disabled="!name.trim() || !type || !leadIsLoco"
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useConsistsStore, UPDATE_CONSIST } from "@/stores/consists";
import { useRSStore } from "@/stores/rs";
import { firstCarIsLocomotive } from "@/utils/consistRules";
import ConsistCarsEditor from "@/components/ConsistCarsEditor.vue";

const props = defineProps({
  consist: { type: Object, default: null },
});
const emit = defineEmits(["closeEditConsistDialog"]);

const consistsStore = useConsistsStore();
const rsStore = useRSStore();
const name = ref(props.consist?.name ?? "");
const trainNumber = ref(props.consist?.trainNumber ?? "");
const consistTypes = ["Freight", "Block", "Mixed", "Intermodal", "Local", "Passenger", "Express", "Special", "Work"];
const type = ref(props.consist?.type ?? "");
const notes = ref(props.consist?.notes ?? "");
const cars = ref(
  (props.consist?.cars ?? []).map((c) => ({
    rollingStockId: c.rollingStockId,
    facing: c.facing,
  }))
);
const leadIsLoco = computed(() => firstCarIsLocomotive(cars.value, rsStore.rs));
const saving = ref(false);
const error = ref("");

const save = async () => {
  saving.value = true;
  error.value = "";
  try {
    await consistsStore[UPDATE_CONSIST]({
      _id: props.consist._id,
      name: name.value.trim(),
      trainNumber: trainNumber.value.trim(),
      type: type.value,
      notes: notes.value,
      cars: cars.value,
    });
    emit("closeEditConsistDialog");
  } catch (e) {
    console.error("Unable to update consist:", e);
    error.value = "Unable to update consist. Please try again.";
  } finally {
    saving.value = false;
  }
};
</script>
