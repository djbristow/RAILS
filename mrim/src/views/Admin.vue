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
            <v-file-input v-model="inFilename" accept="txt" label="File input" @change="onFileChange"></v-file-input>
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
            <v-select label="Report" v-model="printCollection"
              :items="['Rolling Stock', 'AAR Codes', 'Companies', 'Images', 'RFID', 'Structures']"></v-select>
          </v-col>
          <v-col cols="3">
            <v-select v-if="(printCollection === 'Rolling Stock')" label="Sorted By" v-model="sortBy"
              :items="['Road Names', 'AAR Codes', 'Status']"></v-select>
          </v-col>
          <v-col cols="3">
            <v-select v-if="(printCollection === 'Rolling Stock')" label="Break" v-model="breakType"
              :items="['Continuous', 'Table', 'Page']"></v-select>
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
    items: [
      "AAR Codes",
      "Companies",
      "Images",
      "Rolling Stock",
      "Decoders",
      "Structures",
    ],
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
    sortBy: null,
    breakType: null,
  }),
  computed: {
    rs() {
      return this.$store.state.rs;
    },
    structures() {
      return this.$store.state.structures;
    },
    aarCodes() {
      return this.$store.state.aarCodes;
    },
    companies() {
      return this.$store.state.companies;
    },
    decoders() {
      return this.$store.state.decoders;
    },
    images() {
      return this.$store.state.images;
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
          case "AAR Codes":
            data = this.aarCodes;
            break;
          case "Companies":
            data = this.companies;
            break;
          case "Images":
            data = this.images;
            break;
          case "Rolling Stock":
            data = this.rs;
            break;
          case "Decoders":
            data = this.decoders;
            break;
          case "Structures":
            data = this.structures;
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
        if (line[currentPosition] == '\"') {
          isInQuotes = !isInQuotes;
        } else if (line[currentPosition] == ',' && !isInQuotes) {
          if(line[startPosition] == '\"') {
            startPosition++;
            endPosition = currentPosition -1;
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
      this.inptError = false;
      var reader = new FileReader();
      reader.readAsText(this.chosenFile);
      reader.onload = () => {
        this.content = reader.result;
        reader.onloadend = () => {
          let headers = this.content
            .slice(0, this.content.indexOf("\n"))
            .split(",");
          let fileValidation = FileService.valFileType(
            this.selectedInpt,
            headers
          );
          console.log(headers)
          if (fileValidation == "OK") {
            let rows = this.content.split("\n");
            let items = [];
            for (let i = 1; i < rows.length - 1; i++) {
              if (!rows[i].startsWith("i,")) {
                let objValues = this.splitWithParser(rows[i]);
                let rowObj = headers.reduce(function (
                  obj,
                  title,
                  index
                ) {
                  obj[title] = objValues[index];
                  return obj;
                },
                  {});
                items.push(rowObj)
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
        case "AAR Codes":
          PrintServices.printAarCodes()
          break;
        case "Companies":
          PrintServices.printCompanies()
          break;
        case "Images":
          PrintServices.printImages()
          break;
        case "RFID":
          PrintServices.printRfids()
          break;
        case "Rolling Stock":
          PrintServices.printRollingstock(this.sortBy, this.breakType)
          break;
        case "Structures":
          PrintServices.printStructures()
          break;
      }
      this.printCollection = null
      this.sortBy = null
      this.breakType = null
    },
  }
}
</script>
