import { createStore } from "vuex";
import restqa from "./modules/restqa";

export default createStore({
  modules: {
    restqa,
  },
  strict: import.meta.env.DEV,
});
