<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Admin Import Export
      </p>
    </div>
    File to export:
    <v-select
      v-model="fileType"
      :options="selected"
    />
    <v-select
      v-model="fileFormat"
      :options="options"
    />
    <a
      href="#"
      @click="saveFile()"
    >
      <b-icon
        icon="content-save"
        size="is-medium"
      />
    </a>
    <br>
    File to Import:
    <input
      id="file"
      ref="file"
      type="file"
      @change="handleFileUpload()"
    >
    <v-select
      v-model="fileRead"
      :options="selected"
    />
    <a
      href="#"
      @click="loadFile()"
    >
      <b-icon
        icon="upload"
        size="is-medium"
      />
    </a>
  </section>
</template>
<script>
import PpService from '../services/PpService'
// import FileReader from "FileReader";
export default {
  name: 'Admix',
  data () {
    return {
      options: ['Json', 'CSV'],
      selected: ['Companies', 'Projects', 'Purchases'],
      action: null,
      file: null,
      fileType: null,
      fileFormat: null,
      response: null,
      documents: [],
      images: [],
      rollingstocks: [],
      data: null,
      fileName: '',
      fileContent: '',
      strArray: [],
      collection: [],
      fileRead: null
    }
  },
  methods: {
    async saveFile () {
      switch (this.fileType) {
        case 'Companies':
          this.response = await PpService.fetchMcolist()
          this.documents = this.response.data.companies
          if (this.fileFormat === 'Json') {
            this.fileName = 'companies.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'ID,Update,Company,Type,Website,Phone,Adress,Notes\n'
            this.fileName = 'companies.csv'
            var i
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
                this.documents[i].name +
                ',' +
                this.documents[i].type +
                ',' +
                this.documents[i].website +
                ',' +
                this.documents[i].phone +
                ',"' +
                this.documents[i].address +
                '","' +
                this.documents[i].notes +
                '"\n'
            }
          }
          break
        case 'Projects':
          this.response = await PpService.fetchProjlist()
          this.documents = this.response.data.projects
          if (this.fileFormat === 'Json') {
            this.fileName = 'projects.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'ID,Update,Title,Type,Description,Start Date,End Date,Notes\n'
            this.fileName = 'projects.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
                this.documents[i].title +
                ',' +
                this.documents[i].type +
                ',' +
                this.documents[i].startdate +
                ',' +
                this.documents[i].enddate +
                ',"' +
                this.documents[i].description +
                '","' +
                this.documents[i].notes +
                '"\n'
            }
          }
          break
        case 'Purchases':
          this.response = await PpService.fetchPurlist()
          this.documents = this.response.data.purchases
          if (this.fileFormat === 'Json') {
            this.fileName = 'purchases.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'ID,Update,Date,Store,Item,Manufacturer,Unitcost,Qty,Project,Description,Notes\n'
            this.fileName = 'purchases.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
                this.documents[i].date +
                ',' +
                this.documents[i].store +
                ',' +
                this.documents[i].item +
                ',' +
                this.documents[i].manufacturer +
                ',' +
                this.documents[i].unitcost +
                ',' +
                this.documents[i].qty +
                ',' +
                this.documents[i].project +
                 ',"' +
                this.documents[i].desciption +
                '","' +
                this.documents[i].notes +
                '"\n'
            }
          }
          break
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
      this.fileFormat = null
      this.fileType = null
    },
    async loadFile () {
      console.log('trying to import data')
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
      switch (this.fileRead) {
        case 'Companies': {
          var mcoDoc = []
          var collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          var i = 0
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            console.log(this.documents[3])
            mcoDoc = this.documents[0].split(',')
            if (mcoDoc[1] === 'a') {
              await PpService.addMco({
                name: mcoDoc[2],
                type: mcoDoc[3],
                website: mcoDoc[4],
                phone: mcoDoc[5],
                address: this.documents[1],
                notes: this.documents[3]
              })
            } else if (mcoDoc[1] === 'u') {
              await PpService.updateMco({
                id: mcoDoc[0],
                name: mcoDoc[2],
                type: mcoDoc[3],
                website: mcoDoc[4],
                phone: mcoDoc[5],
                address: this.documents[1],
                notes: this.documents[3]
              })
            }
          }
          break
        }
        case 'Projects': {
          var projDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            projDoc = this.documents[0].split(',')
            if (projDoc[1] === 'a') {
              await PpService.addProj({
                title: projDoc[2],
                type: projDoc[3],
                startdate: projDoc[4],
                enddate: projDoc[5],
                description: this.documents[1],
                notes: this.documents[3]
              })
            } else if (projDoc[1] === 'u') {
              await PpService.updateProj({
                id: projDoc[0],
                title: projDoc[2],
                type: projDoc[3],
                startdate: projDoc[4],
                enddate: projDoc[5],
                description: this.documents[1],
                notes: this.documents[3]
              })
            }
          }
          break
        }
        case 'Purchases': {
          var purDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            purDoc = this.documents[0].split(',')
            if (purDoc[1] === 'a') {
              await PpService.addPur({
                date: purDoc[2],
                store: purDoc[3],
                item: purDoc[4],
                desciption: this.documents[1],
                manufacturer: purDoc[5],
                unitcost: purDoc[6],
                qty: purDoc[7],
                project: purDoc[8],
                notes: this.documents[3]
              })
            } else if (purDoc[1] === 'u') {
              await PpService.updatePur({
                id: purDoc[0],
                date: purDoc[2],
                store: purDoc[3],
                item: purDoc[4],
                desciption: this.documents[1],
                manufacturer: purDoc[5],
                unitcost: purDoc[6],
                qty: purDoc[7],
                project: purDoc[8],
                notes: this.documents[3]
              })
            }
          }
          break
        }
      }
      this.action = null
      this.fileRead = null
      this.file = null
    },
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
      console.log('got file name to load')
    }
  }
}
</script>
   <style scoped>
section {
  display: block;
  margin: auto;
  width: 350px;
  padding: 10px;
}
.center {
  text-align: center;
}
</style>
