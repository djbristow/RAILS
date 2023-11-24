<template>
  <v-card width="400">
    <v-card-title class="headline"> Micro </v-card-title>
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
      <v-btn @click="$emit('closeEditMicroDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="microEditDataInvalid" @click="editMicro" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useMicrosStore } from "@/stores/micros";

const microID = ref("");
const microIP = ref("");
const _id = ref("");
const et = ref("");
const purpose = ref("");
const sensorLoc = ref("");
const status = ref("");
const microEditDataInvalid = ref(false);
const microStore = useMicrosStore();
const props = defineProps({
  micro: {
    type: Object,
    required: true,
  },
});
const editMicro = () => {
  microStore.UPDATE_MICRO({
    _id: _id.value,
    microID: microID.value,
    microIP: microIP.value,
    et: et.value,
    purpose: purpose.value,
    sensorLoc: sensorLoc.value,
    status: status.value,
  });
  emit("closeEditMicroDialog");
};
onMounted(() => {
  _id.value = props.micro._id;
  microID.value = props.micro.microID;
  microIP.value = props.micro.microIP;
  et.value = props.micro.et;
  purpose.value = props.micro.purpose;
  sensorLoc.value = props.micro.sensorLoc;
  status.value = props.micro.status;
});
</script>
