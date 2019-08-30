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
        <option value="Companies">
          Companies
        </option>
        <option value="Projects">
          Projects
        </option>
        <option value="Purchases">
          Purchases
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
        <option value="Companies">
          Companies
        </option>
        <option value="Projects">
          Projects
        </option>
        <option value="Purchases">
          Purchases
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
    <hr>
    <b-field label="Create Report">
      <b-select
        v-model="reportType"
        placeholder="Select a report"
      >
        <option value="Projects">
          Projects
        </option>
        <option value="Purchases">
          Purchases
        </option>
      </b-select>
    </b-field>
    <a
      href="#"
      @click="createPdf()"
    >
      <b-icon
        icon="printer"
        size="is-medium"
        type="is-dark"
      />
    </a>
  </section>
</template>
<script>
import PpService from '../services/PpService'
import moment from 'moment'
import * as JsPDF from 'jspdf'
import 'jspdf-autotable'
export default {
  name: 'Admix',
  data () {
    return {
      action: null,
      file: null,
      fileExportType: null,
      fileImportType: null,
      fileFormat: null,
      reportType: null,
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
            this.data = 'ID,Update,Num,Date,Store,Item,Manufacturer,Unitcost,Qty,Project,Description,Notes\n'
            this.fileName = 'purchases.csv'
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ',i,' +
                this.documents[i].num +
                ',' +
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
          this.fileImportType = null
          this.$router.push({
            name: 'Mcolist'
          })
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
          this.fileImportType = null
          this.$router.push({
            name: 'Projlist'
          })
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
                num: purDoc[2],
                date: purDoc[3],
                store: purDoc[4],
                item: purDoc[5],
                desciption: this.documents[1],
                manufacturer: purDoc[6],
                unitcost: purDoc[7],
                qty: purDoc[8],
                project: purDoc[9],
                notes: this.documents[3]
              })
            } else if (purDoc[1] === 'u') {
              await PpService.updatePur({
                id: purDoc[0],
                num: purDoc[2],
                date: purDoc[3],
                store: purDoc[4],
                item: purDoc[5],
                desciption: this.documents[1],
                manufacturer: purDoc[6],
                unitcost: purDoc[7],
                qty: purDoc[8],
                project: purDoc[9],
                notes: this.documents[3]
              })
            }
          }
          this.fileImportType = null
          this.$router.push({
            name: 'Purlist'
          })
        }
      }
      this.action = null
      this.fileRead = null
      this.file = null
    },
    async createPdf (reportType) {
      // http://raw.githack.com/MrRio/jsPDF/master/docs/index.html
      // https://github.com/simonbengtsson/jsPDF-AutoTable
      function Projrow (title, type, startdate, enddate, description, notes) {
        this.title = title
        this.type = type
        this.startdate = startdate
        this.enddate = enddate
        this.description = description
        this.notes = notes
      }
      function Purrow (num, date, store, item, desciption, manufacturer, unitcost, qty, notes, extendcost) {
        this.num = num
        this.date = date
        this.store = store
        this.item = item
        this.desciption = desciption
        this.manufacturer = manufacturer
        this.unitcost = unitcost
        this.qty = qty
        this.notes = notes
        this.extendcost = extendcost
      }
      switch (this.reportType) {
        case 'Purchases': {
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
          })
          var totalcost = 0
          var extendcost = 0
          this.response = await PpService.fetchPurlist()
          this.documents = this.response.data.purchases
          var i = 0
          var purrows = []
          for (i = 0; i < this.documents.length; i++) {
            extendcost = this.documents[i].unitcost * this.documents[i].qty
            totalcost += extendcost
            purrows[i] = new Purrow(
              this.documents[i].num,
              this.formatDate(this.documents[i].date),
              this.documents[i].store,
              this.documents[i].item,
              this.documents[i].desciption,
              this.documents[i].manufacturer,
              formatter.format(this.documents[i].unitcost),
              this.documents[i].qty,
              this.documents[i].notes,
              this.documents[i].extendcost = formatter.format(extendcost)
            )
          }
          var columns = [
            { title: '#', dataKey: 'num' },
            { title: 'Date', dataKey: 'date' },
            { title: 'Store', dataKey: 'store' },
            { title: 'Item', dataKey: 'item' },
            { title: 'Description', dataKey: 'desciption' },
            { title: 'Manufacturer', dataKey: 'manufacturer' },
            { title: 'Cost', dataKey: 'unitcost' },
            { title: 'Qty', dataKey: 'qty' },
            { title: 'Total', dataKey: 'extendcost' },
            { title: 'Notes', dataKey: 'notes' }
          ]
          var doc = new JsPDF('l', 'pt')
          doc.text('Purchases Report', 350, 30)
          doc.autoTable(columns, purrows, {
            styles: { cellPadding: 3, fontSize: 9 },
            theme: 'striped',
            didDrawPage: function (data) {
              // Footer
              var str = 'Page ' + doc.internal.getNumberOfPages()
              console.log(doc.internal.getNumberOfPages())
              doc.setFontSize(9)
              var pageSize = doc.internal.pageSize
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
              doc.text(str, data.settings.margin.left, pageHeight - 10)
            },
            margin: { top: 50 }
          })
          var finalY = doc.previousAutoTable.finalY
          doc.setFontSize(10)
          var summary = 'The number purchases made was ' + this.documents.length + ' for a total cost of ' + formatter.format(totalcost)
          doc.text(summary, 100, finalY + 20)
          doc.save('purchases.pdf')
          break
        }
        case 'Projects': {
          this.response = await PpService.fetchProjlist()
          this.documents = this.response.data.projects
          i = 0
          var projrows = []
          for (i = 0; i < this.documents.length; i++) {
            projrows[i] = new Projrow(
              this.documents[i].title,
              this.documents[i].type,
              this.formatDate(this.documents[i].startdate),
              this.formatDate(this.documents[i].enddate),
              this.documents[i].description,
              this.documents[i].notes)
          }
          columns = [
            { title: 'Title', dataKey: 'title' },
            { title: 'Type', dataKey: 'type' },
            { title: 'Start', dataKey: 'startdate' },
            { title: 'Finish', dataKey: 'enddate' },
            { title: 'Description', dataKey: 'description' },
            { title: 'Notes', dataKey: 'notes' }
          ]
          doc = new JsPDF('l', 'pt')
          doc.text('Projects Report', 350, 30)
          // @ts-ignore
          doc.autoTable(columns, projrows, {
            styles: { cellPadding: 3, fontSize: 9 },
            columnStyles: {
              1: { cellWidth: 80 },
              2: { cellWidth: 45 },
              3: { cellWidth: 45 }
            },
            theme: 'striped',
            margin: { top: 50 }
          })
          doc.save('projects.pdf')
        }
      }
      this.reportType = null
    },
    formatDate (unformatDate) {
      if (unformatDate === null || unformatDate === '') {
        return ''
      } else {
        return moment.utc(unformatDate).format('MM/DD/YY')
      }
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
