<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Structures</v-card-title>
        <v-data-table
          :headers="headers"
          :items="structuresStore.structures"
          item-key="item.id"
          density="compact"
          hover
          style="cursor: pointer"
          @click:row="(event, { item }) => viewStructure(item)"
        >
        </v-data-table>
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
import DialogViewStructure from "@/components/dialogs/DialogViewStructure.vue";
import { useStructuresStore } from "@/stores/structures";

const structuresStore = useStructuresStore();
const editableStructure = ref(null);
const viewStructureDialog = ref(false);
const headers = [
  { title: "Title", key: "title" },
  { title: "Use", key: "structureUse" },
  { title: "Owner", key: "owner" },
  { title: "Location", key: "location" },
  { title: "Year Built", key: "builtDate" },
];

const viewStructure = (item) => {
  editableStructure.value = item;
  viewStructureDialog.value = true;
};
</script>
