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
import moment from "moment";

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
const emit = defineEmits(["closeEditMicroDialog"]);

const formatDate = (epochTime) => {
  if (epochTime === null || epochTime === "") {
    return "";
  } else {
    return moment
      .utc(epochTime * 1000)
      .local()
      .format("YYYY-MM-DD hh:mm");
  }
};

const editMicro = () => {
  let epochTimeValue = "";
  const inputValue = et.value.trim().toLowerCase();
  // If the user enters "now", get the current epoch time
  if (inputValue === "now") {
    epochTimeValue = moment().unix();
  }
  // If the user omits the date, use today's date
  else if (inputValue.match(/^\d{2}:\d{2}$/)) {
    const today = moment().format("YYYY-MM-DD");
    const fullDateString = `${today} ${inputValue}`;
    epochTimeValue = moment(fullDateString, "YYYY-MM-DD hh:mm").unix();
  }
  // If the user enters a full date and time
  else if (inputValue) {
    // moment() is smart enough to handle YYYY-MM-DD hh:mm format
    // and returns an invalid date if the format is wrong
    const parsedMoment = moment(et.value, "YYYY-MM-DD hh:mm");
    if (parsedMoment.isValid()) {
      epochTimeValue = parsedMoment.unix();
    } else {
      // Set to invalid or handle error
      console.error("Invalid date format entered.");
      microEditDataInvalid.value = true;
      return;
    }
  }
  // Update the micro with the new epoch time value
  microStore.UPDATE_MICRO({
    _id: _id.value,
    microID: microID.value,
    microIP: microIP.value,
    et: epochTimeValue,
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
  et.value = formatDate(props.micro.et);
  purpose.value = props.micro.purpose;
  sensorLoc.value = props.micro.sensorLoc;
  status.value = props.micro.status;
});
</script>
