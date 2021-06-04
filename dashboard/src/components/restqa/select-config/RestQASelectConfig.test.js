import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus';
import RestQASelectConfig from './RestQASelectConfig.vue'

describe('RestQASelectConfig', () => {
  let store
  let mockEnvs
  let mockSelectedEnv
  let actions = {
    selectedEnv: jest.fn((_, env) => mockSelectedEnv = env)
  }

  beforeEach(() => {
    store = createStore({
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

  test('Should show the config environments', async () => {
    mockEnvs = ['local', 'uat']
    mockSelectedEnv = 'local'
    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      }
    }
    const component = mount(RestQASelectConfig, options)

    expect(component.exists()).toBeTruthy()
    await component.vm.$nextTick()

    const select = component.findComponent('.select')
    const envs = select.findAllComponents('.option')
    expect(envs.length).toEqual(2)
    expect(envs[0].text()).toEqual('local')
    expect(envs[1].text()).toEqual('uat')
    
    expect(component.vm.$data.env).toEqual('local')

    await component.vm.$nextTick()

    await envs[1].trigger('click')

    await component.vm.$nextTick()

    expect(actions.selectedEnv).toHaveBeenCalledTimes(1)
    expect(actions.selectedEnv.mock.calls[0][1]).toEqual('uat')
  })
})

