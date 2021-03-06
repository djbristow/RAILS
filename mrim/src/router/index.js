import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Rslist from '../components/Rslist'
import Locomotivelist from '../components/Locomotivelist'
import NewDcc from '../components/NewDcc'
import NewRs from '../components/NewRs'
import EditRs from '../components/EditRs'
import Imglist from '../components/Imglist'
import NewImg from '../components/NewImg'
import EditImg from '../components/EditImg'
import Aarlist from '../components/Aarlist'
import EditAar from '../components/EditAar'
import NewAar from '../components/NewAar'
import Colist from '../components/Colist'
import EditCo from '../components/EditCo'
import NewCo from '../components/NewCo'
import Structlist from '../components/Structlist'
import NewStruct from '../components/NewStruct'
import EditStruct from '../components/EditStruct'
import Admix from '../components/Admix'
import Report from '../components/Report'

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
      path: '/Rslist',
      name: 'Rslist',
      component: Rslist
    },
    {
      path: '/Locomotivelist',
      name: 'Locomotivelist',
      component: Locomotivelist
    },
    {
      path: '/RS/dcc',
      name: 'NewDcc',
      component: NewDcc,
    },
    {
      path: '/RS/new',
      name: 'NewRs',
      component: NewRs
    },
    {
      path: '/RS/:id',
      name: 'EditRs',
      component: EditRs
    },
    {
      path: '/Imglist',
      name: 'Imglist',
      component: Imglist
    },
    {
      path: '/EditImg',
      name: 'EditImg',
      component: EditImg
    },
    {
      path: '/Img/new',
      name: 'NewImg',
      component: NewImg
    },
    {
      path: '/Aarlist',
      name: 'Aarlist',
      component: Aarlist
    },
    {
      path: '/EditAar',
      name: 'EditAar',
      component: EditAar
    },
    {
      path: '/Aar/new',
      name: 'NewAar',
      component: NewAar
    },
    {
      path: '/Colist',
      name: 'Colist',
      component: Colist
    },
    {
      path: '/EditCo',
      name: 'EditCo',
      component: EditCo
    },
    {
      path: '/Co/new',
      name: 'NewCo',
      component: NewCo
    },
    {
      path: '/Structlist',
      name: 'Structlist',
      component: Structlist
    },
    {
      path: '/Struct/new',
      name: 'NewStruct',
      component: NewStruct
    },
    {
      path: '/EditStruct',
      name: 'EditStruct',
      component: EditStruct
    },
    {
      path: '/Admix',
      name: 'Admix',
      component: Admix
    },
    {
      path: '/Report',
      name: 'Report',
      component: Report
    }
  ]
})
