<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Inventory of Locomotives</v-card-title>
        <v-data-table
          :headers="headers"
          :items="rsStore.LOCOMOTIVE_LIST"
          item-key="item.id"
          density="compact"
        >
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>
<script setup>
import { useRSStore } from "@/stores/rs";
const rsStore = useRSStore();
const headers = [
  { title: "Road Name", key: "roadName" },
  { title: "Road Number", key: "roadNumber" },
  { title: "AAR", key: "aarCode" },
  { title: "Description", key: "description" },
  { title: "Color", key: "color" },
];
</script>
