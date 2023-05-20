<template>
  <div class="xx">
    <h1>Companies</h1>
    <v-btn @click="addCompany()" width="200">Add Company</v-btn>
    <v-table density="compact" fixed-header height="800px">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Full Name</th>
          <th class="text-left">Type</th>
          <th class="text-left">Location</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in companiesStore.companies" :key="item.id">
          <td>{{ item.shortName }}</td>
          <td>{{ item.longName }}</td>
          <td>{{ item.industryType }}</td>
          <td>{{ item.industryLocation }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editCompany(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteCompany(item)"
              >mdi-delete</v-icon
            >
          </td>
        </tr>
      </tbody>
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
        <dialog-add-company @closeAddCompanyDialog="addCompanyDialog = false" />
      </v-dialog>
    </v-table>
    <br />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DialogEditCompany from "@/components/dialogs/DialogEditCompany.vue";
import DialogDeleteCompany from "@/components/dialogs/DialogDeleteCompany.vue";
import DialogAddCompany from "@/components/dialogs/DialogAddCompany.vue";
import { useCompaniesStore } from "@/stores/companies";

const companiesStore = useCompaniesStore();
const editCompanyDialog = ref(false);
const deleteCompanyDialog = ref(false);
const addCompanyDialog = ref(false);
const editableCompany = ref(null);

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
