<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Admin Import Export
      </p>
    </div>
    <b-field label="File Type to Export">
      <b-select
        v-model="fileExportType"
        placeholder="Select a file"
      >
        <option value="Micros">
          Micro Controllers
        </option>
        <option value="Turnouts">
          Turnouts
        </option>
      </b-select>
    </b-field>
    <b-field label="File Format">
      <b-select
        v-model="fileFormat"
        placeholder="Select a format"
      >
        <option value="Json">
          Json
        </option>
        <option value="CSV">
          CSV
        </option>
      </b-select>
    </b-field>
    <a
      href="#"
      @click="saveFile()"
    >
      <b-icon
        icon="content-save"
        size="is-medium"
        type="is-dark"
      />
    </a>
    <hr>
    <b-field label="File Type to Import">
      <b-select
        v-model="fileImportType"
        placeholder="Select a file"
      >
        <option value="Micros">
          Micro Controllers
        </option>
        <option value="Turnouts">
          Turnouts
        </option>
      </b-select>
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
    <a
      href="#"
      @click="loadFile()"
    >
      <b-icon
        icon="upload"
        size="is-medium"
        type="is-dark"
      />
    </a>
  </section>
</template>
<script>
import RsService from '../services/RsService'
export default {
  name: 'Admix',
  data () {
    return {
      action: null,
      file: null,
      fileExportType: null,
      fileImportType: null,
      fileFormat: null,
      response: null,
      documents: [],
      data: null,
      fileName: '',
      fileContent: '',
      fileRead: null
    }
  },
  methods: {
    async saveFile () {
      switch (this.fileExportType) {
        case 'Micros':
          this.response = await RsService.fetchMicroList()
          this.documents = this.response.data.micros
          if (this.fileFormat === 'Json') {
            this.fileName = 'micros.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'Id,Update,Name,IP,Last Update,Purpose\n'
            this.fileName = 'micros.csv'
            var i
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
                this.documents[i].microID +
                ',' +
                this.documents[i].microIP +
                ',' +
                this.documents[i].et +
                ',"' +
                this.documents[i].purpose +
                '"\n'
            }
          }
          break
        case 'Turnouts':
          this.response = await RsService.fetchToList()
          this.documents = this.response.data.turnouts
          if (this.fileFormat === 'Json') {
            this.fileName = 'turnouts.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'Id,Update,Name,Controller,Number,Type,State,Lock,Last Update,Notes\n'
            this.fileName = 'turnouts.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
                this.documents[i].toID +
                ',' +
                this.documents[i].controller +
                ',' +
                this.documents[i].toNum +
                ',' +
                this.documents[i].type +
                ',' +
                this.documents[i].state +
                ',' +
                this.documents[i].lock +
                ',' +
                this.documents[i].lastUpdate +
                ',"' +
                this.documents[i].notes +
                '"\n'
            }
          }
      }
      const blob = new Blob([this.data], { type: 'text/plain' })
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      a.download = this.fileName
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      a.dispatchEvent(e)
      this.fileExportType = null
      this.fileFormat = null
      this.fileType = null
    },
    async loadFile () {
      const getFileContent = inputFile => {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
          reader.onerror = () => {
            reader.abort()
            reject(new DOMException('Problem parsing input file.'))
          }
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.readAsText(inputFile)
        })
      }
      this.fileContent = await getFileContent(this.file)
      switch (this.fileImportType) {
        case 'Micros': {
          var i = 0
          var microDoc = []
          var collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            microDoc = this.documents[0].split(',')
            if (microDoc[1] === 'a') {
              await RsService.addMicro({
                microID: microDoc[2],
                microIP: microDoc[3],
                et: microDoc[4],
                purpose: this.documents[1]
              })
            } else if (microDoc[1] === 'u') {
              await RsService.updateMicro({
                id: microDoc[0],
                microID: microDoc[2],
                microIP: microDoc[3],
                et: microDoc[4],
                purpose: this.documents[1]
              })
            }
          }
          this.fileImportType = null
          this.$router.push({
            name: 'MicroList'
          })
          break
        }
        // eslint-disable-next-line no-lone-blocks
        case 'Turnouts': {
          var toDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            toDoc = this.documents[0].split(',')
            if (toDoc[1] === 'a') {
              await RsService.addTo({
                toID: toDoc[2],
                controller: toDoc[3],
                toNum: toDoc[4],
                type: toDoc[5],
                state: toDoc[6],
                lock: toDoc[7],
                lastUpdate: toDoc[8],
                notes: this.documents[1]
              })
            } else if (toDoc[1] === 'u') {
              await RsService.updateTo({
                id: toDoc[0],
                toID: toDoc[2],
                controller: toDoc[3],
                toNum: toDoc[4],
                type: toDoc[5],
                state: toDoc[6],
                lock: toDoc[7],
                lastUpdate: toDoc[8],
                notes: this.documents[1]
              })
            }
          }
          this.fileImportType = null
          this.$router.push({
            name: 'ToList'
          })
        }
          this.action = null
          this.fileRead = null
          this.file = null
      }
    }
  }
}
</script>
<style scoped>
section {
  display: block;
  margin: auto;
  width: 250px;
  padding: 10px;
}
.center {
  text-align: center;
}
</style>
