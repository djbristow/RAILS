<template>
  <v-card width="700">
    <v-card-title class="headline"> New Rollingstock </v-card-title>
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
          <v-text-field v-model="notes" label="Notes"></v-text-field>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddRsDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="rsAddDataInvalid" @click="addRs" text> Save </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRSStore, ADD_NEW_RS } from "@/stores/rs";

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
const rsAddDataInvalid = ref(false);
const rsStore = useRSStore();
const emit = defineEmits(["closeAddRsDialog"]);

const addRs = () => {
  rsStore.ADD_NEW_RS({
    roadName: roadName.value,
    roadNumber: roadNumber.value,
    color: color.value,
    aarCode: aarCode.value,
    description: description.value,
    numberBlt: numberBlt.value,
    inSvcDate: (Date(inSvcDate.value)),
    insideLength: insideLength.value,
    insideHeight: insideHeight.value,
    insideWidth: insideWidth.value,
    loadTypes: loadTypes.value,
    capacity: capacity.value,
    bldr: bldr.value,
    bltDate: (Date(bltDate.value)),
    notes: notes.value,
    ltWeight: ltWeight.value,
    loadLimit: loadLimit.value,
    lastMaintDate: (Date(lastMaintDate.value)),
    locationNow: locationNow.value,
    homeLocation: homeLocation.value,
    rsStatus: rsStatus.value,
    imageID: imageID.value,
    modelWeight: modelWeight.value,
    modelLength: modelLength.value,
    rfid: rfid.value,
  });
  emit('closeAddRsDialog');
};
</script>
