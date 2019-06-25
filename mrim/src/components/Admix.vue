<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Admin Import Export
      </p>
    </div>File to export:
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
    <v-select
      v-model="action"
      :options="actions"
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
import RsService from '../services/RsService'
// import FileReader from "FileReader";
export default {
  name: 'Admix',
  data () {
    return {
      options: ['Json', 'CSV'],
      selected: ['AAR Codes', 'Companies', 'Images', 'Rolling Stock'],
      actions: ['Add', 'Update'],
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
        case 'AAR Codes':
          this.response = await RsService.fetchAarlist()
          this.documents = this.response.data.aarCodes
          if (this.fileFormat === 'Json') {
            this.fileName = 'aarCodes.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'AAR Code,RS Type,Description\n'
            this.fileName = 'aarCodes.csv'
            var i
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i].aarCode +
                ',' +
                this.documents[i].rollingstockType +
                ',"' +
                this.documents[i].description +
                '"\n'
            }
          }
          break
        case 'Companies':
          this.response = await RsService.fetchColist()
          this.documents = this.response.data.industries
          if (this.fileFormat === 'Json') {
            this.fileName = 'companies.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'Short Name,Long Name,Type,Location\n'
            this.fileName = 'companies.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i].shortName +
                ',' +
                this.documents[i].longName +
                ',' +
                this.documents[i].industryType +
                ',"' +
                this.documents[i].industryLocation +
                '"\n'
            }
          }
          break
        case 'Images':
          this.response = await RsService.fetchImglist()
          this.documents = this.response.data.images
          if (this.fileFormat === 'Json') {
            this.fileName = 'images.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'Title,File Name,Notes\n'
            this.fileName = 'images.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i].title +
                ',' +
                this.documents[i].fileName +
                ',"' +
                this.documents[i].notes +
                '"\n'
            }
          }
          break
        case 'Rolling Stock':
          this.response = await RsService.fetchAllRslist()
          this.documents = this.response.data.rollingstocks
          if (this.fileFormat === 'Json') {
            this.fileName = 'rollingstocks.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data =
              'Road Name,Road Number,Color,AAR Code,Description,Builder,Built Date,Number Built'
            this.data +=
              ',In Service Date,Inside Length,Inside Height,Inside Width,Capacity,Weight Empty,Load Limit'
            this.data +=
              ',Last Maint Date,RS Status,Home Location,Location Now,Image ID,Model Weight,Model Length,RFID,Notes\n'
            this.fileName = 'rollingstocks.csv'
            for (i = 0; i < this.documents.length; i++) {
              if (this.documents[i].bltDate === null) {
                this.documents[i].bltDate = ''
              }
              if (this.documents[i].inSvcDate === null) {
                this.documents[i].inSvcDate = ''
              }
              if (this.documents[i].lastMaintDate === null) {
                this.documents[i].lastMaintDate = ''
              }
              this.data +=
                this.documents[i].roadName +
                ',' +
                this.documents[i].roadNumber +
                ',' +
                this.documents[i].color +
                ',' +
                this.documents[i].aarCode +
                ',' +
                this.documents[i].description +
                ',' +
                this.documents[i].bldr +
                ',' +
                this.documents[i].bltDate +
                ',' +
                this.documents[i].numberBlt +
                ',' +
                this.documents[i].inSvcDate +
                ',' +
                this.documents[i].insideLength +
                ',' +
                this.documents[i].insideHeight +
                ',' +
                this.documents[i].insideWidth +
                ',' +
                this.documents[i].capacity +
                ',' +
                this.documents[i].ltWeight +
                ',' +
                this.documents[i].loadLimit +
                ',' +
                this.documents[i].lastMaintDate +
                ',' +
                this.documents[i].rsStatus +
                ',' +
                this.documents[i].homeLocation +
                ',' +
                this.documents[i].locationNow +
                ',' +
                this.documents[i].imageID +
                ',' +
                this.documents[i].modelWeight +
                ',' +
                this.documents[i].modelLength +
                ',' +
                this.documents[i].rfid +
                ',"' +
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
        case 'AAR Codes': {
          var aarDoc = []
          var collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          if (this.action === 'Add') {
            var i = 0
            for (i = 1; i < collection.length; i++) {
              this.documents = collection[i].split('"')
              aarDoc = this.documents[0].split(',')
              await RsService.addAar({
                aarCode: aarDoc[0],
                rollingstockType: aarDoc[1],
                description: this.documents[1]
              })
            }
          } else {
            for (i = 1; i < collection.length - 1; i++) {
              this.documents = collection[i].split('"')
              aarDoc = this.documents[0].split(',')
              console.log(i + ' ' + aarDoc[0])
              const aarId = await RsService.getAarByCode(aarDoc[0])
              if (aarId.data._id === undefined) {
                console.log('we be adding this as a new document')
                await RsService.addAar({
                  aarCode: aarDoc[0],
                  rollingstockType: aarDoc[1],
                  description: this.documents[1]
                })
              } else {
                await RsService.updateAar({
                  id: aarId.data._id,
                  aarCode: aarDoc[0],
                  rollingstockType: aarDoc[1],
                  description: this.documents[1]
                })
              }
            }
          }
          break
        }
        case 'Companies': {
          var coDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          if (this.action === 'Add') {
            for (i = 1; i < collection.length; i++) {
              this.documents = collection[i].split('"')
              coDoc = this.documents[0].split(',')
              await RsService.addCo({
                shortName: coDoc[0],
                longName: coDoc[1],
                industryType: coDoc[2],
                industryLocation: this.documents[1]
              })
            }
          } else {
            for (i = 1; i < collection.length - 1; i++) {
              this.documents = collection[i].split('"')
              coDoc = this.documents[0].split(',')
              console.log(i + ' ' + coDoc[0])
              const coId = await RsService.getCoByName(coDoc[0])
              if (coId.data._id === undefined) {
                console.log('we be adding this as a new document')
                await RsService.addCo({
                  shortName: coDoc[0],
                  longName: coDoc[1],
                  industryType: coDoc[2],
                  industryLocation: this.documents[1]
                })
              } else {
                await RsService.updateCo({
                  id: coId.data._id,
                  shortName: coDoc[0],
                  longName: coDoc[1],
                  industryType: coDoc[2],
                  industryLocation: this.documents[1]
                })
              }
            }
          }
          break
        }
        case 'Images': {
          var imgDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          if (this.action === 'Add') {
            for (i = 1; i < collection.length; i++) {
              this.documents = collection[i].split('"')
              imgDoc = this.documents[0].split(',')
              await RsService.addImg({
                title: imgDoc[0],
                fileName: imgDoc[1],
                notes: this.documents[1]
              })
            }
          } else {
            for (i = 1; i < collection.length - 1; i++) {
              this.documents = collection[i].split('"')
              imgDoc = this.documents[0].split(',')
              console.log(i + ' ' + imgDoc[1])
              const imgId = await RsService.getImgByFile(imgDoc[1])
              if (imgId.data._id === undefined) {
                console.log('we be adding this as a new document')
                await RsService.addImg({
                  title: imgDoc[0],
                  fileName: imgDoc[1],
                  notes: this.documents[1]
                })
              } else {
                await RsService.updateImg({
                  id: imgId.data._id,
                  title: imgDoc[0],
                  fileName: imgDoc[1],
                  notes: this.documents[1]
                })
              }
            }
          }
          console.log('loading file....Images')
          break
        }
        case 'Rolling Stock': {
          var rsDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          if (this.action === 'Add') {
            for (i = 1; i < collection.length; i++) {
              this.documents = collection[i].split('"')
              rsDoc = this.documents[0].split(',')
              await RsService.addRs({
                roadName: rsDoc[0],
                roadNumber: rsDoc[1],
                color: rsDoc[2],
                aarCode: rsDoc[3],
                description: rsDoc[4],
                bldr: rsDoc[5],
                bltDate: rsDoc[6],
                numberBlt: rsDoc[7],
                inSvcDate: rsDoc[8],
                insideLength: rsDoc[9],
                insideHeight: rsDoc[10],
                insideWidth: rsDoc[11],
                capacity: rsDoc[12],
                ltWeight: rsDoc[13],
                loadLimit: rsDoc[14],
                lastMaintDate: rsDoc[15],
                locationNow: rsDoc[16],
                homeLocation: rsDoc[17],
                rsStatus: rsDoc[18],
                imageID: rsDoc[19],
                modelWeight: rsDoc[20],
                modelLength: rsDoc[21],
                rfid: rsDoc[22],
                notes: this.documents[1]
              })
            }
          } else {
            console.log(collection.length)
            for (i = 1; i < collection.length - 1; i++) {
              this.documents = collection[i].split('"')
              rsDoc = this.documents[0].split(',')
              const rsId = await RsService.getRsRoad(rsDoc[0] + '-' + rsDoc[1])
              if (rsId.data._id === undefined) {
                console.log('we be adding this as a new document')
                await RsService.addRs({
                  roadName: rsDoc[0],
                  roadNumber: rsDoc[1],
                  color: rsDoc[2],
                  aarCode: rsDoc[3],
                  description: rsDoc[4],
                  bldr: rsDoc[5],
                  bltDate: rsDoc[6],
                  numberBlt: rsDoc[7],
                  inSvcDate: rsDoc[8],
                  insideLength: rsDoc[9],
                  insideHeight: rsDoc[10],
                  insideWidth: rsDoc[11],
                  capacity: rsDoc[12],
                  ltWeight: rsDoc[13],
                  loadLimit: rsDoc[14],
                  lastMaintDate: rsDoc[15],
                  locationNow: rsDoc[16],
                  homeLocation: rsDoc[17],
                  rsStatus: rsDoc[18],
                  imageID: rsDoc[19],
                  modelWeight: rsDoc[20],
                  modelLength: rsDoc[21],
                  rfid: rsDoc[22],
                  notes: this.documents[1]
                })
              } else {
                await RsService.updateRs({
                  id: rsId.data._id,
                  roadName: rsDoc[0],
                  roadNumber: rsDoc[1],
                  color: rsDoc[2],
                  aarCode: rsDoc[3],
                  description: rsDoc[4],
                  bldr: rsDoc[5],
                  bltDate: rsDoc[6],
                  numberBlt: rsDoc[7],
                  inSvcDate: rsDoc[8],
                  insideLength: rsDoc[9],
                  insideHeight: rsDoc[10],
                  insideWidth: rsDoc[11],
                  capacity: rsDoc[12],
                  ltWeight: rsDoc[13],
                  loadLimit: rsDoc[14],
                  lastMaintDate: rsDoc[15],
                  locationNow: rsDoc[16],
                  homeLocation: rsDoc[17],
                  rsStatus: rsDoc[18],
                  imageID: rsDoc[19],
                  modelWeight: rsDoc[20],
                  modelLength: rsDoc[21],
                  rfid: rsDoc[22],
                  notes: this.documents[1]
                })
                console.log('we be updating existing document')
              }
            }
          }
          console.log('loading file....Rolling Stock')
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
  width: 650px;
  padding: 10px;
}
.center {
  text-align: center;
}
</style>
