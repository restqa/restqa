import { getConfig } from '@/services/restqa/project'

const actions = {
  config ({ commit }) {
    commit('loadingConfig', true)
    return getConfig()
      .then(result => commit('config', result))
      .catch(() => {
        commit('config', false)
      })
      .finally(() => commit('loadingConfig', false))
  }
}

export default actions
