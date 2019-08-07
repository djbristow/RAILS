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
        Title:
        <input
          v-model="title"
          type="text"
          name="title"
          size="40"
        >
        <br>Type:
        <input
          v-model="type"
          type="text"
          name="type"
          size="40"
        >
        <br>Description:
        <input
          v-model="description"
          type="text"
          name="description"
          size="40"
        >
        <br>Start:
        <input
          v-model="startdate"
          type="text"
          name="startdate"
          size="40"
        >
        <br>End:
        <input
          v-model="enddate"
          type="text"
          name="enddate"
          size="40"
        >
        <br>Notes:
        <textarea
          v-model="notes"
          rows="5"
          cols="40"
        />
        <br>
        <button
          class="button is-primary"
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
      startdate: '',
      enddate: '',
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
      this.startdate = this.formatDate(response.data.startdate)
      this.enddate = this.formatDate(response.data.enddate)
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
  width: 500px;
  margin: auto;
}
.center {
  text-align: center;
}
.content {
  text-align: right;
}
</style>
