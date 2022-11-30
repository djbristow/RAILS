<template>
  <v-card width="800">
    <v-card-title class="headline"> Decoder </v-card-title>
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
      <v-btn @click="$emit('closeEditDecoderDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="decoderEditDataInvalid" @click="editDecoder" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
  <script>
export default {
  name: "DialogEditDecoder",
  props: ["decoderLoco"],
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
    decoderEditDataInvalid() {
      let result = false;
      return result;
    },
  },
  mounted() {
    this.roadName = this.decoderLoco.roadName;
    this.roadNumber = this.decoderLoco.roadNumber;
    this.mfg = this.decoderLoco.mfg;
    this.family = this.decoderLoco.family;
    this.model = this.decoderLoco.model;
    this.address = this.decoderLoco.address;
  },
  methods: {
    editDecoder() {
      let loco = this.$store.getters.checkLoco(this.roadName, this.roadNumber);
      if (loco == undefined) {
        this.noLoco = true;
      } else {
        let updatedDecoder = {
          _id: this.decoderLoco._id,
          locomotiveID: loco._id,
          mfg: this.mfg,
          family: this.family,
          model: this.model,
          address: this.address,
        };
        this.noLoco = false;
        this.$store.dispatch("updateDecoder", updatedDecoder);
        this.$emit("closeEditDecoderDialog");
      }
    },
  },
};
</script>
