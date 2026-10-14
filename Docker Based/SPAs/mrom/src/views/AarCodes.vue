<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>AAR Codes</v-card-title>
        <v-data-table
          :headers="headers"
          :items="aarCodesStore.aarCodes"
          item-key="item.id"
          density="compact"
        >
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { useAarCodesStore } from "@/stores/aarCodes";

const aarCodesStore = useAarCodesStore();
const headers = [
  { title: "AAR", key: "aarCode" },
  { title: "RS Type", key: "rollingstockType" },
  { title: "Description", key: "description" },
];
</script>
