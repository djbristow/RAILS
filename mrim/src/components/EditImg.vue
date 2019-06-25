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
        Title: <input
          v-model="title"
          type="text"
          name="title"
        ><br>
        Filename: <input
          v-model="fileName"
          type="text"
          name="fileName"
        ><br>
      </div>
      <div class="center">
        Notes: <textarea
          v-model="notes"
          rows="5"
          cols="50"
        /><br>
        <button
          class="button is-primary"
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
