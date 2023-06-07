<template>
  <v-app>
    <v-app-bar color="blue" dark prominent image="./railway_track.jpg">
      <v-app-bar-nav-icon
        style="color: white"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title style="color: white">RAILS</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-title class="text-h6">
          MR Inventory Manager
        </v-list-item-title>
        <v-list-item-subtitle> KJ&C RR </v-list-item-subtitle>
      </v-list-item>
      <v-list nav dense>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { useRSStore } from "@/stores/rs";
import { useAarCodesStore } from "@/stores/aarCodes";
import { useStructuresStore } from "@/stores/structures";
import { useCompaniesStore } from "@/stores/companies";
import { useDecodersStore } from "@/stores/decoders";
import { useImagesStore } from "@/stores/images";

const drawer = ref(false);
const items = [
  { title: "Rollingstock", icon: "mdi-train-car-box", to: "/rollingstock" },
  { title: "Locomotives", icon: "mdi-train", to: "/locomotives"},
  { title: "Decoders", icon: "mdi-chip", to: "/decoders"},
  { title: "Images", icon: "mdi-file-image", to: "/images" },
  { title: "AAR Codes", icon: "mdi-code-array", to: "/aarcodes" },
  { title: "Structures", icon: "mdi-office-building-marker", to: "/structures" },
  { title: "Companies", icon: "mdi-cog", to: "/companies" },
  { title: "Admin", icon: "mdi-format-list-checks", to: "/admin" },
  { title: "About", icon: "mdi-help-box", to: "/" },
];
const aarCodesStore = useAarCodesStore();
const structuresStore = useStructuresStore();
const companiesStore = useCompaniesStore();
const decodersStore = useDecodersStore();
const imagesStore = useImagesStore();
const rsStore = useRSStore();

onMounted(() => {
  rsStore.GET_RS();
  aarCodesStore.GET_AARCODES();
  structuresStore.GET_STRUCTURES();
  companiesStore.GET_COMPANIES();
  decodersStore.GET_DECODERS();
  imagesStore.GET_IMAGES();
});
</script>
<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
</style>
