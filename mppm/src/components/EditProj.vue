<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Project
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        <b-field label="Title">
          <b-input v-model="title" />
        </b-field>
        <b-field label="Type">
          <b-select
            v-model="type"
            placeholder="Select a character"
            required
          >
            <option value="rolling stock">
              Rolling Stock
            </option>
            <option value="electronics">
              Electronics
            </option>
            <option value="scenery">
              Scenery
            </option>
            <option value="track">
              Track
            </option>
            <option value="building">
              Building
            </option>
            <option value="other">
              Other
            </option>
          </b-select>
        </b-field>
        <b-field label="Description">
          <b-input
            v-model="description"
            type="textarea"
          />
        </b-field>
        <b-field label="Start Date">
          <b-datepicker
            v-model="startdate"
            placeholder="Type or select a date..."
            icon="calendar-today"
            editable
          />
        </b-field>
        <b-field label="End Date">
          <b-datepicker
            v-model="enddate"
            placeholder="Type or select a date..."
            icon="calendar-today"
            editable
          />
        </b-field>
        <b-field
          v-if="needsRSInfo"
          label="Road Name"
        >
          <b-input v-model="roadname" />
        </b-field>
        <b-field
          v-if="needsRSInfo"
          label="Road Numbers"
        >
          <b-input v-model="roadnumbers" />
        </b-field>
        <b-field label="Notes">
          <b-input
            v-model="notes"
            type="textarea"
          />
        </b-field>
        <button
          class="button is-light"
          @click="updateProj"
        >
          Update Project
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import PpService from '../services/PpService'
import moment from 'moment'
export default {
  name: 'EditProj',
  data () {
    return {
      title: '',
      type: '',
      description: '',
      startdate: null,
      enddate: null,
      roadname: '',
      roadnumbers: '',
      notes: ''
    }
  },
  computed: {
    needsRSInfo: function () {
      return (this.type === 'rolling stock') && !(this.title === 'RTR')
    }
  },
  mounted () {
    this.getProj()
  },
  methods: {
    async getProj () {
      const response = await PpService.getProj({
        id: this.$route.params.id
      })
      this.title = response.data.title
      this.type = response.data.type
      this.description = response.data.description
      this.startdate = new Date(response.data.startdate)
      this.enddate = new Date(response.data.enddate)
      this.roadname = response.data.roadname
      this.roadnumbers = response.data.roadnumbers
      this.notes = response.data.notes
    },
    async updateProj () {
      await PpService.updateProj({
        id: this.$route.params.id,
        title: this.title,
        type: this.type,
        description: this.description,
        startdate: this.startdate,
        enddate: this.enddate,
        roadname: this.roadname,
        roadnumbers: this.roadnumbers,
        notes: this.notes
      })
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
  width: 400px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: left;
}
</style>
