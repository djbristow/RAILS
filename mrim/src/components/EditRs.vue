<template>
   <section>
      <div class="center">
     <p class="title is-5">Update Rolling Stock</p>
     </div>
     <div class="form">
       <div class="columns">
         <div class="column is-half">
           <div class="content">
             Road Name*: <input type="text" name="roadName" v-model="roadName"><br>
             Road Number*: <input type="text" name="roadNumber" v-model="roadNumber"><br>
             Color: <input type="text" name="color" v-model="color"><br>
             AAR Code*: <input type="text" name="aarCode" v-model="aarCode"><br>
             Builder: <input type="text" width="20" name="bldr" v-model="bldr"><br>
             Built Date: <input type="date" name="bltDate" v-model="bltDate"><br>
             Number Built: <input type="text" name="numberBlt" v-model="numberBlt"><br>
             In Service Date: <input type="date" name="inSvcDate" v-model="inSvcDate"><br>
             Inside Length: <input type="text" name="insideLength" v-model="insideLength"><br>
             Inside Height: <input type="text" name="insideHeight" v-model="insideHeight"><br>
             Inside Width: <input type="text" name="insideWidth" v-model="insideWidth"><br>
           </div>
         </div>
         <div class="column">
           <div class="content">
             Capacity: <input type="text" name="capacity" v-model="capacity"><br>
             Weight Empty: <input type="text" name="ltWeight" v-model="ltWeight"><br>
             Load Limit: <input type="text" name="loadLimit" v-model="loadLimit"><br>
             Last Maint Date:<input type="date" name="lastMaintDate" v-model="lastMaintDate"><br>
             RS Status: <input type="text" name="rsStatus" v-model="rsStatus"><br>
             Home Location: <input type="text" name="homeLocation" v-model="homeLocation"><br>
             Location Now: <input type="text" name="locationNow" v-model="locationNow"><br>
             Image ID: <input type="text" name="imageID" v-model="imageID"><br>
             Model Weight: <input type="text" name="modelWeight" v-model="modelWeight"><br>
             Model Length: <input type="text" name="modelLength" v-model="modelLength"><br>
             RFID: <input type="text" name="rfid" v-model="rfid"><br>
           </div>
         </div>
       </div>
       <div class="center">
                   Notes: <textarea rows="5" cols="40" v-model="notes"></textarea><br>
         <button class="button is-primary" @click="updateRs">Update Rolling Stock</button>
       </div>
     </div>
   </section>
</template>

<script>
import RsService from '@/services/RsService'
export default {
  name: 'EditRs',
  data() {
    return {
      roadName: '',
      roadNumber: '',
      color: '',
      aarCode: '',
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
  mounted() {
    this.getRs()
  },
  methods: {
    async getRs() {
      const response = await RsService.getRs({
        id: this.$route.params.id
      })
        this.roadName = response.data.roadName,
        this.roadNumber = response.data.roadNumber,
        this.color = response.data.color,
        this.aarCode = response.data.aarCode,
        this.numberBlt = response.data.numberBlt,
        this.inSvcDate = response.data.inSvcDate,
        this.insideLength = response.data.insideLength,
        this.insideHeight = response.data.insideHeight,
        this.insideWidth = response.data.insideWidth,
        this.capacity = response.data.capacity,
        this.bldr = response.data.bldr,
        this.bltDate = response.data.bltDate,
        this.notes = response.data.notes,
        this.ltWeight = response.data.ltWeight,
        this.loadLimit = response.data.loadLimit,
        this.lastMaintDate = response.data.lastMaintDate,
        this.locationNow = response.data.locationNow,
        this.homeLocation = response.data.homeLocation,
        this.rsStatus = response.data.rsStatus,
        this.imageID = response.data.imageID,
        this.modelWeight = response.data.modelWeight,
        this.modelLength = response.data.modelLength,
        this.rfid = response.data.rfid
    },
    async updateRs() {
      await RsService.updateRs({
        id: this.$route.params.id,
        roadName: this.roadName,
        roadNumber: this.roadNumber,
        color: this.color,
        aarCode: this.aarCode,
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
