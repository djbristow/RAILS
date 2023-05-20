<template>
  <div class="xx">
    <h1>Decoders</h1>
    <v-btn @click="addDecoder()" width="200">Add Decoder</v-btn>
    <v-table density="compact" fixed-header height="800px">
      <thead>
        <tr>
          <th class="text-left">Road Name</th>
          <th class="text-left">Road Number</th>
          <th class="text-left">Manufacturer</th>
          <th class="text-left">Family</th>
          <th class="text-left">Model</th>
          <th class="text-left">Address</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in decodersStore.DECODER_LOCOS" :key="item.id">
          <td>{{ item.roadName }}</td>
          <td>{{ item.roadNumber }}</td>
          <td>{{ item.mfg }}</td>
          <td>{{ item.family }}</td>
          <td>{{ item.model }}</td>
          <td>{{ item.address }}</td>
          <td>
            <v-icon color="blue darken-1" @click="editDecoder(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteDecoder(item)"
              >mdi-delete</v-icon
            >
          </td>
        </tr>
      </tbody>
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
        <dialog-add-decoder @closeAddDecoderDialog="addDecoderDialog = false" />
      </v-dialog>
    </v-table>
    <br />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DialogEditDecoder from "@/components/dialogs/DialogEditDecoder.vue";
import DialogDeleteDecoder from "@/components/dialogs/DialogDeleteDecoder.vue";
import DialogAddDecoder from "@/components/dialogs/DialogAddDecoder.vue";
import { useDecodersStore } from "@/stores/decoders";

const decodersStore = useDecodersStore();
const editDecoderDialog = ref(false);
const deleteDecoderDialog = ref(false);
const addDecoderDialog = ref(false);
const editableDecoder = ref(null);

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
