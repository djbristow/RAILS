<template>
  <div>
    <div class="text-subtitle-1 mb-2">Cars</div>

    <v-alert v-if="!leadIsLoco" type="warning" density="compact" class="mb-3">
      The first car must be a locomotive (AAR code DE or SE).
    </v-alert>

    <v-row density="compact" align="center">
      <v-col cols="12" sm="7">
        <v-autocomplete
          v-model="selectedId"
          :items="availableItems"
          item-title="title"
          item-value="_id"
          label="Rollingstock"
          density="compact"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col cols="6" sm="2">
        <v-select
          v-model="facing"
          :items="['A', 'B']"
          label="Facing"
          density="compact"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col cols="6" sm="3">
        <v-btn block :disabled="!canAdd" @click="addCar">Add Car</v-btn>
      </v-col>
    </v-row>
    <div v-if="selectedId && !canAdd" class="text-caption text-error mt-1">
      The first car must be a locomotive (DE or SE).
    </div>

    <v-list v-if="cars.length" density="compact" class="mt-2">
      <v-list-item
        v-for="(car, index) in cars"
        :key="car.rollingStockId"
        style="cursor: pointer"
        @click="viewCar(car.rollingStockId)"
      >
        <v-list-item-title>
          {{ index + 1 }}. {{ describe(car.rollingStockId) }}
        </v-list-item-title>
        <v-list-item-subtitle>Facing {{ car.facing }}</v-list-item-subtitle>
        <template #append>
          <v-btn
            :icon="car.facing === 'A' ? 'mdi-arrow-right' : 'mdi-arrow-left'"
            size="x-small"
            variant="text"
            title="Reverse facing"
            @click.stop="flip(index)"
          />
          <v-btn
            icon="mdi-arrow-up"
            size="x-small"
            variant="text"
            :disabled="index === 0"
            @click.stop="move(index, -1)"
          />
          <v-btn
            icon="mdi-arrow-down"
            size="x-small"
            variant="text"
            :disabled="index === cars.length - 1"
            @click.stop="move(index, 1)"
          />
          <v-btn
            icon="mdi-delete"
            size="x-small"
            variant="text"
            color="red"
            @click.stop="remove(index)"
          />
        </template>
      </v-list-item>
    </v-list>
    <div v-else class="text-caption mt-2">No cars added.</div>

    <v-dialog v-model="viewRsDialog">
      <dialog-view-rs
        v-if="viewedRs"
        :rollingstock="viewedRs"
        @closeViewRsDialog="viewRsDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRSStore } from "@/stores/rs";
import {
  firstCarIsLocomotive,
  isInService,
  isLocomotive,
} from "@/utils/consistRules";
import DialogViewRs from "@/components/dialogs/DialogViewRs.vue";

const viewRsDialog = ref(false);
const viewedRs = ref(null);
const viewCar = (id) => {
  viewedRs.value = rsStore.rs.find((r) => r._id === id) ?? null;
  viewRsDialog.value = !!viewedRs.value;
};

const cars = defineModel({ type: Array, default: () => [] });

const rsStore = useRSStore();
const selectedId = ref(null);
const facing = ref("A");

const label = (rs) => `${rs.roadName} ${rs.roadNumber} (${rs.aarCode})`;

const availableItems = computed(() => {
  const used = new Set(cars.value.map((c) => c.rollingStockId));
  return rsStore.rs
    .filter((rs) => isInService(rs) && !used.has(rs._id))
    .map((rs) => ({ _id: rs._id, title: label(rs) }));
});

const selectedRs = computed(() =>
  rsStore.rs.find((rs) => rs._id === selectedId.value)
);

const canAdd = computed(
  () =>
    !!selectedRs.value && (cars.value.length > 0 || isLocomotive(selectedRs.value))
);

const leadIsLoco = computed(() => firstCarIsLocomotive(cars.value, rsStore.rs));

const describe = (id) => {
  const rs = rsStore.rs.find((r) => r._id === id);
  return rs ? label(rs) : id;
};

const addCar = () => {
  cars.value = [
    ...cars.value,
    { rollingStockId: selectedId.value, facing: facing.value },
  ];
  selectedId.value = null;
};

const move = (index, delta) => {
  const next = [...cars.value];
  [next[index], next[index + delta]] = [next[index + delta], next[index]];
  cars.value = next;
};

const flip = (index) => {
  cars.value = cars.value.map((c, i) =>
    i === index ? { ...c, facing: c.facing === "A" ? "B" : "A" } : c
  );
};

const remove = (index) => {
  cars.value = cars.value.filter((_, i) => i !== index);
};
</script>
