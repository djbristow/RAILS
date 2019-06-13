import Vue from 'vue'
import App from './App'
import router from './router'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false
Vue.use(Buefy)
new Vue({
  data: {
    rollingstock: []
  },
  router,
  render: h => h(App)
}).$mount('#app')
