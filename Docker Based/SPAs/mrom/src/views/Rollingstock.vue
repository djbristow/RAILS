<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Rollingstock</v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="mb-4" ></v-text-field>
        
        <v-data-table
          :headers="headers"
          :items="rsStore.rs" :search="search"
          item-key="item.id"
          density="compact"
          hover
          style="cursor: pointer"
          @click:row="(event, { item }) => viewRollingstock(item)"
        ></v-data-table>
        <v-dialog v-model="viewRsDialog">
          <dialog-view-rs
            :rollingstock="editableRs"
            @closeViewRsDialog="viewRsDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogViewRs from "../components/dialogs/DialogViewRs.vue";
import { useRSStore } from "@/stores/rs";

const rsStore = useRSStore();
const viewRsDialog = ref(false);
const editableRs = ref(null);

const headers = [
  { title: "Road Name", key: "roadName" },
  { title: "Road Number", key: "roadNumber" },
  { title: "AAR", key: "aarCode" },
  { title: "Description", key: "description"},
  { title: "Color", key: "color" },
  { title: "Status", key: "rsStatus", sortable: true },
];
const search = ref("");

const viewRollingstock = (item) => {
  editableRs.value = item;
  viewRsDialog.value = true;
};
</script>