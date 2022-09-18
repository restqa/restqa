import {createApp} from "vue";
import VueGtag from "vue-gtag-next";
import router from "./router";
import store from "./store/store";

import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "./assets/theme/restqa/index.css";
import "./assets/scss/element-variables.scss";

import App from "./App.vue";

createApp(App)
  .use(ElementPlus)
  .use(router)
  .use(store)
  .use(VueGtag, {
    isEnabled: false,
    property: {
      id: "UA-118770210-1"
    }
  })
  .mount("#app");
