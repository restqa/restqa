import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'

import ElementPlus from 'element-plus'
import Store from '@/store/modules/restqa'

let mockIsEnabled = {
  value: false
}

jest.mock('vue-gtag-next', () => {
  return {
    useState: () => {
      return {
        isEnabled: mockIsEnabled
      }
    }
  }
})

import App from './App.vue'

describe('App', () => {
  let store
  let mockPreferences

  Store.getters.preferences = () => mockPreferences
  Store.actions.preferences = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    store = createStore({
      modules: {
        restqa: Store
      }
    })
  })

  test('Enable the gtm tracking if telemetry is enabled', async () => {

    mockPreferences = { telemetry: true }

    const options = {
      global: {
        stubs: ['router-view'],
        plugins: [
          store,
          ElementPlus
        ]
      }
    }

    const component = mount(App, options)
    expect(component.exists()).toBeTruthy()

    expect(Store.actions.preferences).toHaveBeenCalledTimes(1)

    component.vm.$options.watch.telemetry.call(component.vm, mockPreferences.telemetry)

    await component.vm.$nextTick()

    expect(mockIsEnabled.value).toBe(true)
  })

  test('Disabled the gtm tracking if telemetry is enabled', async () => {

    mockPreferences = { telemetry: false }

    const options = {
      global: {
        stubs: ['router-view'],
        plugins: [
          store,
          ElementPlus
        ]
      }
    }

    const component = mount(App, options)
    expect(component.exists()).toBeTruthy()

    expect(Store.actions.preferences).toHaveBeenCalledTimes(1)

    component.vm.$options.watch.telemetry.call(component.vm, mockPreferences.telemetry)

    await component.vm.$nextTick()

    expect(mockIsEnabled.value).toBe(false)
  })
})

