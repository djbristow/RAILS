import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/Home'
import Mcolist from 'components/Mcolist'
import NewMco from 'components/NewMco'
import EditMco from 'components/EditMco'
import Projlist from 'components/Projlist'
import NewProj from 'components/NewProj'
import EditProj from 'components/EditProj'
import Purlist from 'components/Purlist'
import EditPur from 'components/EditPur'
import NewPur from 'components/NewPur'
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
      path: '/Mcolist',
      name: 'Mcolist',
      component: Mcolist
    },
    {
      path: '/Mco/new',
      name: 'NewMco',
      component: NewMco
    },
    {
      path: '/Mco/:id',
      name: 'EditMco',
      component: EditMco
    },
    {
      path: '/Projlist',
      name: 'Projlist',
      component: Projlist
    },
    {
      path: '/EditProj',
      name: 'EditProj',
      component: EditProj
    },
    {
      path: '/Proj/new',
      name: 'NewImg',
      component: NewProj
    },
    {
      path: '/Purlist',
      name: 'Purlist',
      component: Purlist
    },
    {
      path: '/EditPur',
      name: 'EditPur',
      component: EditPur
    },
    {
      path: '/Pur/new',
      name: 'NewPur',
      component: NewPur
    },
    {
      path: '/Admix',
      name: 'Admix',
      component: Admix
    }
  ]
})
