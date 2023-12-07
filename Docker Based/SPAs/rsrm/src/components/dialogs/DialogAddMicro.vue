<template>
  <v-card width="400">
    <v-card-title class="headline"> New Micro </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="microID" label="Name"></v-text-field>
        <v-text-field v-model="microIP" label="IP"></v-text-field>
        <v-text-field v-model="et" label="Time"></v-text-field>
        <v-text-field v-model="purpose" label="Purpose"></v-text-field>
        <v-text-field
          v-model="sensorLoc"
          label="Sensor Location"
        ></v-text-field>
        <v-text-field v-model="status" label="Status"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddMicroDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="microAddDataInvalid" @click="addMicro" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from "vue";
import { useMicrosStore } from "@/stores/micros";

const microID = ref("");
const microIP = ref("");
const et = ref("");
const purpose = ref("");
const sensorLoc = ref("");
const status = ref("");
const microAddDataInvalid = ref(false);
const microStore = useMicrosStore();
const emit = defineEmits(["closeAddMicroDialog"]);

const addMicro = () => {
  microStore.ADD_NEW_MICRO({
    microID: microID.value,
    microIP: microIP.value,
    et: et.value,
    purpose: purpose.value,
    sensorLoc: sensorLoc.value,
    status: status.value,
  });
  emit("closeAddMicroDialog");
};
</script>
