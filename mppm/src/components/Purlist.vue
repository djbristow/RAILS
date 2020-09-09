<template>
  <section>
    <div class="center">
      <p class="title is-5">Purchases</p>
    </div>
    <b-table
      :data="purchases"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :default-sort-direction="defaultSortDirection"
      :striped="isStriped"
      :narrowed="isNarrowed"
      default-sort="num"
    >
      <b-table-column field="num" label="#" width="25" sortable v-slot="props">{{ props.row.num }}</b-table-column>
      <b-table-column
        field="date"
        label="Date"
        width="125"
        sortable
        v-slot="props"
      >{{ props.row.date }}</b-table-column>
      <b-table-column
        field="store"
        label="Store"
        width="180"
        sortable
        v-slot="props"
      >{{ props.row.store }}</b-table-column>
      <b-table-column field="item" label="Item" width="100" v-slot="props">{{ props.row.item }}</b-table-column>
      <b-table-column
        field="manufacturer"
        label="Manufacturer"
        width="100"
        sortable
        v-slot="props"
      >{{ props.row.manufacturer }}</b-table-column>
      <b-table-column
        field="description"
        label="description"
        width="250"
        v-slot="props"
      >{{ props.row.desciption }}</b-table-column>
      <b-table-column
        field="unitcost"
        label="Unit Cost"
        width="100"
        v-slot="props"
      >{{ props.row.unitcost }}</b-table-column>
      <b-table-column field="qty" label="Qty" width="80" v-slot="props">{{ props.row.qty }}</b-table-column>
      <b-table-column field="_id" label="Action" width="80" v-slot="props">
        <router-link :to="{ name: 'EditPur', params: { id: props.row._id } }">
          <b-icon icon="pencil" type="is-dark" />
        </router-link>
        <a href="#" @click="deletePur(props.row._id)">
          <b-icon icon="delete-forever" type="is-dark" />
        </a>
      </b-table-column>
    </b-table>
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
import PpService from "../services/PpService";
import moment from "moment";
export default {
  name: "Purchases",
  data() {
    return {
      purchases: [],
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
    this.getPurlist();
  },
  methods: {
    async getPurlist() {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
      var i = 0;
      const response = await PpService.fetchPurlist();
      this.purchases = response.data.purchases;
      for (i = 0; i < response.data.purchases.length; i++) {
        this.purchases[i].date = this.formatDate(
          response.data.purchases[i].date
        );
        this.purchases[i].unitcost = formatter.format(
          response.data.purchases[i].unitcost
        );
      }
    },
    async deletePur(id) {
      await PpService.deletePur(id);
      this.getPurlist();
      this.$router.push({
        name: "Purlist",
      });
    },
    formatDate(unformatDate) {
      if (unformatDate === null || unformatDate === "") {
        return "";
      } else {
        return moment.utc(unformatDate).format("YYYY-MM-DD");
      }
    },
  },
};
</script>
   <style scoped>
section {
  display: block;
  margin: auto;
  width: 1200px;
  padding: 10px;
}
.center {
  text-align: center;
}
</style>
