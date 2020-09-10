<template>
  <section>
    <div class="mgr">
      <div class="center">
        <p class="title is-5">Turnouts</p>
      </div>
      <b-table :data="turnouts" :striped="isStriped" :narrowed="isNarrowed">
        <b-table-column field="toID" label="ID" width="100" v-slot="props">{{ props.row.toID }}</b-table-column>
        <b-table-column
          field="controller"
          label="Controller"
          width="100"
          v-slot="props"
        >{{ props.row.controller }}</b-table-column>
        <b-table-column field="toNum" label="Num" width="50" v-slot="props">{{ props.row.toNum }}</b-table-column>
        <b-table-column field="type" label="Type" width="50" v-slot="props">{{ props.row.type }}</b-table-column>
        <b-table-column
          field="lastUpdate"
          label="Last Update"
          width="100"
          v-slot="props"
        >{{ props.row.lastUpdate }}</b-table-column>
        <b-table-column field="state" label="State" width="100" v-slot="props">{{ props.row.state }}</b-table-column>
        <b-table-column field="_id" label="Points" width="50" v-slot="props">
          <div v-if="props.row.lock !== ''">
            <img src="../assets/lock.svg" style="width:32px;height:32px" />
          </div>
          <div v-else>
            <div v-if="props.row.state === 'CLOSED'">
              <a href="#" @click="throwTo(props.row._id)">
                <img src="../assets/thrown.svg" style="width:32px;height:32px" />
              </a>
            </div>
            <div v-else>
              <a href="#" @click="closeTo(props.row._id)">
                <img src="../assets/closed.svg" style="width:32px;height:32px" />
              </a>
            </div>
          </div>
        </b-table-column>
        <b-table-column field="_id" label="Action" width="75" v-slot="props">
          <router-link :to="{ name: 'EditTo', params: { id: props.row._id } }">
            <b-icon icon="pencil" />
          </router-link>
          <a href="#" @click="deleteTo(props.row._id)">
            <b-icon icon="delete-forever" />
          </a>
        </b-table-column>
      </b-table>
    </div>
  </section>
</template>

<script>
import RsService from "../services/RsService";
import io from "socket.io-client";
import moment from "moment";
var socket = io.connect("http://localhost:3010"); // connection to ISTS

export default {
  name: "Turnouts",
  data() {
    return {
      turnouts: [],
      connStatus: "Disconnected",
      isNarrowed: true,
      isStriped: true,
      radio: "",
    };
  },
  mounted() {
    this.opensocketListener();
    this.getTolist();
  },
  methods: {
    async getTo(message) {
      const res = await RsService.getToByIdentity(
        message.cntrlr + "-" + message.to
      );
      let lock = res.data.lock;
      if (lock === "MRLM") {
        lock = "";
      }
      await RsService.updateTo({
        id: res.data._id,
        toID: res.data.toID,
        toNum: res.data.toNum,
        controller: res.data.controller,
        state: message.state,
        type: res.data.type,
        lock: lock,
        notes: res.data.notes,
        lastUpdate: message.et,
      });
      const response = await RsService.fetchToList();
      this.turnouts = response.data.turnouts;
    },
    opensocketListener() {
      socket.on("connect", () => {
        this.connStatus = "Connected";
      });
      socket.on("disconnect", () => {
        this.connStatus = "Disconnected";
      });
      socket.on("tocmsg", (message) => {
        this.getTo(message);
      });
    },
    async getTolist() {
      const response = await RsService.fetchToList();
      console.log(response.data.turnouts);
      this.turnouts = response.data.turnouts;
    },
    async deleteTo(id) {
      await RsService.deleteTo(id);
      this.getTolist();
    },
    async throwTo(id) {
      const cmd = "THROW";
      this.pubMsg(id, cmd);
    },
    async closeTo(id) {
      const cmd = "CLOSE";
      this.pubMsg(id, cmd);
    },
    async pubMsg(id, cmd) {
      const turnout = this.turnouts.find((turnout) => turnout._id === id);
      const msg = {
        id: id,
        src: "MRLM",
        topic: turnout.controller,
        to: turnout.toNum,
        cmd: cmd,
      };
      await RsService.postMsg(msg);
      this.getTolist();
    },
    formatDate(epochTime) {
      if (epochTime === null || epochTime === "") {
        return "";
      } else {
        return moment
          .utc(epochTime * 1000)
          .local()
          .format("DD MM YY hh:mm:ss");
      }
    },
  },
};
</script>
<style scoped>
section {
  display: block;
  margin: auto;
  width: 900px;
  padding: 10px;
}
.center {
  text-align: center;
}
a {
  color: #474749;
}
</style>
