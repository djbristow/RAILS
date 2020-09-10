<template>
  <section>
    <div class="center">
      <p class="title is-5">Micro Controllers</p>
    </div>
    <b-table
      :data="micros"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :default-sort-direction="defaultSortDirection"
      :striped="isStriped"
      :narrowed="isNarrowed"
      default-sort="roadName"
    >
      <b-table-column
        field="microID"
        label="Name"
        width="50"
        sortable
        v-slot="props"
      >{{ props.row.microID }}</b-table-column>
      <b-table-column
        field="microIP"
        label="IP"
        width="125"
        sortable
        v-slot="props"
      >{{ props.row.microIP }}</b-table-column>
      <b-table-column
        field="purpose"
        label="Purpose"
        width="750"
        v-slot="props"
      >{{ props.row.purpose }}</b-table-column>
      <b-table-column field="et" label="Last Update" width="100" v-slot="props">{{ props.row.et }}</b-table-column>
      <b-table-column field="_id" label="Action" width="75" sortable v-slot="props">
        <router-link :to="{ name: 'EditMicro', params: { id: props.row._id } }">
          <b-icon icon="pencil" />
        </router-link>
        <a href="#" @click="deleteMicro(props.row._id)">
          <b-icon icon="delete-forever" />
        </a>
      </b-table-column>
    </b-table>
  </section>
</template>
<script>
import RsService from "../services/RsService";
export default {
  name: "Microlist",
  data() {
    return {
      micros: [],
      isPaginated: true,
      isPaginationSimple: false,
      isNarrowed: true,
      isStriped: true,
      defaultSortDirection: "asc",
      currentPage: 1,
      perPage: 10,
    };
  },
  mounted() {
    this.getMicrolist();
  },
  methods: {
    async getMicrolist() {
      const response = await RsService.fetchMicroList();
      this.micros = response.data.micros;
    },
    async deleteMicro(id) {
      await RsService.deleteMicro(id);
      const response = await RsService.fetchMicroList();
      this.micros = response.data.micros;
    },
  },
};
</script>
   <style scoped>
section {
  display: block;
  margin: auto;
  width: 1000px;
  padding: 10px;
}
.center {
  text-align: center;
}
</style>
