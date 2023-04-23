<template>
  <v-card width="700">
    <v-card-title class="headline"> Rollingstock Details </v-card-title>
    <v-card-text>
      <v-container>
        <v-row dense>
          <v-text-field v-model="roadName" label="Road Name"></v-text-field>
          <v-text-field v-model="roadNumber" label="Road Number"></v-text-field>
          <v-text-field v-model="aarCode" label="AAR Code"></v-text-field>
          <v-text-field v-model="color" label="Color"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field
            v-model="description"
            label="Description"
          ></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="numberBlt" label="Number Built"></v-text-field>
          <v-text-field v-model="bldr" label="Builder"></v-text-field>
          <v-text-field v-model="bltDate" label="Built Date"></v-text-field>
          <v-text-field
            v-model="inSvcDate"
            label="In Service Date"
          ></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field
            v-model="insideLength"
            label="Inside Length"
          ></v-text-field>
          <v-text-field
            v-model="insideHeight"
            label="Inside Height"
          ></v-text-field>
          <v-text-field
            v-model="insideWidth"
            label="Inside Width"
          ></v-text-field>
          <v-text-field v-model="ltWeight" label="Lt Weight"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="loadLimit" label="Load Limit"></v-text-field>
          <v-text-field v-model="loadTypes" label="Load Types"></v-text-field>
          <v-text-field v-model="capacity" label="Capacity"></v-text-field>
          <v-text-field
            v-model="homeLocation"
            label="Home Location"
          ></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field
            v-model="lastMaintDate"
            label="Last Maintenance"
          ></v-text-field>
          <v-text-field v-model="rsStatus" label="Status"></v-text-field>
        </v-row>
        <v-card-subtitle>Model Details</v-card-subtitle>
        <v-row dense>
          <v-text-field v-model="rfid" label="RFID Tag"></v-text-field>
          <v-text-field v-model="modelWeight" label="Weight"></v-text-field>
          <v-text-field v-model="modelLength" label="Length"></v-text-field>
          <v-text-field v-model="imageID" label="Image ID"></v-text-field>
        </v-row>
        <v-row dense>
          <v-textarea v-model="notes" label="Notes"></v-textarea>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeEditRsDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="rsEditDataInvalid" @click="editRsUpdate" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRSStore } from "@/stores/rs";
import { format } from "date-fns";

const _id = ref("");
const roadName = ref("");
const roadNumber = ref("");
const color = ref("");
const aarCode = ref("");
const description = ref("");
const numberBlt = ref("");
const inSvcDate = ref("");
const insideLength = ref("");
const insideHeight = ref("");
const insideWidth = ref("");
const loadTypes = ref("");
const capacity = ref("");
const bldr = ref("");
const bltDate = ref("");
const notes = ref("");
const ltWeight = ref("");
const loadLimit = ref("");
const lastMaintDate = ref("");
const locationNow = ref("");
const homeLocation = ref("");
const rsStatus = ref("");
const imageID = ref("");
const modelWeight = ref("");
const modelLength = ref("");
const rfid = ref("");
const rsEditDataInvalid = ref(false);
const emit = defineEmits(["closeEditRsDialog"]);
const rsStore = useRSStore();
const props = defineProps({
  rollingstock: {
    type: Object,
    required: true,
  },
});
const editRsUpdate = () => {
  rsStore.UPDATE_RS({
    _id: _id.value,
    roadName: roadName.value,
    roadNumber: roadNumber.value,
    color: color.value,
    aarCode: aarCode.value,
    description: description.value,
    numberBlt: numberBlt.value,
    inSvcDate: inSvcDate.value,
    insideLength: insideLength.value,
    insideHeight: insideHeight.value,
    insideWidth: insideWidth.value,
    loadTypes: loadTypes.value,
    capacity: capacity.value,
    bldr: bldr.value,
    bltDate: bltDate.value,
    notes: notes.value,
    ltWeight: ltWeight.value,
    loadLimit: loadLimit.value,
    lastMaintDate: lastMaintDate.value,
    locationNow: locationNow.value,
    homeLocation: homeLocation.value,
    rsStatus: rsStatus.value,
    imageID: imageID.value,
    modelWeight: modelWeight.value,
    modelLength: modelLength.value,
    rfid: rfid.value,
  });
  emit("closeEditRsDialog");
};
onMounted(() => {
  _id.value = props.rollingstock._id;
  roadName.value = props.rollingstock.roadName;
  roadNumber.value = props.rollingstock.roadNumber;
  color.value = props.rollingstock.color;
  aarCode.value = props.rollingstock.aarCode;
  description.value = props.rollingstock.description;
  numberBlt.value = props.rollingstock.numberBlt;
  inSvcDate.value = format(
    new Date(props.rollingstock.inSvcDate),
    "MMM d, yyyy"
  );
  insideLength.value = props.rollingstock.insideLength;
  insideHeight.value = props.rollingstock.insideHeight;
  insideWidth.value = props.rollingstock.insideWidth;
  loadTypes.value = props.rollingstock.loadTypes;
  capacity.value = props.rollingstock.capacity;
  bldr.value = props.rollingstock.bldr;
  bltDate.value = format(new Date(props.rollingstock.bltDate), "MMM d, yyyy");
  notes.value = props.rollingstock.notes;
  ltWeight.value = props.rollingstock.ltWeight;
  loadLimit.value = props.rollingstock.loadLimit;
  lastMaintDate.value = format(
      new Date(props.rollingstock.lastMaintDate),
      "MMM d, yyyy"
    );
  locationNow.value = props.rollingstock.locationNow;
  homeLocation.value = props.rollingstock.homeLocation;
  rsStatus.value = props.rollingstock.rsStatus;
  imageID.value = props.rollingstock.imageID;
  modelWeight.value = props.rollingstock.modelWeight;
  modelLength.value = props.rollingstock.modelLength;
  rfid.value = props.rollingstock.rfid;
});
</script>
