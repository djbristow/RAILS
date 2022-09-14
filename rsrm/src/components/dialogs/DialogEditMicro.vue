<template>
  <v-card width="400">
    <v-card-title class="headline"> Micro </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="microID" label="Name"></v-text-field>
        <v-text-field v-model="microIP" label="IP"></v-text-field>
        <v-text-field v-model="et" label="Time"></v-text-field>
        <v-text-field v-model="purpose" label="Purpose"></v-text-field>
        <v-text-field
          v-model="sensorLoc"
          label="Sensor Location"
        ></v-text-field>
        <v-text-field v-model="status" label="Status"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeEditMicroDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="microEditDataInvalid" @click="editMicro" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
  <script>
export default {
  name: "DialogEditMicro",
  props: ["micro"],
  data: () => ({
    microID: "",
    microIP: "",
    et: "",
    purpose: "",
    sensorLoc: "",
    status: "",
  }),
  computed: {
    microEditDataInvalid() {
      let result = false;
      return result;
    },
  },
  mounted() {
    this.microID = this.micro.microID;
    this.microIP = this.micro.microIP;
    this.et = this.micro.et;
    this.purpose = this.micro.purpose;
    this.sensorLoc = this.micro.sensorLoc;
    this.status = this.micro.status;
  },
  methods: {
    editMicro() {
      this.$store.dispatch("updateMicro", {
        _id: this.micro._id,
        microID: this.microID,
        microIP: this.microIP,
        et: this.et,
        purpose: this.purpose,
        sensorLoc: this.sensorLoc,
        status: this.status,
      });
      
      this.$emit("closeEditMicroDialog");
    },
  },
};
</script>