<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Add Image
      </p>
    </div>
    <br>
    <div
      class="form"
      enctype="multipart/form-data"
    >
      <div class="content">
        Title: <input
          v-model="title"
          type="text"
          name="title"
        ><br>
        <input
          id="file"
          ref="file"
          type="file"
          accept="image/*"
          @change="handleFileUpload()"
        ><br>
        Notes: <textarea
          v-model="notes"
          rows="5"
          cols="40"
        /><br>
        <button
          class="button is-primary"
          @click="addImg"
        >
          Add Image
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import RsService from '../services/RsService'
import * as axios from 'axios'
export default {
  name: 'NewImg',
  data () {
    return {
      file: null,
      title: '',
      fileName: '',
      notes: ''
    }
  },
  methods: {
    async addImg () {
      await this.submitImg()
      await RsService.addImg({
        title: this.title,
        fileName: this.fileName,
        notes: this.notes
      })
      this.$router.push({
        name: 'Imglist'
      })
    },
    submitImg () {
      let formData = new FormData()
      formData.append('file', this.file)
      // console.log(formData);
      axios({
        method: 'POST',
        'Content-Type': 'multipart/form-data',
        baseURL: 'http://localhost:3003/uploadimg',
        data: formData
      })
        .then(function () {
          console.log('hmmm sucess')
        })
        .catch(function () {
          console.log('failed to upload')
        })
    },
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
      this.fileName = this.file.name
      console.log('done handling file in page')
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
  text-align: right;
}
</style>
