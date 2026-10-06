<template>
  <v-card width="900">
    <v-card-title class="headline">Structure Details</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" md="5">
            <v-row compact>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.title" label="Title" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.structureUse" label="Use" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.description" label="Description" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.owner" label="Owner" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.location" label="Location" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.construction" label="Construction" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.builtDate" label="Built Date" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="structure.size" label="Size" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="12">
                <v-text-field :model-value="isIndustrial ? 'Yes' : 'No'" label="Industrial" readonly hide-details density="compact" variant="outlined" />
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7">
            <v-img :src="imageServer" contain />
          </v-col>
          <v-col v-if="isIndustrial" cols="12">
            <v-card-subtitle>Industrial Details</v-card-subtitle>
            <v-row compact>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.type" label="Type" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.rawMaterials" label="Raw Materials" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.rMCapacity" label="Raw Materials Capacity" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.conRate" label="Consumption Rate" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.priority" label="Priority" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.aarCodeIn" label="AAR Code In" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.product" label="Product" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.productCap" label="Product Capacity" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.prodRate" label="Product Rate" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.aarCodeOut" label="AAR Code Out" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.unloadDuration" label="Unload Duration" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.loadDuration" label="Load Duration" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field :model-value="structure.sidingCap" label="Siding Capacity" readonly hide-details density="compact" variant="outlined" />
              </v-col>
              <v-col cols="12">
                <v-textarea :model-value="structure.notes" label="Notes" readonly hide-details density="compact" variant="outlined" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('closeViewStructureDialog')" text>Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { computed, ref, onMounted } from "vue";
const props = defineProps({
  structure: {
    type: Object,
    required: true,
  },
});
const isIndustrial = computed(() => {
  const value = props.structure.isIndustrial;
  return value === true || value === 1 || ["true", "1", "yes"].includes(String(value).toLowerCase());
});
const imageServer = ref("");
onMounted(() => {
  if (import.meta.env.DEV) {
    imageServer.value = import.meta.env.VITE_MRFM_URI_DEV + "/" + props.structure.image;
  } else {
    imageServer.value = import.meta.env.VITE_MRFM_URI + "/" + props.structure.image;
  }
});
</script>