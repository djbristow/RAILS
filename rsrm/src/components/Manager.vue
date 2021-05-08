<template>
  <section>
    <div class="mgr">
      <div class="center">
        <p class="title is-5">Rollingstock RFID Manager</p>
        <p>Version 2.0.6</p>
      </div>
      <b-table :data="rollingstocks" :striped="isStriped" :narrowed="isNarrowed">
        <b-table-column
          field="sensor"
          label="Sensor"
          width="100"
          v-slot="props"
        >{{ props.row.sensor }}</b-table-column>
        <b-table-column field="rfid" label="RFID" width="100" v-slot="props">{{ props.row.rfid }}</b-table-column>
        <b-table-column
          field="roadNameNumber"
          label="Road Name and Number"
          width="300"
          v-slot="props"
        >
          <div v-if="props.row.roadNameNumber === 'RS not in inventory'">
            <span style="color:red">{{ props.row.roadNameNumber }}</span>
          </div>
          <div v-else>{{ props.row.roadNameNumber }}</div>
        </b-table-column>
        <b-table-column field="color" label="Color" width="150" v-slot="props">{{ props.row.color }}</b-table-column>
        <b-table-column
          field="aarCode"
          label="AAR"
          width="100"
          v-slot="props"
        >{{ props.row.aarCode }}</b-table-column>
        <b-table-column field="_id" label="Register" width="100" v-slot="props">
          <div v-if="props.row.roadNameNumber === 'Not Registered'">
            <a href="#" @click="cardModal(props.row.rfid)">
              <b-icon icon="check-circle-outline" />
            </a>
          </div>
        </b-table-column>
      </b-table>
    </div>
    <b-modal :active.sync="isCardModalActive" :width="350">
      <div class="card">
        <header class="modal-card-head">
          <p class="modal-card-title">Rollingstock Registration</p>
        </header>
        <section class="modal-card-body">
          <p class="rfid-text">{{ updateRfid }}</p>
          <b-field horizontal label="Name">
            <b-input v-model="name" maxlength="5" required />
          </b-field>
          <b-field horizontal label="Number">
            <b-input v-model="number" maxlength="7" required />
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click="updateRs()">Register</button>
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import RsService from "../services/RsService";
import io from "socket.io-client";
var socket = io.connect("http://localhost:3005");

export default {
  name: "Manager",

  data() {
    return {
      isCardModalActive: false,
      isNarrowed: true,
      isStriped: true,
      rollingstocks: [],
      connStatus: "Disconnected",
      rfid: "",
      updateRfid: "",
      newRoadNameNumber: "",
      newRoadName: "",
      newRoadNumber: "",
      newSensor: "",
      name: "",
      number: "",
    };
  },
  mounted() {
    this.opensocketListener();
  },
  methods: {
    async getRs(message) {
      let rs = {
        rfid: "",
        roadNameNumber: "Not Registered",
        sensor: "",
        color: "",
        aarCode: "",
      };
      rs.rfid = message.rfid;
      this.newSensor = message.sensor;
      rs.sensor = this.newSensor;
      const response = await RsService.getRsRfid(message.rfid);
      if (response.data === "") {
        this.rollingstocks.unshift(rs);
      } else {
        rs.roadNameNumber =
          response.data.roadName + " " + response.data.roadNumber;
        rs.color = response.data.color;
        rs.aarCode = response.data.aarCode;
        this.rollingstocks.unshift(rs);
      }
    },
    opensocketListener() {
      socket.on("connect", () => {
        this.connStatus = "Connected";
      });
      socket.on("disconnect", () => {
        this.connStatus = "Disconnected";
      });
      socket.on("rfidmsg", (message) => {
        this.getRs(message);
      });
    },
    async cardModal(rfid) {
      this.updateRfid = rfid;
      this.isCardModalActive = true;
    },
    async updateRs() {
      let params = this.name + "-" + this.number;
      let roadNameNumber = this.name + " " + this.number;
      let color = "";
      let aarCode = "";
      const response = await RsService.getRsRoad(params);
      let rsid = response.data._id;
      if (typeof rsid === "undefined") {
        roadNameNumber = "RS not in inventory";
      } else {
        const response = await RsService.getRs({
          id: rsid,
        });
        color = response.data.color;
        aarCode = response.data.aarCode;
        await RsService.updateRs({
          id: rsid,
          roadName: this.name,
          roadNumber: this.number,
          color: response.data.color,
          aarCode: response.data.aarCode,
          description: response.data.description,
          numberBlt: response.data.numberBlt,
          inSvcDate: response.data.inSvcDate,
          insideLength: response.data.insideLength,
          insideHeight: response.data.insideHeight,
          insideWidth: response.data.insideWidth,
          loadTypes: response.data.loadTypes,
          capacity: response.data.capacity,
          bldr: response.data.bldr,
          bltDate: response.data.bltDate,
          notes: response.data.notes,
          ltWeight: response.data.ltWeight,
          loadLimit: response.data.loadLimit,
          lastMaintDate: response.data.lastMaintDate,
          locationNow: response.data.locationNow,
          homeLocation: response.data.homeLocation,
          rsStatus: response.data.rsStatus,
          imageID: response.data.imageID,
          modelWeight: response.data.modelWeight,
          modelLength: response.data.modelLength,
          rfid: this.updateRfid,
        });
      }
      for (var i = 0; i < this.rollingstocks.length; i++) {
        if (this.rollingstocks[i].rfid === this.updateRfid) {
          this.rollingstocks[i].roadNameNumber = roadNameNumber;
          this.rollingstocks[i].color = color;
          this.rollingstocks[i].aarCode = aarCode;
        }
      }
      this.name = "";
      this.number = "";
      this.isCardModalActive = false;
    },
  },
};
</script>
<style scoped>
section {
  display: block;
  margin: auto;
  width: 770px;
  padding: 10px;
}
section.modal-card-body {
  width: 310px;
}
header.modal-card-head {
  background-color: rgb(106, 181, 243);
}
p.modal-card-title {
  color: rgb(17, 22, 66);
}
p.rfid-text {
  color: steelblue;
}
footer.modal-card-foot {
  background-color: rgb(106, 181, 243);
}
.center {
  text-align: center;
}
a {
  color: #42b983;
}
</style>
