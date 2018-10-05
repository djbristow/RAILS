import Vue from 'vue'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueSelect from 'vue-select'
//import FileReader from 'FileReader'

Vue.use(Buefy)

Vue.config.productionTip = false
Vue.component('v-select', VueSelect)


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
