<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Decoders</v-card-title>
        <v-card-actions>
          <v-btn @click="addDecoder()" width="200">Add Decoder</v-btn>
        </v-card-actions>
        <v-data-table
          :headers="headers"
          :items="decodersStore.DECODER_LOCOS"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editDecoder(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteDecoder(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
        <v-dialog v-model="editDecoderDialog">
          <dialog-edit-decoder
            :decoderLoco="editableDecoder"
            @closeEditDecoderDialog="editDecoderDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="deleteDecoderDialog">
          <dialog-delete-decoder
            :decoderLoco="editableDecoder"
            @closeDeleteDecoderDialog="deleteDecoderDialog = false"
          />
        </v-dialog>
        <v-dialog v-model="addDecoderDialog">
          <dialog-add-decoder
            @closeAddDecoderDialog="addDecoderDialog = false"
          />
        </v-dialog>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import DialogEditDecoder from "@/components/dialogs/DialogEditDecoder.vue";
import DialogDeleteDecoder from "@/components/dialogs/DialogDeleteDecoder.vue";
import DialogAddDecoder from "@/components/dialogs/DialogAddDecoder.vue";
import { useDecodersStore } from "@/stores/decoders";

const decodersStore = useDecodersStore();
const editDecoderDialog = ref(false);
const deleteDecoderDialog = ref(false);
const addDecoderDialog = ref(false);
const editableDecoder = ref(null);
const headers = [
  { title: "Road Name", key: "roadName" },
  { title: "Road Number", key: "roadNumber" },
  { title: "Manufacturer", key: "mfg" },
  { title: "Family", key: "family" },
  { title: "Model", key: "model" },
  { title: "Address", key: "address" },
  { title: "Actions", key: "actions", sortable: false },
];

const addDecoder = () => {
  addDecoderDialog.value = true;
};
const editDecoder = (item) => {
  editableDecoder.value = item;
  editDecoderDialog.value = true;
};
const deleteDecoder = (item) => {
  editableDecoder.value = item;
  deleteDecoderDialog.value = true;
};
</script>
