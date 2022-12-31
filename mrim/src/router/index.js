import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import About from '../views/About.vue'
import Rollingstock from '../views/Rollingstock.vue'
import AarCodes from '../views/AarCodes.vue'
import Structures from '../views/Structures.vue'
import Companies from '../views/Companies.vue'
import Locomotives from '../views/Locomotives.vue'
import Decoders from '../views/Decoders.vue'
import Images from '../views/Images.vue'
const routes = [
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/',
    name: 'About',
    component: About,
  },
  {
    path: '/rollingstock',
    name: 'Rollingstock',
    component: Rollingstock,
  },
  {
    path: '/aarcodes',
    name: 'AarCodes',
    component: AarCodes,
  },
  {
    path: '/structures',
    name: 'Structures',
    component: Structures,
  },
  {
    path: '/companies',
    name: 'Companies',
    component: Companies,
  },
  {
    path: '/locomotives',
    name: 'Locomotives',
    component: Locomotives,
  },
  {
    path: '/decoders',
    name: 'Decoders',
    component: Decoders,
  },
  {
    path: '/images',
    name: 'Images',
    component: Images,

  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;