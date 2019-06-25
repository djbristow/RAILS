import Api from './Api'

export default {
  fetchRslist () {
    return Api().get('rslist')
  },
  fetchAllRslist () {
    return Api().get('rslistall')
  },
  addRs (params) {
    return Api().post('add_rs', params)
  },
  updateRs (params) {
    return Api().put('rs/' + params.id, params)
  },
  getRs (params) {
    return Api().get('rs/' + params.id)
  },
  getRsById (id) {
    return Api().get('rs/' + id)
  },
  deleteRs (id) {
    return Api().delete('rs/' + id)
  },
  getRsRoad (params) {
    return Api().get('rs_road/' + params)
  },
  fetchImglist () {
    return Api().get('imglist')
  },
  getImg (params) {
    return Api().get('img/' + params.id)
  },
  getImgById (id) {
    return Api().get('img/' + id)
  },
  getImgByFile (fileName) {
    return Api().get('img_file/' + fileName)
  },
  deleteImg (id) {
    return Api().delete('img/' + id)
  },
  updateImg (params) {
    return Api().put('img/' + params.id, params)
  },
  addImg (params) {
    return Api().post('add_img', params)
  },
  fetchAarlist () {
    return Api().get('aarlist')
  },
  getAar (params) {
    return Api().get('aar/' + params.id)
  },
  getAarByCode (code) {
    return Api().get('aar_code/' + code)
  },
  deleteAar (id) {
    return Api().delete('aar/' + id)
  },
  updateAar (params) {
    return Api().put('aar/' + params.id, params)
  },
  addAar (params) {
    return Api().post('add_aar', params)
  },
  fetchColist () {
    return Api().get('colist')
  },
  getCo (params) {
    return Api().get('co/' + params.id)
  },
  getCoByName (name) {
    return Api().get('co_name/' + name)
  },
  deleteCo (id) {
    return Api().delete('co/' + id)
  },
  updateCo (params) {
    return Api().put('co/' + params.id, params)
  },
  addCo (params) {
    return Api().post('add_co', params)
  }
}
