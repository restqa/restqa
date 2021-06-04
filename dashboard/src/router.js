import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  scrollBehavior () {
    return {
      left: 0,
      top: 0
    }
  },
  routes: [{
    path: '/',
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
    path: '/beta',
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
      }
    ]
  }]
})

router.afterEach((to) => {
  document.title = (to.meta.title || 'Testing with ❤️') + ' | RestQA Dashboard 🦏'
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
