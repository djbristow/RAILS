<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Update Image
      </p>
    </div>
    <br>
    <div class="form">
      <div class="content">
        <b-field label="Title">
          <b-input v-model="title" />
        </b-field>
        <b-field label="Filename">
          <b-input v-model="fileName" />
        </b-field>
        <b-field label="Notes">
          <b-input
            v-model="notes"
            type="textarea"
          />
        </b-field>
        <button
          class="button is-light"
          @click="updateImg"
        >
          Update Image
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
export default {
  name: 'EditImg',
  data () {
    return {
      title: '',
      fileName: '',
      notes: ''
    }
  },
  mounted () {
    this.getImg()
  },
  methods: {
    async getImg () {
      const response = await RsService.getImg({
        id: this.$route.params.id
      })
      this.title = response.data.title
      this.fileName = response.data.fileName
      this.notes = response.data.notes
    },
    async updateImg () {
      await RsService.updateImg({
        id: this.$route.params.id,
        title: this.title,
        fileName: this.fileName,
        notes: this.notes
      })
      this.$router.push({
        name: 'Imglist'
      })
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
