<template>
<section>
  <div class="mgr">
    <div class="center">
      <p class="title is-5">Rollingstock RFID Manager</p>
    </div>
    <div class="form">
      <b-table :data="rollingstocks" :striped="isStriped" :narrowed="isNarrowed">
        <template slot-scope="props">
    	<b-table-column field="rfid" label="RFID" width="100">
        {{ props.row.rfid }}
    	</b-table-column>
      <div v-if="props.row.roadName === 'unkn'">
    	  <b-table-column field="roadName" label="Road Name and Number" width="350">
          <input v-model="newRoadName" placeholder="Road Name"> <input v-model="newRoadNumber" placeholder="Road Number">
    	  </b-table-column>
      </div>
      <div v-else>
         <div v-if="props.row.roadNumber === 'inventory'"><span style="color:red">
         <b-table-column field="roadName" label="Road Name and Number" width="400">
                {{ props.row.roadName }} {{ props.row.roadNumber }}
         </b-table-column></span></div>
         <div v-else>
            <b-table-column field="roadName" label="Road Name and Number" width="400">
                   {{ props.row.roadName }} {{ props.row.roadNumber }}
            </b-table-column>
         </div>
      </div>
      <b-table-column field="location" label="Location" width="250">
              {{ props.row.location }}
      </b-table-column>
      <div v-if="props.row.roadName === 'unkn'">
      <b-table-column field="_id" label="Action" width="100">
        <a href="#" @click="updateRs(props.row.rfid)"><b-icon icon="check-circle-outline"/></a>
      </b-table-column>
       </div>
       <div v-else>
          <b-table-column field="_id" label="Action" width="100">
          <p> </p>
       	 </b-table-column>
    </div>
    </template>
      </b-table>
    </div>
  </div>
</section>
</template>

<script>
import RsService from '@/services/RsService'
import io from 'socket.io-client'
var socket = io.connect("http://localhost:3005");
export default {
  name: 'Manager',
  data() {
    return {
      rollingstocks: [],
      connStatus: "Disconnected",
      isNarrowed: true,
      isStriped: true,
      newRoadName: "",
      newRoadNumber: "",
      newLocation: ""
    }
  },
  mounted() {
    //this.getRslist()
    this.opensocketListener();
  },
  methods: {
    async getRs(rfid) {
      let rs = {
        rfid: "",
        roadName: "unkn",
        roadNumber: "",
        location: "Div 1"
      };
      rs.rfid = rfid;
      this.newLocation = rs.location;
      const response = await RsService.getRsRfid(rfid);
      if (response.data === "") {
        this.rollingstocks.unshift(rs);
      } else {
        rs.roadName = response.data.roadName;
        rs.roadNumber = response.data.roadNumber;
        this.rollingstocks.unshift(rs);
      };
      //when rollinstocks length is greater than 20 pop() the last element of the array
    },
    opensocketListener() {
      socket.on('connect', () => {
        this.connStatus = "Connected";
      });
      socket.on('disconnect', () => {
        this.connStatus = "Disconnected";
      });
      socket.on('rfidmsg', (message) => {
        this.getRs(message.rfid);
      });
    },
    async updateRs(id) {
      let rs = {
        rfid: id,
        roadName: this.newRoadName,
        roadNumber: this.newRoadNumber,
        location: this.newLocation
      }
      console.log(rs.roadName);
      var index = 0;
      for (var i = 0; i < this.rollingstocks.length; i++) {
        if (this.rollingstocks[i].rfid === id) {
          index = i;
        }
      }
      let params = this.newRoadName + "-" + this.newRoadNumber;
      console.log(params)
      const response = await RsService.getRsRoad(params);
      let rsid = response.data._id;
      let aarcode = response.data.aarCode;
      if (typeof rsid === 'undefined') {
        rs.roadName = "RS not in ";
        rs.roadNumber = "inventory";
      } else {
        const response = await RsService.getRs({
          id: rsid
        })
        console.log(response.data)
        await RsService.updateRs({
          id: rsid,
          roadName: rs.roadName,
          roadNumber: rs.roadNumber,
          color: response.data.color,
          aarCode: response.data.aarCode,
          numberBlt: response.data.numberBlt,
          inSvcDate: response.data.inSvcDate,
          insideLength: response.data.insideLength,
          insideHeight: response.data.insideHeight,
          insideWidth: response.data.insideWidth,
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
          rfid: id
        });
      }
      this.rollingstocks[index] = rs;
      this.newRoadName = "";
      this.newRoadNumber = "";
    }
  }
}
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
  color: #42b983;
}
</style>
