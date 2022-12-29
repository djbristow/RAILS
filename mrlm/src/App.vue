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
  
<script>
import { io } from 'socket.io-client';
import RlService from "./services/RlService";
export default {
  data: () => ({
    name: "App",
    socketTo: io("http://localhost:3010"),
    socketBtn: io("http://127.0.0.1:3012"),
    drawer: false,
    items: [
      { title: "Turnouts", icon: "mdi-electric-switch", to: "/turnouts" },
      { title: "Turnout Panel Lights", icon: "mdi-alarm-panel", to: "/tplights" },
      { title: "Micro Contollers", icon: "mdi-memory", to: "/microcontlr" },
      { title: "Admin", icon: "mdi-format-list-checks", to: "/admin" },
      { title: "About", icon: "mdi-help-box", to: "/" },
    ],
  }),
  mounted() {
    this.$store.dispatch("getMicros");
    this.$store.dispatch("getTurnouts");
    this.$store.dispatch("getTplights");
    // setTimeout(() => this.refreshMicros(), 60000);
    this.opensocketToListener();
    this.opensocketBtnListener();
  },
  methods: {
    refreshMicros() {
      this.$store.dispatch("getMicros");
      setTimeout(() => this.refreshMicros(), 120000);
    },
    opensocketToListener() {
      this.socketTo.on("connect", () => {
        this.$store.dispatch("setToConnStatus", "Connected");
      });
      this.socketTo.on("disconnect", () => {
        this.$store.dispatch("setToConnStatus", "Disconnected");
      });
      this.socketTo.on("tocmsg", (message) => {
        this.processToMsg(message);
      });
    },
    processToMsg(message) {
      let turnout = this.$store.getters['getTurnoutByCntrlrTo'](message.cntrlr, message.to);
      if (turnout) {
        let updatedTurnout = {
          _id: turnout._id,
          toID: turnout.toID,
          controller: turnout.controller,
          toNum: turnout.toNum,
          type: turnout.type,
          lastUpdate: message.et,
          state: message.dir,
          lock: "",
          toLoc: turnout.toLoc,
          notes: turnout.notes,
        };
        this.$store.dispatch("updateTurnout", updatedTurnout);
        let tpl = this.$store.getters['getTplightByTo_Id'](updatedTurnout._id);
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
        let micro = this.$store.getters['getMicroById'](message.cntrlr);
        if (micro) {
          let updatedMicro = {
            _id: micro._id,
            microID: micro.microID,
            microIP: micro.microIP,
            purpose: micro.purpose,
            et: message.et,
            status: "Up",
          };
          this.$store.dispatch("updateMicro", updatedMicro);
        }
      }
    },
    opensocketBtnListener() {
      this.socketBtn.on("connect", () => {
        this.$store.dispatch("setBtnConnStatus", "Connected");
      });
      this.socketBtn.on("disconnect", () => {
        this.$store.dispatch("setBtnConnStatus", "Disconnected");
      });
      this.socketBtn.on("btnmsg", (message) => {
        this.processBtnMsg(message);
      });
    },
    processBtnMsg(message) {
      let tpl = this.$store.getters['getTpLightByCntTplNum'](message.cntrlr, message.tplNum);
      let to = this.$store.getters['getTurnoutBy_Id'](tpl.to_id);
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
          lock: "TPLB",
          toLoc: to.toLoc,
          notes: to.notes,
        };
        this.$store.dispatch("updateTurnout", updatedTurnout);
        let micro = this.$store.getters['getMicroById'](message.cntrlr);
        if (micro) {
          let updatedMicro = {
            _id: micro._id,
            microID: micro.microID,
            microIP: micro.microIP,
            purpose: micro.purpose,
            et: message.et,
            status: "Up",
          };
          this.$store.dispatch("updateMicro", updatedMicro);
        }
      }
    },

  },
};
</script>
<style>
.xx {
  margin-left: 50px;
  width: 1200px;
  padding: 10px;
}
</style>