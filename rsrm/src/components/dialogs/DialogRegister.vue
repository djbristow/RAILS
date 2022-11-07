<template>
  <v-card width="400">
    <v-card-title class="headline"> Rollingstock Registration </v-card-title>
    <v-subheader>RFID Tag {{ rfid }}</v-subheader>
    <v-card-text>
      <v-container>
        <v-text-field v-model="roadname" label="Road Name" required></v-text-field>
        <v-text-field v-model="roadnumber" label="Road Number" required></v-text-field>
      </v-container>
      <v-container v-if="newrs">
        <div class="red--text mb-8">
          Rollingstock {{ roadname }} {{ roadnumber }} is not in the inventory
        </div>
        <v-text-field v-model="aarcode" label="AAR Code" required></v-text-field>
        <v-text-field v-model="color" label="Color" required></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeRegisterDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="rsDataInvalid" @click="checkUpdateRs" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: ["rfid"],
  data: () => ({
    newrs: false,
    roadname: "",
    roadnumber: "",
    namenumber: "",
    aarcode: "",
    color: "",
    new_rs: {
      aarCode: "",
      color: "",
      roadName: "",
      roadNumber: "",
      rfid: "",
      _id: "",
    },
  }),
  computed: {
    rsDataInvalid() {
      let result = true;
      if (!this.newrs) {
        if (this.roadnumber !== "" && this.roadname !== "") {
          result = false;
        }
      } else {
        if (this.aarCode !== "" && this.color !== "") {
          result = false;
        }
      }
      return result;
    },
  },
  methods: {
    checkUpdateRs() {
      this.new_rs.rfid = this.rfid;
      this.new_rs.roadName = this.roadname;
      this.new_rs.roadNumber = this.roadnumber;
      if (this.newrs) {
        console.log("second round");
        this.new_rs.color = this.color;
        this.new_rs.aarCode = this.aarcode;
        console.log(this.new_rs);
        this.$store.dispatch("addNewRsRfid", this.new_rs);
        this.$emit("close");
      } else {
        this.namenumber = this.roadname + "-" + this.roadnumber;
        let rsFound = this.$store.getters.checkRoadNameNumber(this.namenumber);
        if (rsFound === undefined) {
          this.newrs = true;
        } else {
          this.new_rs.aarCode = rsFound.aarCode;
          this.new_rs.color = rsFound.color;
          this.new_rs._id = rsFound._id;
          this.$store.dispatch("updateRsRfid", this.new_rs);
          this.$emit('closeRegisterDialog');
        }
      }
    },
  },
};
</script>
