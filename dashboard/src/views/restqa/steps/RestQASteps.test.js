import {
  shallowMount
} from '@vue/test-utils'
import RestQASteps from './RestQASteps.vue'
import RestQAProjectSteps from '../../../components/restqa/project-steps/RestQAProjectSteps.vue'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQASteps', () => {
  test('Renders the components', async () => {

    const data = [{
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

    const Service = {
      getStepDefinition: jest.fn().mockResolvedValue(data)
    }

    const component = shallowMount(RestQASteps, {
      data() {
        return {
          Service
        }
      }
    })

    await component.vm.$nextTick()

    expect(component.exists()).toBeTruthy()

    const wrappers = component.findAllComponents(RestQAProjectSteps)
    expect(wrappers.length).toBe(3)

    await component.vm.$nextTick()

    expect(wrappers.at(0).props('keyword')).toBe('given')
    const expectedGivenData = data.filter(step => step.keyword === 'Given')
    expect(wrappers.at(0).props('data')).toEqual(expectedGivenData)

    expect(wrappers.at(1).props('keyword')).toBe('when')
    const expectedWhenData = data.filter(step => step.keyword === 'When')
    expect(wrappers.at(1).props('data')).toEqual(expectedWhenData)

    expect(wrappers.at(2).props('keyword')).toBe('then')
    const expectedThenData = data.filter(step => step.keyword === 'Then')
    expect(wrappers.at(2).props('data')).toEqual(expectedThenData)
  })

  test('filter the list of steps by keyword (steps)', async () => {

    const data = [{
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

    const Service = {
      getStepDefinition: jest.fn().mockResolvedValue(data)
    }

    const component = shallowMount(RestQASteps, {
      data() {
        return {
          Service
        }
      }
    })

    await component.vm.$nextTick()

    expect(component.exists()).toBeTruthy()

    const wrappers = component.findAllComponents(RestQAProjectSteps)
    expect(wrappers.length).toBe(3)

    await component.vm.$nextTick()

    const input = component.find('.search')
    input.element.value = 'call'
    await input.trigger('input')

    expect(wrappers.at(0).props('keyword')).toBe('given')
    expect(wrappers.at(0).props('data')).toEqual([])

    expect(wrappers.at(1).props('keyword')).toBe('when')
    expect(wrappers.at(1).props('data')).toEqual([data[2]])

    expect(wrappers.at(2).props('keyword')).toBe('then')
    expect(wrappers.at(2).props('data')).toEqual([])
  })

  test('filter the list of steps by keyword (comment)', async () => {

    const data = [{
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

    const Service = {
      getStepDefinition: jest.fn().mockResolvedValue(data)
    }

    const component = shallowMount(RestQASteps, {
      data() {
        return {
          Service
        }
      }
    })

    await component.vm.$nextTick()

    expect(component.exists()).toBeTruthy()

    const wrappers = component.findAllComponents(RestQAProjectSteps)
    expect(wrappers.length).toBe(3)

    await component.vm.$nextTick()

    const input = component.find('.search')
    input.element.value = 'status code'
    await input.trigger('input')

    expect(wrappers.at(0).props('keyword')).toBe('given')
    expect(wrappers.at(0).props('data')).toEqual([])

    expect(wrappers.at(1).props('keyword')).toBe('when')
    expect(wrappers.at(1).props('data')).toEqual([])

    expect(wrappers.at(2).props('keyword')).toBe('then')
    expect(wrappers.at(2).props('data')).toEqual([data[3]])
  })
})
