<template>
  <v-card width="500">
    <v-card-title class="headline">New Decoder</v-card-title>
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
const decoderStore = useDecodersStore();
const rssStore = useRSStore();
const decoderAddDataInvalid = ref(false);
const emit = defineEmits(["closeAddDecoderDialog"]);

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
