import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import ToList from 'components/ToList'
import NewTo from 'components/NewTo'
import EditTo from 'components/EditTo'
import MicroList from 'components/MicroList'
import EditMicro from 'components/EditMicro'
import NewMicro from 'components/NewMicro'
import Admix from 'components/Admix'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/ToList',
      name: 'ToList',
      component: ToList
    },
    {
      path: '/TO/new',
      name: 'NewTo',
      component: NewTo
    },
    {
      path: '/TO/:id',
      name: 'EditTo',
      component: EditTo
    },
    {
      path: '/MicroList',
      name: 'MicroList',
      component: MicroList
    },
    {
      path: '/Micro/new',
      name: 'NewMicro',
      component: NewMicro
    },
    {
      path: '/Micro/:id',
      name: 'EditMicro',
      component: EditMicro
    },
    {
      path: '/Admix',
      name: 'Admix',
      component: Admix
    }
  ]
})
