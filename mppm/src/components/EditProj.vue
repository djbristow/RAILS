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
          <b-input v-model="type" />
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
      notes: ''
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
