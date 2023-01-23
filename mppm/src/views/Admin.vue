<template>
  <div class="xx">
    <h1>Admin</h1>
    <br />
    <div>
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-select :items="items" label="Collection" v-model="selectedExpt"></v-select>
          </v-col>
          <v-col cols="6">
            <v-btn @click="downloadFile"> Export </v-btn>
          </v-col>
        </v-row>
        <p v-if="exprtError" style="color: #ff0000">
          An error has ocurred, select a collection.
        </p>
        <v-row>
          <v-col cols="4">
            <v-file-input
              v-model="inFilename"
              accept="txt"
              label="File input"
              @change="onFileChange"
            ></v-file-input>
          </v-col>
          <v-col cols="4">
            <v-select :items="items" label="Collection" v-model="selectedInpt"></v-select>
          </v-col>
          <v-col cols="4">
            <v-btn @click="uploadFile"> Import </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <p v-if="inptError" style="color: #ff0000">
            {{ error }}
          </p>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-select
              label="Report"
              v-model="printCollection"
              :items="['Purchases', 'Projects', 'MR Companies']"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-if="printCollection === 'Purchases'"
              label="Sorted By"
              v-model="purSortBy"
              :items="['Date', 'Project', 'Manufacturer', 'Store']"
            ></v-select>
            <v-select
              v-if="printCollection === 'Projects'"
              label="Sorted By"
              v-model="projSortBy"
              :items="['Name', 'Start Date', 'Type']"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-select
              v-if="
                (printCollection === 'Purchases' && purSortBy !== 'Date') ||
                printCollection === 'Projects'
              "
              label="Break"
              v-model="breakType"
              :items="['Continuous', 'Table', 'Page']"
            ></v-select>
          </v-col>
          <v-col cols="3">
            <v-btn @click="printFile"> Print </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import exportFromJSON from "export-from-json";
import FileService from "../services/FileService";
import PrintServices from "../services/PrintServices";

export default {
  data: () => ({
    items: ["Purchases", "Projects", "MrCompanies"],
    selectedExpt: null,
    selectedInpt: null,
    chosenFile: null,
    exprtError: false,
    inptError: false,
    content: null,
    error: null,
    inFilename: [],
    row: null,
    printCollection: null,
    purSortBy: null,
    projSortBy: null,
    breakType: null,
  }),
  computed: {
    purchases() {
      return this.$store.state.purchases;
    },
    projects() {
      return this.$store.state.projects;
    },
    mrcos() {
      return this.$store.state.mrcos;
    },
  },
  methods: {
    downloadFile() {
      let data = null;
      if (this.selectedExpt == null) {
        this.exprtError = true;
      } else {
        this.exprtError = false;
        switch (this.selectedExpt) {
          case "Purchases":
            data = this.purchases;
            break;
          case "Projects":
            data = this.projects;
            break;
          case "MrCompanies":
            data = this.mrcos;
            break;
        }
        const fileName = this.selectedExpt;
        const exportType = exportFromJSON.types.csv;
        if (data) exportFromJSON({ data, fileName, exportType });
        this.selectedExpt = null;
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.chosenFile = files[0];
    },
    splitWithParser(input) {
      let tokens = [];
      let startPosition = 0;
      let endPosition = 0;
      let isInQuotes = false;
      let line = Array.from(input);
      for (let currentPosition = 0; currentPosition < input.length; currentPosition++) {
        if (line[currentPosition] == '"') {
          isInQuotes = !isInQuotes;
        } else if (line[currentPosition] == "," && !isInQuotes) {
          if (line[startPosition] == '"') {
            startPosition++;
            endPosition = currentPosition - 1;
          } else {
            endPosition = currentPosition;
          }
          tokens.push(input.substring(startPosition, endPosition));
          startPosition = currentPosition + 1;
        }
      }
      let lastToken = input.substring(startPosition);
      if (lastToken == ",") {
        tokens.push("");
      } else {
        tokens.push(lastToken);
      }
      return tokens;
    },
    uploadFile() {
      let msLineEnd = false;
      this.inptError = false;
      var reader = new FileReader();
      reader.readAsText(this.chosenFile);
      reader.onload = () => {
        this.content = reader.result;
        if (this.content.includes("\r")) {
          msLineEnd = true;
        }
        reader.onloadend = () => {
          let headers = this.content.slice(0, this.content.indexOf("\n")).split(",");
          let fileValidation = FileService.valFileType(this.selectedInpt, headers);
          if (msLineEnd){
            let lastHeader = headers[headers.length-1].slice(0, -1);
            headers[headers.length-1] = lastHeader
            console.log(headers)
          }
          let rows = [];
          if (fileValidation == "OK") {
            if (msLineEnd){
              rows = this.content.split("\r\n");
            } else {
              rows = this.content.split("\n");
            }
            console.log(rows)
            let items = [];
            for (let i = 1; i < rows.length - 1; i++) {
              if (!rows[i].startsWith("i,")) {
                let objValues = this.splitWithParser(rows[i]);
                let rowObj = headers.reduce(function (obj, title, index) {
                  obj[title] = objValues[index];
                  return obj;
                }, {});
                items.push(rowObj);
              }
            }
            FileService.importFileContent(items, this.selectedInpt);
            this.selectedInpt = null;
            this.inFilename = [];
          } else if (fileValidation == "noAction") {
            this.error = "Error: no action column in selected file";
            this.inptError = true;
          } else {
            this.error = "Error: mismatch between file type and collection.";
            this.inptError = true;
          }
        };
      };
    },
    printFile() {
      switch (this.printCollection) {
        case "MR Companies":
          PrintServices.printMrCompanies();
          break;
        case "Projects":
          PrintServices.printProjects(this.projSortBy, this.breakType);
          break;
        case "Purchases":
          PrintServices.printPurchases(this.purSortBy, this.breakType);
          break;
      }
      this.printCollection = null;
      this.purSortBy = null;
      this.projSortBy = null;
      this.breakType = null;
    },
  },
};
</script>
