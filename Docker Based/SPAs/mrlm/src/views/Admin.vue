<template>
  <div class="xx">
    <h1>Admin</h1>
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
            <v-btn @click="downloadFile" :disabled="!selectedExpt">
              Export
            </v-btn>
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
            <v-btn @click="uploadFile" :disabled="!inFilename || !selectedInpt">
              Import
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col cols="8">
            <v-file-input
              v-model="svgFile"
              accept=".svg"
              label="Panel input"
              @change="onSvgFileChange"
            ></v-file-input>
          </v-col>
          <v-col cols="4">
            <v-btn @click="importSvgFile" :disabled="!svgFile"> Import </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-select
              :items="controllers"
              label="Turnout Panel Controller"
              v-model="selectedLpbCntlr"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-btn @click="resetLpbCntlr" :disabled="!selectedLpbCntlr">
              Export
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <p v-if="inptError" style="color: #ff0000">
            {{ error }}
          </p>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import exportFromJSON from "export-from-json";
import FileService from "../services/FileService";
import { useMicrosStore } from "@/stores/micros";
import { useTurnoutsStore } from "@/stores/turnouts";
import { useTplightsStore } from "@/stores/tplights";
import { useSvgContentStore, SET_SVG_CONTENT } from "@/stores/svgContent";
import RlService from "@/services/RlService";

const microsStore = useMicrosStore();
const turnoutsStore = useTurnoutsStore();
const tplightsStore = useTplightsStore();
const svgContentStore = useSvgContentStore();
const items = ["Micros", "Turnouts", "TPLights"];
const controllers = ref([]);
const selectedExpt = ref(null);
const selectedInpt = ref(null);
const chosenFile = ref(null);
const exprtError = ref(false);
const inptError = ref(false);
const error = ref(null);
const inFilename = ref([]);
const svgFile = ref(null);
const selectedLpbCntlr = ref(null);

onMounted(async () => {
      // Fetch the tplights data first
      await tplightsStore.GET_TPLIGHTS();
      // Then, get the unique controllers from the fetched data
      controllers.value = tplightsStore.GET_TPLIGHTS_CONTROLLERS();
    });


const downloadFile = () => {
  let data = null;
  if (selectedExpt.value == null) {
    exprtError.value = true;
  } else {
    exprtError.value = false;
    switch (selectedExpt.value) {
      case "Micros":
        data = microsStore.micros;
        break;
      case "Turnouts":
        data = turnoutsStore.turnouts;
        break;
      case "TPLights":
        data = tplightsStore.tplights;
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

const onSvgFileChange = (e) => {
  let files = e.target?.files || e.dataTransfer?.files || svgFile.value;
  if (!files || !files.length) return;
  svgFile.value = files[0];
};

const importSvgFile = (e) => {
  if (!svgFile.value) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      svgContentStore[SET_SVG_CONTENT](content);
      svgFile.value = null; // Clear the file input after successful import
    } catch (err) {
      console.error("File processing error:", err);
    }
  };
  reader.readAsText(svgFile.value);
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

const uploadFile = () => {
  inptError.value = false;
  var reader = new FileReader();
  reader.readAsText(chosenFile.value);
  reader.onload = () => {
    content = reader.result;
    reader.onloadend = () => {
      let headers = content.slice(0, content.indexOf("\n")).split(",");
      let fileValidation = FileService.valFileType(selectedInpt.value, headers);
      if (fileValidation == "OK") {
        let rows = content.split("\n");
        let items = [];
        for (let i = 1; i < rows.length - 1; i++) {
          if (!rows[i].startsWith("i,")) {
            let objValues = splitWithParser(rows[i]);
            let rowObj = headers.reduce(function (obj, title, index) {
              obj[title] = objValues[index];
              return obj;
            }, {});
            items.push(rowObj);
          }
        }
        FileService.importFileContent(items, selectedInpt.value);
        selectedInpt.value = null;
        inFilename.value = [];
      } else if (fileValidation == "noAction") {
        error.value = "Error: no action column in selected file";
        inptError.value = true;
      } else {
        error.value = "Error: mismatch between file type and collection.";
        inptError.value = true;
      }
    };
  };
};

const resetLpbCntlr = () => {
  console.log("Resetting LPB Controller: " + selectedLpbCntlr.value);
  const lights = tplightsStore.tplights.filter(light => light.controller === selectedLpbCntlr.value);
  const turnouts = turnoutsStore.turnouts;
  lights.forEach(light => {
    const turnout = turnoutsStore.turnouts.find(t => t._id === light.to_id);
    let color = "unknown";
    if (turnout) {
      if (turnout.state === "CLOSED") {
        color = "GREEN";
      } else if (turnout.state === "THROWN") {
        color = "BLUE";
      } else {
        color = "RED";
      }
    }
    const msg = {
      topic: selectedLpbCntlr.value,
      tplNum: light.tplNum,
      color: color,
    };
    console.log(msg);
    RlService.postTplMsg(msg);
  });
};
</script>
