import { getConfig, getStepDefinition, getFeatures } from '@/services/restqa/project'
import Info from '@/services/restqa/info'

import DefaultInfo from '@/assets/data/info.json'

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
  },
  info({ commit }) {
    return Info.get()
      .then(result => {
        commit('info', result)
      })
      .catch(() => {
        commit('info', DefaultInfo)
      })
  },
  steps({ commit }) {
    return getStepDefinition()
      .then(result => {
        commit('steps', result)
      })
      .catch(() => {
      })
  },
  features({ commit }) {
    return getFeatures()
      .then(result => {
        commit('features', result)
      })
      .catch(() => {
      })
  },
  selectedFile({ commit }, val) {
    val.filename && commit('selectedFile', val.filename)
  }
}

export default actions
