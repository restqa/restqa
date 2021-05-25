import { shallowMount } from '@vue/test-utils'
import RestQAProjectInit from './RestQAProjectInit.vue'
import Loader from '../../utils/loader/Loader'
import { ForbiddenError, ValidationError } from '../../../services/http'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQAProjectInit', () => {
  test('Should show an error if the name is not defined when we try to trigger the initialization', async () => {
    const err = new ValidationError('Please share a project name.')
    const Service = {
      initialize: jest.fn().mockRejectedValue(err)
    }
    const component = shallowMount(RestQAProjectInit, {
      data() {
        return {
          Service 
        }
      }
    })
    expect(component.exists()).toBeTruthy()
    expect(component.findComponent(Loader).exists()).toBeTruthy()
    expect(component.findComponent(Loader).props('show')).toBeFalsy()

    const inputs = [
      'name',
      'description',
      'url',
      'env',
      'btn'
    ].reduce((obj, item) => {
      obj[item] = component.find(`#${item}`)
      return obj
    }, {})

    await inputs.btn.trigger('click')

    expect(component.findComponent(Loader).props('show')).toBeTruthy()

    await component.vm.$nextTick()
    
    expect(Service.initialize).toHaveBeenCalledTimes(1)
    const expectedData = {}
    expect(Service.initialize.mock.calls[0][0]).toEqual(expectedData)

    await component.vm.$nextTick()

    const alert = component.find('.alert')
    expect(alert.classes('warning')).toBe(true)
    expect(alert.isVisible()).toBeTruthy()
    expect(alert.text()).toEqual('Please share a project name.')

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
  })

  test('Should show an error if the backend has a server error', async () => {
    const err = new Error('Backend server error')
    const Service = {
      initialize: jest.fn().mockRejectedValue(err)
    }
    const component = shallowMount(RestQAProjectInit, {
      data() {
        return {
          Service 
        }
      }
    })
    expect(component.exists()).toBeTruthy()
    expect(component.findComponent(Loader).exists()).toBeTruthy()
    expect(component.findComponent(Loader).props('show')).toBeFalsy()

    const inputs = [
      'name',
      'description',
      'url',
      'env',
      'btn'
    ].reduce((obj, item) => {
      obj[item] = component.find(`#${item}`)
      return obj
    }, {})

    await inputs.btn.trigger('click')

    expect(component.findComponent(Loader).props('show')).toBeTruthy()

    await component.vm.$nextTick()
    
    expect(Service.initialize).toHaveBeenCalledTimes(1)
    const expectedData = {}
    expect(Service.initialize.mock.calls[0][0]).toEqual(expectedData)

    await component.vm.$nextTick()

    const alert = component.find('.alert')
    expect(alert.classes('error')).toBe(true)
    expect(alert.isVisible()).toBeTruthy()
    expect(alert.text()).toEqual('Backend server error')

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
  })

  test('Should initalize the project', async () => {
    const Service = {
      initialize: jest.fn().mockResolvedValue({
        folder: '/tmp/project/',
        configuration: '/tmp/project/.restqa.yml'
      })
    }
    const component = shallowMount(RestQAProjectInit, {
      data() {
        return {
          Service 
        }
      }
    })
    expect(component.exists()).toBeTruthy()
    expect(component.findComponent(Loader).exists()).toBeTruthy()
    expect(component.findComponent(Loader).props('show')).toBeFalsy()

    const expectedData = {
      name: 'backend api',
      description: 'The backend apis used by all the corporate frontend clients',
      url: 'https://api.restqa.io',
      env: 'prod'
    }

    const inputs = [
      'name',
      'description',
      'url',
      'env',
    ].reduce((obj, item) => {
      obj[item] = component.find(`#${item}`)
      obj[item].setValue(expectedData[item])
      return obj
    }, {})

    inputs.btn = component.find('#btn')
    await inputs.btn.trigger('click')

    expect(component.findComponent(Loader).props('show')).toBeTruthy()

    await component.vm.$nextTick()
    
    expect(Service.initialize).toHaveBeenCalledTimes(1)
    expect(Service.initialize.mock.calls[0][0]).toEqual(expectedData)

    await component.vm.$nextTick()

    const alert = component.find('.alert')
    expect(alert.classes('success')).toBe(true)
    expect(alert.isVisible()).toBeTruthy()
    expect(alert.text()).toEqual('🚀🚀 Your project has been created successfully!')

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
  })
})

