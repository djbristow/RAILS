<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Rolling Stock
      </p>
    </div>
    <div class="form">
      <div class="columns">
        <div class="column is-one-third">
          <div class="content">
            <b-field label="Road Name*">
              <b-input v-model="roadName" />
            </b-field>
            <b-field label="Road Number*">
              <b-input v-model="roadNumber" />
            </b-field>
            <b-field label="Color">
              <b-input v-model="color" />
            </b-field>
            <b-field label="AAR Code*">
              <b-input v-model="aarCode" />
            </b-field>
            <b-field label="Description">
              <b-input v-model="description" />
            </b-field>
            <b-field label="Builder">
              <b-input v-model="bldr" />
            </b-field>
            <b-field label="Built Date">
              <b-datepicker
                v-model="bltDate"
                placeholder="Type or select a date..."
                icon="calendar-today"
                editable
              />
            </b-field>
            <b-field label="Number Built">
              <b-input v-model="numberBlt" />
            </b-field>
            <b-field label="In Service Date">
              <b-datepicker
                v-model="inSvcDate"
                placeholder="Type or select a date..."
                icon="calendar-today"
                editable
              />
            </b-field>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="content">
            <b-field label="Inside Length">
              <b-input v-model="insideLength" />
            </b-field>
            <b-field label="Inside Height">
              <b-input v-model="insideHeight" />
            </b-field>
            <b-field label="Inside Width">
              <b-input v-model="insideWidth" />
            </b-field>
            <b-field label="Capacity">
              <b-input v-model="capacity" />
            </b-field>
            <b-field label="Weight Empty">
              <b-input v-model="ltWeight" />
            </b-field>
            <b-field label="Load Limit">
              <b-input v-model="loadLimit" />
            </b-field>
            <b-field label="Last Maint Date">
              <b-datepicker
                v-model="lastMaintDate"
                placeholder="Type or select a date..."
                icon="calendar-today"
                editable
              />
            </b-field>
            <b-field label="RS Status">
              <b-input v-model="rsStatus" />
            </b-field>
            <b-field label="Home Location">
              <b-input v-model="homeLocation" />
            </b-field>
          </div>
        </div>
        <div class="column">
          <div class="content">
            <b-field label="Location Now">
              <b-input v-model="locationNow" />
            </b-field>
            <b-field label="Image ID">
              <b-input v-model="imageID" />
            </b-field>
            <b-field label="Model Weight">
              <b-input v-model="modelWeight" />
            </b-field>
            <b-field label="Model Length">
              <b-input v-model="modelLength" />
            </b-field>
            <b-field label="RFID">
              <b-input v-model="rfid" />
            </b-field>
            <b-field label="Model Length">
              <b-input v-model="modelLength" />
            </b-field>
            <b-field label="RFID">
              <b-input v-model="rfid" />
            </b-field>
            <b-field label="Notes">
              <b-input
                v-model="notes"
                type="textarea"
              />
            </b-field>
          </div>
        </div>
      </div>
      <button
        class="button is-light"
        @click="addRs"
      >
        Add Rolling Stock
      </button>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'NewRs',
  data () {
    return {
      roadName: '',
      roadNumber: '',
      color: '',
      aarCode: '',
      description: '',
      numberBlt: 0,
      inSvcDate: null,
      insideLength: '',
      insideHeight: '',
      insideWidth: '',
      capacity: '',
      bldr: '',
      bltDate: null,
      notes: '',
      ltWeight: '',
      loadLimit: '',
      lastMaintDate: null,
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
    async addRs () {
      await RsService.addRs({
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
  width: 1200px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: left;
}
</style>
