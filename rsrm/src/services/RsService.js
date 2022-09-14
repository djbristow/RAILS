import ApiRs from './ApiRs'
import ApiMicro from './ApiMicro'

export default {
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
    return ApiRs().get('rs/' + params.id)
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
