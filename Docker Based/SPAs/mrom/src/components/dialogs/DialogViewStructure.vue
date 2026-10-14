<template>
  <v-card width="900">
    <v-card-title class="headline"> Structure Details </v-card-title>
    <v-container>
      <v-row dense>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Title" :model-value="structure.title" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Use" :model-value="structure.structureUse" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Description" :model-value="structure.description" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Owner" :model-value="structure.owner" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Location" :model-value="structure.location" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Construction" :model-value="structure.construction" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Built Date" :model-value="structure.builtDate" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Size" :model-value="structure.size" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field label="Industrial" :model-value="structure.isIndustrial ? 'Yes' : 'No'" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Type" :model-value="structure.type" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Raw Materials" :model-value="structure.rawMaterials" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Raw Materials Capacity" :model-value="structure.rMCapacity" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Consumption Rate" :model-value="structure.conRate" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Priority" :model-value="structure.priority" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Inbound AAR Code" :model-value="structure.aarCodeIn" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Product" :model-value="structure.product" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Product Capacity" :model-value="structure.productCap" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Production Rate" :model-value="structure.prodRate" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Outbound AAR Code" :model-value="structure.aarCodeOut" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Unload Duration" :model-value="structure.unloadDuration" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Load Duration" :model-value="structure.loadDuration" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col v-if="structure.isIndustrial" cols="12" sm="6" md="4">
          <v-text-field label="Siding Capacity" :model-value="structure.sidingCap" readonly hide-details density="compact" variant="outlined" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="Notes" :model-value="structure.notes" readonly hide-details density="compact" variant="outlined" rows="2" auto-grow />
        </v-col>
      </v-row>
    </v-container>
    <v-card-actions>
      <v-btn @click="$emit('closeViewStructureDialog')">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
defineProps({
  structure: {
    type: Object,
    required: true,
  },
});
</script>
