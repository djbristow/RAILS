<template>
  <v-card width="800">
    <v-card-title class="headline">Decoder</v-card-title>
    <v-card-text>
      <v-container>
          <v-row compact>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="roadName" label="Road Name" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="roadNumber" label="Road Number" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="mfg" label="Manufacturer" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="family" label="Family" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="model" label="Model" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="address" label="Address" hide-details density="compact" variant="outlined" />
            </v-col>
          </v-row>
        </v-container>
    </v-card-text>
    <v-card-actions>
      <div v-if="noLoco">
        <v-spacer />
        <h3 style="color: darkred">Locomotive not in inventory.</h3>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeEditDecoderDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="decoderEditDataInvalid" @click="editDecoder" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useDecodersStore } from "@/stores/decoders";
import { useRSStore } from "@/stores/rs";

const props = defineProps({
  decoderLoco: {
    type: Object,
    required: true,
  },
});
const roadName = ref("");
const roadNumber = ref("");
const mfg = ref("");
const family = ref("");
const model = ref("");
const address = ref("");
const noLoco = ref(false);
const decoderStore = useDecodersStore();
const rssStore = useRSStore();
const decoderEditDataInvalid = ref(false);
const emit = defineEmits(["closeEditDecoderDialog"]);

const editDecoder = () => {
  let loco = rssStore.CHECK_LOCO(roadName.value, roadNumber.value);
  if (loco == undefined) {
    noLoco.value = true;
  } else {
    noLoco.value = false;
    decoderStore.UPDATE_DECODER({
      _id: props.decoderLoco._id,
      locomotiveID: loco._id,
      roadName: roadName.value,
      roadNumber: roadNumber.value,
      mfg: mfg.value,
      family: family.value,
      model: model.value,
      address: address.value,
    });
    emit("closeEditDecoderDialog");
  }
};
onMounted(() => {
  roadName.value = props.decoderLoco.roadName;
  roadNumber.value = props.decoderLoco.roadNumber;
  mfg.value = props.decoderLoco.mfg;
  family.value = props.decoderLoco.family;
  model.value = props.decoderLoco.model;
  address.value = props.decoderLoco.address;
});
</script>
