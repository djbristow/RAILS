<template>
  <v-app>
    <v-container class="xx">
      <v-card>
        <v-card-title>Admin RFID Micros</v-card-title>
        <v-card-actions>
          <v-btn @click="addMicro()" width="200">Add Micro</v-btn>
        </v-card-actions>

        <v-data-table
          :headers="headers"
          :items="microsStore.micros"
          item-key="item.id"
          density="compact"
        >
          <template v-slot:item.et="{ item }">
            {{ formatDate(item.et) }}
          </template>
          <template v-slot:item.status="{ item }">
            <v-icon v-if="item.status === 'Up'" color="green"
              >mdi-server</v-icon
            >
            <v-icon v-else-if="item.status === 'Down'" color="red"
              >mdi-server
            </v-icon>
            <v-icon v-else color="yellow">mdi-server </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon color="blue darken-1" @click="editMicro(item)">
              mdi-pencil
            </v-icon>
            <v-icon color="red darken-1" @click="deleteMicro(item)"
              >mdi-delete</v-icon
            >
          </template>
        </v-data-table>
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
      </v-card>
      <br />
      <v-card-actions>
        <v-btn @click="downloadFile"> Export RFID RS </v-btn>
        <br />
        <v-btn @click="printRfids()" width="200">Print RFID Report</v-btn>
      </v-card-actions>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import jsPDF from "jspdf";
import moment from "moment";
import "jspdf-autotable";
import exportFromJSON from "export-from-json";
import DialogEditMicro from "../components/dialogs/DialogEditMicro.vue";
import DialogDeleteMicro from "../components/dialogs/DialogDeleteMicro.vue";
import DialogAddMicro from "../components/dialogs/DialogAddMicro.vue";
import { useMicrosStore } from "@/stores/micros";
import { useRSStore } from "@/stores/rs";

const rsStore = useRSStore();
const microsStore = useMicrosStore();
const editMicroDialog = ref(false);
const deleteMicroDialog = ref(false);
const addMicroDialog = ref(false);
const editableMicro = ref(null);
const headers = [
  { title: "Name", key: "microID" },
  { title: "IP", key: "microIP" },
  { title: "Date Time", key: "et" },
  { title: "Location", key: "location" },
  { title: "Status", key: "status" },
  { title: "Actions", key: "actions", sortable: false},
];

const formatDate = (epochTime) => {
  if (epochTime === null || epochTime === "") {
    return "";
  } else {
    return moment
      .utc(epochTime * 1000)
      .local()
      .format("YYYY-MM-DD hh:mm:ss");
  }
};
const downloadFile = () => {
  let data = rsStore.rs;
  let fileName = "rfid_rs";
  let exportType = exportFromJSON.types.csv;
  exportFromJSON({ data, fileName, exportType });
};
const addMicro = () => {
  addMicroDialog.value = true;
};
const deleteMicro = (item) => {
  editableMicro.value = item;
  deleteMicroDialog.value = true;
};
const editMicro = (item) => {
  editableMicro.value = item;
  editMicroDialog.value = true;
};
const printRfids = () => {
  class Rsrow {
    constructor(roadName, roadNumber, color, aarCode, description, rfid) {
      this.roadName = roadName;
      this.roadNumber = roadNumber;
      this.color = color;
      this.aarCode = aarCode;
      this.description = description;
      this.rfid = rfid;
    }
  }
  var i = 0;
  var rsrows = [];
  for (i = 0; i < rsStore.rs.length; i++) {
    rsrows[i] = new Rsrow(
      rsStore.rs[i].roadName,
      rsStore.rs[i].roadNumber,
      rsStore.rs[i].color,
      rsStore.rs[i].aarCode,
      rsStore.rs[i].description,
      rsStore.rs[i].rfid
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
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      doc.text(str, data.settings.margin.left, pageHeight - 10);
    },
    margin: { top: 50 },
  });
  doc.save("rfid.pdf");
};
</script>
