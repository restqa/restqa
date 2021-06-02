import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  scrollBehavior () {
    return {
      left: 0,
      top: 0
    }
  },
  routes: [
    {
      path: '/',
      component: () => import('./layouts/Dashboard.vue'),
      children: [
        {
          path: '/',
          name: 'homepage',
          component: () => import('./views/Homepage.vue')
        },
        {
          path: '/steps',
          name: 'steps',
          component: () => import('./views/Steps/Steps.vue')
        }
      ]
    }
  ]
})

export default router
