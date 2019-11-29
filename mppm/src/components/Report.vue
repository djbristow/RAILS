<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Generate Reports
      </p>
    </div>
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
  name: 'Report',
  data () {
    return {
      reportType: null,
      response: null,
      documents: [],
      images: [],
      rollingstocks: [],
      data: null,
      strArray: [],
      collection: []
    }
  },
  methods: {
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
