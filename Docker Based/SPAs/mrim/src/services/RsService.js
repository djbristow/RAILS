import ApiRs from "./ApiRs";

export default {
  // Rollingstock Services
  addRs(params) {
    return ApiRs().post("add_rs", params);
  },
  updateRs(params) {
    return ApiRs().put("rs/" + params._id, params);
  },
  getRsRoad(params) {
    return ApiRs().get("rs_road/" + params);
  },
  fetchAllRslist() {
    return ApiRs().get("rslistall");
  },
  deleteRs(id) {
    return ApiRs().delete("rs/" + id);
  },
  // AarCode Services
  fetchAarlist() {
    return ApiRs().get("aarlist");
  },
  deleteAarCode(id) {
    return ApiRs().delete("aar/" + id);
  },
  updateAar(params) {
    return ApiRs().put("update_aar/" + params.id, params);
  },
  addAar(params) {
    return ApiRs().post("add_aar", params);
  },
  getAarByCode(code) {
    return ApiRs().get("aar_code/" + code);
  },
  // Structures Services
  addStruct(params) {
    console.log("params: ", params)
    return ApiRs().post("add_struct", params);
  },
  deleteStruct(id) {
    return ApiRs().delete("struct/" + id);
  },
  updateStruct(params) {
    return ApiRs().put("update_struct/" + params._id, params);
  },
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
  addCo(params) {
    return ApiRs().post("add_co", params);
  },
  deleteCo(id) {
    return ApiRs().delete("co/" + id);
  },
  updateCo(params) {
    return ApiRs().put("update_co/" + params.id, params);
  },
  getCoByName(name) {
    return ApiRs().get("co_name/" + name);
  },
  // Decoders Services
  fetchDcclist() {
    return ApiRs().get("dcclistall");
  },
  addDcc(params) {
    return ApiRs().post("add_dcc", params);
  },
  updateDcc(params) {
    return ApiRs().put("update_dcc/" + params.id, params);
  },
  deleteDcc(id) {
    return ApiRs().delete("dcc/" + id);
  },
  getDccByAddr(addr) {
    return ApiRs().get("dcc_addr/" + addr);
  },
  // Images Services
  fetchImglist() {
    return ApiRs().get("imglist");
  },
   getImgByFile(fileName) {
    return ApiRs().get("img_file/" + fileName);
  },
  deleteImg(id) {
    return ApiRs().delete("img/" + id);
  },
  updateImg(params) {
    return ApiRs().put("update_img/" + params.id, params);
  },
  addImg(params) {
    console.log("params: ", params);
    return ApiRs().post("add_img", params);
  },
};
