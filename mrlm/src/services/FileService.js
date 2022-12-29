import store from "../store";
export default {
  valFileType(inptType, header) {
    let fileValid = "bad";
    if (inptType == null) {
      fileValid = "noType";
    } else if (header.includes("action")) {
      switch (inptType) {
        case "Micros":
          if (
            header.includes("microID") &&
            header.includes("microIP") &&
            header.includes("et")
          ) {
            fileValid = "OK";
          }
          break;
        case "MrCompanies":
          if (
            header.includes("name") &&
            header.includes("website") &&
            header.includes("phone")
          ) {
            fileValid = "OK";
          }
          break;
        case "Projects":
          if (
            header.includes("title") &&
            header.includes("startdate") &&
            header.includes("enddate")
          ) {
            fileValid = "OK";
          }
          break;
      }
    } else {
      fileValid = "noAction";
    }
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
      case "Micros":
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewMicro", item);
          } else {
            store.dispatch("updateMicro", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteMicro", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "MrCompanies":
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewMrco", item);
          } else {
            store.dispatch("updateMrco", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteMrco", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
      case "Projects":
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewProjects", item);
          } else {
            store.dispatch("updateProjects", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteProjects", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
    }
  },
};
