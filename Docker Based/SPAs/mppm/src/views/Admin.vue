<template>
  <div class="xx">
    <h1>Admin</h1>
    <br />
    <div>
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-select
              :items="items"
              label="Collection"
              v-model="selectedExpt"
            ></v-select>
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
            <v-select
              :items="items"
              label="Collection"
              v-model="selectedInpt"
            ></v-select>
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

<script setup>
import { ref } from "vue";
import { usePurchasesStore } from "@/stores/purchases";
import { useProjectsStore } from "@/stores/projects";
import { useMrcosStore } from "@/stores/mrcos";
import exportFromJSON from "export-from-json";
import FileService from "../services/FileService";
import PrintServices from "../services/PrintServices";

const purchasesStore = usePurchasesStore();
const projectsStore = useProjectsStore();
const mrcosStore = useMrcosStore();
const items = ["Purchases", "Projects", "MR Companies"];
const selectedExpt = ref(null);
const selectedInpt = ref(null);
const chosenFile = ref(null);
const exprtError = ref(false);
const inptError = ref(false);
const content = ref(null);
const error = ref(null);
const inFilename = ref([]);
const printCollection = ref(null);
const purSortBy = ref(null);
const projSortBy = ref(null);
const breakType = ref(null);
const downloadFile = () => {
  let data = null;
  if (selectedExpt.value == null) {
    exprtError.value = true;
  } else {
    exprtError.value = false;
    switch (selectedExpt.value) {
      case "Purchases":
        data = purchasesStore.purchases;
        break;
      case "Projects":
        data = projectsStore.projects;
        break;
      case "MR Companies":
        data = mrcosStore.mrcos;
        break;
    }
    const fileName = selectedExpt.value;
    const exportType = exportFromJSON.types.csv;
    if (data) exportFromJSON({ data, fileName, exportType });
    selectedExpt.value = null;
  }
};
const onFileChange = (e) => {
  let files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  chosenFile.value = files[0];
};
const splitWithParser = (input) => {
  let tokens = [];
  let startPosition = 0;
  let endPosition = 0;
  let isInQuotes = false;
  let line = Array.from(input);
  for (
    let currentPosition = 0;
    currentPosition < input.length;
    currentPosition++
  ) {
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
};
const handleDataStore = (item, type) => {
  let action = item.action;
  delete item.action;
  if (action == "a" && item._id !== "") {
    delete item._id;
  }
  switch (type) {
    case "Purchases":
      if (action == "a" || action == "u") {
        if (action == "a") {
          purchasesStore.ADD_PURCHASE(item);
        } else {
          purchasesStore.UPDATE_PURCHASE(item);
        }
      } else if (action == "d") {
        purchasesStore.DELETE_PURCHASE(item._id);
      } else {
        console.log("There is a problem");
      }
      break;
    case "MR Companies":
      if (action == "a" || action == "u") {
        if (action == "a") {
          mrcosStore.ADD_MRCO(item);
        } else {
          mrcosStore.UPDATE_MRCO(item);
        }
      } else if (action == "d") {
        mrcosStore.DELETE_MRCO(item._id);
      } else {
        console.log("There is a problem");
      }
      break;
    case "Projects":
      if (action == "a" || action == "u") {
        if (action == "a") {
          projectsStore.ADD_PROJECT(item);
        } else {
          projectsStore.UPDATE_PROJECT(item);
        }
      } else if (action == "d") {
        projectsStore.DELETE_PROJECT(item._id);
      } else {
        console.log("There is a problem");
      }
      break;
  }
};
const uploadFile = () => {
  let msLineEnd = false;
  inptError.value = false;
  var reader = new FileReader();
  reader.readAsText(chosenFile.value);
  reader.onload = () => {
    content.value = reader.result;
    if (content.value.includes("\r")) {
      msLineEnd = true;
    }
    reader.onloadend = () => {
      let headers = content.value
        .slice(0, content.value.indexOf("\n"))
        .split(",");
      if (msLineEnd) {
        let lastHeader = headers[headers.length - 1].slice(0, -1);
        headers[headers.length - 1] = lastHeader;
      }
      let fileValidation = FileService.valFileType(selectedInpt.value, headers);
      let rows = [];
      if (fileValidation == "OK") {
        if (msLineEnd) {
          rows = content.value.split("\r\n");
        } else {
          rows = content.value.split("\n");
        }
        for (let i = 1; i < rows.length; i++) {
          let row = splitWithParser(rows[i]);
          let obj = {};
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }
          if (obj.action !== "i" && row.length > 2) {
            handleDataStore(obj, selectedInpt.value);
          }
        }
        selectedInpt.value = null;
        chosenFile.value = null;
      } else {
        inptError.value = true;
        error.value = fileValidation;
      }
    };
  };
}; // uploadFile
const printFile = () => {
  switch (printCollection.value) {
    case "MR Companies":
      PrintServices.printMrCompanies(mrcosStore.mrcos);
      break;
    case "Projects":
      PrintServices.printProjects(
        projSortBy.value,
        breakType.value,
        projectsStore.projects,
        projectsStore.GET_UNIQUE_PROJECT_TYPES,
      );
      break;
    case "Purchases":
      if (purSortBy.value == "Date") {
          breakType.value =  "Continuous";
      }
      PrintServices.printPurchases(
        purSortBy.value,
        breakType.value,
        purchasesStore.purchases,
        purchasesStore.GET_UNIQUE_PUR_STORES,
        purchasesStore.GET_UNIQUE_PUR_PROJECTS,
        purchasesStore.GET_UNIQUE_PUR_MANUFACTURERS
      );
      break;
  }
  printCollection.value = null;
  purSortBy.value = null;
  projSortBy.value = null;
  breakType.value = null;
};
</script>
