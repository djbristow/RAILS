<template>
  <v-card width="700">
    <v-card-title class="headline"> Rollingstock Details </v-card-title>
    <v-card-text
      ><v-container>
        <v-row dense>
          <v-text-field v-model="roadName" label="Road Name"></v-text-field>
          <v-text-field v-model="roadNumber" label="Road Number"></v-text-field>
          <v-text-field v-model="aarCode" label="AAR Code"></v-text-field>
          <v-text-field v-model="color" label="Color"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field
            v-model="description"
            label="Description"
          ></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="numberBlt" label="Number Built"></v-text-field>
          <v-text-field v-model="bldr" label="Builder"></v-text-field>
          <v-text-field v-model="bltDate" label="Built Date"></v-text-field>
          <v-text-field
            v-model="inSvcDate"
            label="In Service Date"
          ></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field
            v-model="insideLength"
            label="Inside Length"
          ></v-text-field>
          <v-text-field
            v-model="insideHeight"
            label="Inside Height"
          ></v-text-field>
          <v-text-field
            v-model="insideWidth"
            label="Inside Width"
          ></v-text-field>
          <v-text-field v-model="ltWeight" label="Lt Weight"></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field v-model="loadLimit" label="Load Limit"></v-text-field>
          <v-text-field v-model="loadTypes" label="Load Types"></v-text-field>
          <v-text-field v-model="capacity" label="Capacity"></v-text-field>
          <v-text-field
            v-model="homeLocation"
            label="Home Location"
          ></v-text-field>
        </v-row>
        <v-row dense>
          <v-text-field
            v-model="lastMaintDate"
            label="Last Maintenance"
          ></v-text-field>
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
          <v-textarea v-model="notes" label="Notes"></v-textarea>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeEditRsDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="rsEditDataInvalid" @click="editRsUpdate" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { format } from "date-fns";
export default {
  name: "DialogEditRs",
  props: ["rollingstock"],
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
    rsEditDataInvalid() {
      let result = false;
      return result;
    },
  },
  mounted() {
    this.roadName = this.rollingstock.roadName;
    this.roadNumber = this.rollingstock.roadNumber;
    this.rfid = this.rollingstock.rfid;
    this.color = this.rollingstock.color;
    this.aarCode = this.rollingstock.aarCode;
    this.description = this.rollingstock.description;
    this.numberBlt = this.rollingstock.numberBlt;
    this.inSvcDate = format(
      new Date(this.rollingstock.inSvcDate),
      "MMM d, yyyy"
    );
    this.insideLength = this.rollingstock.insideLength;
    this.insideHeight = this.rollingstock.insideHeight;
    this.insideWidth = this.rollingstock.insideWidth;
    this.loadTypes = this.rollingstock.loadTypes;
    this.capacity = this.rollingstock.capacity;
    this.bldr = this.rollingstock.bldr;
    this.bltDate = format(new Date(this.rollingstock.bltDate), "MMM d, yyyy");
    this.notes = this.rollingstock.notes;
    this.ltWeight = this.rollingstock.ltWeight;
    this.loadLimit = this.rollingstock.loadLimit;
    this.lastMaintDate = format(
      new Date(this.rollingstock.lastMaintDate),
      "MMM d, yyyy"
    );
    this.locationNow = this.rollingstock.locationNow;
    this.homeLocation = this.rollingstock.homeLocation;
    this.rsStatus = this.rollingstock.rsStatus;
    this.imageID = this.rollingstock.imageID;
    this.modelWeight = this.rollingstock.modelWeight;
    this.modelLength = this.rollingstock.modelLength;
  },
  methods: {
    editRsUpdate() {
      this.$store.dispatch("updateRs", {
        _id: this.rollingstock._id,
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
      console.log(this.roadNumber + " " + this.lastMaintDate + " " + this.rfid);
      this.$emit("closeEditRsDialog");
    },
  },
};
</script>
