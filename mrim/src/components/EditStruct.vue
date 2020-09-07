<template>
  <section>
    <div class="center">
      <p class="title is-5">Update Structure</p>
    </div>
    <div class="form">
      <div class="columns">
        <div class="column is-one-third">
          <div class="content">
            <b-field label="Title*">
              <b-input v-model="title" size="is-small" />
            </b-field>
            <b-field label="Use*">
              <b-input v-model="structureUse" size="is-small" />
            </b-field>
            <b-field label="Owner*">
              <b-input v-model="owner" size="is-small" />
            </b-field>
            <b-field label="Operational*">
              <b-switch
                v-model="isOperational"
                type="is-success"
                true-value="Yes"
                false-value="No"
              >{{ isOperational }}</b-switch>
            </b-field>
            <b-field v-if="isVisible" label="Type">
              <b-input v-model="type" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Raw Materials">
              <b-input v-model="rawMaterials" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Raw Material Capacity">
              <b-input v-model="rMCapacity" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Consumption Rate">
              <b-input v-model="conRate" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Prority">
              <b-input v-model="priority" size="is-small" />
            </b-field>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="content">
            <b-field label="Location">
              <b-input v-model="location" size="is-small" />
            </b-field>
            <b-field label="Construction">
              <b-input v-model="construction" size="is-small" />
            </b-field>
            <b-field label="Year Built">
              <b-input v-model="builtDate" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="AAR Code Inbound RS">
              <b-input v-model="aarCodeIn" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Product">
              <b-input v-model="product" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Production Capacity">
              <b-input v-model="productCap" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Production Rate">
              <b-input v-model="prodRate" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="AAR Code Outbound RS">
              <b-input v-model="aarCodeOut" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Siding Capacity">
              <b-input v-model="sidingCap" size="is-small" />
            </b-field>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="content">
            <b-field label="Size">
              <b-input v-model="size" size="is-small" />
            </b-field>
            <b-field label="Pictures">
              <b-input v-model="image" size="is-small" />
            </b-field>
            <b-field label="Description">
              <b-input v-model="description" type="textarea" />
            </b-field>
            <b-field v-if="isVisible" label="Unload Duration">
              <b-input v-model="unloadDuration" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Load Duration">
              <b-input v-model="loadDuration" size="is-small" />
            </b-field>
            <b-field v-if="isVisible" label="Notes">
              <b-input v-model="notes" type="textarea" />
            </b-field>
          </div>
        </div>
        <hr />
      </div>
      <button class="button is-light" @click="updateStruct">Update Structure</button>
    </div>
  </section>
</template>

<script>
import RsService from "../services/RsService";
export default {
  name: "EditStruct",
  data() {
    return {
      title: "",
      structureUse: "",
      description: "",
      owner: "",
      location: "",
      construction: "",
      builtDate: "",
      size: "",
      image: "",
      isOperational: "No",
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
      isIndustrial: false,
    };
  },
  computed: {
    isVisible: function () {
      var flag = false;
      if (this.isOperational == "Yes") {
        flag = true;
      }
      return flag;
    },
  },
  mounted() {
    this.getStruct();
  },
  methods: {
    async getStruct() {
      const response = await RsService.getStruct({
        id: this.$route.params.id,
      });
      if (response.data.isIndustrial) {
        this.title = response.data.title;
        this.structureUse = response.data.structureUse;
        this.description = response.data.description;
        this.owner = response.data.owner;
        this.location = response.data.location;
        this.construction = response.data.construction;
        this.builtDate = response.data.builtDate;
        this.size = response.data.size;
        this.image = response.data.image;
        this.type = response.data.type;
        this.rawMaterials = response.data.rawMaterials;
        this.rMCapacity = response.data.rMCapacity;
        this.conRate = response.data.conRate;
        this.priority = response.data.priority;
        this.aarCodeIn = response.data.aarCodeIn;
        this.product = response.data.product;
        this.productCap = response.data.productCap;
        this.prodRate = response.data.prodRate;
        this.aarCodeOut = response.data.aarCodeOut;
        this.unloadDuration = response.data.unloadDuration;
        this.loadDuration = response.data.loadDuration;
        this.sidingCap = response.data.sidingCap;
        this.notes = response.data.notes;
        this.isOperational = "Yes";
        this.isIndustrial = true;
      } else {
        this.title = response.data.title;
        this.structureUse = response.data.structureUse;
        this.description = response.data.description;
        this.owner = response.data.owner;
        this.location = response.data.location;
        this.construction = response.data.construction;
        this.builtDate = response.data.builtDate;
        this.size = response.data.size;
        this.image = response.data.image;
        this.isOperational = "No";
        this.isIndustrial = false;
      }
    },
    async updateStruct() {
        console.log(this.isIndustrial)
      if (this.isIndustrial) {
        await RsService.updateStruct({
          id: this.$route.params.id,
          title: this.title,
          structureUse: this.structureUse,
          description: this.description,
          owner: this.owner,
          location: this.location,
          construction: this.construction,
          builtDate: this.builtDate,
          size: this.size,
          image: this.image,
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
          isIndustrial: true,
        });
      } else {
        await RsService.updateStruct({
          id: this.$route.params.id,
          title: this.title,
          structureUse: this.structureUse,
          description: this.description,
          owner: this.owner,
          location: this.location,
          construction: this.construction,
          builtDate: this.builtDate,
          size: this.size,
          image: this.image,
          isIndustrial: false,
        });
      }
      this.$router.push({
        name: "Structlist",
      });
    },
  },
};
</script>
<style scoped>
section {
  width: 1000px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: left;
}
</style>
