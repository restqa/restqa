import { shallowMount } from '@vue/test-utils'
import RestQAProjectSteps from './RestQAProjectSteps.vue'
import Loader from '../../utils/loader/Loader'
import VxCard from '../../vx-card/VxCard'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQAProjectSteps', () => {
  test('renders the step definition, when the props data is not defined', async () => {

    const component = shallowMount(RestQAProjectSteps, {
      propsData: {
        keyword: 'given'
      }
    })

    expect(component.exists()).toBeTruthy()

    expect(component.findComponent(Loader).isVisible()).toBeTruthy()
    expect(component.findComponent(VxCard).attributes('title')).toBe('Keyword: Given')
    expect(component.find('.step-definitions').exists()).toBeFalsy()
    
    await component.vm.$nextTick()

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
    }]

    component.setProps({ data })

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
    expect(component.find('.step-definitions').isVisible()).toBeTruthy()

    const expectedSteps = component.findAll('.step-definition')
    expect(expectedSteps.at(0).find('.plugin').text()).toEqual('@restqa/restqapi')
    expect(expectedSteps.at(0).find('.keyword').text()).toEqual('Given')
    expect(expectedSteps.at(0).find('.step').text()).toEqual('I have the api gateway')
    expect(expectedSteps.at(0).find('.comment').text()).toEqual('Initiate the api call')
    expect(expectedSteps.at(1).find('.plugin').text()).toEqual('@restqa/faker-plugin')
    expect(expectedSteps.at(1).find('.keyword').text()).toEqual('Given')
    expect(expectedSteps.at(1).find('.step').text()).toEqual('I have the cookie')
    expect(expectedSteps.at(1).find('.comment').text()).toEqual('Adding the cookie')
  })

  test('renders the step definition, when the props data is passed', async () => {

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
    }]

    const component = shallowMount(RestQAProjectSteps, {
      propsData: {
        keyword: 'given',
        data
      }
    })

    expect(component.exists()).toBeTruthy()

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
    expect(component.find('.step-definitions').isVisible()).toBeTruthy()

    const expectedSteps = component.findAll('.step-definition')
    expect(expectedSteps.at(0).find('.plugin').text()).toEqual('@restqa/restqapi')
    expect(expectedSteps.at(0).find('.keyword').text()).toEqual('Given')
    expect(expectedSteps.at(0).find('.step').text()).toEqual('I have the api gateway')
    expect(expectedSteps.at(0).find('.comment').text()).toEqual('Initiate the api call')
    expect(expectedSteps.at(1).find('.plugin').text()).toEqual('@restqa/faker-plugin')
    expect(expectedSteps.at(1).find('.keyword').text()).toEqual('Given')
    expect(expectedSteps.at(1).find('.step').text()).toEqual('I have the cookie')
    expect(expectedSteps.at(1).find('.comment').text()).toEqual('Adding the cookie')
  })
})

