import Vue from 'vue'
import Router from 'vue-router'
import Manager from '@/components/Manager'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Manager',
      component: Manager
    }
  ]
})
