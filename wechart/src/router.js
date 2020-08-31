import Vue from 'vue'

import Router from 'vue-router'
import recycle from './views/Home.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/recycle',
      name: 'recycle',
      component: recycle
    },
    {
      path: '/vlist',
      name: 'vlist',
      component: () => import('./views/Vlist.vue')
    },
    {
      path: '/vlistMe',
      name: 'vlistMe',
      component: () => import('./views/VlistMe.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})