import { createApp } from "vue";
import { RouterFullReport, RouterPartialReport } from "./router";
import store from "./store/store";
import App from "./App.vue";

import "./assets/scss/element-variables.scss";

import "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-gherkin";
import "prismjs/components/prism-bash";
import "prism-themes/themes/prism-dracula.css";

let router = RouterFullReport;
if (false === store.getters.result.isFullReport()) {
  router = RouterPartialReport;
}
createApp(App).use(router).use(store).mount("#app");
