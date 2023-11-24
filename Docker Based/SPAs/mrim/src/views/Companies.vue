<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Companies</v-card-title>
        <v-card-actions>
          <v-btn @click="addCompany()" width="200">Add Company</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="companiesStore.companies"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editCompany(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteCompany(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editCompanyDialog">
          <dialog-edit-company
            :company="editableCompany"
            @closeEditCompanyDialog="editCompanyDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteCompanyDialog">
          <dialog-delete-company
            :company="editableCompany"
            @closeDeleteCompanyDialog="deleteCompanyDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addCompanyDialog">
          <dialog-add-company
            @closeAddCompanyDialog="addCompanyDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogEditCompany from "@/components/dialogs/DialogEditCompany.vue";
import DialogDeleteCompany from "@/components/dialogs/DialogDeleteCompany.vue";
import DialogAddCompany from "@/components/dialogs/DialogAddCompany.vue";
import { useCompaniesStore } from "@/stores/companies";

const companiesStore = useCompaniesStore();
const editCompanyDialog = ref(false);
const deleteCompanyDialog = ref(false);
const addCompanyDialog = ref(false);
const editableCompany = ref(null);
const headers = [
  { title: "Name", key: "shortName" },
  { title: "Full Name", key: "longName" },
  { title: "Type", key: "industryType" },
  { title: "Location", key: "industryLocation" },
  { title: "Actions", key: "actions", sortable: false },
];

const addCompany = () => {
  addCompanyDialog.value = true;
};
const editCompany = (item) => {
  editableCompany.value = item;
  editCompanyDialog.value = true;
};
const deleteCompany = (item) => {
  editableCompany.value = item;
  deleteCompanyDialog.value = true;
};
</script>
