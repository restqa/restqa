import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import RestQASelectConfig from './RestQASelectConfig.vue'

const localVue = createLocalVue()
localVue.use(Vuex)


afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQASelectConfig', () => {
  let store
  let mockEnvs
  let mockSelectedEnv
  let actions = {
    selectedEnv: jest.fn((_, env) => mockSelectedEnv = env)
  }

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        restqa: {
          state: {},
          actions,
          getters: {
            environments: () => mockEnvs,
            selectedEnv: () => mockSelectedEnv,
          }
        }
      }
    })
  })

  test('Should not show the config environments if the list is empty', () => {
    mockEnvs = []
    const options = {
      localVue,
      store
    }
    const component = shallowMount(RestQASelectConfig, options)

    expect(component.exists()).toBeTruthy()
    expect(component.isVisible()).toBeFalsy()
  })

  test('Should show the config environments', async () => {
    mockEnvs = ['local', 'uat']
    mockSelectedEnv = 'local'
    const options = {
      localVue,
      store
    }
    const component = shallowMount(RestQASelectConfig, options)

    expect(component.exists()).toBeTruthy()
    expect(component.isVisible()).toBeTruthy()

    const select = component.find('select#environments')
    const envs = select.findAll('option')
    expect(envs.length).toEqual(2)
    expect(envs.at(0).text()).toEqual('local')
    expect(envs.at(1).text()).toEqual('uat')
    
    expect(component.vm.$data.env).toEqual('local')

    await component.vm.$nextTick()

    envs.at(1).setSelected()

    await component.vm.$nextTick()

    expect(actions.selectedEnv).toHaveBeenCalledTimes(1)
    expect(actions.selectedEnv.mock.calls[0][1]).toEqual('uat')
  })
})

