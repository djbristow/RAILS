<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Rollingstock</v-card-title>
        <v-card-actions>
          <v-btn @click="addRollingstock()" width="175">New Rollingstock</v-btn>
        </v-card-actions>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="mb-4" ></v-text-field>
        
        <v-data-table
          :headers="headers"
          :items="filteredRollingstock" :search="search"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editRollingstock(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteRollingstock(item)"
              >mdi-delete</v-icon
            >
            <v-icon
              v-if="item.imageID"
              color="green darken-1"
              @click="viewRollingstock(item)"
              >mdi-eye</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editRsDialog">
          <dialog-edit-rs
            :rollingstock="editableRs"
            @closeEditRsDialog="editRsDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteRsDialog">
          <dialog-delete-rs
            :rollingstock="editableRs"
            @closeDeleteRsDialog="deleteRsDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addRsDialog">
          <dialog-add-rs @closeAddRsDialog="addRsDialog = false" />
        </v-dialog>
        <v-dialog v-model="viewRsDialog">
          <dialog-view-rs
            :rollingstock="editableRs"
            @closeViewRsDialog="viewRsDialog = false"
          />
        </v-dialog>
        <v-select
          v-model="selectedStatuses"
          :items="statusOptions"
          label="Filter by Status"
          multiple
          chips
          clearable
          single-line
          hide-details
          class="mb-3"
        ></v-select>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue"; // CHANGED: Added 'computed'
import DialogEditRs from "../components/dialogs/DialogEditRs.vue";
import DialogDeleteRs from "../components/dialogs/DialogDeleteRs.vue";
import DialogAddRs from "../components/dialogs/DialogAddRs.vue";
import DialogViewRs from "../components/dialogs/DialogViewRs.vue";
import { useRSStore } from "@/stores/rs";

const rsStore = useRSStore();
const editRsDialog = ref(false);
const deleteRsDialog = ref(false);
const addRsDialog = ref(false);
const viewRsDialog = ref(false);
const editableRs = ref(null);

// 👇 ADDED: Status filtering logic
const statusOptions = ref(["Operational", "Out of Service", "In Service", "In Maintenance", ""]);
// Default to all options to show all rollingstock initially
const selectedStatuses = ref(statusOptions.value);

const filteredRollingstock = computed(() => {
  if (selectedStatuses.value.length === 0) {
    return []; // If nothing is selected, show an empty list
  }
  
  // Filter the full list from the store
  return rsStore.rs.filter((rs) => {
    return selectedStatuses.value.includes(rs.rsStatus);
  });
});
// 👆 END ADDED

const headers = [
  { title: "Road Name", key: "roadName" },
  { title: "Road Number", key: "roadNumber" },
  { title: "AAR", key: "aarCode" },
  { title: "Description", key: "description"},
  { title: "Color", key: "color" },
  { title: "Actions", key: "actions", sortable: false },
];
const search = ref("");

const addRollingstock = () => {
  addRsDialog.value = true;
};
const editRollingstock = (item) => {
  editableRs.value = item;
  editRsDialog.value = true;
};
const deleteRollingstock = (item) => {
  editableRs.value = item;
  deleteRsDialog.value = true;
};
const viewRollingstock = (item) => {
  editableRs.value = item;
  viewRsDialog.value = true;
};
</script>