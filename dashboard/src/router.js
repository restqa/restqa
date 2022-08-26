import {createRouter, createWebHashHistory} from "vue-router";
import Store from "./store/store";
import {trackRouter} from "vue-gtag-next";

const isBeta = Boolean(
  new Date("07/01/2021 00:00:00").getTime() - new Date().getTime() > 0
);

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  scrollBehavior() {
    return {
      left: 0,
      top: 0
    };
  },
  routes: [
    {
      path: isBeta ? "/" : "/coming-soon",
      component: () => import("./layouts/FullPage.vue"),
      children: [
        {
          path: "",
          name: "page-coming-soon",
          component: () => import("./views/pages/ComingSoon.vue"),
          meta: {
            title: "Coming soon!"
          }
        }
      ]
    },
    {
      path: isBeta ? "/beta" : "/",
      component: () => import("./layouts/Dashboard.vue"),
      children: [
        {
          path: "",
          name: "homepage",
          component: () => import("./views/homepage/Homepage.vue"),
          meta: {
            title: "Dashboard"
          }
        },
        {
          path: "/steps",
          name: "steps",
          component: () => import("./views/Steps/Steps.vue"),
          meta: {
            title: "Step definition"
          }
        },
        {
          path: "/editor",
          name: "editor",
          component: () => import("./views/editor/Editor.vue"),
          meta: {
            title: "Editor"
          }
        },
        {
          path: "/sandbox",
          name: "sandbox",
          component: () => import("./views/sandbox/Sandbox.vue"),
          meta: {
            title: "Sandbox"
          }
        },
        {
          path: "/features",
          name: "features",
          component: () => import("./views/testReport/Features.vue"),
          meta: {
            title: "Feature"
          }
        },
        {
          path: "/features/:id",
          name: "feature",
          component: () => import("./views/testReport/Feature.vue"),
          meta: {
            title: "Feature",
            parentRoute: "features"
          }
        },
        {
          path: "/specification",
          name: "specification",
          component: () => import("./views/openapi/Openapi.vue"),
          meta: {
            title: "API Specification"
          }
        },
        {
          path: "/performance",
          name: "performance",
          component: () => import("./views/performance/Performance.vue"),
          meta: {
            title: "Performance testing"
          }
        },
        {
          path: "/collection",
          name: "collection",
          component: () => import("./views/collection/Collection.vue"),
          meta: {
            title: "Collection"
          }
        },
        {
          path: "/http-mock",
          name: "http-mock",
          component: () => import("./views/http-mock/HttpMock.vue"),
          meta: {
            title: "HTTP Mock"
          }
        }
      ]
    }
  ]
});

router.beforeEach((to) => {
  if (to.name !== "homepage" && null === Store.getters.config) {
    //return {'name': 'homepage'}
  }
});

router.afterEach((to) => {
  document.title =
    (to.meta.title || "Testing with ❤️") + " | RestQA Dashboard 🦏";
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

trackRouter(router);

export default router;
