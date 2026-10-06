<template>
  <v-card width="400">
    <v-card-title class="headline">New Company</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="shortName" label="Name" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="longName" label="Long Name" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="industryType" label="Type" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="industryLocation" label="Location" hide-details density="compact" variant="outlined" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
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
const emit = defineEmits(["closeAddCompanyDialog"]);

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
