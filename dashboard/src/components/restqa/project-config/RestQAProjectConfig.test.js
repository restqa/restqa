import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import RestQAProjectConfig from './RestQAProjectConfig.vue'

const localVue = createLocalVue()
localVue.use(Vuex)


afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQAProjectInit', () => {
  let store
  let mockConfig
  let mockEnv

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        restqa: {
          state: {},
          actions: {},
          getters: {
            config: () => mockConfig,
            selectedEnv: () => mockEnv
          }
        }
      }
    })
  })

  test('Should show the config information, only one environement', async () => {
    mockConfig = {
      version: '0.0.1',
      metadata: {
        code: 'FEATURE',
        name: 'feature',
        description: 'fff'
      },
      environments: [{
        name: 'local',
        default: true,
        plugins: [{
          name: '@restqa/restqapi',
          config: {
            url: 'https://docs.restqa.io'
          }
        }],
        outputs: [{
          type: 'html',
          enabled: true
        },{
          type: 'file',
          enabled: true,
          config: {
            path: 'restqa-result.json'
          }
        }]
      }]
    }

    const options = {
      localVue,
      store
    }
    const component = shallowMount(RestQAProjectConfig, options)

    expect(component.exists()).toBeTruthy()

    const fields  = [
      'key',
      'name',
      'description',
      'url',
      'env',
    ].reduce((obj, item) => {
      obj[item] = component.find(`span.${item}`)
      return obj
    }, {})

    await component.vm.$nextTick()
    
    expect(fields.key.text()).toEqual(mockConfig.metadata.code)
    expect(fields.name.text()).toEqual(mockConfig.metadata.name)
    expect(fields.description.text()).toEqual(mockConfig.metadata.description)
    expect(fields.env.text()).toEqual(mockConfig.environments[0].name)
    expect(fields.url.text()).toEqual('https://docs.restqa.io')
    const outputs = component.findAll('ul li')
    expect(outputs.length).toEqual(2)
    expect(outputs.at(0).text()).toEqual('html')
    expect(outputs.at(1).text()).toEqual('file')
  })

  test('Should show the config information from the selected environment', async () => {
    mockEnv = 'uat'
    mockConfig = {
      version: '0.0.1',
      metadata: {
        code: 'FEATURE',
        name: 'feature',
        description: 'fff'
      },
      environments: [{
        name: 'local',
        default: true,
        plugins: [{
          name: '@restqa/restqapi',
          config: {
            url: 'http://localhost:3000'
          }
        }],
        outputs: [{
          type: 'html',
          enabled: true
        },{
          type: 'file',
          enabled: true,
          config: {
            path: 'restqa-result.json'
          }
        }]
      }, {
        name: 'uat',
        plugins: [{
          name: '@restqa/faker-plugin',
          config: {
            url: 'https://docs.restqa.io'
          }
        }, {
          name: '@restqa/restqapi',
          config: {
            url: 'https://uat.restqa.io'
          }
        }],
        outputs: [{
          type: 'html',
          enabled: true
        }]
      }]
    }

    const options = {
      localVue,
      store
    }
    const component = shallowMount(RestQAProjectConfig, options)

    expect(component.exists()).toBeTruthy()

    const fields  = [
      'key',
      'name',
      'description',
      'url',
      'env',
    ].reduce((obj, item) => {
      obj[item] = component.find(`span.${item}`)
      return obj
    }, {})

    await component.vm.$nextTick()
    
    expect(fields.key.text()).toEqual(mockConfig.metadata.code)
    expect(fields.name.text()).toEqual(mockConfig.metadata.name)
    expect(fields.description.text()).toEqual(mockConfig.metadata.description)
    expect(fields.env.text()).toEqual('uat')
    expect(fields.url.text()).toEqual('https://uat.restqa.io')
    const outputs = component.findAll('ul li')
    expect(outputs.length).toEqual(1)
    expect(outputs.at(0).text()).toEqual('html')
  })
})
