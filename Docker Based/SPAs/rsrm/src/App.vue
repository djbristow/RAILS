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
        <v-list-item-title class="text-h6"> RFID Manager </v-list-item-title>
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
import io from "socket.io-client";
import {ref, onMounted } from "vue";
import { useConnStatusStore } from "@/stores/connStatus";
import { useAarCodesStore } from "@/stores/aarCodes";
import { useMicrosStore } from "@/stores/micros";
import { useRSStore} from "@/stores/rs";

const connStatusStore = useConnStatusStore();
const aarCodesStore = useAarCodesStore();
const microsStore = useMicrosStore();
const rsStore = useRSStore();
const drawer = ref(false);
const items = ref([
  { title: "Reader", icon: "mdi-smart-card-reader", to: "/reader" },
  { title: "Admin", icon: "mdi-format-list-checks", to: "/admin" },
  { title: "Rollingstock", icon: "mdi-train-car-box", to: "/rollingstock" },
  { title: "AAR Codes", icon: "mdi-code-array", to: "/aarcodes" },
  { title: "About", icon: "mdi-help-box", to: "/" },
]);
const socket = io.connect("http://" + import.meta.env.VITE_MYISRS_URI);
const opensocketListener = () => {
  socket.on("connect", () => {
    connStatusStore.SET_CONN_STATUS("Connected");
  });
  socket.on("disconnect", () => {
    connStatusStore.SET_CONN_STATUS("Disconnected");
  });
  socket.on("rfidmsg", (message) => {
    getRs(message);
  });
};
onMounted(() => {
  rsStore.GET_RS();
  aarCodesStore.GET_AARCODES();
  microsStore.GET_MICROS();
  opensocketListener();
  setTimeout(() => refreshMicros(), 60000);
});
 const getRs = (message) => {
  //{"et":"1590463450","mcntrlr":"rfidRdr01","reader":"1","rfid":"1C0044CF23"}
  let rs = {
    time: "",
    rfid: "",
    roadNameNumber: "Not Registered",
    sensor: "",
    reader: "",
    color: "",
    aarCode: "",
  };
  var foundRs = null;
  rs.time = message.et;
  rs.rfid = message.rfid;
  rs.sensor = message.mcntrlr;
  rs.reader = message.reader;
  foundRs = rsStore.GET_RS_WITH_RFID(rs.rfid);
  if (foundRs === undefined) {
    rsStore.ADD_NEW_RFID(rs);
  } else {
    rs.roadNameNumber = foundRs.roadName + " " + foundRs.roadNumber;
    rs.color = foundRs.color;
    rs.aarCode = foundRs.aarCode;
    rsStore.ADD_NEW_RFID(rs);
  }
  setTimeout(() => {  console.log('delayc'); }, 4000);
};
const refreshMicros = () => {
  console.log("refreshMicros");
  microsStore.GET_MICROS();
  setTimeout(() => refreshMicros(), 60000);
};
</script>
