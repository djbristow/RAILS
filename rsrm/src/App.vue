<template>
  <v-app>
    <v-app-bar color="blue" dark prominent image="./railway_track.jpg">
      <v-app-bar-nav-icon style="color: white" @click="drawer = !drawer"></v-app-bar-nav-icon>
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
  
<script>
import io from "socket.io-client";
var socket = io.connect("http://localhost:3005");
export default {
  data: () => ({
    name: "App",
    drawer: false,
    items: [
      { title: "Reader", icon: "mdi-smart-card-reader", to: "/reader" },
      { title: "Admin", icon: "mdi-format-list-checks", to: "/admin" },
      { title: "Rollingstock", icon: "mdi-train-car-box", to: "/rollingstock" },
      { title: "AAR Codes", icon: "mdi-code-array", to: "/aarcodes" },
      { title: "About", icon: "mdi-help-box", to: "/" },
    ],
  }),
  mounted() {
    this.$store.dispatch("getRollingstocks");
    this.$store.dispatch("getMicros");
    this.$store.dispatch("getAarCodes");
    this.opensocketListener();
    setTimeout(() => this.refreshMicros(), 60000);
  },
  methods: {
    opensocketListener() {
      socket.on("connect", () => {
        this.$store.dispatch("setConnStatus", "Connected");
      });
      socket.on("disconnect", () => {
        this.$store.dispatch("setConnStatus", "Disconnected");
      });
      socket.on("rfidmsg", (message) => {
        console.log(message);
        this.getRs(message);
      });
    },
    async getRs(message) {
      //{"et":"1590463450","sensor":"rfidRdr01","reader":"1","rfid":"1C0044CF23"}
      let rs = {
        time: "",
        rfid: "",
        roadNameNumber: "Not Registered",
        sensor: "",
        reader: "",
        color: "",
        aarCode: "",
      };
      this.foundRs = null;
      var myDate = new Date(message.et * 1000);
      rs.time = myDate.toLocaleString();
      rs.rfid = message.rfid;
      rs.sensor = message.sensor;
      rs.reader = message.reader;
      this.foundRs = this.$store.getters.getRsByRfid(rs.rfid);
      if (this.foundRs === undefined) {
        this.$store.dispatch("addRsRfid", rs);
      } else {
        rs.roadNameNumber =
          this.foundRs.roadName + " " + this.foundRs.roadNumber;
        rs.color = this.foundRs.color;
        rs.aarCode = this.foundRs.aarCode;
        this.$store.dispatch("addRsRfid", rs);
      }
    },
    refreshMicros() {
      this.$store.dispatch("getMicros");
      setTimeout(() => this.refreshMicros(), 120000);
    },
  },
};
</script>