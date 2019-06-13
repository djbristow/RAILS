import Api from './Api'

export default {
  updateRs (params) {
    return Api().put('rs/' + params.id, params)
  },
  getRsRfid (rfid) {
    return Api().get('rs_rfid/' + rfid)
  },
  getRs (params) {
    return Api().get('rs/' + params.id)
  },
  getRsRoad (params) {
    return Api().get('rs_road/' + params)
  }
}
