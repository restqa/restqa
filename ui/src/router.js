import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "./layouts/Dashboard.vue";
import Homepage from "./views/Homepage.vue";
import Features from "./views/testReport/Features.vue";
import Feature from "./views/testReport/Feature.vue";
import Specification from "./views/specification/Specification.vue";
import Performance from "./views/performance/Performance.vue";
import Collection from "./views/collection/Collection.vue";
import Coverage from "./views/coverage/Coverage.vue";
import HttpMock from "./views/http-mock/HttpMock.vue";
import Documentation from "./views/documentation/Page.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
  routes: [
    {
      path: "/",
      component: Dashboard,
      children: [
        {
          path: "",
          name: "homepage",
          component: Homepage,
          meta: {
            title: "Dashboard",
          },
        },
        {
          path: "/features",
          name: "features",
          component: Features,
          meta: {
            title: "Test Report",
          },
        },
        {
          path: "/features/:id",
          name: "feature",
          component: Feature,
          meta: {
            title: "Feature",
            parentRoute: "features",
          },
        },
        {
          path: "/coverage",
          name: "coverage",
          component: Coverage,
          meta: {
            title: "Code Coverage",
          },
        },
        {
          path: "/specification",
          name: "specification",
          component: Specification,
          meta: {
            title: "API Specification",
          },
        },
        {
          path: "/performance",
          name: "performance",
          component: Performance,
          meta: {
            title: "Performance testing",
          },
        },
        {
          path: "/collection",
          name: "collection",
          component: Collection,
          meta: {
            title: "Collection",
          },
        },
        {
          path: "/http-mock",
          name: "http-mock",
          component: HttpMock,
          meta: {
            title: "HTTP Mock",
          },
        },
        {
          path: "/documentation/:id",
          name: "documentationPage",
          component: Documentation,
          meta: {
            title: "Documentation",
          },
        },
        {
          path: "/goto/:link",
          name: "goTo",
          component: Documentation,
          meta: {
            title: "External link",
          },
          beforeEnter(to) {
            window.open(to.params.link, "_blank");
          },
        },
      ],
    },
  ],
});

router.afterEach((to) => {
  document.title =
    (to.meta.title || "Testing with ❤️") + " | RestQA Dashboard 🦏";
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
