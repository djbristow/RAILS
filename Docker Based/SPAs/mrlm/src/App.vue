<template>
  <v-app>
    <v-app-bar color="blue" dark prominent image="./railway_track.jpg">
      <v-app-bar-nav-icon style="color: white" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title style="color: white">RAILS</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-title class="text-h6">
          Model Railroad Layout Manager
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
import { onMounted, ref } from "vue";
import { io } from 'socket.io-client';
import RlService from "@/services/RlService";
import { useTurnoutsStore } from "@/stores/turnouts";
import { useTplightsStore } from "@/stores/tplights";
import { useMicrosStore } from "@/stores/micros";
import { useConnStatsStore } from "@/stores/connStats";

const turnoutsStore = useTurnoutsStore();
const tplightsStore = useTplightsStore();
const microsStore = useMicrosStore();
const connStatsStore = useConnStatsStore();
const ISTS_BASE_URI = import.meta.env.VITE_MYISTS_URI;
const ISBS_BASE_URI = import.meta.env.VITE_MYISBS_URI;
const drawer = ref(false);
const items = [
  { title: "Turnouts", icon: "mdi-electric-switch", to: "/turnouts" },
  { title: "Turnout Panel Lights", icon: "mdi-alarm-panel", to: "/tplights" },
  { title: "Panel", icon: "mdi-view-dashboard", to: "/panel" },
  { title: "Micro Contollers", icon: "mdi-memory", to: "/microcontlr" },
  { title: "Admin", icon: "mdi-format-list-checks", to: "/admin" },
  { title: "About", icon: "mdi-help-box", to: "/" },
];
onMounted(() => {
  turnoutsStore.GET_TURNOUTS();
  tplightsStore.GET_TPLIGHTS();
  microsStore.GET_MICROS();
  setTimeout(() => refreshMicros(), 60000);
  opensocketToListener();
  opensocketBtnListener();
});
const refreshMicros = () => {
  microsStore.GET_MICROS();
  setTimeout(() => refreshMicros(), 60000);
};

// Initialize the Socket.IO client for turnout contacts
const socketTo = io({
  path: `${ISTS_BASE_URI}/socket.io/` // This tells the client to connect to /api/isrs/socket.io/
});

const opensocketToListener = () => {
  socketTo.on("connect", () => {
    connStatsStore.SET_CONN_TO_STATUS("Connected");
    console.log("Socket.IO Connected! Current URI:", socketTo.io.uri); // For debugging
  });
  socketTo.on("disconnect", (reason) => {
    connStatsStore.SET_CONN_TO_STATUS("Disconnected");
    console.log("Socket.IO Disconnected:", reason); // For debugging
  });
  socketTo.on("tocmsg", (message) => {
    processToMsg(message);
  });
  socketTo.on("connect_error", (error) => { // Add this for better error visibility
    console.error("Socket.IO Connection Error:", error);
  });
};
// Initialize the Socket.IO client for turnout panel buttons
const socketBtn = io({
  path: `${ISBS_BASE_URI}/socket.io/`
});

const opensocketBtnListener = () => {
  socketBtn.on("connect", () => {
    connStatsStore.SET_CONN_BTN_STATUS("Connected");
    console.log("Socket.IO Connected! Current URI:", socketBtn.io.uri); // For debugging
  });
  socketBtn.on("disconnect", () => {
    connStatsStore.SET_CONN_BTN_STATUS("Disconnected");
    console.log("Socket.IO Disconnected:", reason); // For debugging
  });
  socketBtn.on("btnmsg", (message) => {
    processBtnMsg(message);
  });
  socketBtn.on("connect_error", (error) => { // Add this for better error visibility
    console.error("Socket.IO Connection Error:", error);
  });
};

const processToMsg = (message) => {
  let turnout = turnoutsStore.GET_TURNOUT_BY_CNTRLR_TO(message.cntrlr, message.to);
  if (turnout) {
    let updatedTurnout = {
      _id: turnout._id,
      toID: turnout.toID,
      controller: turnout.controller,
      toNum: turnout.toNum,
      type: turnout.type,
      lastUpdate: message.et,
      state: message.state,
      lock: "",
      toLoc: turnout.toLoc,
      notes: turnout.notes,
    };
    turnoutsStore.UPDATE_TURNOUT(updatedTurnout);
    let tpl = tplightsStore.GET_TPLIGHT_BY_TO_ID(updatedTurnout._id);
    let color = "";
    if (updatedTurnout.state === "CLOSED") {
      color = "GREEN";
    } else {
      color = "BLUE";
    }
    let msg = {
      topic: tpl.controller,
      tplNum: tpl.tplNum,
      color: color,
    };
    console.log(msg)
    RlService.postTplMsg(msg);
    let micro = microsStore.GET_MICRO_BY_ID(message.cntrlr);
    if (micro) {
      let updatedMicro = {
        _id: micro._id,
        microID: micro.microID,
        microIP: micro.microIP,
        purpose: micro.purpose,
        et: message.et,
        status: "Up",
      };
      microsStore.UPDATE_MICRO(updatedMicro);
    }
  }
};
const processBtnMsg = (message) => {
  let tpl = tplightsStore.GET_TPLIGHT_BY_CNT_TPLNUM(message.cntrlr, message.tplNum);
  let to = turnoutsStore.GET_TURNOUT_BY_ID(tpl.to_id);
  if (to.lock === "") {
    let cmd = "CLOSE";
    if (to.state === "CLOSED") {
      cmd = "THROW";
    }
    let msg = {
      topic: to.controller,
      to: to.toNum,
      cmd: cmd,
    };
    RlService.postToMsg(msg);
    msg = {
      topic: tpl.controller,
      tplNum: tpl.tplNum,
      color: "RED",
    };
    RlService.postTplMsg(msg);
    let updatedTurnout = {
      _id: to._id,
      toID: to.toID,
      controller: to.controller,
      toNum: to.toNum,
      type: to.type,
      lastUpdate: to.lastUpdate,
      state: to.state,
      lock: "",
      toLoc: to.toLoc,
      notes: to.notes,
    };
    turnoutsStore.UPDATE_TURNOUT(updatedTurnout);
  }
};
</script>
<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
.svg-wrapper svg {
  width: 100%;       /* fills container */
  height: auto;
  display: block;
  border: 5px solid black;
}
</style>