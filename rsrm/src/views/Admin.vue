<template>
  <div class="xx">
    <h1>Admin</h1>
    <h2>RFID Micros</h2>
    <v-btn @click="addMicro()" width="200">Add Micro</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">IP</th>
          <th class="text-left">ET</th>
          <th class="text-left">Location</th>
          <th class="text-left">Status</th>
          <th class="text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in micros" :key="item.id">
          <td>{{ item.microID }}</td>
          <td>{{ item.microIP }}</td>
          <td>{{ item.et }}</td>
          <td>{{ item.location }}</td>
          <td>
            <div v-if="item.status === 'Up'">
              <v-icon color="green">mdi-server</v-icon>
            </div>
            <div v-else-if="item.status === 'Down'">
              <v-icon color="red">mdi-server </v-icon>
            </div>
            <div v-else>
              <v-icon color="yellow">mdi-server </v-icon>
            </div>
          </td>
          <td>
            <v-icon color="blue darken-1" @click="editMicro(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteMicro(item)"
              >mdi-delete</v-icon
            >
          </td>
        </tr>
      </tbody>
      <v-dialog v-model="editMicroDialog">
        <dialog-edit-micro
          :micro="editableMicro"
          @closeEditMicroDialog="editMicroDialog = false"
        />
      </v-dialog>
      <v-dialog v-model="deleteMicroDialog">
        <dialog-delete-micro
          :micro="editableMicro"
          @closeDeleteMicroDialog="deleteMicroDialog = false"
        />
      </v-dialog>
      <v-dialog v-model="addMicroDialog">
        <dialog-add-Micro @closeAddMicroDialog="addMicroDialog = false" />
      </v-dialog>
    </v-table>
    <br />
    <hr />
    <download-csv :data="rs"><v-btn> Export RFID RS </v-btn></download-csv><br />
    <v-btn @click="printRfids()" width="200">Print RFID Report</v-btn>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
import JsonCSV from "vue-json-csv";
import DialogEditMicro from "../components/dialogs/DialogEditMicro.vue";
import DialogDeleteMicro from "../components/dialogs/DialogDeleteMicro.vue";
import DialogAddMicro from "../components/dialogs/DialogAddMicro.vue";
//Vue.component('downloadCsv', JsonCSV)
export default {
  components: {
    DialogEditMicro,
    DialogDeleteMicro,
    DialogAddMicro,
    downloadCsv: JsonCSV,
  },
  data: () => ({
    editMicroDialog: false,
    deleteMicroDialog: false,
    addMicroDialog: false,
    editableMicro: null,
    micro: null,
    name: {
      type: String,
      default: "rollingstock.csv",
    },
  }),
  computed: {
    rs() {
      return this.$store.state.rs;
    },
    micros() {
      return this.$store.state.micros;
    },
  },
  methods: {
    addMicro() {
      this.addMicroDialog = true;
    },
    deleteMicro(item) {
      this.editableMicro = item;
      this.deleteMicroDialog = true;
    },
    editMicro(item) {
      this.editableMicro = item;
      this.editMicroDialog = true;
    },
    printRfids() {
      function Rsrow(roadName, roadNumber, color, aarCode, description, rfid) {
        this.roadName = roadName;
        this.roadNumber = roadNumber;
        this.color = color;
        this.aarCode = aarCode;
        this.description = description;
        this.rfid = rfid;
      }
      var i = 0;
      var rsrows = [];
      for (i = 0; i < this.rs.length; i++) {
        rsrows[i] = new Rsrow(
          this.rs[i].roadName,
          this.rs[i].roadNumber,
          this.rs[i].color,
          this.rs[i].aarCode,
          this.rs[i].description,
          this.rs[i].rfid
        );
      }
      var columns = [
        { header: "RFID", dataKey: "rfid" },
        { header: "Road", dataKey: "roadName" },
        { header: "Number", dataKey: "roadNumber" },
        { header: "Color", dataKey: "color" },
        { header: "AAR", dataKey: "aarCode" },
        { header: "Description", dataKey: "description" },
      ];
      var doc = new jsPDF("p", "pt");
      doc.text("RFID Report", 220, 30);
      // @ts-ignore
      doc.autoTable({
        columns: columns,
        body: rsrows,
        styles: { cellPadding: 3, fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 70 },
        },
        theme: "striped",
        didDrawPage: function (data) {
          var str = "Page " + doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height
            ? pageSize.height
            : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
        margin: { top: 50 },
      });
      doc.save("rfid.pdf");
    },
  },
};
</script>