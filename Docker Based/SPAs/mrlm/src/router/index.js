import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import About from '../views/About.vue'
import MicroContlr from '../views/MicroContlr.vue'
import Panel from '../views/Panel.vue'
import Turnouts from '../views/Turnouts.vue'
import TPLights from '../views/TPLights.vue'
const routes = [
    {
      path: '/Admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/',
      name: 'About',
      component: About
    },
    {
      path: '/MicroContlr',
      name: 'MicroContlr',
      component: MicroContlr
    },
    {
      path: '/Panel',
      name: 'Panel',
      component: Panel
    },
    {
      path: '/Turnouts',
      name: 'Turnouts',
      component: Turnouts
    },
    {
      path: '/TPLights',
      name: 'TPLights',
      component: TPLights
    },
  ]
const router = createRouter({ history: createWebHashHistory(), routes })
export default router