<template>
  <v-card width="900">
    <v-card-title class="headline"> Rollingstock Details </v-card-title>
    <v-container>
      <v-row dense>
        <v-col cols="4">
          <v-text-field>Road Name: {{ rollingstock.roadName }}</v-text-field>
          <v-text-field>Road Number: {{ rollingstock.roadNumber }}</v-text-field>
          <v-text-field>AAR Code: {{ rollingstock.aarCode }}</v-text-field>
          <v-text-field>Color: {{ rollingstock.color }}</v-text-field>
          <v-text-field>Description: {{ rollingstock.description }}</v-text-field>
        </v-col>
        <v-col cols="8">
          <v-img :src='imageServer' />
        </v-col>
      </v-row>
      <v-row dense>
        <v-text-field>Number Built: {{ rollingstock.numberBlt }}</v-text-field>
        <v-text-field>Builder: {{ rollingstock.bldr }}</v-text-field>
        <v-text-field>Built Date: {{ formatDate(rollingstock.bltDate) }}</v-text-field>
        <v-text-field>In Service Date: {{ formatDate(rollingstock.inSvcDate) }}</v-text-field>
      </v-row>
      <v-row dense>
        <v-text-field>Inside Length: {{ rollingstock.insideLength }}</v-text-field>
        <v-text-field>Inside Height: {{ rollingstock.insideHeight }}</v-text-field>
        <v-text-field>Inside Width: {{ rollingstock.insideWidth }}</v-text-field>
        <v-text-field>Lt Weight: {{ rollingstock.ltWeight }}</v-text-field>
      </v-row>
      <v-row dense>
        <v-text-field>Load Limit: {{ rollingstock.loadLimit }}</v-text-field>
        <v-text-field>Load Types: {{ rollingstock.loadTypes }}</v-text-field>
        <v-text-field>Capacity: {{ rollingstock.capacity }}</v-text-field>
        <v-text-field>Home Location: {{ rollingstock.homeLocation }}</v-text-field>
      </v-row>
      <v-row dense>
        <v-text-field>Last Maintenance: {{ formatDate(rollingstock.lastMaintDate) }}</v-text-field>
        <v-text-field>Status: {{ rollingstock.rsStatus }}</v-text-field>
      </v-row>
      <v-card-subtitle>Model Details</v-card-subtitle>
      <v-row dense>
        <v-text-field>RFID Tag: {{ rollingstock.rfid }}</v-text-field>
        <v-text-field>Weight: {{ rollingstock.modelWeight }}</v-text-field>
        <v-text-field>Length: {{ rollingstock.modelLength }}</v-text-field>
        <v-text-field>Image ID: {{ rollingstock.imageID }}</v-text-field>
      </v-row>
      <v-row dense>
        <v-text-field>Notes: {{ rollingstock.notes}}</v-text-field>
      </v-row>
    </v-container>
    <v-btn @click="$emit('closeViewRsDialog')" text>Close</v-btn>
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
  if (unformatDate === null || unformatDate === "") {
    return "";
  } else {
    let pdate = new Date(unformatDate.toString().substring(0, 10));
    let day = pdate.getDate() + 1;
    pdate = pdate.setDate(day);
    return format(pdate, "MMM d, yyyy");
  }
};
const imageServer = ref("");
onMounted(() =>{
  imageServer.value = 'http://' + import.meta.env.VITE_MRFM_TCP_ADDR +':'+ import.meta.env.VITE_MRFM_TCP_PORT +'/'+ props.rollingstock.imageID;
});
</script>
