<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Model Railroad Companies
      </p>
    </div>
    <b-table
      :data="companies"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :default-sort-direction="defaultSortDirection"
      :striped="isStriped"
      :narrowed="isNarrowed"
      default-sort="name"
    >
      <template slot-scope="props">
        <b-table-column
          field="name"
          label="Company"
          width="100"
          sortable
        >
          {{ props.row.name }}
        </b-table-column>
        <b-table-column
          field="type"
          label="Type"
          width="75"
          sortable
        >
          {{ props.row.type }}
        </b-table-column>
        <b-table-column
          field="website"
          label="URL"
          width="150"
          sortable
        >
          {{ props.row.website }}
        </b-table-column>
        <b-table-column
          field="_id"
          label="Action"
          width="75"
        >
          <router-link :to="{ name: 'EditMco', params: { id: props.row._id } }">
            <b-icon icon="pencil" />
          </router-link>
          <a
            href="#"
            @click="deleteMco(props.row._id)"
          ><b-icon icon="delete-forever" /></a>
        </b-table-column>
      </template>
    </b-table>
    <b-field
      grouped
      group-multiline
    >
      <b-select
        v-model="perPage"
        :disabled="!isPaginated"
      >
        <option value="10">
          10 per page
        </option>
        <option value="20">
          20 per page
        </option>
        <option value="30">
          30 per page
        </option>
        <option value="40">
          40 per page
        </option>
      </b-select>
    </b-field>
  </section>
</template>
<script>
import PpService from '../services/PpService'
export default {
  name: 'Mcolist',
  data () {
    return {
      companies: [],
      isPaginated: true,
      isPaginationSimple: false,
      isNarrowed: true,
      isStriped: true,
      defaultSortDirection: 'asc',
      currentPage: 1,
      perPage: 10
    }
  },
  mounted () {
    this.getMcolist()
  },
  methods: {
    async getMcolist () {
      const response = await PpService.fetchMcolist()
      this.companies = response.data.companies
    },
    async deleteMco (id) {
      await PpService.deleteMco(id)
      this.getMcolist()
      this.$router.push({
        name: 'Mcolist'
      })
    }
  }
}
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
