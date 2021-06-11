import { createStore } from 'vuex'
import restqa from './modules/restqa'

export default createStore({
  modules: {
    restqa
  },
  strict: process.env.NODE_ENV !== 'production'
})
