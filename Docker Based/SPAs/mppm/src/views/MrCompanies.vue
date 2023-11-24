<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Model Railroad Companies</v-card-title>
        <v-card-actions>
          <v-btn @click="addMrCompany()" width="200">Add MR Companies</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="mrcosStore.mrcos"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editMrCompany(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteMrCompany(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editMrCompanyDialog">
          <dialog-edit-mr-company
            :mrco="editableMrCompany"
            @closeEditMrCompanyDialog="editMrCompanyDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteMrCompanyDialog">
          <dialog-delete-mr-company
            :mrco="editableMrCompany"
            @closeDeleteMrCompanyDialog="deleteMrCompanyDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addMrCompanyDialog">
          <dialog-add-mr-company
            @closeAddMrCompanyDialog="addMrCompanyDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useMrcosStore } from "@/stores/mrcos";
import DialogEditMrCompany from "@/components/dialogs/DialogEditMrCompany.vue";
import DialogDeleteMrCompany from "@/components/dialogs/DialogDeleteMrCompany.vue";
import DialogAddMrCompany from "@/components/dialogs/DialogAddMrCompany.vue";

const mrcosStore = useMrcosStore();
const editMrCompanyDialog = ref(false);
const deleteMrCompanyDialog = ref(false);
const addMrCompanyDialog = ref(false);
const editableMrCompany = ref(null);
const headers = [
  { title: "Name", key: "name" },
  { title: "Type", key: "type" },
  { title: "Website", key: "website" },
  { title: "Actions", key: "actions", sortable: false },
];

const addMrCompany = () => {
  addMrCompanyDialog.value = true;
};
const deleteMrCompany = (item) => {
  editableMrCompany.value = item;
  deleteMrCompanyDialog.value = true;
};
const editMrCompany = (item) => {
  editableMrCompany.value = item;
  editMrCompanyDialog.value = true;
};
</script>
