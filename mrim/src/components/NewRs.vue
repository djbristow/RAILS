<template>
<section>
   <div class="center">
  <p class="title is-5">Add Rolling Stock</p>
  </div>
  <div class="form">
    <div class="columns">
      <div class="column is-half">
        <div class="content">
          Road Name*: <input type="text" name="roadName" v-model="roadName"><br>
          Road Number*: <input type="text" name="roadNumber" v-model="roadNumber"><br>
          Color: <input type="text" name="color" v-model="color"><br>
          AAR Code*: <input type="text" name="aarCode" v-model="aarCode"><br>
          Builder: <input type="text" name="bldr" v-model="bldr"><br>
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
      <button class="button is-primary" @click="addRs">Add Rolling Stock</button>
    </div>
  </div>
</section>
</template>

<script>
import RsService from '@/services/RsService'
export default {
  name: 'NewRs',
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
  methods: {
    async addRs() {
      await RsService.addRs({
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
