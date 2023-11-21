<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title>AAR Codes</v-card-title>
        <v-card-actions>
          <v-btn @click="addAarCode">Add AAR Code</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="aarCodesStore.aarCodes"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editAarCode(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteAarCode(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editAarCodeDialog">
          <dialog-edit-aar-code
            :aarCode="editableAarCode"
            @closeEditAarCodeDialog="editAarCodeDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteAarCodeDialog">
          <dialog-delete-aar-code
            :aarCode="editableAarCode"
            @closeDeleteAarCodeDialog="deleteAarCodeDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addAarCodeDialog">
          <dialog-add-aar-code
            @closeAddAarCodeDialog="addAarCodeDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogEditAarCode from "@/components/dialogs/DialogEditAarCode.vue";
import DialogDeleteAarCode from "@/components/dialogs/DialogDeleteAarCode.vue";
import DialogAddAarCode from "@/components/dialogs/DialogAddAarCode.vue";
import { useAarCodesStore } from "@/stores/aarCodes";

const aarCodesStore = useAarCodesStore();
const editAarCodeDialog = ref(false);
const deleteAarCodeDialog = ref(false);
const addAarCodeDialog = ref(false);
const editableAarCode = ref(null);
const headers = [
  { title: "AAR", key: "aarCode" },
  { title: "RS Type", key: "rollingstockType" },
  { title: "Description", key: "description" },
  { title: "Actions", key: "actions", sortable: false },
];

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
