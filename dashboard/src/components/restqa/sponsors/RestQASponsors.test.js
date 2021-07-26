import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RestQASponsors from './RestQASponsors.vue'
import ElementPlus from 'element-plus';

describe('RestQASponsors', () => {
  let store
  let mockSponsors
  let actions = {}

  beforeEach(() => {
    store = createStore({
      modules: {
        restqa: {
          state: {},
          actions,
          getters: {
            info: () => {
              return {
                sponsors: mockSponsors
              }
            }
          }
        }
      }
    })
  })

  afterEach(() => {
    mockSponsors = null;
  })

  test('renders a team sponsors', async () => {

    mockSponsors = [{
      url: "https://1atalent-consulting.com",
      name: "1RestQA 1 is here! Do your end-to-end API test integration, the right way!",
      logo: "https://atalent-consulting.com/logo.png"
    }, {
      url: "https://2atalent-consulting.com",
      name: "RestQA 2 is here! Do your end-to-end API test integration, the right way!",
      logo: "https://2atalent-consulting.com/logo.png"
    }]

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      }
    }

    const component = mount(RestQASponsors, options)

    expect(component.find('.sponsors').exists()).toBeTruthy()
    expect(component.find('.sponsors').isVisible()).toBeTruthy()
    
    const wrappers = component.findAll('.sponsor')
    expect(wrappers.length).toBe(2)
    expect(wrappers[0].find('img').attributes('src')).toEqual(mockSponsors[0].logo)
    expect(wrappers[0].find('img').attributes('alt')).toEqual(mockSponsors[0].name)
    expect(wrappers[0].attributes('href')).toEqual(mockSponsors[0].url)
    expect(wrappers[0].attributes('title')).toEqual(mockSponsors[0].name)
    expect(wrappers[0].attributes('target')).toEqual('_blank')

    expect(wrappers[1].find('img').attributes('src')).toEqual(mockSponsors[1].logo)
    expect(wrappers[1].find('img').attributes('alt')).toEqual(mockSponsors[1].name)
    expect(wrappers[1].attributes('href')).toEqual(mockSponsors[1].url)
    expect(wrappers[1].attributes('title')).toEqual(mockSponsors[1].name)
    expect(wrappers[1].attributes('target')).toEqual('_blank')
  })

  test('render no sponsor if we coudlnt fetch any sponsor', async () => {

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      }
    }

    const component = mount(RestQASponsors , options)
    expect(component.find('.sponsors').exists()).toBeFalsy()
    const wrappers = component.findAll('.sponsor')
    expect(wrappers.length).toBe(0)
    expect(component.find('.join a').text()).toBe('Your logo here')
    expect(component.find('.join a').attributes('href')).toBe('https://github.com/sponsors/restqa')
  })
})

