import Api from './Api'
import ApiToCmd from './ApiToCmd'

export default {
  fetchTPLightList() {
    return Api().get('tpllist')
  },
  deleteTPL(id) {
    return Api().delete('tpl/' + id)
  },
  addTPL (params) {
    return Api().post('add_tpl', params)
  },
  getTPL (params) {
    return Api().get('tpl_id/' + params.id)
  },
  updateTPL (params) {
    return Api().put('update_tpl/' + params.id, params)
  },
  fetchToList () {
    return Api().get('tolist')
  },
  getToByIdentity (params) {
    return Api().get('to_ident/' + params)
  },
  getToByName (params) {
    //console.log(params.id)
    return Api().get('to_name/' + params)
  },
  getTo (params) {
    return Api().get('to_id/' + params.id)
  },
  addTo (params) {
    return Api().post('add_to', params)
  },
  updateTo (params) {
    return Api().put('update_to/' + params.id, params)
  },
  deleteTo (id) {
    return Api().delete('to/' + id)
  },
  fetchMicroList () {
    return Api().get('microlist')
  },
  deleteMicro (id) {
    return Api().delete('micro/' + id)
  },
  updateMicro (params) {
    return Api().put('update_micro/' + params.id, params)
  },
  addMicro (params) {
    return Api().post('add_micro', params)
  },
  getMicro (params) {
    return Api().get('micro/' + params.id)
  },
  postMsg (params) {
    console.log(params)
    return ApiToCmd().post('to/', params)
  }
}
