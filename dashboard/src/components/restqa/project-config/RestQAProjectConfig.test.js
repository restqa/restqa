import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus';
import RestQAProjectConfig from './RestQAProjectConfig.vue'
import Store from '@/store/modules/restqa'

describe('RestQAProjectConfig', () => {
  let store

  Store.actions.config = ({ commit }, val) => {
    commit('config', val)
  }

  beforeEach(() => {
    store = createStore({
      modules: {
        restqa: Store
      }
    })
  })

  test('Should show the config information, only one environement', async () => {
    let mockConfig = {
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

    store.dispatch('config', mockConfig)

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
      shallow: false
    }

    const component = mount(RestQAProjectConfig, options)
    expect(component.findComponent({ 'name': 'card' }).find('.header').text()).toMatch('Project Configuration (LOCAL)')


    expect(component.exists()).toBeTruthy()

    const descriptions= component.findComponent('.config')

    const fields  = [
      'URL',
      'CODE',
      'NAME',
      'DESCRIPTION',
      'OUTPUTS',
    ].reduce((obj, key) => {
      descriptions.findAll('tr td').forEach((td, i, arr) => {
        if (td.text() == key) {
          obj[key] = arr[i + 1].text()
        }
      })
      return obj
    }, {})

    expect(fields['CODE']).toEqual(mockConfig.metadata.code)
    expect(fields['NAME']).toEqual(mockConfig.metadata.name)
    expect(fields['DESCRIPTION']).toEqual(mockConfig.metadata.description)
    expect(fields['URL']).toEqual('https://docs.restqa.io')
    expect(fields['OUTPUTS']).toEqual('htmlfile')
  })

  test('Should show the config information from the selected environment', async () => {
    let mockConfig = {
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

    store.dispatch('config', mockConfig)
    store.dispatch('selectedEnv', 'uat')

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
      shallow: false
    }

    const component = mount(RestQAProjectConfig, options)
    expect(component.findComponent({ 'name': 'card' }).find('.header').text()).toMatch('Project Configuration (UAT)')

    expect(component.exists()).toBeTruthy()

    const descriptions= component.findComponent('.config')

    let fields  = [
      'URL',
      'CODE',
      'NAME',
      'DESCRIPTION',
      'OUTPUTS',
    ].reduce((obj, key) => {
      descriptions.findAll('tr td').forEach((td, i, arr) => {
        if (td.text() == key) {
          obj[key] = arr[i + 1].text()
        }
      })
      return obj
    }, {})

    expect(fields['CODE']).toEqual(mockConfig.metadata.code)
    expect(fields['NAME']).toEqual(mockConfig.metadata.name)
    expect(fields['DESCRIPTION']).toEqual(mockConfig.metadata.description)
    expect(fields['URL']).toEqual('https://uat.restqa.io')
    expect(fields['OUTPUTS']).toEqual('html')

    store.dispatch('selectedEnv', 'local')

    await component.vm.$nextTick()

    expect(component.findComponent({ 'name': 'card' }).find('.header').text()).toMatch('Project Configuration (LOCAL)')
    fields  = [
      'URL',
      'CODE',
      'NAME',
      'DESCRIPTION',
      'OUTPUTS',
    ].reduce((obj, key) => {
      descriptions.findAll('tr td').forEach((td, i, arr) => {
        if (td.text() == key) {
          obj[key] = arr[i + 1].text()
        }
      })
      return obj
    }, {})

    expect(fields['CODE']).toEqual(mockConfig.metadata.code)
    expect(fields['NAME']).toEqual(mockConfig.metadata.name)
    expect(fields['DESCRIPTION']).toEqual(mockConfig.metadata.description)
    expect(fields['URL']).toEqual('http://localhost:3000')
    expect(fields['OUTPUTS']).toEqual('htmlfile')
  })
})
