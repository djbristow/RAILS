<template>
  <v-app>
    <v-container class="xx">
      <v-card>
        <v-card-title>Inventory of Rollingstock</v-card-title>
        <v-card-actions>
          <v-btn @click="addRollingstock()" width="175">New Rollingstock</v-btn>
        </v-card-actions>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="rsStore.rs"
          :search="search"
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
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogEditRs from "@/components/dialogs/DialogEditRs.vue";
import DialogDeleteRs from "@/components/dialogs/DialogDeleteRs.vue";
import DialogAddRs from "@/components/dialogs/DialogAddRs.vue";
import { useRSStore } from "@/stores/rs";

const rsStore = useRSStore();
const editRsDialog = ref(false);
const deleteRsDialog = ref(false);
const addRsDialog = ref(false);
const editableRs = ref(null);
const headers = [
  { title: "Road Name", key: "roadName" },
  { title: "Road Number", key: "roadNumber" },
  { title: "AAR", key: "aarCode" },
  { title: "Color", key: "color" },
  { title: "RFID", key: "rfid" },
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
</script>
