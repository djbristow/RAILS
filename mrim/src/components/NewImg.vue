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
        <b-field label="Title">
          <b-input v-model="title" />
        </b-field>
        <b-field class="file">
          <b-upload v-model="file">
            <a class="button is-light">
              <b-icon icon="upload" />
              <span>Click to upload</span>
            </a>
          </b-upload>
          <span
            v-if="file"
            class="file-name"
          >
            {{ file.name }}
          </span>
        </b-field>
        <b-field label="Notes">
          <b-input
            v-model="notes"
            type="textarea"
          />
        </b-field>
        <button
          class="button is-light"
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
      this.fileName = this.file.name
      axios({
        method: 'POST',
        'Content-Type': 'multipart/form-data',
        baseURL: 'http://localhost:3003/uploadimg',
        data: formData
      })
        .then(function () {
          console.log('sucedded to upload')
        })
        .catch(function () {
          console.log('failed to upload')
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
