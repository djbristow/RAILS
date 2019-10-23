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
        <option value="AAR Codes">
          AAR Codes
        </option>
        <option value="Companies">
          Companies
        </option>
        <option value="Images">
          Images
        </option>
        <option value="Rolling Stock">
          Rolling Stock
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
        <option value="AAR Codes">
          AAR Codes
        </option>
        <option value="Companies">
          Companies
        </option>
        <option value="Images">
          Images
        </option>
        <option value="Rolling Stock">
          Rolling Stock
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
// import FileReader from "FileReader";
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
      switch (this.fileExportType) {
        case 'AAR Codes':
          this.response = await RsService.fetchAarlist()
          this.documents = this.response.data.aarCodes
          if (this.fileFormat === 'Json') {
            this.fileName = 'aarCodes.json'
            this.data = JSON.stringify(this.documents)
          } else {
            this.data = 'Id,Update,AAR Code,RS Type,Description\n'
            this.fileName = 'aarCodes.csv'
            var i
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
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
            this.data = 'Id,Update,Short Name,Long Name,Type,Location\n'
            this.fileName = 'companies.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
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
            this.data = 'Id,Update,Title,File Name,Notes\n'
            this.fileName = 'images.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
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
              'Id,Update,Road Name,Road Number,Color,AAR Code,Description,Builder,Built Date,Number Built'
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
                this.documents[i]._id +
                ',i,' +
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
        case 'AAR Codes': {
          var i = 0
          var aarDoc = []
          var collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            aarDoc = this.documents[0].split(',')
            if (aarDoc[1] === 'a') {
              await RsService.addAar({
                aarCode: aarDoc[2],
                rollingstockType: aarDoc[3],
                description: this.documents[1]
              })
            } else if (aarDoc[1] === 'u') {
              await RsService.updateAar({
                id: aarDoc[0],
                aarCode: aarDoc[2],
                rollingstockType: aarDoc[3],
                description: this.documents[1]
              })
            }
          }
          this.fileImportType = null
          this.$router.push({
            name: 'Aarlist'
          })
          break
        }
        case 'Companies': {
          var coDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            coDoc = this.documents[0].split(',')
            if (coDoc[1] === 'a') {
              await RsService.addCo({
                shortName: coDoc[2],
                longName: coDoc[3],
                industryType: coDoc[4],
                industryLocation: this.documents[1]
              })
            } else if (coDoc[1] === 'u') {
              await RsService.updateCo({
                id: coDoc[0],
                shortName: coDoc[2],
                longName: coDoc[3],
                industryType: coDoc[4],
                industryLocation: this.documents[1]
              })
            }
          }
          this.fileImportType = null
          this.$router.push({
            name: 'Colist'
          })
          break
        }
        case 'Images': {
          var imgDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            imgDoc = this.documents[0].split(',')
            if (imgDoc[1] === 'a') {
              await RsService.addImg({
                title: imgDoc[2],
                fileName: imgDoc[3],
                notes: this.documents[1]
              })
            } else if (imgDoc[1] === 'u') {
              await RsService.updateImg({
                id: imgDoc[0],
                title: imgDoc[2],
                fileName: imgDoc[3],
                notes: this.documents[1]
              })
            }
          }
          this.fileImportType = null
          this.$router.push({
            name: 'Imglist'
          })
          break
        }
        case 'Rolling Stock': {
          var rsDoc = []
          collection = new Blob([], { type: 'text/plain' })
          collection = this.fileContent.split('\n')
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"')
            rsDoc = this.documents[0].split(',')
            if (rsDoc[1] === 'a') {
              await RsService.addRs({
                roadName: rsDoc[2],
                roadNumber: rsDoc[3],
                color: rsDoc[4],
                aarCode: rsDoc[5],
                description: rsDoc[6],
                bldr: rsDoc[7],
                bltDate: rsDoc[8],
                numberBlt: rsDoc[9],
                inSvcDate: rsDoc[10],
                insideLength: rsDoc[11],
                insideHeight: rsDoc[12],
                insideWidth: rsDoc[13],
                capacity: rsDoc[14],
                ltWeight: rsDoc[15],
                loadLimit: rsDoc[16],
                lastMaintDate: rsDoc[17],
                locationNow: rsDoc[18],
                homeLocation: rsDoc[19],
                rsStatus: rsDoc[20],
                imageID: rsDoc[21],
                modelWeight: rsDoc[22],
                modelLength: rsDoc[23],
                rfid: rsDoc[24],
                notes: this.documents[1]
              })
            } else if (rsDoc[1] === 'u') {
              await RsService.updateRs({
                id: rsDoc[0],
                roadName: rsDoc[2],
                roadNumber: rsDoc[3],
                color: rsDoc[4],
                aarCode: rsDoc[5],
                description: rsDoc[6],
                bldr: rsDoc[7],
                bltDate: rsDoc[8],
                numberBlt: rsDoc[9],
                inSvcDate: rsDoc[10],
                insideLength: rsDoc[11],
                insideHeight: rsDoc[12],
                insideWidth: rsDoc[13],
                capacity: rsDoc[14],
                ltWeight: rsDoc[15],
                loadLimit: rsDoc[16],
                lastMaintDate: rsDoc[17],
                locationNow: rsDoc[18],
                homeLocation: rsDoc[19],
                rsStatus: rsDoc[20],
                imageID: rsDoc[21],
                modelWeight: rsDoc[22],
                modelLength: rsDoc[23],
                rfid: rsDoc[24],
                notes: this.documents[1]
              })
            }
          }
          this.fileImportType = null
          this.$router.push({
            name: 'Rslist'
          })
        }
      }
      this.action = null
      this.fileRead = null
      this.file = null
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
