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
        
        <!-- SVG Layout Management Section -->
        <v-divider class="my-4"></v-divider>
        <h3>Panel Layout Management</h3>
        
        <!-- Upload SVG Layout -->
        <v-row class="mt-4">
          <v-col cols="8">
            <v-file-input
              v-model="svgFile"
              accept=".svg"
              label="Upload Panel Layout (SVG)"
              @change="onSvgFileChange"
            ></v-file-input>
          </v-col>
          <v-col cols="4">
            <v-btn 
              @click="importSvgFile" 
              :disabled="!svgFile || isUploadingLayout"
              :loading="isUploadingLayout"
            > 
              Upload Layout
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Display available layouts and status messages -->
        <v-row v-if="svgLayoutError" class="mt-2">
          <v-col cols="12">
            <v-alert type="error" dismissible>
              {{ svgLayoutError }}
            </v-alert>
          </v-col>
        </v-row>
        
        <v-row v-if="svgLayoutSuccess" class="mt-2">
          <v-col cols="12">
            <v-alert type="success" dismissible>
              {{ svgLayoutSuccess }}
            </v-alert>
          </v-col>
        </v-row>
        
        <!-- Available Layouts List -->
        <v-row v-if="availableSvgLayouts.length > 0" class="mt-4">
          <v-col cols="12">
            <h4>Available Panel Layouts:</h4>
            <v-list>
              <v-list-item 
                v-for="layout in availableSvgLayouts" 
                :key="layout"
                class="layout-item"
              >
                <v-list-item-title>{{ layout }}</v-list-item-title>
                <template v-slot:append>
                  <v-btn
                    icon
                    size="small"
                    @click="deleteLayout(layout)"
                    :loading="deletingLayout === layout"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        
        <v-row v-else-if="!isLoadingLayouts && availableSvgLayouts.length === 0" class="mt-4">
          <v-col cols="12">
            <p style="color: #666">No panel layouts uploaded yet.</p>
          </v-col>
        </v-row>
        
        <v-row v-if="isLoadingLayouts" class="mt-4">
          <v-col cols="12">
            <v-progress-linear indeterminate></v-progress-linear>
          </v-col>
        </v-row>
        
        <!-- Turnout Panel Controller Section -->
        <v-divider class="my-4"></v-divider>
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
import SvgLayoutService from "../services/SvgLayoutService";
import { useMicrosStore } from "@/stores/micros";
import { useTurnoutsStore } from "@/stores/turnouts";
import { useTplightsStore } from "@/stores/tplights";
import { useSvgContentStore } from "@/stores/svgContent";
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

// SVG Layout management refs
const availableSvgLayouts = ref([]);
const isUploadingLayout = ref(false);
const isLoadingLayouts = ref(false);
const svgLayoutError = ref("");
const svgLayoutSuccess = ref("");
const deletingLayout = ref(null);

onMounted(async () => {
  // Fetch the tplights data first
  await tplightsStore.GET_TPLIGHTS();
  // Then, get the unique controllers from the fetched data
  controllers.value = tplightsStore.GET_TPLIGHTS_CONTROLLERS();
  
  // Load available SVG layouts
  await loadAvailableLayouts();
});

const loadAvailableLayouts = async () => {
  try {
    isLoadingLayouts.value = true;
    svgLayoutError.value = "";
    await svgContentStore.fetchAvailableLayouts();
    availableSvgLayouts.value = svgContentStore.availableLayouts;
  } catch (err) {
    console.error("Error loading layouts:", err);
    svgLayoutError.value = "Failed to load available layouts";
  } finally {
    isLoadingLayouts.value = false;
  }
};

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

const importSvgFile = async () => {
  if (!svgFile.value) return;
  
  try {
    isUploadingLayout.value = true;
    svgLayoutError.value = "";
    svgLayoutSuccess.value = "";
    
    const response = await svgContentStore.uploadSvgLayout(svgFile.value);
    svgLayoutSuccess.value = `Layout '${response.filename}' uploaded successfully`;
    availableSvgLayouts.value = svgContentStore.availableLayouts;
    svgFile.value = null;
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      svgLayoutSuccess.value = "";
    }, 3000);
  } catch (err) {
    console.error("Error uploading SVG:", err);
    svgLayoutError.value = err.message || "Failed to upload layout";
  } finally {
    isUploadingLayout.value = false;
  }
};

const deleteLayout = async (filename) => {
  if (!confirm(`Delete layout '${filename}'?`)) return;
  
  try {
    deletingLayout.value = filename;
    svgLayoutError.value = "";
    svgLayoutSuccess.value = "";
    
    await svgContentStore.deleteSvgLayout(filename);
    availableSvgLayouts.value = svgContentStore.availableLayouts;
    svgLayoutSuccess.value = `Layout '${filename}' deleted successfully`;
    
    // Clear success message after 2 seconds
    setTimeout(() => {
      svgLayoutSuccess.value = "";
    }, 2000);
  } catch (err) {
    console.error("Error deleting layout:", err);
    svgLayoutError.value = err.message || "Failed to delete layout";
  } finally {
    deletingLayout.value = null;
  }
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
