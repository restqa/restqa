import { createApp } from "vue";
import VueGtag from "vue-gtag-next";
import router from "./router";
import store from "./store/store";

import "@element-plus/theme-chalk/dist/index.css";
import "./assets/theme/restqa/index.css";
import "./assets/scss/element-variables.scss";
import "vue-prism-editor/dist/prismeditor.min.css";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism-tomorrow.css";

import App from "./App.vue";

createApp(App)
  .use(router)
  .use(store)
  .use(VueGtag, {
    isEnabled: false,
    property: {
      id: "UA-118770210-1",
    },
  })
  .mount("#app");
