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
<script setup>
import { useCompaniesStore } from "@/stores/companies";

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
});
const companyStore = useCompaniesStore();
const deleteCompany = (id) => {
  companyStore.DELETE_COMPANY(id);
  emit("closeDeleteCompanyDialog");
};
</script>
