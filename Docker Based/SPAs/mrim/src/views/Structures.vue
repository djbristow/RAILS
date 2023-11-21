<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title>Structures</v-card-title>
        <v-card-actions>
          <v-btn @click="addStructure()" width="200">Add Structure</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="structuresStore.structures"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editStructure(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteStructure(item)"
              >mdi-delete</v-icon
            >
            <v-icon
              v-if="item.image"
              color="green darken-1"
              @click="viewStructure(item)"
              >mdi-eye</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editStructureDialog">
          <dialog-edit-structure
            :structure="editableStructure"
            @closeEditStructureDialog="editStructureDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteStructureDialog">
          <dialog-delete-structure
            :structure="editableStructure"
            @closeDeleteStructureDialog="deleteStructureDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addStructureDialog">
          <dialog-add-structure
            @closeAddStructureDialog="addStructureDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="viewStructureDialog">
          <dialog-view-structure
            :structure="editableStructure"
            @closeViewStructureDialog="viewStructureDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogAddStructure from "@/components/dialogs/DialogAddStructure.vue";
import DialogDeleteStructure from "@/components/dialogs/DialogDeleteStructure.vue";
import DialogEditStructure from "@/components/dialogs/DialogEditStructure.vue";
import DialogViewStructure from "@/components/dialogs/DialogViewStructure.vue";
import { useStructuresStore } from "@/stores/structures";

const structuresStore = useStructuresStore();
const editStructureDialog = ref(false);
const deleteStructureDialog = ref(false);
const addStructureDialog = ref(false);
const editableStructure = ref(null);
const viewStructureDialog = ref(false);
const headers = [
  { title: "Title", key: "title" },
  { title: "Use", key: "structureUse" },
  { title: "Owner", key: "owner" },
  { title: "Location", key: "location" },
  { title: "Year Built", key: "builtDate" },
  { title: "Actions", key: "actions", sortable: false },
];

const addStructure = () => {
  addStructureDialog.value = true;
};
const editStructure = (item) => {
  editableStructure.value = item;
  editStructureDialog.value = true;
};
const deleteStructure = (item) => {
  editableStructure.value = item;
  deleteStructureDialog.value = true;
};
const viewStructure = (item) => {
  editableStructure.value = item;
  viewStructureDialog.value = true;
};
</script>
