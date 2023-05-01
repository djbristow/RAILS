<template>
  <v-card width="800">
    <v-card-title class="headline"> Company </v-card-title>
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
  <script setup>
import { ref, onMounted } from "vue";
import { useCompaniesStore } from "@/stores/companies";

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
});
const shortName = ref("");
const longName = ref("");
const industryType = ref("");
const industryLocation = ref("");
const companyEditDataInvalid = ref(false);
const emit = defineEmits(["closeEditCompanyDialog"]);
const companyStore = useCompaniesStore();
const editCompany = () => {
  companyStore.UPDATE_COMPANY({
    _id: props.company._id,
    shortName: shortName.value,
    longName: longName.value,
    industryType: industryType.value,
    industryLocation: industryLocation.value,
  });
  emit("closeEditCompanyDialog");
};
onMounted(() => {
  shortName.value = props.company.shortName;
  longName.value = props.company.longName;
  industryType.value = props.company.industryType;
  industryLocation.value = props.company.industryLocation;
});
</script>
