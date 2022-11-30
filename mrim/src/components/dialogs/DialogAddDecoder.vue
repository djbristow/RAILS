<template>
  <v-card width="500">
    <v-card-title class="headline"> New Decoder </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="roadName" label="Road Name"></v-text-field>
        <v-text-field v-model="roadNumber" label="Road Number"></v-text-field>
        <v-text-field v-model="mfg" label="Manufacturer"></v-text-field>
        <v-text-field v-model="family" label="Family"></v-text-field>
        <v-text-field v-model="model" label="Model"></v-text-field>
        <v-text-field v-model="address" label="Address"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <div v-if="noLoco">
        <v-spacer></v-spacer>
        <h3 style="color: darkred">Locomotive not in inventory.</h3>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeAddDecoderDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="decoderAddDataInvalid" @click="addDecoder" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogAddDecoder",
  data: () => ({
    roadName: "",
    roadNumber: "",
    mfg: "",
    family: "",
    model: "",
    address: "",
    noLoco: false,
  }),
  computed: {
    decoderAddDataInvalid() {
      let result = false;
      return result;
    },
  },
  methods: {
    addDecoder() {
      let loco = this.$store.getters.checkLoco(this.roadName, this.roadNumber);
      if (loco == undefined) {
        this.noLoco = true;
      } else {
        this.noLoco = false;
        this.$store.dispatch("addNewDecoder", {
          locomotiveID: loco._id,
          roadName: this.roadName,
          roadNumber: this.roadNumber,
          mfg: this.mfg,
          family: this.family,
          model: this.model,
          address: this.address,
        });
        this.$emit("closeAddDecoderDialog");
      }
    },
  },
};
</script>
