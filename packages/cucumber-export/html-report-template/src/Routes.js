import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/components/Layout/Layout'

// RestQA
import TestSuitesPage from '@/pages/RestQA/TestSuites'
import FeaturePage from '@/pages/RestQA/FeaturePage'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'TestSuitesPage',
          component: TestSuitesPage
        },
        {
          path: '/features/:id',
          name: 'FeaturePage',
          component: FeaturePage
        }
      ]
    }
  ],
})
