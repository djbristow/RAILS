<template>
  <v-card width="800">
    <v-card-title class="headline"> AAR Code </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="shortName" label="Name"></v-text-field>
        <v-text-field v-model="longName" label="Long Name"></v-text-field>
        <v-text-field v-model="industryType" label="Type"></v-text-field>
        <v-text-field v-model="industryLocation" label="Location"></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeEditCompanyDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="companyEditDataInvalid" @click="editCompany" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
  <script>
export default {
  name: "DialogEditCompany",
  props: ["company"],
  data: () => ({
    shortName: "",
    longName: "",
    industryType: "",
    industryLocation: "",
  }),
  computed: {
    companyEditDataInvalid() {
      let result = false;
      return result;
    },
  },
  mounted() {
        this.shortName = this.company.shortName
        this.longName = this.company.longName;
        this.industryType = this.company.industryType;
        this.industryLocation = this.company.industryLocation;
  },
  methods: {
    editCompany() {
      let updatedCompany = {
        _id: this.company._id,
           shortName: this.shortName,
    longName: this.longName,
    industryType: this.industryType,
    industryLocation: this.industryLocation,
      };
      this.$store.dispatch("updateCompany", updatedCompany);
      this.$emit("closeEditCompanyDialog");
    },
  },
};
</script>
