import { mount } from '@vue/test-utils'
import RestQATips from './RestQATips.vue'
import ElementPlus from 'element-plus'

let mockGet

jest.mock('axios', () => {
  const originalModule = jest.requireActual('axios')
  return {
    ...originalModule,
    create: function() {
      return this
    },
    get: function () {
      return mockGet.apply(this, arguments)
    }
  }
})

beforeEach(() => {
  mockGet = undefined
})

describe('RestQATips', () => {

  test('render tips', async () => {

    const data = { 
      message: 'the tips of the day on https://restqa.io'
    }

    mockGet = jest.fn().mockResolvedValue({ data })

    const options = {
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQATips, options)

    expect(component.exists()).toBeTruthy()

    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'Card' }).vm.title).toEqual('Tips')
    expect(component.findComponent({ name: 'Card' }).vm.emoji).toEqual('💡')

    await component.vm.$nextTick()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet.mock.calls[0][0]).toBe('/api/tips')

    await component.vm.$nextTick()

    expect(component.find('.message').isVisible()).toBeTruthy()
    expect(component.find('.message').text()).toEqual('the tips of the day on https://restqa.io')
    expect(component.find('.message').html()).toMatch('<a href="https://restqa.io" target="_blank">https://restqa.io</a>')
  })

  test('render default tips if error happen during retrieving', async () => {

    mockGet = jest.fn().mockRejectedValue(new Error('the error'))

    const options = {
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQATips, options)

    expect(component.exists()).toBeTruthy()

    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'Card' }).vm.title).toEqual('Tips')
    expect(component.findComponent({ name: 'Card' }).vm.emoji).toEqual('💡')

    await component.vm.$nextTick()

    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet.mock.calls[0][0]).toBe('/api/tips')

    await component.vm.$nextTick()

    expect(component.find('.message').isVisible()).toBeTruthy()

    await component.vm.$nextTick()

    expect(component.find('.message').text()).toEqual('Share your feedback : https://restqa.io/feedback')
    expect(component.find('.message').html()).toMatch('<a href="https://restqa.io/feedback" target="_blank">https://restqa.io/feedback</a>')
  })
})
