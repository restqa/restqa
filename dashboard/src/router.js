import { createRouter, createWebHashHistory } from 'vue-router'
import Store from './store/store'
import { trackRouter } from "vue-gtag-next";

const isBeta = Boolean((new Date('07/01/2021 00:00:00').getTime() - new Date().getTime()) > 0)

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  scrollBehavior () {
    return {
      left: 0,
      top: 0
    }
  },
  routes: [{
    path: isBeta ? '/' : '/coming-soon',
    component: () => import('./layouts/FullPage.vue'),
    children: [{
      path: '',
      name: 'page-coming-soon',
      component: () => import('./views/pages/ComingSoon.vue'),
      meta: {
        title: 'Coming soon!'
      }
    }]
  }, {
    path: isBeta ? '/beta' : '/',
    component: () => import('./layouts/Dashboard.vue'),
    children: [{
        path: '',
        name: 'homepage',
        component: () => import('./views/Homepage.vue'),
        meta: {
          title: 'Dashboard'
        }
      }, {
        path: '/steps',
        name: 'steps',
        component: () => import('./views/Steps/Steps.vue'),
        meta: {
          title: 'Step definition'
        }
      }, {
        path: '/editor',
        name: 'editor',
        component: () => import('./views/editor/Editor.vue'),
        meta: {
          title: 'Editor'
        }
      }
    ]
  }]
})

router.beforeEach((to) => {
  if (to.name !== 'homepage' && null === Store.getters.config) {
    //return {'name': 'homepage'}
  }
})

router.afterEach((to) => {
  document.title = (to.meta.title || 'Testing with ❤️') + ' | RestQA Dashboard 🦏'
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

trackRouter(router)

export default router
