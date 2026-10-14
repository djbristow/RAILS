<template>
  <v-app class="xx">
    <v-container>
      <v-card>
        <v-card-title>Companies</v-card-title>
        <v-data-table
          :headers="headers"
          :items="companiesStore.companies"
          item-key="item.id"
          density="compact"
        >
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { useCompaniesStore } from "@/stores/companies";

const companiesStore = useCompaniesStore();
const headers = [
  { title: "Name", key: "shortName" },
  { title: "Full Name", key: "longName" },
  { title: "Type", key: "industryType" },
  { title: "Location", key: "industryLocation" },
];
</script>
