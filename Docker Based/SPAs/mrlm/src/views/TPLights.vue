<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Turnout Panel Lights</v-card-title>
        <v-card-actions>
          <v-btn @click="addTPLight()" width="250"
            >Add Turnout Panel Light</v-btn
          >
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="tplightsStore.TO_TPLIGHTS"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.color="{ item }">
            <v-icon v-if="item.color === 'green'" color="green darken-1"
              >mdi-circle</v-icon
            >
            <v-icon v-else-if="item.color === 'red'" color="red darken-1"
              >mdi-circle</v-icon
            >
            <v-icon v-else color="blue darken-1">mdi-circle</v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editTPLight(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteTPLight(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editTPLightDialog">
          <dialog-edit-t-p-light
            :tplight="editableTPLight"
            @closeEditTPLightDialog="editTPLightDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteTPLightDialog">
          <dialog-delete-t-p-light
            :tplight="editableTPLight"
            @closeDeleteTPLightDialog="deleteTPLightDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addTPLightDialog">
          <dialog-add-t-p-light
            @closeAddTPLightDialog="addTPLightDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogEditTPLight from "@/components/dialogs/DialogEditTPLight.vue";
import DialogDeleteTPLight from "@/components/dialogs/DialogDeleteTPLight.vue";
import DialogAddTPLight from "@/components/dialogs/DialogAddTPLight.vue";
import { useTplightsStore } from "@/stores/tplights";
import { useTurnoutsStore } from "@/stores/turnouts";

const tplightsStore = useTplightsStore();
const editableTPLight = ref(null);
const editTPLightDialog = ref(false);
const deleteTPLightDialog = ref(false);
const addTPLightDialog = ref(false);
const headers = [
  { title: "Turnout", key: "turnout" },
  { title: "Panel Number", key: "panelNum" },
  { title: "Panel Name", key: "panelName" },
  { title: "Controller", key: "controller" },
  { title: "TPL Number", key: "controller" },
  { title: "Status", key: "color" },
  { title: "Actions", key: "actions", sortable: false },
];

const addTPLight = () => {
  addTPLightDialog.value = true;
};
const deleteTPLight = (item) => {
  editableTPLight.value = item;
  deleteTPLightDialog.value = true;
};
const editTPLight = (item) => {
  editableTPLight.value = item;
  editTPLightDialog.value = true;
};
</script>
