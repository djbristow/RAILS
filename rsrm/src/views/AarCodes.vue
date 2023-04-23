<template>
  <div class="xx">
    <h1>AAR Codes</h1>
    <v-btn @click="addAarCode()" width="200">Add AAR Code</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">AAR</th>
          <th class="text-left">RS Type</th>
          <th class="text-left">Description</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in aarCodesStore.aarCodes" :key="item.id">
          <td>{{ item.aarCode }}</td>
          <td>{{ item.rollingstockType }}</td>
          <td>{{ item.description }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editAarCode(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteAarCode(item)">mdi-delete</v-icon>
          </td>
        </tr>
      </tbody>
      <v-dialog v-model="editAarCodeDialog">
        <dialog-edit-aar-code :aarCode="editableAarCode" @closeEditAarCodeDialog="editAarCodeDialog = false" />
      </v-dialog>
      <v-dialog v-model="deleteAarCodeDialog">
        <dialog-delete-aar-code :aarCode="editableAarCode" @closeDeleteAarCodeDialog="deleteAarCodeDialog = false" />
      </v-dialog>
      <v-dialog v-model="addAarCodeDialog">
        <dialog-add-aar-code @closeAddAarCodeDialog="addAarCodeDialog = false" />
      </v-dialog>
    </v-table>
    <br />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DialogEditAarCode from "@/components/dialogs/DialogEditAarCode.vue";
import DialogDeleteAarCode from "@/components/dialogs/DialogDeleteAarCode.vue";
import DialogAddAarCode from "@/components/dialogs/DialogAddAarCode.vue";
import { useAarCodesStore } from "@/stores/aarCodes";

const aarCodesStore = useAarCodesStore();
const editAarCodeDialog = ref(false);
const deleteAarCodeDialog = ref(false);
const addAarCodeDialog = ref(false);
const editableAarCode = ref(null);

const addAarCode = () => {
  addAarCodeDialog.value = true;
};
const editAarCode = (item) => {
  editableAarCode.value = item;
  editAarCodeDialog.value = true;
};
const deleteAarCode = (item) => {
  editableAarCode.value = item;
  deleteAarCodeDialog.value = true;
};
</script>