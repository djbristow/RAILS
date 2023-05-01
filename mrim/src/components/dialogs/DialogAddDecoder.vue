<template>
  <v-card width="500">
    <v-card-title class="headline"> New Decoder </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="roadName" label="Road Name"></v-text-field>
        <v-text-field v-model="roadNumber" label="Road Number"></v-text-field>
        <v-text-field v-model="mfg" label="Manufacturer"></v-text-field>
        <v-text-field v-model="family" label="Family"></v-text-field>
        <v-text-field v-model="model" label="Model"></v-text-field>
        <v-text-field v-model="address" label="Address"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <div v-if="noLoco">
        <v-spacer></v-spacer>
        <h3 style="color: darkred">Locomotive not in inventory.</h3>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddDecoderDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="decoderAddDataInvalid" @click="addDecoder" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref } from "vue";
import { useDecodersStore } from "@/stores/decoders";
import { useRSStore } from "@/stores/rs";

const roadName = ref("");
const roadNumber = ref("");
const mfg = ref("");
const family = ref("");
const model = ref("");
const address = ref("");
const noLoco = ref(false);
const emit = defineEmits(["closeAddDecoderDialog"]);
const decoderStore = useDecodersStore();
const rssStore = useRSStore();
const decoderAddDataInvalid = ref(false);
const addDecoder = () => {
  let loco = rssStore.CHECK_LOCO(roadName.value, roadNumber.value);
  if (loco == undefined) {
    noLoco.value = true;
  } else {
    noLoco.value = false;
    decoderStore.ADD_NEW_DECODER({
      locomotiveID: loco._id,
      roadName: roadName.value,
      roadNumber: roadNumber.value,
      mfg: mfg.value,
      family: family.value,
      model: model.value,
      address: address.value,
    });
    emit("closeAddDecoderDialog");
  }
};
</script>
