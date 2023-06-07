<template>
  <v-app>
    <div class="xx">
      <h1>Inventory of Locomotives</h1>
      <v-table density="compact" fixed-header height="800px">
        <thead>
          <tr>
            <th class="text-left">Road Name</th>
            <th class="text-left">Road Number</th>
            <th class="text-left">AAR</th>
            <th class="text-left">Description</th>
            <th class="text-left">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in rsStore.LOCOMOTIVE_LIST" :key="item.id">
            <td>{{ item.roadName }}</td>
            <td>{{ item.roadNumber }}</td>
            <td>{{ item.aarCode }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.color }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-app>
</template>
<script setup>
import { useRSStore } from "@/stores/rs";
const rsStore = useRSStore();
</script>
