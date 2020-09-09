import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.component('v-select', vSelect)
new Vue({
  el: '#app',
  router,
  render: h => h(App),
}).$mount('#app')
