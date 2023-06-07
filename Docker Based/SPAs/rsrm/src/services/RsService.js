import ApiRs from './ApiRs'
import ApiMicro from './ApiMicro'

export default {
//Rollingstock Services
  addRs(params) {
    return ApiRs().post('add_rs', params)
  },
  updateRs (params) {
    return ApiRs().put('rs/' + params._id, params)
  },
  getRsRfid (rfid) {
    return ApiRs().get('rs_rfid/' + rfid)
  },
  getRs (params) {
    return ApiRs().get('' + params.id)
  },
  getRsRoad (params) {
    return ApiRs().get('rs_road/' + params)
  },
  fetchAllRslist() {
    return ApiRs().get('rslistall')
  },
  deleteRs(id) {
    return ApiRs().delete('rs/' + id)
  },
//AarCode Services
  fetchAarlist() {
    return ApiRs().get('aarlist')
  },
  getAarByCode(code) {
    return ApiRs().get("aar_code/" + code);
  },
  deleteAarCode(id) {
    return ApiRs().delete('aar/' + id)
  },
  updateAar(params) {
    return ApiRs().put('update_aar/' + params.id, params)
  },
  addAar(params) {
    return ApiRs().post('add_aar', params)
  },
// Micro-controller services
  fetchMicroList () {
    return ApiMicro().get('microlist')
  },
  deleteMicro (id) {
    return ApiMicro().delete('micro/' + id)
  },
  updateMicro (params) {
    return ApiMicro().put('update_micro/' + params.id, params)
  },
  addMicro (params) {
    return ApiMicro().post('add_micro', params)
  },
  getMicro (params) {
    return ApiMicro().get('micro/' + params.id)
  },
}