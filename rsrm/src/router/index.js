import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import About from '../views/About.vue'
import Rollingstock from '../views/Rollingstock.vue'
import Reader from '../views/Reader.vue'
import AarCodes from '../views/AarCodes.vue'

const routes = [
  {
    path: '/',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/rollingstock',
    name: 'Rollingstock',
    component: Rollingstock,
  },
  {
    path: '/reader',
    name: 'Reader',
    component: Reader,
  },
  {
    path: '/aarcodes',
    name: 'AarCodes',
    component: AarCodes,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;