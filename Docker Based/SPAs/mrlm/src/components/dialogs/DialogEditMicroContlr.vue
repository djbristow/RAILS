<template>
  <v-card width="800">
    <v-card-title class="headline"> Edit Micro Controller </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="microID" label="Name"></v-text-field>
        <v-text-field v-model="microIP" label="IP"></v-text-field>
        <v-text-field v-model="purpose" label="Purpose"></v-text-field>
        <v-text-field v-model="et" label="Last Update"></v-text-field>
        <v-text-field v-model="status" label="Status"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        @click="$emit('closeEditMicroContlrDialog')"
        color="red darken-1"
        text
      >
        Cancel
      </v-btn>
      <v-btn
        :disabled="microContlrEditDataInvalid"
        @click="editMicroContlr"
        text
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useMicrosStore } from "@/stores/micros";

const emit = defineEmits(["closeEditMicroContlrDialog"]);

const props = defineProps({
  micro: {
    type: Object,
    required: true,
  },
});
const microStore = useMicrosStore();
const _id = ref("");
const microID = ref("");
const microIP = ref("");
const purpose = ref("");
const et = ref("");
const status = ref("");
const editMicroContlr = (id) => {
  microStore.UPDATE_MICRO({
    _id: _id.value,
    microID: microID.value,
    microIP: microIP.value,
    et: et.value,
    purpose: purpose.value,
    status: status.value,
  });
  emit("closeEditMicroContlrDialog");
};
onMounted(() => {
  _id.value = props.micro._id;
  microID.value = props.micro.microID;
  microIP.value = props.micro.microIP;
  purpose.value = props.micro.purpose;
  et.value = props.micro.et;
  status.value = props.micro.status;
});
const microContlrEditDataInvalid = computed(() => {
  let result = false;
  return result;
});
</script>
