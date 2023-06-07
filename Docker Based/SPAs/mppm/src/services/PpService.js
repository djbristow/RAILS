import ApiPp from './ApiPp'

export default {
  // MR Companies
  fetchMcolist () {
    return ApiPp().get('mcolist')
  },
  addMco (params) {
    return ApiPp().post('add_mco', params)
  },
  updateMco (params) {
    return ApiPp().put('update_mco/' + params.id, params)
  },
  getMco (params) {
    return ApiPp().get('mco/' + params.id)
  },
  deleteMco (id) {
    return ApiPp().delete('mco/' + id)
  },
  getMcoByName (name) {
    return ApiPp().get('mco_name/' + name)
  },
  // Projects
  fetchProjlist () {
    return ApiPp().get('projlist')
  },
  addProj (params) {
    return ApiPp().post('add_proj', params)
  },
  updateProj (params) {
    return ApiPp().put('update_proj/' + params.id, params)
  },
  deleteProj (id) {
    return ApiPp().delete('proj/' + id)
  },
  getProjByTitle (id) {
    return ApiPp().get('proj_title/' + id)
  },
  // Purchases
  fetchPurlist () {
    return ApiPp().get('purlist')
  },
  addPur (params) {
    return ApiPp().post('add_pur', params)
  },
  updatePur (params) {
    return ApiPp().put('update_pur/' + params.id, params)
  },
  deletePur (id) {
    return ApiPp().delete('pur/' + id)
  },
  getPurByNumber (number) {
    return ApiPp().get('pur_number/' + number)
  }, 
}
