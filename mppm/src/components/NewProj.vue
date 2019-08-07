<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Project
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
          @click="addProj"
        >
          Add Project
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import PpService from '../services/PpService'
export default {
  name: 'NewProj',
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
  methods: {
    async addProj () {
      await PpService.addProj({
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
