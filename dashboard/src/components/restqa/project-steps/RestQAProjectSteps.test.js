import { mount } from '@vue/test-utils'
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

    expect(component.findComponent({ name: 'card'}).vm.title).toBe('Given')
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

    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'card'}).vm.title).toBe('Given - 2 step definitions')
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)

    await component.vm.$nextTick()

    const expectedSteps = component.findComponent('.step-definition')
    expect(expectedSteps.findComponent('.step').vm.prop).toEqual('step')
    expect(expectedSteps.findComponent('.step').vm.label).toEqual('Step Definition')
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

    expect(component.findComponent({ name: 'card'}).vm.title).toBe('Given - 2 step definitions')
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)

    const expectedSteps = component.findComponent('.step-definition')

    expect(expectedSteps.findComponent('.step').vm.prop).toEqual('step')
    expect(expectedSteps.findComponent('.step').vm.label).toEqual('Step Definition')
  })
})

