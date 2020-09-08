<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Generate Reports
      </p>
      <br>
      <br>
    </div>
    <div class="columns">
      <div class="column">
        <div class="ax">
          Print Rolling Stock sorted by
        </div>
        <br>
        <br>
        <br>
      </div>
      <div class="column is-narrow">
        <b-select
          v-model="sortType"
          placeholder="Select a column"
        >
          <option value="roadnames">
            Road Names
          </option>
          <option value="aar">
            AAR Codes
          </option>
          <option value="status">
            Status
          </option>
        </b-select>
        <br>
        <br>
        <br>
      </div>
      <div class="column is-narrow">
        <b-select
          v-model="breakType"
          placeholder="Select break"
        >
          <option value="continuous">
            Continuous
          </option>
          <option value="tablebreaks">
            Table Breaks
          </option>
          <option value="pagebreaks">
            Page Breaks
          </option>
        </b-select>
        <div class="ax">
          Print AAR Codes<br>
        </div>
        <div class="ax">
          Print Companies<br>
        </div>
        <div class="ax">
          Print Images<br>
        </div>
        <div class="ax">
          Print RFID<br>
        </div>
      </div>
      <div class="column is-narrow">
        <a
          href="#"
          @click="printRollingstock()"
        >
          <b-icon
            icon="printer"
            size="is-medium"
            type="is-dark"
          />
        </a>
        <br>
        <a
          href="#"
          @click="printAarCodes()"
        >
          <b-icon
            icon="printer"
            size="is-medium"
            type="is-dark"
          />
        </a>
        <br>
        <a
          href="#"
          @click="printCompanies()"
        >
          <b-icon
            icon="printer"
            size="is-medium"
            type="is-dark"
          />
        </a>
        <br>
        <a
          href="#"
          @click="printImages()"
        >
          <b-icon
            icon="printer"
            size="is-medium"
            type="is-dark"
          />
        </a>
        <br>
        <a
          href="#"
          @click="printRfids()"
        >
          <b-icon
            icon="printer"
            size="is-medium"
            type="is-dark"
          />
        </a>
      </div>
    </div>
  </section>
</template>
<script>
import RsService from '../services/RsService'
import moment from 'moment'
// import * as JsPDF from 'jspdf'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
export default {
  name: 'Report',
  data () {
    return {
      sortType: null,
      breakType: null,
      response: null,
      documents: [],
      data: null,
      strArray: [],
      collection: []
    }
  },
  methods: {
    async printAarCodes () {
      function Aarrow (aarCode, rollingstockType, description) {
        this.aarCode = aarCode
        this.rollingstockType = rollingstockType
        this.description = description
      }
      var i = 0
      this.response = await RsService.fetchAarlist()
      this.documents = this.response.data.aarCodes
      var aarrows = []
      for (i = 0; i < this.documents.length; i++) {
        aarrows[i] = new Aarrow(
          this.documents[i].aarCode,
          this.documents[i].rollingstockType,
          this.documents[i].description)
      }
      var columns = [
        { header: 'AAR', dataKey: 'aarCode' },
        { header: 'RS Type', dataKey: 'rollingstockType' },
        { header: 'Description', dataKey: 'description' }
      ]
      var doc = new jsPDF('l', 'pt')
      doc.text('AAR Codes Report', 350, 30)
      // @ts-ignore
      doc.autoTable({
        columns: columns,
        body: aarrows,
        styles: { cellPadding: 3, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 80 }
        },
        theme: 'striped',
        margin: { top: 50 }
      })
      doc.save('aarcodes.pdf')
    },
    async printCompanies () {
      function Corow (shortName, longName, industryType, industryLocation) {
        this.shortName = shortName
        this.longName = longName
        this.industryType = industryType
        this.industryLocation = industryLocation
      }
      var i = 0
      this.response = await RsService.fetchColist()
      this.documents = this.response.data.industries
      var corows = []
      for (i = 0; i < this.documents.length; i++) {
        corows[i] = new Corow(
          this.documents[i].shortName,
          this.documents[i].longName,
          this.documents[i].industryType,
          this.documents[i].industryLocation)
      }
      var columns = [
        { header: 'Title', dataKey: 'shortName' },
        { header: 'Name', dataKey: 'longName' },
        { header: 'Type', dataKey: 'industryType' },
        { header: 'Location', dataKey: 'industryLocation' }
      ]
      var doc = new jsPDF('l', 'pt')
      doc.text('Companies Report', 350, 30)
      // @ts-ignore
      doc.autoTable({
        columns: columns,
        body: corows,
        styles: { cellPadding: 3, fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 60 }
        },
        theme: 'striped',
        margin: { top: 50 }
      })
      doc.save('companies.pdf')
    },
    async printImages () {
      var i = 0
      var y = 70
      this.response = await RsService.fetchImglist()
      this.documents = this.response.data.images
      var doc = new jsPDF('p', 'pt')
      var height = doc.internal.pageSize.height
      doc.text('Images Report', 250, 30)
      doc.setFontSize(10)
      for (i = 0; i < this.documents.length; i++) {
        var imageURL = './static/img/' + this.documents[i].fileName
        var imageData = await this.loadImg(imageURL)
        var h = imageData.height / (imageData.width / 275)
        if (y + h > height - 50) {
          doc.addPage()
          y = 70
        }
        doc.addImage(imageData.imgData, 'JPEG', 290, y, 275, h, undefined, 'NONE')
        console.log(y)
        doc.text('Title: ' + this.documents[i].title, 50, y)
        doc.text('File: ' + this.documents[i].fileName, 50, y + 20)
        doc.text('Notes: ' + this.documents[i].notes, 50, y + 40)
        y = y + 20 + h
      }
      doc.save('images.pdf')
    },
    async loadImg (url) {
      var rsimage = null
      function RSImage (imgData, height, width) {
        this.imgData = imgData
        this.height = height
        this.width = width
      }
      function toDataURL (url) {
        return new Promise(function (resolve, reject) {
          var img = new Image()
          img.onError = function () {
            reject(Error('Cannot load image: "' + url + '"'))
          }
          img.onload = async function () {
            var canvas = document.createElement('canvas')
            var context = canvas.getContext('2d')
            canvas.height = this.naturalHeight
            canvas.width = this.naturalWidth
            context.drawImage(this, 0, 0)
            var imgObject = new RSImage(canvas.toDataURL('image/jpeg'), this.naturalHeight, this.naturalWidth)
            resolve(imgObject)
          }
          img.src = url
        })
      }
      await toDataURL(url).then(function (response) {
        rsimage = new RSImage(response.imgData, response.height, response.width)
      }, function (error) {
        console.error('Failed!', error)
      })
      return rsimage
    },
    async printRollingstock () {
      function Rsrow (roadName, roadNumber, color, aarCode, description, capacity, bldr, bltDate, ltWeight, loadLimit, lastMaintDate, rsStatus) {
        this.roadName = roadName
        this.roadNumber = roadNumber
        this.color = color
        this.aarCode = aarCode
        this.description = description
        this.capacity = capacity
        this.bldr = bldr
        this.bltDate = bltDate
        this.ltWeight = ltWeight
        this.loadLimit = loadLimit
        this.lastMaintDate = lastMaintDate
        this.rsStatus = rsStatus
      }
      var i = 0
      var j = 0
      var title = 'Rolling Stock Report by '
      var byTitle = 'Road Name'
      var uniques = null
      var somerows = []
      this.response = await RsService.fetchAllRslist()
      this.documents = this.response.data.rollingstocks
      var rsrows = []
      for (i = 0; i < this.documents.length; i++) {
        rsrows[i] = new Rsrow(
          this.documents[i].roadName,
          this.documents[i].roadNumber,
          this.documents[i].color,
          this.documents[i].aarCode,
          this.documents[i].description,
          this.documents[i].capacity,
          this.documents[i].bldr,
          this.formatDate(this.documents[i].bltDate),
          this.documents[i].ltWeight,
          this.documents[i].loadLimit,
          this.formatDate(this.documents[i].lastMaintDate),
          this.documents[i].rsStatus)
      }
      var columns = [
        { header: 'Road', dataKey: 'roadName' },
        { header: 'Number', dataKey: 'roadNumber' },
        { header: 'AAR', dataKey: 'aarCode' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Color', dataKey: 'color' },
        { header: 'Builder', dataKey: 'bldr' },
        { header: 'Built', dataKey: 'bltDate' },
        { header: 'Capacity', dataKey: 'capacity' },
        { header: 'Empty', dataKey: 'ltWeight' },
        { header: 'Max', dataKey: 'loadLimit' },
        { header: 'Maintenance', dataKey: 'lastMaintDate' },
        { header: 'Status', dataKey: 'rsStatus' }
      ]
      if (this.sortType === 'aar') {
        byTitle = 'AAR Code'
        rsrows.sort(function (a, b) {
          var aarCodeA = a.aarCode
          var aarCodeB = b.aarCode
          if (aarCodeA < aarCodeB) {
            return -1
          }
          if (aarCodeA > aarCodeB) {
            return 1
          }
          return 0
        })
      } if (this.sortType === 'status') {
        byTitle = 'RS Status'
        rsrows.sort(function (a, b) {
          var rsStatusA = a.rsStatus
          var rsStatusB = b.rsStatus
          if (rsStatusA < rsStatusB) {
            return -1
          }
          if (rsStatusA > rsStatusB) {
            return 1
          }
          return 0
        })
      }
      var doc = new jsPDF('l', 'pt')
      var newTitle = title + byTitle
      doc.text(newTitle, 350, 30)
      if (this.breakType === 'continuous') {
        // @ts-ignore
        doc.autoTable({
          columns: columns,
          body: rsrows,
          styles: { cellPadding: 3, fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 40 }
          },
          theme: 'striped',
          didDrawPage: function (data) {
            // Footer
            var str = 'Page ' + doc.internal.getNumberOfPages()
            doc.setFontSize(9)
            var pageSize = doc.internal.pageSize
            var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
            doc.text(str, data.settings.margin.left, pageHeight - 10)
          },
          margin: { top: 50 }
        })
      } else {
        if (this.sortType === 'roadnames') {
          this.response = await RsService.fetchUniqueRoadNames()
          uniques = this.response.data.roadnames
        } else if (this.sortType === 'aar') {
          this.response = await RsService.fetchUniqueAarCodes()
          uniques = this.response.data.aarcodes
        } else {
          this.response = await RsService.fetchUniqueStatuses()
          uniques = this.response.data.opstatuses
        }
        var k = 0
        for (i = 0; i < uniques.length; i++) {
          for (j = 0; j < rsrows.length; j++) {
            if ((this.sortType === 'roadnames' && rsrows[j].roadName === uniques[i]) ||
              (this.sortType === 'aar' && rsrows[j].aarCode === uniques[i]) ||
              (this.sortType === 'status' && rsrows[j].rsStatus === uniques[i])) {
              somerows[k] = new Rsrow(
                rsrows[j].roadName,
                rsrows[j].roadNumber,
                rsrows[j].color,
                rsrows[j].aarCode,
                rsrows[j].description,
                rsrows[j].capacity,
                rsrows[j].bldr,
                rsrows[j].bltDate,
                rsrows[j].ltWeight,
                rsrows[j].loadLimit,
                rsrows[j].lastMaintDate,
                rsrows[j].rsStatus)
              k++
            }
          }
          doc.autoTable(columns, somerows, {
            styles: { cellPadding: 3, fontSize: 9 },
            columnStyles: {
              0: { cellWidth: 40 }
            },
            theme: 'striped',
            didDrawPage: function (data) {
            // Footer
              var str = 'Page ' + doc.internal.getNumberOfPages()
              doc.setFontSize(9)
              var pageSize = doc.internal.pageSize
              var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
              doc.text(str, data.settings.margin.left, pageHeight - 10)
            },
            margin: { top: 50 }
          })
          if (this.breakType === 'pagebreaks' && i < uniques.length - 1) {
            doc.addPage()
          }
          k = 0
          somerows = []
        }
      }
      doc.save('rollingstock.pdf')
      this.sortType = null
      this.breakType = null
    },
    async printRfids () {
      function Rsrow (roadName, roadNumber, color, aarCode, description, rfid) {
        this.roadName = roadName
        this.roadNumber = roadNumber
        this.color = color
        this.aarCode = aarCode
        this.description = description
        this.rfid = rfid
      }
      var i = 0
      this.response = await RsService.fetchAllRslist()
      this.documents = this.response.data.rollingstocks
      var rsrows = []
      for (i = 0; i < this.documents.length; i++) {
        rsrows[i] = new Rsrow(
          this.documents[i].roadName,
          this.documents[i].roadNumber,
          this.documents[i].color,
          this.documents[i].aarCode,
          this.documents[i].description,
          this.documents[i].rfid)
      }
      var columns = [
        { header: 'RFID', dataKey: 'rfid' },
        { header: 'Road', dataKey: 'roadName' },
        { header: 'Number', dataKey: 'roadNumber' },
        { header: 'Color', dataKey: 'color' },
        { header: 'AAR', dataKey: 'aarCode' },
        { header: 'Description', dataKey: 'description' }
      ]
      var doc = new jsPDF('p', 'pt')
      doc.text('RFID Report', 220, 30)
      // @ts-ignore
      doc.autoTable({
        columns: columns,
        body: rsrows,
        styles: { cellPadding: 3, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 70 }
        },
        theme: 'striped',
        didDrawPage: function (data) {
          // Footer
          var str = 'Page ' + doc.internal.getNumberOfPages()
          doc.setFontSize(9)
          var pageSize = doc.internal.pageSize
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
          doc.text(str, data.settings.margin.left, pageHeight - 10)
        },
        margin: { top: 50 }
      })
      doc.save('rfid.pdf')
      this.sortType = null
      this.breakType = null
    },
    formatDate (unformatDate) {
      if (unformatDate === null || unformatDate === '') {
        return ''
      } else {
        return moment.utc(unformatDate).format('YYYY/MM/DD')
      }
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
.ax {
  padding-top: 6px;
  padding-bottom: 6px;
}
.center {
  text-align: center;
}
</style>
