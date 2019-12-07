<template>
  <section>
    <div class="center">
      <p class="title is-5">
        Generate Reports
      </p>
      <br>
      <br>
      <br>
    </div>
    <div class="columns">
      <div class="column">
        <div class="ax">
          Print Purchases sorted by
        </div>
        <div class="ax">
          Print Projects sorted by
        </div>
      </div>
      <div class="column is-narrow">
        <b-select
          v-model="purSortType"
          placeholder="Select a column"
        >
          <option value="proj">
            Project
          </option>
          <option value="manufacturer">
            Manufacturer
          </option>
          <option value="store">
            Store
          </option>
        </b-select>
        <b-select
          v-model="projSortType"
          placeholder="Select a column"
        >
          <option value="name">
            Name
          </option>
          <option value="startdate">
            Start Date
          </option>
          <option value="type">
            Type
          </option>
        </b-select>
      </div>
      <div class="column is-narrow">
        <b-select
          v-model="purBreakType"
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
        <b-select
          v-if="needsVisible"
          v-model="projBreakType"
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
        <div v-else>
          <br>
        </div>
      </div>
      <div class="column is-narrow">
        <a
          href="#"
          @click="printPurchases()"
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
          @click="printProjects()"
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
import PpService from '../services/PpService'
import moment from 'moment'
import * as JsPDF from 'jspdf'
import 'jspdf-autotable'
export default {
  name: 'Report',
  data () {
    return {
      projSortType: null,
      projBreakType: null,
      purSortType: null,
      purBreakType: null,
      response: null,
      documents: [],
      data: null,
      strArray: [],
      collection: []
    }
  },
  computed: {
    needsVisible: function () {
      return (this.projSortType === 'type')
    }
  },
  methods: {
    // http://raw.githack.com/MrRio/jsPDF/master/docs/index.html
    // https://github.com/simonbengtsson/jsPDF-AutoTable
    async printProjects () {
      function Projrow (title, type, startdate, enddate, description, notes) {
        this.title = title
        this.type = type
        this.startdate = startdate
        this.enddate = enddate
        this.description = description
        this.notes = notes
      }
      var i = 0
      var j = 0
      var title = 'Projects Report by '
      var byTitle = 'Name'
      var uniques = null
      var somerows = []
      this.response = await PpService.fetchProjlist()
      this.documents = this.response.data.projects
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
      var columns = [
        { title: 'Title', dataKey: 'title' },
        { title: 'Type', dataKey: 'type' },
        { title: 'Start', dataKey: 'startdate' },
        { title: 'Finish', dataKey: 'enddate' },
        { title: 'Description', dataKey: 'description' },
        { title: 'Notes', dataKey: 'notes' }
      ]
      if (this.projSortType === 'startdate') {
        byTitle = 'Start Date'
        projrows.sort(function (a, b) {
          var projDateA = a.startdate
          var projDateB = b.startdate
          if (projDateA < projDateB) {
            return -1
          }
          if (projDateA > projDateB) {
            return 1
          }
          return 0
        })
      } if (this.projSortType === 'type') {
        byTitle = 'Type'
        projrows.sort(function (a, b) {
          var projTypeA = a.type
          var projTypeB = b.type
          if (projTypeA < projTypeB) {
            return -1
          }
          if (projTypeA > projTypeB) {
            return 1
          }
          return 0
        })
      } if (this.projSortType === 'name') {
        byTitle = 'Name'
        projrows.sort(function (a, b) {
          var projNameA = a.title
          var projNameB = b.title
          if (projNameA < projNameB) {
            return -1
          }
          if (projNameA > projNameB) {
            return 1
          }
          return 0
        })
      }
      var doc = new JsPDF('l', 'pt')
      var newTitle = title + byTitle
      doc.text(newTitle, 350, 30)
      if (this.projBreakType === 'continuous' || this.projSortType === 'name' || this.projSortType === 'startdate') {
      // @ts-ignore
        doc.autoTable(columns, projrows, {
          styles: { cellPadding: 3, fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 100 },
            1: { cellWidth: 80 },
            2: { cellWidth: 55 },
            3: { cellWidth: 55 },
            4: { cellWidth: 250 }
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
        this.response = await PpService.fetchUniqueProjectTypes()
        uniques = this.response.data.projects
        var k = 0
        for (i = 0; i < uniques.length; i++) {
          for (j = 0; j < projrows.length; j++) {
            if (projrows[j].type === uniques[i]) {
              somerows[k] = new Projrow(
                projrows[j].title,
                projrows[j].type,
                projrows[j].startdate,
                projrows[j].enddate,
                projrows[j].description,
                projrows[j].notes)
              k++
            }
          }
          doc.autoTable(columns, somerows, {
            styles: { cellPadding: 3, fontSize: 9 },
            columnStyles: {
              0: { cellWidth: 100 },
              1: { cellWidth: 80 },
              2: { cellWidth: 55 },
              3: { cellWidth: 55 },
              4: { cellWidth: 250 }
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
          if (this.projBreakType === 'pagebreaks' && i < uniques.length - 1) {
            doc.addPage()
          }
          k = 0
          somerows = []
        }
      }
      doc.save('projects.pdf')
      this.projBreakType = null
      this.projSortType = null
    },
    async printPurchases () {
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
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })
      var title = 'Purchases Report by '
      var totalcost = 0
      var extendcost = 0
      var startRow = []
      var uniques = []
      var somerows = []
      var i = 0
      var j = 0
      var k = 0
      var purrows = []
      if (this.purSortType !== 'proj') {
        this.response = await PpService.fetchPurlist()
        this.documents = this.response.data.purchases
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
      }
      switch (this.purSortType) {
        case 'proj':
          this.response = await PpService.fetchUniquePurchaseProjects()
          uniques = this.response.data.purchases
          var byTitle = 'Project'
          startRow[0] = 0
          k = 0
          for (i = 0; i < uniques.length; i++) {
            this.response = await PpService.fetchPurListProj(uniques[i])
            for (j = 0; j < this.response.data.length; j++) {
              extendcost = this.response.data[j].unitcost * this.response.data[j].qty
              totalcost += extendcost
              purrows.push(new Purrow(
                this.response.data[j].num,
                this.formatDate(this.response.data[j].date),
                this.response.data[j].store,
                this.response.data[j].item,
                this.response.data[j].desciption,
                this.response.data[j].manufacturer,
                formatter.format(this.response.data[j].unitcost),
                this.response.data[j].qty,
                this.response.data[j].notes,
                this.response.data[j].extendcost = formatter.format(extendcost)
              ))
              k++
            }
            startRow[i] = k
          }
          break
        case 'manufacturer':
          this.response = await PpService.fetchUniquePurchaseManufacturer()
          uniques = this.response.data.purchases
          byTitle = 'Manufacturer'
          purrows.sort(function (a, b) {
            var purTypeA = a.manufacturer
            var purTypeB = b.manufacturer
            if (purTypeA < purTypeB) {
              return -1
            }
            if (purTypeA > purTypeB) {
              return 1
            }
            return 0
          })
          startRow[0] = 0
          for (i = 0; i < uniques.length - 1; i++) {
            while (purrows[j].manufacturer === uniques[i]) {
              j++
            }
            startRow[i] = j
          }
          startRow[uniques.length - 1] = purrows.length
          break
        case 'store':
          this.response = await PpService.fetchUniquePurchaseStore()
          uniques = this.response.data.purchases
          byTitle = 'Store'
          purrows.sort(function (a, b) {
            var purTypeA = a.store
            var purTypeB = b.store
            if (purTypeA < purTypeB) {
              return -1
            }
            if (purTypeA > purTypeB) {
              return 1
            }
            return 0
          })
          startRow[0] = 0
          for (i = 0; i < uniques.length - 1; i++) {
            while (purrows[j].store === uniques[i]) {
              j++
            }
            startRow[i] = j
          }
          startRow[uniques.length - 1] = purrows.length
          break
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
      var newTitle = title + byTitle
      doc.text(newTitle, 350, 30)
      if (this.projBreakType === 'continuous') {
        doc.autoTable(columns, purrows, {
          styles: { cellPadding: 3, fontSize: 9 },
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
        var finalY = doc.previousAutoTable.finalY
        doc.setFontSize(10)
        var summary = 'The number purchases made was ' + this.documents.length + ' for a total cost of ' + formatter.format(totalcost)
        doc.text(summary, 100, finalY + 20)
      } else {
        k = 0
        for (i = 0; i < uniques.length; i++) {
          somerows = []
          while (k < startRow[i]) {
            somerows.push(purrows[k])
            k++
          }
          doc.setFontSize(12)
          if (this.purBreakType === 'pagebreaks' || i === 0) {
            doc.text(uniques[i], 50, 40)
          } else if (i !== 0) {
            finalY = doc.previousAutoTable.finalY
            doc.text(uniques[i], 50, finalY + 20)
          }
          doc.autoTable(columns, somerows, {
            styles: { cellPadding: 3, fontSize: 9 },
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
          if (this.purBreakType === 'pagebreaks' && i < uniques.length - 1) {
            doc.addPage()
          }
        }
      }
      doc.save('purchases.pdf')
      this.purSortType = null
      this.purBreakType = null
    },
    formatDate (unformatDate) {
      if (unformatDate === null || unformatDate === '') {
        return ''
      } else {
        return moment.utc(unformatDate).format('YYYY-MM-DD')
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
.center {
  text-align: center;
}
</style>
