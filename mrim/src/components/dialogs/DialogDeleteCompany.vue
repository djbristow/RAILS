<template>
  <v-card width="400">
    <v-card-title class="headline"> Delete AAR Code? </v-card-title>
    <v-card-actions>
      <v-card-text>Are you sure you want to delete <strong>{{ company.shortName }}</strong>?</v-card-text>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('closeDeleteCompanyDialog')" text> No </v-btn>
      <v-btn @click="deleteCompany(company._id)" color="red darken-1" text>
        Yes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "DialogDeleteCompany",
  props: ["company"],
  methods: {
    deleteCompany(id) {
      this.$store.dispatch("deleteCompany", id);
      this.$emit("closeDeleteCompanyDialog");
    },
  },
};
</script>
