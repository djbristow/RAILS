import Api from './Api'

export default {
  fetchMcolist () {
    return Api().get('mcolist')
  },
  addMco (params) {
    return Api().post('add_mco', params)
  },
  updateMco (params) {
    return Api().put('mco/' + params.id, params)
  },
  getMco (params) {
    return Api().get('mco/' + params.id)
  },
  deleteMco (id) {
    return Api().delete('mco/' + id)
  },
  fetchUniqueProjectTypes () {
    return Api().get('projectlisttype')
  },
  fetchProjlist () {
    return Api().get('projlist')
  },
  getProj (params) {
    return Api().get('proj/' + params.id)
  },
  getProjById (id) {
    return Api().get('proj/' + id)
  },
  deleteProj (id) {
    return Api().delete('proj/' + id)
  },
  updateProj (params) {
    return Api().put('proj/' + params.id, params)
  },
  addProj (params) {
    return Api().post('add_proj', params)
  },
  fetchPurlist () {
    return Api().get('purlist')
  },
  getPur (params) {
    return Api().get('pur/' + params.id)
  },
  deletePur (id) {
    return Api().delete('pur/' + id)
  },
  updatePur (params) {
    return Api().put('pur/' + params.id, params)
  },
  addPur (params) {
    return Api().post('add_pur', params)
  }
}
