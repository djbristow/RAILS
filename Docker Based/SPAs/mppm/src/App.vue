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
          Model Project & Purchase Manager
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
import { ref, onMounted } from 'vue';
import { usePurchasesStore } from '@/stores/purchases';
import { useProjectsStore } from '@/stores/projects';
import { useMrcosStore } from '@/stores/mrcos';

const drawer = ref(false);
const purchasesStore = usePurchasesStore();
const projectsStore = useProjectsStore();
const mrcosStore = useMrcosStore();
const items = [
  { title: "Purchases", icon: "mdi-currency-usd", to: "/purchases" },
  { title: "Grouped Purchases", icon: "mdi-currency-usd", to: "/groupedpurchases"},
  { title: "Projects", icon: "mdi-notebook-outline", to: "/projects"},
  { title: "MR Companies", icon: "mdi-cog", to: "/mrcompanies" },
  { title: "Admin", icon: "mdi-format-list-checks", to: "/admin" },
  { title: "About", icon: "mdi-help-box", to: "/" },
];
onMounted(() => {
  purchasesStore.GET_PURCHASES();
  projectsStore.GET_PROJECTS();
  mrcosStore.GET_MRCOS();
});
</script>
<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
</style>
