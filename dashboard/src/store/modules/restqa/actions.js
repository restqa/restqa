import { getConfig } from '@/services/restqa/project'

const actions = {
  config ({ commit }) {
    commit('loadingConfig', true)
    return getConfig()
      .then(result => {
        commit('config', result)
        commit('selectedEnv', (result.environments.find(_ => _.default) || result.environments[0]).name)
      })
      .catch(() => commit('config', false))
      .finally(() => commit('loadingConfig', false))
  },
  selectedEnv ({ commit }, val) {
    commit('selectedEnv', val)
  }
}

export default actions
