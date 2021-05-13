import { shallowMount } from '@vue/test-utils'
import Loader	 from './Loader.vue'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('Loader', () => {
  test('Do not show the loader with the default value', async () => {

    const component = shallowMount(Loader)

    expect(component.isVisible()).toBeFalsy()

    await component.vm.$nextTick()

    expect(component.isVisible()).toBeFalsy()
  })

  test('Do not show the loader if the prop data passed is false', async () => {

    const component = shallowMount(Loader, {
      propsData: {
        show: false
      }
    })

    expect(component.isVisible()).toBeFalsy()

    await component.vm.$nextTick()

    expect(component.isVisible()).toBeFalsy()
  })

  test('Do not show then show the loader', async () => {

    const component = shallowMount(Loader, {
      propsData: {
        show: false
      }
    })

    await component.vm.$nextTick()

    expect(component.isVisible()).toBeFalsy()

    component.setProps({ show: true })

    await component.vm.$nextTick()

    expect(component.isVisible()).toBeTruthy()
  })
})

