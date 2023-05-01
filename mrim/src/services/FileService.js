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
};
