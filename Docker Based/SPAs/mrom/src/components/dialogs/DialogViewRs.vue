<template>
  <v-card width="900">
    <v-card-title class="headline"> Rollingstock Details </v-card-title>
    <v-container>
      <v-row compact>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Road Name" :model-value="rollingstock.roadName" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Road Number" :model-value="rollingstock.roadNumber" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="AAR Code" :model-value="rollingstock.aarCode" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Color" :model-value="rollingstock.color" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Description" :model-value="rollingstock.description" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Number Built" :model-value="rollingstock.numberBlt" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Builder" :model-value="rollingstock.bldr" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Built Date" :model-value="formatDate(rollingstock.bltDate)" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="In Service Date" :model-value="formatDate(rollingstock.inSvcDate)" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Inside Length" :model-value="rollingstock.insideLength" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Inside Height" :model-value="rollingstock.insideHeight" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Inside Width" :model-value="rollingstock.insideWidth" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Lt Weight" :model-value="rollingstock.ltWeight" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Load Limit" :model-value="rollingstock.loadLimit" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Load Types" :model-value="rollingstock.loadTypes" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Capacity" :model-value="rollingstock.capacity" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Home Location" :model-value="rollingstock.homeLocation" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Last Maintenance" :model-value="formatDate(rollingstock.lastMaintDate)" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Next Maintenance" :model-value="formatDate(rollingstock.nextMaintDate)" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Number of Axles" :model-value="rollingstock.numAxles" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Status" :model-value="rollingstock.rsStatus" readonly hide-details density="compact" variant="outlined" />
        </v-col>
      </v-row>
      <v-card-subtitle class="px-0 my-2">Model Details</v-card-subtitle>
      <v-row compact>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="RFID Tag" :model-value="rollingstock.rfid" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="RFID Location" :model-value="rollingstock.rfidLocation" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Weight" :model-value="rollingstock.modelWeight" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Length" :model-value="rollingstock.modelLength" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="Notes" :model-value="rollingstock.notes" readonly hide-details density="compact" variant="outlined" rows="2" auto-grow />
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn @click="$emit('closeViewRsDialog')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { format } from "date-fns";
defineProps({
  rollingstock: {
    type: Object,
    required: true,
  },
});
const formatDate = (unformatDate) => {
  if (!unformatDate) {
    return "";
  }
  const dateObject = new Date(unformatDate);
    if (isNaN(dateObject)) {
    console.error("Invalid date string provided:", unformatDate);
    return "";
  }
  return format(dateObject, "yyyy-MM-dd");
};
</script>
