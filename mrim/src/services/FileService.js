import store from "../store";
export default {
  valFileType(inptType, header) {
    let fileValid = "bad";
    if (inptType == null) {
      fileValid = "noType";
    } else if (header.includes("action")) {
      switch (inptType) {
        case "AAR Codes":
          if (
            header.includes("aarCode") &&
            header.includes("description") &&
            header.includes("rollingstockType")
          ) {
            fileValid = "OK";
          }
          break;
        case "Companies":
          if (
            header.includes("shortName") &&
            header.includes("industryType") &&
            header.includes("industryLocation")
          ) {
            fileValid = "OK";
          }
          break;
        case "Images":
          if (
            header.includes("title") &&
            header.includes("fileName") &&
            header.includes("notes")
          ) {
            fileValid = "OK";
          }
          break;
        case "Rolling Stock":
          if (
            header.includes("roadName") &&
            header.includes("roadNumber") &&
            header.includes("aarCode")
          ) {
            fileValid = "OK";
          }
          break;
        case "Decoders":
          if (
            header.includes("locomotiveID") &&
            header.includes("mfg") &&
            header.includes("family")
          ) {
            fileValid = "OK";
          }
          break;
        case "Structures":
          if (
            header.includes("isIndustrial") &&
            header.includes("structureUse") &&
            header.includes("owner")
          ) {
            fileValid = "OK";
          }
          break;
      }
    } else {
      fileValid = "noAction";
    }
    console.log(fileValid);
    return fileValid;
  },
  importFileContent(items, fileType) {
    let i = 0;
    for (i in items) {
      this.handleDataStore(items[i], fileType);
    }
  },

  handleDataStore(item, type) {
    let action = item.action;
    delete item.action;
    if (action == "a" && item._id !== "") {
      delete item._id;
    }
    switch (type) {
      case "AAR Codes":
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewAarCode", item);
          } else {
            store.dispatch("updateAarCode", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteAarCode", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Companies":
        console.log(item);
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewCompany", item);
          } else {
            store.dispatch("updateCompany", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteCompany", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Images":
        if (action == "a" || action == "u") {
          if (action == "a") {
            console.log(item)
            store.dispatch("addNewImage", item);
          } else {
            store.dispatch("updateImage", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteImage", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Rolling Stock":
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewRs", item);
          } else {
            store.dispatch("updateRs", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteRs", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Decoders":
        if (action == "a") {
          store.dispatch("addNewDecoder", item);
        } else if ((action = "u")) {
          store.dispatch("updateDecoder", item);
        } else if (action == "d") {
          store.dispatch("deleteDecoder", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Structures":
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewStructure", item);
          } else {
            store.dispatch("updateStructure", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteStructure", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
    }
  },
};
