<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Rolling Stock
      </p>
    </div>
    <div class="form">
      <div class="columns">
        <div class="column is-half">
          <div class="content">
            Road Name*: <input
              v-model="roadName"
              type="text"
              name="roadName"
            ><br>
            Road Number*: <input
              v-model="roadNumber"
              type="text"
              name="roadNumber"
            ><br>
            Color: <input
              v-model="color"
              type="text"
              name="color"
            ><br>
            AAR Code*: <input
              v-model="aarCode"
              type="text"
              name="aarCode"
            ><br>
            Description: <input
              v-model="description"
              type="text"
              name="description"
            ><br>
            Builder: <input
              v-model="bldr"
              type="text"
              width="20"
              name="bldr"
            ><br>
            Built Date: <input
              v-model="bltDate"
              type="date"
              name="bltDate"
            ><br>
            Number Built: <input
              v-model="numberBlt"
              type="text"
              name="numberBlt"
            ><br>
            In Service Date: <input
              v-model="inSvcDate"
              type="date"
              name="inSvcDate"
            ><br>
            Inside Length: <input
              v-model="insideLength"
              type="text"
              name="insideLength"
            ><br>
            Inside Height: <input
              v-model="insideHeight"
              type="text"
              name="insideHeight"
            ><br>
            Inside Width: <input
              v-model="insideWidth"
              type="text"
              name="insideWidth"
            ><br>
          </div>
        </div>
        <div class="column">
          <div class="content">
            Capacity: <input
              v-model="capacity"
              type="text"
              name="capacity"
            ><br>
            Weight Empty: <input
              v-model="ltWeight"
              type="text"
              name="ltWeight"
            ><br>
            Load Limit: <input
              v-model="loadLimit"
              type="text"
              name="loadLimit"
            ><br>
            Last Maint Date:<input
              v-model="lastMaintDate"
              type="date"
              name="lastMaintDate"
            ><br>
            RS Status: <input
              v-model="rsStatus"
              type="text"
              name="rsStatus"
            ><br>
            Home Location: <input
              v-model="homeLocation"
              type="text"
              name="homeLocation"
            ><br>
            Location Now: <input
              v-model="locationNow"
              type="text"
              name="locationNow"
            ><br>
            Image ID: <input
              v-model="imageID"
              type="text"
              name="imageID"
            ><br>
            Model Weight: <input
              v-model="modelWeight"
              type="text"
              name="modelWeight"
            ><br>
            Model Length: <input
              v-model="modelLength"
              type="text"
              name="modelLength"
            ><br>
            RFID: <input
              v-model="rfid"
              type="text"
              name="rfid"
            ><br>
          </div>
        </div>
      </div>
      <div class="center">
        Notes: <textarea
          v-model="notes"
          rows="5"
          cols="40"
        /><br>
        <button
          class="button is-primary"
          @click="updateRs"
        >
          Update Rolling Stock
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'EditRs',
  data () {
    return {
      roadName: '',
      roadNumber: '',
      color: '',
      aarCode: '',
      description: '',
      numberBlt: '',
      inSvcDate: '',
      insideLength: '',
      insideHeight: '',
      insideWidth: '',
      capacity: '',
      bldr: '',
      bltDate: '',
      notes: '',
      ltWeight: '',
      loadLimit: '',
      lastMaintDate: '',
      locationNow: '',
      homeLocation: '',
      rsStatus: '',
      imageID: '',
      modelWeight: '',
      modelLength: '',
      rfid: ''
    }
  },
  mounted () {
    this.getRs()
  },
  methods: {
    async getRs () {
      const response = await RsService.getRs({
        id: this.$route.params.id
      })
      this.roadName = response.data.roadName
      this.roadNumber = response.data.roadNumber
      this.color = response.data.color
      this.aarCode = response.data.aarCode
      this.description = response.data.description
      this.numberBlt = response.data.numberBlt
      this.inSvcDate = response.data.inSvcDate
      this.insideLength = response.data.insideLength
      this.insideHeight = response.data.insideHeight
      this.insideWidth = response.data.insideWidth
      this.capacity = response.data.capacity
      this.bldr = response.data.bldr
      this.bltDate = response.data.bltDate
      this.notes = response.data.notes
      this.ltWeight = response.data.ltWeight
      this.loadLimit = response.data.loadLimit
      this.lastMaintDate = response.data.lastMaintDate
      this.locationNow = response.data.locationNow
      this.homeLocation = response.data.homeLocation
      this.rsStatus = response.data.rsStatus
      this.imageID = response.data.imageID
      this.modelWeight = response.data.modelWeight
      this.modelLength = response.data.modelLength
      this.rfid = response.data.rfid
    },
    async updateRs () {
      await RsService.updateRs({
        id: this.$route.params.id,
        roadName: this.roadName,
        roadNumber: this.roadNumber,
        color: this.color,
        aarCode: this.aarCode,
        description: this.description,
        numberBlt: this.numberBlt,
        inSvcDate: this.inSvcDate,
        insideLength: this.insideLength,
        insideHeight: this.insideHeight,
        insideWidth: this.insideWidth,
        capacity: this.capacity,
        bldr: this.bldr,
        bltDate: this.bltDate,
        notes: this.notes,
        ltWeight: this.ltWeight,
        loadLimit: this.loadLimit,
        lastMaintDate: this.lastMaintDate,
        locationNow: this.locationNow,
        homeLocation: this.homeLocation,
        rsStatus: this.rsStatus,
        imageID: this.imageID,
        modelWeight: this.modelWeight,
        modelLength: this.modelLength,
        rfid: this.rfid
      })
      this.$router.push({
        name: 'Rslist'
      })
    }
  }
}
</script>
<style scoped>
section {
  width: 900px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: right;
}
</style>
