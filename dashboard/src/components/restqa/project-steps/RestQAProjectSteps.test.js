import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus';
import RestQAProjectSteps from './RestQAProjectSteps.vue'

describe('RestQAProjectSteps', () => {

  test('renders the step definition, when the props data is not defined', async () => {

    const options = {
      props: {
        keyword: 'given'
      },
      global: {
        plugins: [
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectSteps, options)
    expect(component.exists()).toBeTruthy()

    expect(component.findComponent({ name: 'card'}).vm.title).toBe('Keyword: Given')
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(true)
    
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

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(true)

    await component.vm.$nextTick()

    expect(component.find('.step-definitions').isVisible()).toBeTruthy()

    const expectedSteps = component.findAll('.step-definition')
    expect(expectedSteps[0].find('.plugin').text()).toEqual('@restqa/restqapi')
    expect(expectedSteps[0].find('.keyword').text()).toEqual('Given')
    expect(expectedSteps[0].find('.step').text()).toEqual('I have the api gateway')
    expect(expectedSteps[0].find('.comment').text()).toEqual('Initiate the api call')
    expect(expectedSteps[1].find('.plugin').text()).toEqual('@restqa/faker-plugin')
    expect(expectedSteps[1].find('.keyword').text()).toEqual('Given')
    expect(expectedSteps[1].find('.step').text()).toEqual('I have the cookie')
    expect(expectedSteps[1].find('.comment').text()).toEqual('Adding the cookie')
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

    const options = {
      props: {
        keyword: 'given',
        data
      },
      global: {
        plugins: [
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectSteps, options)
    expect(component.exists()).toBeTruthy()
    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'card'}).vm.title).toBe('Keyword: Given')
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)
    expect(component.find('.step-definitions').isVisible()).toBeTruthy()

    const expectedSteps = component.findAll('.step-definition')
    expect(expectedSteps[0].find('.plugin').text()).toEqual('@restqa/restqapi')
    expect(expectedSteps[0].find('.keyword').text()).toEqual('Given')
    expect(expectedSteps[0].find('.step').text()).toEqual('I have the api gateway')
    expect(expectedSteps[0].find('.comment').text()).toEqual('Initiate the api call')
    expect(expectedSteps[1].find('.plugin').text()).toEqual('@restqa/faker-plugin')
    expect(expectedSteps[1].find('.keyword').text()).toEqual('Given')
    expect(expectedSteps[1].find('.step').text()).toEqual('I have the cookie')
    expect(expectedSteps[1].find('.comment').text()).toEqual('Adding the cookie')
  })
})

