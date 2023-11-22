<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title>Micro Controllers</v-card-title>
        <v-card-actions>
          <v-btn @click="addMicroContlr()" width="200"
            >Add Micro Controller</v-btn
          >
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="microsStore.micros"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.et="{ item }">
            {{ formatDate(item.et) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-icon v-if="item.status === 'Up'" color="green"
              >mdi-server</v-icon
            >
            <v-icon v-else-if="item.status === 'Down'" color="red"
              >mdi-server
            </v-icon>
            <v-icon v-else color="yellow">mdi-server </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editMicroContlr(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteMicroContlr(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editMicroContlrDialog">
          <dialog-edit-micro-contlr
            :micro="editableMicroContlr"
            @closeEditMicroContlrDialog="editMicroContlrDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteMicroContlrDialog">
          <dialog-delete-micro-contlr
            :micro="editableMicroContlr"
            @closeDeleteMicroContlrDialog="deleteMicroContlrDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addMicroContlrDialog">
          <dialog-add-micro-contlr
            @closeAddMicroContlrDialog="addMicroContlrDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import moment from "moment";
import DialogEditMicroContlr from "../components/dialogs/DialogEditMicroContlr.vue";
import DialogDeleteMicroContlr from "../components/dialogs/DialogDeleteMicroContlr.vue";
import DialogAddMicroContlr from "../components/dialogs/DialogAddMicroContlr.vue";
import { useMicrosStore } from "@/stores/micros";

const microsStore = useMicrosStore();
const addMicroContlrDialog = ref(false);
const deleteMicroContlrDialog = ref(false);
const editMicroContlrDialog = ref(false);
const editableMicroContlr = ref(null);
const headers = [
  { title: "Name", key: "microID" },
  { title: "IP", key: "microIP" },
  { title: "Purpose", key: "purpose" },
  { title: "Last Update", key: "et" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false },
];

const formatDate = (epochTime) => {
  if (epochTime === null || epochTime === "") {
    return "";
  } else {
    return moment
      .utc(epochTime * 1000)
      .local()
      .format("YYYY-MM-DD hh:mm:ss");
  }
};
const addMicroContlr = () => {
  addMicroContlrDialog.value = true;
};
const deleteMicroContlr = (item) => {
  editableMicroContlr.value = item;
  deleteMicroContlrDialog.value = true;
};
const editMicroContlr = (item) => {
  editableMicroContlr.value = item;
  editMicroContlrDialog.value = true;
};
</script>
