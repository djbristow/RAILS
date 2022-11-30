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
<script>
export default {
  name: "DialogAddStructure",
  data: () => ({
    title: "",
    structureUse: "",
    description: "",
    owner: "",
    location: "",
    construction: "",
    builtDate: "",
    size: "",
    image: "",
    isIndustrial: "",
    type: "",
    rawMaterials: "",
    rMCapacity: "",
    conRate: "",
    priority: "",
    aarCodeIn: "",
    product: "",
    productCap: "",
    prodRate: "",
    aarCodeOut: "",
    unloadDuration: "",
    loadDuration: "",
    sidingCap: "",
    notes: "",
  }),
  computed: {
    structureAddDataInvalid() {
      let result = false;
      return result;
    },
  },
  methods: {
    addStructure() {
      this.$store.dispatch("addNewStructure", {
        title: this.title,
        structureUse: this.structureUse,
        description: this.description,
        owner: this.owner,
        location: this.location,
        construction: this.construction,
        builtDate: this.builtDate,
        size: this.size,
        image: this.image,
        isIndustrial: this.isIndustrial,
        type: this.type,
        rawMaterials: this.rawMaterials,
        rMCapacity: this.rMCapacity,
        conRate: this.conRate,
        priority: this.priority,
        aarCodeIn: this.aarCodeIn,
        product: this.product,
        productCap: this.productCap,
        prodRate: this.prodRate,
        aarCodeOut: this.aarCodeOut,
        unloadDuration: this.unloadDuration,
        loadDuration: this.loadDuration,
        sidingCap: this.sidingCap,
        notes: this.notes,
      });
      this.$emit("closeAddStructureDialog");
    },
  },
};
</script>
