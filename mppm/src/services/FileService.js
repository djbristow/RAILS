import store from "../store";
export default {
  valFileType(inptType, header) {
    let fileValid = "bad";
    if (inptType == null) {
      fileValid = "noType";
    } else if (header.includes("action")) {
      switch (inptType) {
        case "Purchases":
          if (
            header.includes("num") &&
            header.includes("store") &&
            header.includes("project")
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
    console.log ("item: ", item);
    switch (type) {
      case "Purchases":
        if (action == "a" || action == "u") {
          if (action == "a") {
            store.dispatch("addNewPurchase", item);
          } else {
            store.dispatch("updatePurchase", item);
          }
        } else if (action == "d") {
          store.dispatch("deletePurchase", item._id);
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
            store.dispatch("addNewProject", item);
          } else {
            store.dispatch("updateProject", item);
          }
        } else if (action == "d") {
          store.dispatch("deleteProject", item._id);
        } else {
          console.log("There is a problem");
        }
        break;
    }
  },
};
