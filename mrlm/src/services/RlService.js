import ApiRl from './ApiRl'
import ApiTp from './ApiTp'
import ApiLight from './ApiLight'

export default {
  fetchTPLightList() {
    return ApiRl().get('tpllist')
  },
  deleteTPL(id) {
    return ApiRl().delete('tpl/' + id)
  },
  addTPL (params) {
    return ApiRl().post('add_tpl', params)
  },
  getTPLByTplnum (tplnum) {
    return ApiRl().get('tpl_num/' + tplnum)
  },
  updateTPL (params) {
    return ApiRl().put('update_tpl/' + params.id, params)
  },
  fetchToList () {
    return ApiRl().get('tolist')
  },
  getToByIdentity (params) {
    return ApiRl().get('to_ident/' + params)
  },
  getToByName (params) {
    return ApiRl().get('to_name/' + params)
  },
  getTo (params) {
    return ApiRl().get('to_id/' + params.id)
  },
  addTo (params) {
    return ApiRl().post('add_to', params)
  },
  updateTo (params) {
    return ApiRl().put('update_to/' + params.id, params)
  },
  deleteTo (id) {
    return ApiRl().delete('to/' + id)
  },
  fetchMicroList () {
    return ApiRl().get('microlist')
  },
  deleteMicro (id) {
    return ApiRl().delete('micro/' + id)
  },
  updateMicro (params) {
    return ApiRl().put('update_micro/' + params.id, params)
  },
  addMicro (params) {
    return ApiRl().post('add_micro', params)
  },
  getMicroByName (params) {
    return ApiRl().get('micro_name/' + params)
  },
  // mqtt
  postToMsg (params) {
    return ApiTp().post('to/', params)
  },
  postTplMsg (params) {
    return ApiLight().post('tpl/', params)
  }
}
