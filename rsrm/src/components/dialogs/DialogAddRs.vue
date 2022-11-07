<template>
  <v-card width="700">
    <v-card-title class="headline"> New Rollingstock </v-card-title>
    <v-card-text>
      <v-container>
        <v-row dense>
          <v-text-field v-model="roadName" label="Road Name"></v-text-field>
          <v-text-field v-model="roadNumber" label="Road Number"></v-text-field>
          <v-text-field v-model="aarCode" label="AAR Code"></v-text-field>
          <v-text-field v-model="color" label="Color"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="description" label="Description"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="numberBlt" label="Number Built"></v-text-field>
          <v-text-field v-model="bldr" label="Builder"></v-text-field>
          <v-text-field v-model="bltDate" label="Built Date"></v-text-field>
          <v-text-field v-model="inSvcDate" label="In Service Date"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="insideLength" label="Inside Length"></v-text-field>
          <v-text-field v-model="insideHeight" label="Inside Height"></v-text-field>
          <v-text-field v-model="insideWidth" label="Inside Width"></v-text-field>
          <v-text-field v-model="ltWeight" label="Lt Weight"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="loadLimit" label="Load Limit"></v-text-field>
          <v-text-field v-model="loadTypes" label="Load Types"></v-text-field>
          <v-text-field v-model="capacity" label="Capacity"></v-text-field>
          <v-text-field v-model="homeLocation" label="Home Location"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="lastMaintDate" label="Last Maintenance"></v-text-field>
          <v-text-field v-model="rsStatus" label="Status"></v-text-field>
        </v-row>
        <v-card-subtitle>Model Details</v-card-subtitle>
        <v-row dense>
          <v-text-field v-model="rfid" label="RFID Tag"></v-text-field>
          <v-text-field v-model="modelWeight" label="Weight"></v-text-field>
          <v-text-field v-model="modelLength" label="Length"></v-text-field>
          <v-text-field v-model="imageID" label="Image ID"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="notes" label="Notes"></v-text-field>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddRsDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="rsAddDataInvalid" @click="addRs" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DialogAddRs",
  data: () => ({
    roadName: "",
    roadNumber: "",
    color: "",
    aarCode: "",
    description: "",
    numberBlt: "",
    inSvcDate: "",
    insideLength: "",
    insideHeight: "",
    insideWidth: "",
    loadTypes: "",
    capacity: "",
    bldr: "",
    bltDate: "",
    notes: "",
    ltWeight: "",
    loadLimit: "",
    lastMaintDate: "",
    locationNow: "",
    homeLocation: "",
    rsStatus: "",
    imageID: "",
    modelWeight: "",
    modelLength: "",
    rfid: "",
  }),
  computed: {
    rsAddDataInvalid() {
      let result = false;
      return result;
    },
  },
  methods: {
    addRs() {
      this.$store.dispatch("addNewRs", {
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
        loadTypes: this.loadTypes,
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
        rfid: this.rfid,
      });
      this.$emit('closeAddRsDialog');
    },
  },
};
</script>
