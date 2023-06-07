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
        case "MR Companies":
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
};
