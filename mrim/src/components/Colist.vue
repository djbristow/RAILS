<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Companies
      </p>
    </div>
    <b-table
      :data="industries"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :default-sort-direction="defaultSortDirection"
      :striped="isStriped"
      :narrowed="isNarrowed"
      default-sort="roadName"
    >
      <template slot-scope="props">
        <b-table-column
          field="shortName"
          label="Short Name"
          width="50"
          sortable
        >
          {{ props.row.shortName }}
        </b-table-column>
        <b-table-column
          field="longName"
          label="Long Name"
          width="200"
        >
          {{ props.row.longName }}
        </b-table-column>
        <b-table-column
          field="industryType"
          label="Type"
          width="100"
          sortable
        >
          {{ props.row.industryType }}
        </b-table-column>
        <b-table-column
          field="industryLocation"
          label="Location"
          width="100"
          sortable
        >
          {{ props.row.industryLocation }}
        </b-table-column>
        <b-table-column
          field="_id"
          label="Action"
          width="75"
          sortable
        >
          <router-link :to="{ name: 'EditCo', params: { id: props.row._id } }">
            <b-icon icon="pencil" />
          </router-link>
          <a
            href="#"
            @click="deleteCo(props.row._id)"
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
import RsService from '../services/RsService'
export default {
  name: 'Colist',
  data () {
    return {
      industries: [],
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
    this.getColist()
  },
  methods: {
    async getColist () {
      const response = await RsService.fetchColist()
      this.industries = response.data.industries
    },
    async deleteCo (id) {
      await RsService.deleteCo(id)
      this.getColist()
    }
  }
}
</script>
   <style scoped>
   section {
   display: block;
   margin: auto;
   width: 800px;
   padding: 10px;
   }
   .center {
   text-align: center;
   }
   </style>
