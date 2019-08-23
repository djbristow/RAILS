<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Projects
      </p>
    </div>
    <b-table
      :data="projects"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :default-sort-direction="defaultSortDirection"
      :striped="isStriped"
      :narrowed="isNarrowed"
      default-sort="title"
    >
      <template slot-scope="props">
        <b-table-column
          field="title"
          label="Title"
          width="200"
          sortable
        >
          {{ props.row.title }}
        </b-table-column>
        <b-table-column
          field="type"
          label="Type"
          width="150"
          sortable
        >
          {{ props.row.type }}
        </b-table-column>
        <b-table-column
          field="description"
          label="Description"
          width="300"
        >
          {{ props.row.description }}
        </b-table-column>
        <b-table-column
          field="startdate"
          label="Start"
          width="120"
          sortable
        >
          {{ props.row.startdate }}
        </b-table-column>
        <b-table-column
          field="enddate"
          label="End"
          width="120"
        >
          {{ props.row.enddate }}
        </b-table-column>
        <b-table-column
          field="notes"
          label="Notes"
          width="300"
        >
          {{ props.row.notes }}
        </b-table-column>

        <b-table-column
          field="_id"
          label="Action"
          width="75"
        >
          <router-link :to="{ name: 'EditProj', params: { id: props.row._id } }">
            <b-icon
              icon="pencil"
              type="is-dark"
            />
          </router-link>
          <a
            href="#"
            @click="deleteProj(props.row._id)"
          >
            <b-icon
              icon="delete-forever"
              type="is-dark"
            />
          </a>
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
import moment from 'moment'
export default {
  name: 'Projlist',
  data () {
    return {
      projects: [],
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
    this.getProjlist()
  },
  methods: {
    async getProjlist () {
      var i = 0
      const response = await PpService.fetchProjlist()
      this.projects = response.data.projects
      for (i = 0; i < response.data.projects.length; i++) {
        this.projects[i].startdate = this.formatDate(response.data.projects[i].startdate)
        this.projects[i].enddate = this.formatDate(response.data.projects[i].enddate)
      }
    },
    async deleteProj (id) {
      await PpService.deleteProj(id)
      this.getProjlist()
      this.$router.push({
        name: 'Projlist'
      })
    },
    formatDate (unformatDate) {
      if (unformatDate === null || unformatDate === '') {
        return ''
      } else {
        return moment.utc(unformatDate).format('YYYY-MM-DD')
      }
    }
  }
}
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
