<template>
    <v-card width="700">
      <v-card-title class="headline">New Rollingstock</v-card-title>
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
              <v-text-field v-model="aarCode" label="AAR Code" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="color" label="Color" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="description" label="Description" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="numberBlt" label="Number Built" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="bldr" label="Builder" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="bltDate" label="Built Date" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="inSvcDate" label="In Service Date" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="insideLength" label="Inside Length" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="insideHeight" label="Inside Height" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="insideWidth" label="Inside Width" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="ltWeight" label="Lt Weight" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="loadLimit" label="Load Limit" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="loadTypes" label="Load Types" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="capacity" label="Capacity" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="homeLocation" label="Home Location" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="lastMaintDate" label="Last Maintenance" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="numAxles" label="Number of Axles" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="rsStatus"
                :items="['Operational', 'In Service', 'In Maintenance', 'Out of Service']"
                label="Status"
                hide-details
                density="compact"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-card-subtitle>Model Details</v-card-subtitle>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="rfid" label="RFID Tag" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="rfidLocation" label="RFID Location" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="imageID" label="Image ID" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="modelWeight" label="Weight" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field v-model="modelLength" label="Length" hide-details density="compact" variant="outlined" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="notes" label="Notes" hide-details density="compact" variant="outlined" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit('closeAddRsDialog')" color="red darken-1" text>
          Cancel
        </v-btn>
        <v-btn :disabled="rsAddDataInvalid" @click="addRs" text>
          Save
        </v-btn>
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
const numberBlt = ref(0);
const inSvcDate = ref("");
const insideLength = ref("");
const insideHeight = ref("");
const insideWidth = ref("");
const loadTypes = ref("");
const capacity = ref(0);
const bldr = ref("");
const bltDate = ref("");
const notes = ref("");
const ltWeight = ref(0);
const loadLimit = ref(0);
const lastMaintDate = ref("");
const locationNow = ref("");
const homeLocation = ref("");
const rsStatus = ref("");
const imageID = ref("");
const modelWeight = ref(0);
const modelLength = ref(0);
const rfid = ref("");
const rfidLocation = ref(0);
const numAxles = ref(4);
const rsAddDataInvalid = ref(false);
const rsStore = useRSStore();
const emit = defineEmits(['closeAddRsDialog']);

const addRs = () => {
  const inSvcDateValue = inSvcDate.value ? new Date(inSvcDate.value) : null;
  const lastMaintDateValue = lastMaintDate.value ? new Date(lastMaintDate.value) : null;
  const bltDateValue = bltDate.value ? new Date(bltDate.value) : null;
  
  rsStore.ADD_NEW_RS({
    roadName: roadName.value,
    roadNumber: roadNumber.value,
    color: color.value,
    aarCode: aarCode.value,
    description: description.value,
    numberBlt: numberBlt.value,
    inSvcDate: inSvcDateValue,
    insideLength: insideLength.value,
    insideHeight: insideHeight.value,
    insideWidth: insideWidth.value,
    loadTypes: loadTypes.value,
    capacity: capacity.value,
    bldr: bldr.value,
    bltDate: bltDateValue,
    notes: notes.value,
    ltWeight: ltWeight.value,
    loadLimit: loadLimit.value,
    lastMaintDate: lastMaintDateValue,
    locationNow: locationNow.value,
    homeLocation: homeLocation.value,
    rsStatus: rsStatus.value,
    imageID: imageID.value,
    modelWeight: modelWeight.value,
    modelLength: modelLength.value,
    rfid: rfid.value,
    rfidLocation: rfidLocation.value,
    numAxles: numAxles.value,
  });
  emit('closeAddRsDialog');
};
</script>
