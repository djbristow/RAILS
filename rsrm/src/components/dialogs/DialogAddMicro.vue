<template>
  <v-card width="400">
    <v-card-title class="headline"> New Micro </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="microID" label="Name"></v-text-field>
        <v-text-field v-model="microIP" label="IP"></v-text-field>
        <v-text-field v-model="et" label="Time"></v-text-field>
        <v-text-field v-model="purpose" label="Purpose"></v-text-field>
        <v-text-field v-model="sensorLoc" label="Sensor Location"></v-text-field>
        <v-text-field v-model="status" label="Status"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddMicroDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="microAddDataInvalid" @click="addMicro" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogAddMicro",
  data: () => ({
    microID: "",
    microIP: "",
    et: "",
    purpose: "",
    sensorLoc: "",
    status: "",
  }),
  computed: {
    microAddDataInvalid() {
      let result = false;
      return result;
    },
  },
  methods: {
    addMicro() {
      this.$store.dispatch("addNewMicro", {
        microID: this.microID,
        microIP: this.microIP,
        et: this.et,
        purpose: this.purpose,
        sensorLoc: this.sensorLoc,
        status: this.status,
      });
      this.$emit("closeAddMicroDialog");
    },
  },
};
</script>
