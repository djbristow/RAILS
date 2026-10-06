<template>
  <v-card width="900">
    <v-card-title class="headline">Rollingstock Details</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" md="5">
            <v-row compact>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="rollingstock.roadName" label="Road Name" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="rollingstock.roadNumber" label="Road Number" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="rollingstock.aarCode" label="AAR Code" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="rollingstock.color" label="Color" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="rollingstock.description" label="Description" readonly hide-details density="compact" variant="outlined" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7">
            <v-img :src="imageServer" contain />
          </v-col>
          <v-col cols="12">
            <v-row compact>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.numberBlt" label="Number Built" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.bldr" label="Builder" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="formatDate(rollingstock.bltDate)" label="Built Date" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="formatDate(rollingstock.inSvcDate)" label="In Service Date" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.insideLength" label="Inside Length" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.insideHeight" label="Inside Height" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.insideWidth" label="Inside Width" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.ltWeight" label="Lt Weight" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.loadLimit" label="Load Limit" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.loadTypes" label="Load Types" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.capacity" label="Capacity" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.homeLocation" label="Home Location" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="formatDate(rollingstock.lastMaintDate)" label="Last Maintenance" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.numAxles" label="Number of Axles" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="formatDate(rollingstock.nextMaintDate)" label="Next Maintenance" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field :model-value="rollingstock.rsStatus" label="Status" readonly hide-details density="compact" variant="outlined" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-card-subtitle>Model Details</v-card-subtitle>
            <v-row compact>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="rollingstock.rfid" label="RFID Tag" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="rollingstock.rfidLocation" label="RFID Location" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="rollingstock.imageID" label="Image ID" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="rollingstock.modelWeight" label="Weight" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="rollingstock.modelLength" label="Length" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12">
                <v-textarea :model-value="rollingstock.notes" label="Notes" readonly hide-details density="compact" variant="outlined" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('closeViewRsDialog')" text>Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { format } from "date-fns";
const props = defineProps({
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
const imageServer = ref("");
onMounted(() =>{
  if (import.meta.env.DEV) {
    imageServer.value = import.meta.env.VITE_MRFM_URI_DEV + "/" + props.rollingstock.imageID;
  }
  else {
    imageServer.value = import.meta.env.VITE_MRFM_URI + "/" + props.rollingstock.imageID;
  }
});
</script>
