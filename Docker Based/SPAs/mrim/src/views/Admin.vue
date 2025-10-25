<template>
  <div class="xx">
    <h1>Admin</h1>
    <br />
    <div>
      <VContainer fluid>
        <VRow>
          <VCol cols="4">
            <VSelect
              :items="items"
              label="Collection"
              v-model="selectedExpt"
            ></VSelect>
          </VCol>
          <VCol cols="6">
            <VBtn @click="downloadFile"> Export </VBtn>
          </VCol>
        </VRow>
        <p v-if="exprtError" style="color: #ff0000">
          An error has ocurred, select a collection.
        </p>
        <VRow>
          <VCol cols="4">
            <VFileInput
              v-model="inFilename"
              accept="txt"
              label="File input"
              @change="onFileChange"
            ></VFileInput>
          </VCol>
          <VCol cols="4">
            <VSelect
              :items="items"
              label="Collection"
              v-model="selectedInpt"
            ></VSelect>
          </VCol>
          <VCol cols="4">
            <VBtn @click="uploadFile"> Import </VBtn>
          </VCol>
        </VRow>
        <VRow>
          <p v-if="inptError" style="color: #ff0000">
            {{ error }}
          </p>
        </VRow>
        <VRow>
          <VCol cols="3">
            <VSelect
              label="Report"
              v-model="printCollection"
              :items="[
                'Rolling Stock',
                'AAR Codes',
                'Companies',
                'Images',
                'RFID',
                'Structures',
              ]"
            ></VSelect>
          </VCol>
          <VCol cols="3">
            <VSelect
              v-if="printCollection === 'Rolling Stock'"
              label="Sorted By"
              v-model="sortBy"
              :items="['Road Names', 'AAR Codes', 'Status']"
            ></VSelect>
          </VCol>
          <VCol cols="3">
            <VSelect
              v-if="printCollection === 'Rolling Stock'"
              label="Break"
              v-model="breakType"
              :items="['Continuous', 'Table', 'Page']"
            ></VSelect>
          </VCol>
          <VCol cols="3">
            <VBtn @click="printFile"> Print </VBtn>
          </VCol>
        </VRow>
        <VRow>
        <VCol cols="3">
            <VBtn @click="printCards"> Print Cards </VBtn>
          </VCol>
        </VRow>
      </VContainer>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRSStore } from "@/stores/rs";
import { useAarCodesStore } from "@/stores/aarCodes";
import { useCompaniesStore } from "@/stores/companies";
import { useImagesStore } from "@/stores/images";
import { useStructuresStore } from "@/stores/structures";
import { useDecodersStore } from "@/stores/decoders";
import exportFromJSON from "export-from-json";
import FileService from "../services/FileService";
import PrintServices from "../services/PrintServices";

const rsStore = useRSStore();
const aarCodesStore = useAarCodesStore();
const companiesStore = useCompaniesStore();
const imagesStore = useImagesStore();
const structuresStore = useStructuresStore();
const decodersStore = useDecodersStore();
const items = [
  "AAR Codes",
  "Companies",
  "Images",
  "Rolling Stock",
  "Decoders",
  "Structures",
];
const selectedExpt = ref(null);
const selectedInpt = ref(null);
const chosenFile = ref(null);
const exprtError = ref(false);
const inptError = ref(false);
const content = ref(null);
const error = ref(null);
const inFilename = ref([]);
const printCollection = ref(null);
const sortBy = ref(null);
const breakType = ref(null);
const downloadFile = () => {
  let data = null;
  if (selectedExpt.value == null) {
    exprtError.value = true;
  } else {
    exprtError.value = false;
    switch (selectedExpt.value) {
      case "AAR Codes":
        data = aarCodesStore.aarCodes;
        break;
      case "Companies":
        data = companiesStore.companies;
        break;
      case "Images":
        data = imagesStore.images;
        break;
      case "Rolling Stock":
        data = rsStore.rs;
        break;
      case "Decoders":
        data = decodersStore.decoders;
        break;
      case "Structures":
        data = structuresStore.structures;
        break;
    }
    let fileName = selectedExpt.value;
    let exportType = exportFromJSON.types.csv;
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
  if (action !== "") {
    switch (type) {
      case "AAR Codes":
        if (action == "a" || action == "u") {
          if (action == "a") {
            aarCodesStore.ADD_NEW_AARCODE(item);
          } else {
            aarCodesStore.UPDATE_AARCODE(item);
          }
        } else if (action == "d") {
          aarCodesStore.DELETE_AARCODE(item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Companies":
        if (action == "a" || action == "u") {
          if (action == "a") {
            companiesStore.ADD_NEW_COMPANY(item);
          } else {
            companiesStore.UPDATE_COMPANY(item);
          }
        } else if (action == "d") {
          companiesStore.DELETE_COMPANY(item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Images":
        if (action == "a" || action == "u") {
          if (action == "a") {
            imagesStore.ADD_NEW_IMAGE(item);
          } else {
            imagesStore.UPDATE_IMAGE(item);
          }
        } else if (action == "d") {
          imagesStore.DELETE_IMAGE(item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Rolling Stock":
        console.log(item);
        if (action == "a" || action == "u") {
          if (action == "a") {
            rsStore.ADD_NEW_RS(item);
          } else {
            rsStore.UPDATE_RS(item);
          }
        } else if (action == "d") {
          rsStore.DELETE_RS(item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Decoders":
        if (action == "a") {
          decodersStore.ADD_NEW_DECODER(item);
        } else if ((action = "u")) {
          decodersStore.UPDATE_DECODER(item);
        } else if (action == "d") {
          decodersStore.DELETE_DECODER(item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Structures":
        if (action == "a" || action == "u") {
          if (action == "a") {
            structuresStore.ADD_NEW_STRUCTURE(item);
          } else {
            structuresStore.UPDATE_STRUCTURE(item);
          }
        } else if (action == "d") {
          structuresStore.DELETE_STRUCTURE(item._id);
        } else {
          console.log("There is a problem");
        }
        break;
    }
  }
};
const uploadFile = () => {
  let msLineEnd = false;
  let data = [];
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
          if (obj.action !== "i") {
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
    case "AAR Codes":
      PrintServices.printAarCodes(aarCodesStore.aarCodes);
      break;
    case "Companies":
      PrintServices.printCompanies(companiesStore.companies);
      break;
    case "Images":
      PrintServices.printImages(
        imagesStore.images,
        imagesStore.GET_UNIQUE_IMAGE_CATEGORY,
        rsStore.rs
      );
      break;
    case "RFID":
      PrintServices.printRfids(rsStore.rs);
      break;
    case "Rolling Stock":
    console.log("Status Types : " + rsStore.GET_UNIQUE_RS_STATUS);
      PrintServices.printRollingstock(
        sortBy.value,
        breakType.value,
        rsStore.rs,
        rsStore.GET_UNIQUE_ROAD_NAMES,
        rsStore.GET_UNIQUE_AARCODES,
        rsStore.GET_UNIQUE_RS_STATUS
      );
      break;
    case "Structures":
      PrintServices.printStructures(structuresStore.structures);
      break;
  }
  printCollection.value = null;
  sortBy.value = null;
  breakType.value = null;
};
const printCards = () => {
  console.log("Printing Rolling Stock Cards");
  PrintServices.printCarCards(rsStore.rs);
};
</script>
