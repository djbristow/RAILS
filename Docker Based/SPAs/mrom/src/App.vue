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
          MR Operations Manager
        </v-list-item-title>
        <v-list-item-subtitle> {{ mrName }} </v-list-item-subtitle>
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
import { ref, onMounted } from "vue";
import { useConnStatusStore } from "@/stores/connStatus";
import { useRSStore } from "@/stores/rs";
import { useAarCodesStore } from "@/stores/aarCodes";
import { useStructuresStore } from "@/stores/structures";
import { useCompaniesStore } from "@/stores/companies";
import { useConsistsStore } from "@/stores/consists";
import { createRfidConsistBuilder } from "@/utils/rfidConsistBuilder";

const drawer = ref(false);
const mrName = ref(import.meta.env.DEV ? import.meta.env.VITE_MRNAME_DEV : "");
const items = [
  { title: "Rollingstock", icon: "mdi-train-car-box", to: "/rollingstock" },
  { title: "Locomotives", icon: "mdi-train", to: "/locomotives"},
  { title: "Consists", icon: "mdi-train-variant", to: "/consists" },
  { title: "AAR Codes", icon: "mdi-code-array", to: "/aarcodes" },
  { title: "Companies", icon: "mdi-cog", to: "/companies" },
  { title: "Structures", icon: "mdi-office-building-marker", to: "/structures" },
  { title: "Admin", icon: "mdi-format-list-checks", to: "/admin" },
  { title: "About", icon: "mdi-help-box", to: "/" },
];
const aarCodesStore = useAarCodesStore();
const structuresStore = useStructuresStore();
const companiesStore = useCompaniesStore();
const consistsStore = useConsistsStore();
const rsStore = useRSStore();
const connStatusStore = useConnStatusStore();
const addRfidToStream = createRfidConsistBuilder();

// Initialize the Socket.IO client
let socket;
if (import.meta.env.DEV) {
  // For local development
  socket = io(import.meta.env.VITE_MYISRS_URI_DEV, {
  transports: ["websocket"]
});
} else {
  // For production (Docker/Nginx)
  socket = io({
  path: `${import.meta.env.VITE_MYISRS_URI}/socket.io/` // This tells the client to connect to /api/isrs/socket.io/
});
}

const opensocketListener = () => {
  socket.on("connect", () => {
    connStatusStore.SET_CONN_STATUS("Connected");
    console.log("Socket.IO Connected! Current URI:", socket.io.uri); // For debugging
  });
  socket.on("disconnect", (reason) => {
    connStatusStore.SET_CONN_STATUS("Disconnected");
    console.log("Socket.IO Disconnected:", reason); // For debugging
  });
  socket.on("rfidmsg", (message) => {
    getRs(message);
    addRfidToStream(message.rfid, message.et);
  });
  socket.on("connect_error", (error) => { // Add this for better error visibility
    console.error("Socket.IO Connection Error:", error);
  });
};

onMounted(async () => {
  rsStore.GET_RS();
  aarCodesStore.GET_AARCODES();
  structuresStore.GET_STRUCTURES();
  companiesStore.GET_COMPANIES();
  consistsStore.GET_CONSISTS();
  opensocketListener();

  // MRNAME is injected at container runtime (see compose "environment"), not at build time
  if (!import.meta.env.DEV) {
    try {
      const res = await fetch("./config.json");
      mrName.value = (await res.json()).mrName || "";
    } catch (e) {
      mrName.value = "";
    }
  }
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
  console.log("Received RFID :", rs.rfid);
  foundRs = rsStore.GET_RS_WITH_RFID(rs.rfid);
  if (foundRs === undefined) {
    console.log("RFID not registered:", rs.rfid);
  } else {
    rs.roadNameNumber = foundRs.roadName + " " + foundRs.roadNumber;
    rs.color = foundRs.color;
    rs.aarCode = foundRs.aarCode;
    rsStore.ADD_NEW_RFID(rs);
  }
  setTimeout(() => {  console.log('delayc'); }, 4000);
};
</script>
<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
</style>
