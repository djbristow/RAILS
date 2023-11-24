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
<script setup>
import { ref } from "vue";
import { useCompaniesStore } from "@/stores/companies";

const shortName = ref("");
const longName = ref("");
const industryType = ref("");
const industryLocation = ref("");
const companyAddDataInvalid = ref(false);
const companyStore = useCompaniesStore();
const addCompany = () => {
  companyStore.ADD_NEW_COMPANY({
    shortName: shortName.value,
    longName: longName.value,
    industryType: industryType.value,
    industryLocation: industryLocation.value,
  });
  emit("closeAddCompanyDialog");
};
</script>
