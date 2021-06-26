import { mount } from '@vue/test-utils'
import ElementPlus from 'element-plus'
import RestQAProjectEditorIde from './RestQAProjectEditorIde.vue'
import { ForbiddenError } from '../../../../services/http.js'

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
  mockGet = null
})

describe('RestQAProjectEditorIde', () => {

  test('Load the file content', async () => {

    const data = 'The file content'
    mockGet = jest.fn().mockResolvedValue({ data })

    const options = {
      props: {
        file: 'foo.feature'
      },
      global: {
        plugins: [
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditorIde, options)

    await component.vm.$nextTick()

    expect(component.exists()).toBeTruthy()

    await component.vm.$nextTick()

    expect(component.vm.code).toEqual('')

    await component.vm.$nextTick()

    expect(mockGet).toHaveBeenCalledTimes(1)

    await component.vm.$nextTick()

    expect(component.findComponent({name: 'el-alert'}).exists()).toBeFalsy()

    await component.vm.$nextTick()

    expect(component.findComponent('.ide').exists()).toBeTruthy()
    expect(component.vm.code).toEqual(data)
  })

  test('Show error when the file can\'t be loaded', async () => {

    mockGet = jest.fn().mockRejectedValue(new ForbiddenError('this is an error'))

    const options = {
      props: {
        file: 'foo.feaure'
      },
      global: {
        plugins: [
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditorIde, options)
    await component.vm.$nextTick()
    expect(component.exists()).toBeTruthy()
    await component.vm.$nextTick()
    expect(component.vm.code).toEqual('')
    await component.vm.$nextTick()
    expect(mockGet).toHaveBeenCalledTimes(1)
    await component.vm.$nextTick()
    expect(component.findComponent('.ide').exists()).toBeFalsy()
    await component.vm.$nextTick()
    expect(component.vm.code).toEqual('')
    await component.vm.$nextTick()
    expect(component.findComponent({name: 'el-alert'}).isVisible()).toBeTruthy()
    expect(component.findComponent({name: 'el-alert'}).vm.type).toBe('error')
    expect(component.findComponent({name: 'el-alert'}).text()).toBe('An error occured: this is an error')
  })

  test('Do not Load the file content because the file is not passed', async () => {

    mockGet = jest.fn()

    const options = {
      global: {
        plugins: [
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditorIde, options)
    expect(component.exists()).toBeTruthy()
    expect(component.vm.code).toEqual('')
    expect(mockGet).toHaveBeenCalledTimes(0)
    expect(component.findComponent('.ide').exists()).toBeFalsy()
    expect(component.vm.code).toEqual('')
    await component.vm.$nextTick()
    expect(component.findComponent({name: 'el-alert'}).isVisible()).toBeTruthy()
    expect(component.findComponent({name: 'el-alert'}).vm.type).toBe('error')
    expect(component.findComponent({name: 'el-alert'}).text()).toBe('An error occured: the file can\'t be loaded')
  })
})
