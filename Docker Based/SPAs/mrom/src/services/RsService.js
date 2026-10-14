import ApiRs from "./ApiRs";

export default {
  // Rollingstock Services
  getRsRoad(params) {
    return ApiRs().get("rs_road/" + params);
  },
  fetchAllRslist() {
    return ApiRs().get("rslistall");
  },
    getRsRfid (rfid) {
    return ApiRs().get('rs_rfid/' + rfid)
  },
  // AarCode Services
  fetchAarlist() {
    return ApiRs().get("aarlist");
  },
  getAarByCode(code) {
    return ApiRs().get("aar_code/" + code);
  },
  // Structures Services
  fetchAllStructlist() {
    return ApiRs().get("structlistall");
  },
  getStructByTitle(title) {
    return ApiRs().get("struct_title/" + title);
  },
  // Companies Services
  fetchCoList() {
    return ApiRs().get("colist");
  },
  getCoByName(name) {
    return ApiRs().get("co_name/" + name);
  },
};
