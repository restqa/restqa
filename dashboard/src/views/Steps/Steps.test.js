import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'

import ElementPlus from 'element-plus'
import Store from '@/store/modules/restqa'
import Steps from './Steps.vue'
import RestQAProjectSteps from '@/components/restqa/project-steps/RestQAProjectSteps.vue'


describe('RestQASteps', () => {
  let store
  let mockSteps

  Store.getters.steps = () => mockSteps
  Store.actions.steps = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    store = createStore({
      modules: {
        restqa: Store
      }
    })
  })

  test('Renders the components without data if the data are not arrived yet', async () => {

    mockSteps = null

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
      shallow: false
    }

    const component = mount(Steps, options)
    expect(component.exists()).toBeTruthy()

    expect(Store.actions.steps).toHaveBeenCalledTimes(1)

    const wrappers = component.findAllComponents(RestQAProjectSteps)
    expect(wrappers.length).toBe(3)

    await component.vm.$nextTick()

    expect(wrappers[0].props('keyword')).toBe('given')
    expect(wrappers[0].props('data')).toEqual(null)

    expect(wrappers[1].props('keyword')).toBe('when')
    expect(wrappers[1].props('data')).toEqual(null)

    expect(wrappers[2].props('keyword')).toBe('then')
    expect(wrappers[2].props('data')).toEqual(null)
  })

  test('Renders the components', async () => {

    mockSteps = [{
      plugin: '@restqa/restqapi',
      keyword: 'Given',
      step: 'I have the api gateway',
      comment: 'Initiate the api call'
    }, {
      plugin: '@restqa/faker-plugin',
      keyword: 'Given',
      step: 'I have the cookie',
      comment: 'Adding the cookie'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'When',
      step: 'I call the api',
      comment: 'I call the api'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'Then',
      step: 'The response status is should be {string}',
      comment: 'Check the response status'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'Then',
      step: 'The response header contains {string}',
      comment: 'Check the response headers'
    }]

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
      shallow: false
    }

    const component = mount(Steps, options)
    expect(component.exists()).toBeTruthy()

    expect(Store.actions.steps).toHaveBeenCalledTimes(1)

    const wrappers = component.findAllComponents(RestQAProjectSteps)
    expect(wrappers.length).toBe(3)

    await component.vm.$nextTick()

    expect(wrappers[0].props('keyword')).toBe('given')
    const expectedGivenData = mockSteps.filter(step => step.keyword === 'Given')
    expect(wrappers[0].props('data')).toEqual(expectedGivenData)

    expect(wrappers[1].props('keyword')).toBe('when')
    const expectedWhenData = mockSteps.filter(step => step.keyword === 'When')
    expect(wrappers[1].props('data')).toEqual(expectedWhenData)

    expect(wrappers[2].props('keyword')).toBe('then')
    const expectedThenData = mockSteps.filter(step => step.keyword === 'Then')
    expect(wrappers[2].props('data')).toEqual(expectedThenData)
  })

  test('filter the list of steps by keyword (steps)', async () => {

    mockSteps = [{
      plugin: '@restqa/restqapi',
      keyword: 'Given',
      step: 'I have the api gateway',
      comment: 'Initiate the api instance'
    }, {
      plugin: '@restqa/faker-plugin',
      keyword: 'Given',
      step: 'I have the cookie',
      comment: 'Adding the cookie'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'When',
      step: 'I call the api',
      comment: 'I call the api'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'Then',
      step: 'The response status is should be {string}',
      comment: 'Check the response status'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'Then',
      step: 'The response header contains {string}',
      comment: 'Check the response headers'
    }]

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
      shallow: false
    }

    const component = mount(Steps, options)
    expect(component.exists()).toBeTruthy()

    expect(Store.actions.steps).toHaveBeenCalledTimes(1)

    const wrappers = component.findAllComponents(RestQAProjectSteps)
    expect(wrappers.length).toBe(3)

    await component.vm.$nextTick()

    const input = component.findComponent('.search')
    await input.setValue('call')

    expect(wrappers[0].props('keyword')).toBe('given')
    expect(wrappers[0].props('data')).toEqual([])

    expect(wrappers[1].props('keyword')).toBe('when')
    expect(wrappers[1].props('data')).toEqual([mockSteps[2]])

    expect(wrappers[2].props('keyword')).toBe('then')
    expect(wrappers[2].props('data')).toEqual([])
  })

  test('filter the list of steps by keyword (comment)', async () => {

    mockSteps = [{
      plugin: '@restqa/restqapi',
      keyword: 'Given',
      step: 'I have the api gateway',
      comment: 'Initiate the api instance'
    }, {
      plugin: '@restqa/faker-plugin',
      keyword: 'Given',
      step: 'I have the cookie',
      comment: 'Adding the cookie'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'When',
      step: 'I call the api',
      comment: 'I call the api'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'Then',
      step: 'The response status is should be {string}',
      comment: 'Check the response status code'
    }, {
      plugin: '@restqa/restqapi',
      keyword: 'Then',
      step: 'The response header contains {string}',
      comment: 'Check the response headers'
    }]

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
      shallow: false
    }

    const component = mount(Steps, options)
    expect(component.exists()).toBeTruthy()

    expect(Store.actions.steps).toHaveBeenCalledTimes(1)

    const wrappers = component.findAllComponents(RestQAProjectSteps)
    expect(wrappers.length).toBe(3)

    await component.vm.$nextTick()

    const input = component.findComponent('.search')
    await input.setValue('status code')

    expect(wrappers[0].props('keyword')).toBe('given')
    expect(wrappers[0].props('data')).toEqual([])

    expect(wrappers[1].props('keyword')).toBe('when')
    expect(wrappers[1].props('data')).toEqual([])

    expect(wrappers[2].props('keyword')).toBe('then')
    expect(wrappers[2].props('data')).toEqual([mockSteps[3]])
  })
})

