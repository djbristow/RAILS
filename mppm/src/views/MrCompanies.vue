<template>
  <div class="xx">
    <h1>Model Railroad Companies</h1>
    <v-btn @click="addMrCompany()" width="200">Add MR Companies</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Type</th>
          <th class="text-left">Website</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in mrcosStore.mrcos" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.website }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editMrCompany(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteMrCompany(item)"
              >mdi-delete</v-icon
            >
          </td>
        </tr>
      </tbody>
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
    </v-table>
    <br />
  </div>
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
