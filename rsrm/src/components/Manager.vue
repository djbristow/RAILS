<template>
  <section>
    <div class="mgr">
      <div class="center">
        <p class="title is-5">
          Rollingstock RFID Manager
        </p>
      </div>
      <div class="form">
        <b-table
          :data="rollingstocks"
          :striped="isStriped"
          :narrowed="isNarrowed"
        >
          <template slot-scope="props">
            <b-table-column
              field="sensor"
              label="Sensor"
              width="100"
            >
              {{ props.row.sensor }}
            </b-table-column>
            <b-table-column
              field="rfid"
              label="RFID"
              width="100"
            >
              {{ props.row.rfid }}
            </b-table-column>
            <div v-if="props.row.roadName === 'unkn'">
              <b-table-column
                field="roadName"
                label="Road Name and Number"
                width="400"
              >
                <input
                  v-model="newRoadName"
                  placeholder="Road Name"
                >
                <input
                  v-model="newRoadNumber"
                  placeholder="Road Number"
                >
              </b-table-column>
              <b-table-column
                field="_id"
                label="Action"
                width="100"
              >
                <a
                  href="#"
                  @click="updateRs(props.row.rfid)"
                >
                  <b-icon icon="check-circle-outline" />
                </a>
              </b-table-column>
            </div>
            <div v-else>
              <div v-if="props.row.roadNumber === 'inventory'">
                <b-table-column
                  field="roadName"
                  label="Road Name and Number"
                  width="400"
                >
                  <span style="color:red">RS not in inventory</span>
                </b-table-column>
                <b-table-column
                  field="_id"
                  label="Action"
                  width="100"
                >
                  <p />
                </b-table-column>
              </div>
              <div v-else>
                <b-table-column
                  field="roadName"
                  label="Road Name and Number"
                  width="400"
                >
                  {{ props.row.roadName }} {{ props.row.roadNumber }}
                </b-table-column>
                <b-table-column
                  field="_id"
                  label="Action"
                  width="100"
                >
                  <p />
                </b-table-column>
              </div>
            </div>
          </template>
        </b-table>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
import io from 'socket.io-client'
var socket = io.connect('http://localhost:3005')
export default {
  name: 'Manager',
  data () {
    return {
      rollingstocks: [],
      connStatus: 'Disconnected',
      isNarrowed: true,
      isStriped: true,
      newRoadName: '',
      newRoadNumber: '',
      newSensor: ''
    }
  },
  mounted () {
    this.opensocketListener()
  },
  methods: {
    async getRs (message) {
      let rs = {
        rfid: '',
        roadName: 'unkn',
        roadNumber: '',
        sensor: ''
      }
      rs.rfid = message.rfid
      this.newSensor = message.sensor
      rs.sensor = this.newSensor
      const response = await RsService.getRsRfid(message.rfid)
      if (response.data === '') {
        this.rollingstocks.unshift(rs)
      } else {
        rs.roadName = response.data.roadName
        rs.roadNumber = response.data.roadNumber
        this.rollingstocks.unshift(rs)
      }
    },
    opensocketListener () {
      socket.on('connect', () => {
        this.connStatus = 'Connected'
      })
      socket.on('disconnect', () => {
        this.connStatus = 'Disconnected'
      })
      socket.on('rfidmsg', message => {
        this.getRs(message)
      })
    },
    async updateRs (id) {
      let rs = {
        rfid: id,
        roadName: this.newRoadName,
        roadNumber: this.newRoadNumber,
        sensor: this.newSensor
      }
      // console.log(rs.roadName)
      var index = 0
      for (var i = 0; i < this.rollingstocks.length; i++) {
        if (this.rollingstocks[i].rfid === id) {
          index = i
        }
      }
      let params = this.newRoadName + '-' + this.newRoadNumber
      // console.log(params)
      const response = await RsService.getRsRoad(params)
      let rsid = response.data._id
      // let aarcode = response.data.aarCode
      if (typeof rsid === 'undefined') {
        rs.roadName = ''
        rs.roadNumber = 'inventory'
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
          rfid: id
        })
      }
      this.rollingstocks[index] = rs
      this.newRoadName = ''
      this.newRoadNumber = ''
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
