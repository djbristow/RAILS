<template>
  <v-card width="800">
    <v-card-title class="headline">New Structure</v-card-title>
    <v-card-text>
      <v-container>
        <v-row compact>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="title" label="Title" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="structureUse" label="Use" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="description" label="Description" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="owner" label="Owner" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="location" label="Location" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="construction" label="Construction" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="builtDate" label="Built Date" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="size" label="Size" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="image" label="Image" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="isIndustrial" label="Industrial" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="type" label="Type" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="rawMaterials" label="Raw Materials" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="rMCapacity" label="rMCapacity" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="conRate" label="conRate" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="priority" label="Priority" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="aarCodeIn" label="AAR Code In" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="product" label="Product" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="productCap" label="Product Capacity" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="prodRate" label="Product Rate" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="aarCodeOut" label="AAR Code Out" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="unloadDuration" label="Unload Duration" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="loadDuration" label="Load Duration" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field v-model="sidingCap" label="Siding Capacity" hide-details density="compact" variant="outlined" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="notes" label="Notes" hide-details density="compact" variant="outlined" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        @click="$emit('closeAddStructureDialog')"
        color="red darken-1"
        text
      >
        Cancel
      </v-btn>
      <v-btn :disabled="structureAddDataInvalid" @click="addStructure" text>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { ref } from "vue";
import { useStructuresStore } from "@/stores/structures";
const title = ref("");
const structureUse = ref("");
const description = ref("");
const owner = ref("");
const location = ref("");
const construction = ref("");
const builtDate = ref("");
const size = ref("");
const image = ref("");
const isIndustrial = ref(false);
const type = ref("");
const rawMaterials = ref("");
const rMCapacity = ref("");
const conRate = ref("");
const priority = ref("");
const aarCodeIn = ref("");
const product = ref("");
const productCap = ref("");
const prodRate = ref("");
const aarCodeOut = ref("");
const unloadDuration = ref("");
const loadDuration = ref("");
const sidingCap = ref("");
const notes = ref("");
const structuresStore = useStructuresStore();
const structureAddDataInvalid = ref(false);
const emit = defineEmits(["closeAddStructureDialog"]);

const addStructure = () => {
  structuresStore.ADD_NEW_STRUCTURE({
    title: title.value,
    structureUse: structureUse.value,
    description: description.value,
    owner: owner.value,
    location: location.value,
    construction: construction.value,
    builtDate: builtDate.value,
    size: size.value,
    image: image.value,
    isIndustrial: isIndustrial.value,
    type: type.value,
    rawMaterials: rawMaterials.value,
    rMCapacity: rMCapacity.value,
    conRate: conRate.value,
    priority: priority.value,
    aarCodeIn: aarCodeIn.value,
    product: product.value,
    productCap: productCap.value,
    prodRate: prodRate.value,
    aarCodeOut: aarCodeOut.value,
    unloadDuration: unloadDuration.value,
    loadDuration: loadDuration.value,
    sidingCap: sidingCap.value,
    notes: notes.value,
  });
  emit("closeAddStructureDialog");
};
</script>
