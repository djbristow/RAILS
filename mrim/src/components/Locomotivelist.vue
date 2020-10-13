<template>
  <section>
    <div class="center">
      <p class="title is-5">Locomotive Inventory</p>
    </div>
    <div class="tsize">
      <b-table
        :data="locomotives"
        :striped="isStriped"
        :narrowed="isNarrowed"
        :paginated="isPaginated"
        :per-page="perPage"
        :current-page.sync="currentPage"
      >
        <b-table-column
          field="roadName"
          label="Name"
          width="80"
          sortable
          v-slot="props"
          >{{ props.row.roadName }}</b-table-column
        >
        <b-table-column
          field="roadNumber"
          label="#"
          width="60"
          numeric
          sortable
          v-slot="props"
          >{{ props.row.roadNumber }}</b-table-column
        >
        <b-table-column
          field="aarCode"
          label="AAR"
          width="60"
          centered
          sortable
          v-slot="props"
          >{{ props.row.aarCode }}</b-table-column
        >
        <b-table-column
          field="description"
          label="Description"
          width="180"
          sortable
          v-slot="props"
          >{{ props.row.description }}</b-table-column
        >
        <b-table-column
          field="mfg"
          label="MFG"
          width="100"
          sortable
          v-slot="props"
          >{{ props.row.mfg }}</b-table-column
        >
        <b-table-column
          field="family"
          label="Family"
          width="310"
          sortable
          v-slot="props"
          >{{ props.row.family }}</b-table-column
        >
        <b-table-column
          field="model"
          label="Model"
          width="130"
          sortable
          v-slot="props"
          >{{ props.row.model }}</b-table-column
        >
        <b-table-column
          field="address"
          label="Address"
          width="80"
          sortable
          v-slot="props"
          >{{ props.row.address }}</b-table-column
        >
      </b-table>
    </div>
    <b-field grouped group-multiline>
      <b-select v-model="perPage" :disabled="!isPaginated">
        <option value="10">10 per page</option>
        <option value="20">20 per page</option>
        <option value="30">30 per page</option>
        <option value="40">40 per page</option>
      </b-select>
    </b-field>
  </section>
</template>

<script>
import RsService from "../services/RsService";
export default {
  name: "Locomotives",
  data() {
    return {
      locomotives: [],
      rsLocomotives: [],
      decoders: [],
      currentPage: 1,
      perPage: 10,
      isPaginated: true,
      isPaginationSimple: false,
      isNarrowed: true,
      isStriped: true,
      defaultSortDirection: "asc",
    };
  },
  mounted() {
    this.getLocomotivelist();
  },
  methods: {
    async getLocomotivelist() {
      var response = await RsService.fetchRSLocomotives();
      this.rsLocomotives = response.data.rollingstocks;
      response = await RsService.fetchDcclist();
      this.decoders = response.data.dccs;
      for (let i = 0; i < this.rsLocomotives.length; i++) {
        var loco = {
          roadName: "",
          roadNumber: "",
          aarCode: "",
          description: "",
          mfg: "",
          family: "",
          model: "",
          address: "",
        };
        loco.roadName = this.rsLocomotives[i].roadName;
        loco.roadNumber = this.rsLocomotives[i].roadNumber;
        loco.aarCode = this.rsLocomotives[i].aarCode;
        loco.description = this.rsLocomotives[i].description;
        const getDecoder = this.decoders.find(
          (decoder) => decoder.locomotiveID === this.rsLocomotives[i]._id
        );
        if (getDecoder == undefined) {
          loco.mfg = "";
          loco.family = "";
          loco.model = "";
          loco.address = "";
        } else {
          loco.mfg = getDecoder.mfg;
          loco.family = getDecoder.family;
          loco.model = getDecoder.model;
          loco.address = getDecoder.address;
        }
        this.locomotives.push(loco);
      }
    },
  },
};
</script>

<style scoped>
section {
  display: block;
  margin: auto;
  width: 1100px;
  padding: 10px;
}
.center {
  text-align: center;
}
.tsize {
  display: block;
  margin: auto;
  width: 850px;
}
.columns {
  width: 670px;
  background-color: white;
  padding: 10px;
}
.modal-card-head {
  background-color: rgb(106, 181, 243);
  width: 680px;
}
.modal-card-body {
  background-color: white;
  width: 680px;
}
.modal-card-foot {
  background-color: rgb(106, 181, 243);
  width: 680px;
}
</style>
