<template>
  <v-card width="800">
    <v-card-title class="headline"> New Structure </v-card-title>
    <v-card-text>
      <v-container>
        <v-text-field v-model="title" label="Title"></v-text-field>
        <v-text-field v-model="structureUse" label="Use"></v-text-field>
        <v-text-field v-model="description" label="Description"></v-text-field>
        <v-text-field v-model="owner" label="Owner"></v-text-field>
        <v-text-field v-model="location" label="Location"></v-text-field>
        <v-text-field
          v-model="construction"
          label="Construction"
        ></v-text-field>
        <v-text-field v-model="builtDate" label="Built Date"></v-text-field>
        <v-text-field v-model="size" label="Size"></v-text-field>
        <v-text-field v-model="image" label="Image"></v-text-field>
        <v-text-field v-model="isIndustrial" label="Industrial"></v-text-field>
        <v-text-field v-model="type" label="Type"></v-text-field>
        <v-text-field
          v-model="rawMaterials"
          label="Raw Materials"
        ></v-text-field>
        <v-text-field v-model="rMCapacity" label="rMCapacity"></v-text-field>
        <v-text-field v-model="conRate" label="conRate"></v-text-field>
        <v-text-field v-model="priority" label="Priority"></v-text-field>
        <v-text-field v-model="aarCodeIn" label="AAR Code In"></v-text-field>
        <v-text-field v-model="product" label="Product"></v-text-field>
        <v-text-field
          v-model="productCap"
          label="Product Capacity"
        ></v-text-field>
        <v-text-field v-model="prodRate" label="Product Rate"></v-text-field>
        <v-text-field v-model="aarCodeOut" label="AAR Code Out"></v-text-field>
        <v-text-field
          v-model="unloadDuration"
          label="Unload Duration"
        ></v-text-field>
        <v-text-field
          v-model="loadDuration"
          label="Load Duration"
        ></v-text-field>
        <v-text-field
          v-model="sidingCap"
          label="Siding Capacity"
        ></v-text-field>
        <v-textarea v-model="notes" label="notes"></v-textarea>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
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
