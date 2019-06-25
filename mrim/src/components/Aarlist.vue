<template>
  <section>
    <div class="center">
      <p class="title is-5">
        AAR Codes
      </p>
    </div>
    <b-table
      :data="aarCodes"
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
          field="aarCode"
          label="Code"
          width="50"
          sortable
        >
          {{ props.row.aarCode }}
        </b-table-column>
        <b-table-column
          field="rollingstockType"
          label="RS Type"
          width="125"
          sortable
        >
          {{ props.row.rollingstockType }}
        </b-table-column>
        <b-table-column
          field="description"
          label="Description"
          width="750"
        >
          {{ props.row.description }}
        </b-table-column>
        <b-table-column
          field="_id"
          label="Action"
          width="75"
          sortable
        >
          <router-link :to="{ name: 'EditAar', params: { id: props.row._id } }">
            <b-icon icon="pencil" />
          </router-link>
          <a
            href="#"
            @click="deleteAar(props.row._id)"
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
  name: 'Aarlist',
  data () {
    return {
      aarCodes: [],
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
    this.getAarlist()
  },
  methods: {
    async getAarlist () {
      const response = await RsService.fetchAarlist()
      this.aarCodes = response.data.aarCodes
    },
    async deleteAar (id) {
      await RsService.deleteAar(id)
      this.getAarlist()
      this.$router.push({
        name: 'Aarlist'
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
