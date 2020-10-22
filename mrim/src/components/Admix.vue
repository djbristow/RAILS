<template>
  <section>
    <div class="center">
      <p class="title is-5">Admin Import Export</p>
    </div>
    <b-field label="File Type to Export">
      <b-select v-model="fileExportType" placeholder="Select a file">
        <option value="AAR Codes">AAR Codes</option>
        <option value="Companies">Companies</option>
        <option value="Images">Images</option>
        <option value="Rolling Stock">Rolling Stock</option>
        <option value="DCC">DCC</option>
        <option value="Structures">Structures</option>
      </b-select>
    </b-field>
    <b-field label="File Format">
      <b-select v-model="fileFormat" placeholder="Select a format">
        <option value="Json">Json</option>
        <option value="CSV">CSV</option>
      </b-select>
    </b-field>
    <a href="#" @click="saveFile()">
      <b-icon icon="content-save" size="is-medium" type="is-dark" />
    </a>
    <hr />
    <b-field label="File Type to Import">
      <b-select v-model="fileImportType" placeholder="Select a file">
        <option value="AAR Codes">AAR Codes</option>
        <option value="Companies">Companies</option>
        <option value="Images">Images</option>
        <option value="Rolling Stock">Rolling Stock</option>
        <option value="DCC">DCC</option>
        <option value="JMRI Roster">JMRI Roster</option>
        <option value="Structures">Structures</option>
      </b-select>
    </b-field>
    <b-field class="file">
      <b-upload v-model="file">
        <a class="button is-light">
          <b-icon icon="upload" />
          <span>Click to upload</span>
        </a>
      </b-upload>
      <span v-if="file" class="file-name">{{ file.name }}</span>
    </b-field>
    <a href="#" @click="loadFile()">
      <b-icon icon="upload" size="is-medium" type="is-dark" />
    </a>
  </section>
</template>
<script>
import RsService from "../services/RsService";
//import  * as parser from "xml2json";
// import FileReader from "FileReader";
//var parser = require('xml2json');
export default {
  name: "Admix",
  data() {
    return {
      action: null,
      file: null,
      fileExportType: null,
      fileImportType: null,
      fileFormat: null,
      response: null,
      documents: [],
      images: [],
      rollingstocks: [],
      data: null,
      fileName: "",
      fileContent: "",
      strArray: [],
      collection: [],
      fileRead: null,
    };
  },
  methods: {
    async saveFile() {
      switch (this.fileExportType) {
        case "AAR Codes":
          this.response = await RsService.fetchAarlist();
          this.documents = this.response.data.aarCodes;
          if (this.fileFormat === "Json") {
            this.fileName = "aarCodes.json";
            this.data = JSON.stringify(this.documents);
          } else {
            this.data = "Id,Update,AAR Code,RS Type,Description\n";
            this.fileName = "aarCodes.csv";
            var i;
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ",i," +
                this.documents[i].aarCode +
                "," +
                this.documents[i].rollingstockType +
                ',"' +
                this.documents[i].description +
                '"\n';
            }
          }
          break;
        case "Companies":
          this.response = await RsService.fetchColist();
          this.documents = this.response.data.industries;
          if (this.fileFormat === "Json") {
            this.fileName = "companies.json";
            this.data = JSON.stringify(this.documents);
          } else {
            this.data = "Id,Update,Short Name,Long Name,Type,Location\n";
            this.fileName = "companies.csv";
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ",i," +
                this.documents[i].shortName +
                "," +
                this.documents[i].longName +
                "," +
                this.documents[i].industryType +
                ',"' +
                this.documents[i].industryLocation +
                '"\n';
            }
          }
          break;
        case "Images":
          this.response = await RsService.fetchImglist();
          this.documents = this.response.data.images;
          if (this.fileFormat === "Json") {
            this.fileName = "images.json";
            this.data = JSON.stringify(this.documents);
          } else {
            this.data = "Id,Update,Title,File Name,Notes\n";
            this.fileName = "images.csv";
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                this.documents[i]._id +
                ",i," +
                this.documents[i].title +
                "," +
                this.documents[i].fileName +
                ',"' +
                this.documents[i].notes +
                '"\n';
            }
          }
          break;
        case "Rolling Stock":
          this.response = await RsService.fetchAllRslist();
          this.documents = this.response.data.rollingstocks;
          if (this.fileFormat === "Json") {
            this.fileName = "rollingstocks.json";
            this.data = JSON.stringify(this.documents);
          } else {
            this.data =
              "Id,Update,Road Name,Road Number,Color,AAR Code,Description,Builder,Built Date,Number Built";
            this.data +=
              ",In Service Date,Inside Length,Inside Height,Inside Width,Capacity,Weight Empty,Load Limit";
            this.data +=
              ",Last Maint Date,RS Status,Home Location,Location Now,Image ID,Model Weight,Model Length,RFID,Notes\n";
            this.fileName = "rollingstocks.csv";
            for (i = 0; i < this.documents.length; i++) {
              if (this.documents[i].bltDate === null) {
                this.documents[i].bltDate = "";
              }
              if (this.documents[i].inSvcDate === null) {
                this.documents[i].inSvcDate = "";
              }
              if (this.documents[i].lastMaintDate === null) {
                this.documents[i].lastMaintDate = "";
              }
              this.data +=
                this.documents[i]._id +
                ",i," +
                this.documents[i].roadName +
                "," +
                this.documents[i].roadNumber +
                "," +
                this.documents[i].color +
                "," +
                this.documents[i].aarCode +
                "," +
                this.documents[i].description +
                "," +
                this.documents[i].bldr +
                "," +
                this.documents[i].bltDate +
                "," +
                this.documents[i].numberBlt +
                "," +
                this.documents[i].inSvcDate +
                "," +
                this.documents[i].insideLength +
                "," +
                this.documents[i].insideHeight +
                "," +
                this.documents[i].insideWidth +
                "," +
                this.documents[i].capacity +
                "," +
                this.documents[i].ltWeight +
                "," +
                this.documents[i].loadLimit +
                "," +
                this.documents[i].lastMaintDate +
                "," +
                this.documents[i].rsStatus +
                "," +
                this.documents[i].homeLocation +
                "," +
                this.documents[i].locationNow +
                "," +
                this.documents[i].imageID +
                "," +
                this.documents[i].modelWeight +
                "," +
                this.documents[i].modelLength +
                "," +
                this.documents[i].rfid +
                ',"' +
                this.documents[i].notes +
                '"\n';
            }
          }
          break;
        case "DCC":
          {
            this.response = await RsService.fetchDcclist();
            this.documents = this.response.data.dccs;
            if (this.fileFormat === "Json") {
              this.fileName = "dcc.json";
              this.data = JSON.stringify(this.documents);
            } else {
              this.data = "Id,Update,Locomotive Id,Mfg,Family,Model,Address\n";
              this.fileName = "dcc.csv";
              for (i = 0; i < this.documents.length; i++) {
                this.data +=
                  '"' +
                  this.documents[i]._id +
                  '","i","' +
                  this.documents[i].locomotiveID +
                  '","' +
                  this.documents[i].mfg +
                  '","' +
                  this.documents[i].family +
                  '","' +
                  this.documents[i].model +
                  '","' +
                  this.documents[i].address +
                  '"\n';
              }
            }
          }
          break;
        case "Structures": {
          this.response = await RsService.fetchAllStructlist();
          this.documents = this.response.data.structures;
          if (this.fileFormat === "Json") {
            this.fileName = "structures.json";
            this.data = JSON.stringify(this.documents);
          } else {
            this.data =
              "Id,Update,Title,Use,Description,Owner,Location,Construction,Year Built,Size,Image,IsIndustrial,";
            this.data +=
              "Type,Raw Materials,RM Capacity,Consumption Rate,Priority,AAR Code In,Product,Production Capacity,";
            this.data +=
              "Production Rate,AAR Code Out,Unload Duration,Load Duration,Siding Capacity,Notes\n";
            this.fileName = "structures.csv";
            for (i = 0; i < this.documents.length; i++) {
              this.data +=
                '"' +
                this.documents[i]._id +
                '","i","' +
                this.documents[i].title +
                '","' +
                this.documents[i].structureUse +
                '","' +
                this.documents[i].description +
                '","' +
                this.documents[i].owner +
                '","' +
                this.documents[i].location +
                '","' +
                this.documents[i].construction +
                '","' +
                this.documents[i].builtDate +
                '","' +
                this.documents[i].size +
                '","' +
                this.documents[i].image +
                '","' +
                this.documents[i].isIndustrial;
              if (this.documents[i].isIndustrial) {
                this.data +=
                  '","' +
                  this.documents[i].type +
                  '","' +
                  this.documents[i].rawMaterials +
                  '","' +
                  this.documents[i].rMCapacity +
                  '","' +
                  this.documents[i].conRate +
                  '","' +
                  this.documents[i].priority +
                  '","' +
                  this.documents[i].aarCodeIn +
                  '","' +
                  this.documents[i].product +
                  '","' +
                  this.documents[i].productCap +
                  '","' +
                  this.documents[i].prodRate +
                  '","' +
                  this.documents[i].aarCodeOut +
                  '","' +
                  this.documents[i].unloadDuration +
                  '","' +
                  this.documents[i].loadDuration +
                  '","' +
                  this.documents[i].sidingCap +
                  '","' +
                  this.documents[i].notes +
                  '"\n';
              } else {
                this.data += '"\n';
              }
            }
          }
        }
      }
      const blob = new Blob([this.data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents");
      const a = document.createElement("a");
      a.download = this.fileName;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
      this.fileExportType = null;
      this.fileFormat = null;
      this.fileType = null;
    },
    async loadFile() {
      const getFileContent = (inputFile) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Problem parsing input file."));
          };
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsText(inputFile);
        });
      };
      this.fileContent = await getFileContent(this.file);
      switch (this.fileImportType) {
        case "AAR Codes": {
          var i = 0;
          var aarDoc = [];
          var collection = new Blob([], { type: "text/plain" });
          collection = this.fileContent.split("\n");
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"');
            aarDoc = this.documents[0].split(",");
            if (aarDoc[1] === "a") {
              await RsService.addAar({
                aarCode: aarDoc[2],
                rollingstockType: aarDoc[3],
                description: this.documents[1],
              });
            } else if (aarDoc[1] === "u") {
              await RsService.updateAar({
                id: aarDoc[0],
                aarCode: aarDoc[2],
                rollingstockType: aarDoc[3],
                description: this.documents[1],
              });
            }
          }
          this.fileImportType = null;
          this.$router.push({
            name: "Aarlist",
          });
          break;
        }
        case "Companies": {
          var coDoc = [];
          collection = new Blob([], { type: "text/plain" });
          collection = this.fileContent.split("\n");
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"');
            coDoc = this.documents[0].split(",");
            if (coDoc[1] === "a") {
              await RsService.addCo({
                shortName: coDoc[2],
                longName: coDoc[3],
                industryType: coDoc[4],
                industryLocation: this.documents[1],
              });
            } else if (coDoc[1] === "u") {
              await RsService.updateCo({
                id: coDoc[0],
                shortName: coDoc[2],
                longName: coDoc[3],
                industryType: coDoc[4],
                industryLocation: this.documents[1],
              });
            }
          }
          this.fileImportType = null;
          this.$router.push({
            name: "Colist",
          });
          break;
        }
        case "Images": {
          var imgDoc = [];
          collection = new Blob([], { type: "text/plain" });
          collection = this.fileContent.split("\n");
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"');
            imgDoc = this.documents[0].split(",");
            if (imgDoc[1] === "a") {
              await RsService.addImg({
                title: imgDoc[2],
                fileName: imgDoc[3],
                notes: this.documents[1],
              });
            } else if (imgDoc[1] === "u") {
              await RsService.updateImg({
                id: imgDoc[0],
                title: imgDoc[2],
                fileName: imgDoc[3],
                notes: this.documents[1],
              });
            }
          }
          this.fileImportType = null;
          this.$router.push({
            name: "Imglist",
          });
          break;
        }
        case "Rolling Stock": {
          var rsDoc = [];
          collection = new Blob([], { type: "text/plain" });
          collection = this.fileContent.split("\n");
          for (i = 1; i < collection.length - 1; i++) {
            this.documents = collection[i].split('"');
            rsDoc = this.documents[0].split(",");
            if (rsDoc[1] === "a") {
              await RsService.addRs({
                roadName: rsDoc[2],
                roadNumber: rsDoc[3],
                color: rsDoc[4],
                aarCode: rsDoc[5],
                description: rsDoc[6],
                bldr: rsDoc[7],
                bltDate: rsDoc[8],
                numberBlt: rsDoc[9],
                inSvcDate: rsDoc[10],
                insideLength: rsDoc[11],
                insideHeight: rsDoc[12],
                insideWidth: rsDoc[13],
                capacity: rsDoc[14],
                ltWeight: rsDoc[15],
                loadLimit: rsDoc[16],
                lastMaintDate: rsDoc[17],
                locationNow: rsDoc[18],
                homeLocation: rsDoc[19],
                rsStatus: rsDoc[20],
                imageID: rsDoc[21],
                modelWeight: rsDoc[22],
                modelLength: rsDoc[23],
                rfid: rsDoc[24],
                notes: this.documents[1],
              });
            } else if (rsDoc[1] === "u") {
              await RsService.updateRs({
                id: rsDoc[0],
                roadName: rsDoc[2],
                roadNumber: rsDoc[3],
                color: rsDoc[4],
                aarCode: rsDoc[5],
                description: rsDoc[6],
                bldr: rsDoc[7],
                bltDate: rsDoc[8],
                numberBlt: rsDoc[9],
                inSvcDate: rsDoc[10],
                insideLength: rsDoc[11],
                insideHeight: rsDoc[12],
                insideWidth: rsDoc[13],
                capacity: rsDoc[14],
                ltWeight: rsDoc[15],
                loadLimit: rsDoc[16],
                lastMaintDate: rsDoc[17],
                locationNow: rsDoc[18],
                homeLocation: rsDoc[19],
                rsStatus: rsDoc[20],
                imageID: rsDoc[21],
                modelWeight: rsDoc[22],
                modelLength: rsDoc[23],
                rfid: rsDoc[24],
                notes: this.documents[1],
              });
            }
          }
          this.fileImportType = null;
          this.$router.push({
            name: "Rslist",
          });
          break;
        }
        case "DCC":
          {
            var dccDoc = [];
            collection = new Blob([], { type: "text/plain" });
            collection = this.fileContent.split("\n");
            for (i = 1; i < collection.length - 1; i++) {
              dccDoc = collection[i].split('","');
              if (dccDoc[1] === "a") {
                await RsService.addDcc({
                  locomotiveID: dccDoc[2],
                  mfg: dccDoc[3],
                  family: dccDoc[4],
                  model: dccDoc[5],
                  address: dccDoc[6].slice(0, -1),
                });
              }
              if (dccDoc[1] === "u") {
                await RsService.updateDcc({
                  id: dccDoc[0].slice(1),
                  locomotiveID: dccDoc[2],
                  mfg: dccDoc[3],
                  family: dccDoc[4],
                  model: dccDoc[5],
                  address: dccDoc[6].slice(0, -1),
                });
              }
            }
            this.fileImportType = null;
            this.$router.push({
              name: "Locomotivelist",
            });
          }
          break;
        case "JMRI Roster":
          {
            var response = await RsService.fetchDcclist();
            var decoders = response.data.dccs;
            var convert = require("xml-js");
            var result = convert.xml2json(this.fileContent, {
              compact: true,
              spaces: 4,
            });
            var jmriRoster = JSON.parse(result);
            var locomotives =
              jmriRoster["roster-config"]["roster"]["locomotive"];
            for (i = 0; i < locomotives.length; i++) {
              const getDecoder = decoders.find(
                (decoder) =>
                  decoder.address === locomotives[i]._attributes.dccAddress
              );
              if (getDecoder == undefined) {
                response = await RsService.getRsRoad(
                  locomotives[i]._attributes.roadName +
                    "-" +
                    locomotives[i]._attributes.roadNumber
                );
                if (response.data.length == 0) {
                  alert(
                    "Locomotive " +
                      locomotives[i]._attributes.roadName +
                      " " +
                      locomotives[i]._attributes.roadNumber +
                      " is not in inventory"
                  );
                } else {
                  await RsService.addDcc({
                    locomotiveID: response.data._id,
                    mfg: locomotives[i]._attributes.mfg,
                    family: locomotives[i].decoder._attributes.family,
                    model: locomotives[i].decoder._attributes.model,
                    address: locomotives[i]._attributes.dccAddress,
                  });
                }
              } else {
                if (
                  getDecoder.mfg != locomotives[i]._attributes.mfg ||
                  getDecoder.family !=
                    locomotives[i].decoder._attributes.family ||
                  getDecoder.model != locomotives[i].decoder._attributes.model
                ) {
                  await RsService.updateDcc({
                    id: getDecoder._id,
                    locomotiveID: getDecoder.locomotiveID,
                    mfg: locomotives[i]._attributes.mfg,
                    family: locomotives[i].decoder._attributes.family,
                    model: locomotives[i].decoder._attributes.model,
                    address: getDecoder.address,
                  });
                }
              }
            }
            this.fileImportType = null;
            this.$router.push({
              name: "Locomotivelist",
            });
          }
          break;
        case "Structures": {
          i = 0;
          var structureDoc = [];
          var isIndustrial = false;
          collection = new Blob([], { type: "text/plain" });
          collection = this.fileContent.split("\n");
          for (i = 1; i < collection.length - 1; i++) {
            structureDoc = collection[i].split('","');
            if (structureDoc.length == 26) {
              isIndustrial = true;
            } else {
              isIndustrial = false;
            }
            if (structureDoc[1] === "a") {
              if (!isIndustrial) {
                await RsService.addStruct({
                  title: structureDoc[2],
                  structureUse: structureDoc[3],
                  description: structureDoc[4],
                  owner: structureDoc[5],
                  location: structureDoc[6],
                  construction: structureDoc[7],
                  builtDate: structureDoc[8],
                  size: structureDoc[9],
                  image: structureDoc[10],
                  isIndustrial: isIndustrial,
                });
              } else {
                await RsService.addStruct({
                  title: structureDoc[2],
                  structureUse: structureDoc[3],
                  description: structureDoc[4],
                  owner: structureDoc[5],
                  location: structureDoc[6],
                  construction: structureDoc[7],
                  builtDate: structureDoc[8],
                  size: structureDoc[9],
                  image: structureDoc[10],
                  isIndustrial: isIndustrial,
                  type: structureDoc[12],
                  rawMaterials: structureDoc[13],
                  rMCapacity: structureDoc[14],
                  conRate: structureDoc[15],
                  priority: structureDoc[16],
                  aarCodeIn: structureDoc[17],
                  product: structureDoc[18],
                  productCap: structureDoc[19],
                  prodRate: structureDoc[20],
                  aarCodeOut: structureDoc[21],
                  unloadDuration: structureDoc[22],
                  loadDuration: structureDoc[23],
                  sidingCap: structureDoc[24],
                  notes: structureDoc[25].slice(0, structureDoc[25].length - 1),
                });
              }
            }
            if (structureDoc[1] === "u") {
              if (!isIndustrial) {
                await RsService.updateStruct({
                  id: structureDoc[0].slice(1),
                  title: structureDoc[2],
                  structureUse: structureDoc[3],
                  description: structureDoc[4],
                  owner: structureDoc[5],
                  location: structureDoc[6],
                  construction: structureDoc[7],
                  builtDate: structureDoc[8],
                  size: structureDoc[9],
                  image: structureDoc[10],
                  isIndustrial: isIndustrial,
                });
              } else {
                await RsService.updateStruct({
                  id: structureDoc[0].slice(1),
                  title: structureDoc[2],
                  structureUse: structureDoc[3],
                  description: structureDoc[4],
                  owner: structureDoc[5],
                  location: structureDoc[6],
                  construction: structureDoc[7],
                  builtDate: structureDoc[8],
                  size: structureDoc[9],
                  image: structureDoc[10],
                  isIndustrial: isIndustrial,
                  type: structureDoc[12],
                  rawMaterials: structureDoc[13],
                  rMCapacity: structureDoc[14],
                  conRate: structureDoc[15],
                  priority: structureDoc[16],
                  aarCodeIn: structureDoc[17],
                  product: structureDoc[18],
                  productCap: structureDoc[19],
                  prodRate: structureDoc[20],
                  aarCodeOut: structureDoc[21],
                  unloadDuration: structureDoc[22],
                  loadDuration: structureDoc[23],
                  sidingCap: structureDoc[24],
                  notes: structureDoc[25].slice(0, structureDoc[25].length - 1),
                });
              }
            }
          }
          this.fileImportType = null;
          this.$router.push({
            name: "Structlist",
          });
          break;
        }
      }
      this.action = null;
      this.fileRead = null;
      this.file = null;
    },
  },
};
</script>
   <style scoped>
section {
  display: block;
  margin: auto;
  width: 250px;
  padding: 10px;
}
.center {
  text-align: center;
}
</style>
