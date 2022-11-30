<template>
  <v-card width="400">
    <v-card-title class="headline"> New Company </v-card-title>
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
      <v-btn @click="$emit('closeAddCompanyDialog')" color="red darken-1" text>
        Cancel
      </v-btn>
      <v-btn :disabled="companyAddDataInvalid" @click="addCompany" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogAddCompany",
  data: () => ({
    shortName: "",
    longName: "",
    industryType: "",
    industryLocation: "",
  }),
  computed: {
    companyAddDataInvalid() {
      let result = false;
      return result;
    },
  },
  methods: {
    addCompany() {
      this.$store.dispatch("addNewCompany", {
        shortName: this.shortName,
        longName: this.longName,
        industryType: this.industryType,
        industryLocation: this.industryLocation,
      });
      this.$emit("closeAddCompanyDialog");
    },
  },
};
</script>
