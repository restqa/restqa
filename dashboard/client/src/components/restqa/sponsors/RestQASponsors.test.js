import { shallowMount } from '@vue/test-utils'
import RestQASponsors from './RestQASponsors.vue'
import Loader from '../../utils/loader/Loader'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQASponsors', () => {
  test('renders a team sponsors', async () => {

    const data = [{
      url: "https://1atalent-consulting.com",
      name: "1RestQA 1 is here! Do your end-to-end API test integration, the right way!",
      logo: "https://atalent-consulting.com/logo.png"
    }, {
      url: "https://2atalent-consulting.com",
      name: "RestQA 2 is here! Do your end-to-end API test integration, the right way!",
      logo: "https://2atalent-consulting.com/logo.png"
    }]
    const Service = {
      getTeamSponsors: jest.fn().mockResolvedValue(data)
    }

    const component = shallowMount(RestQASponsors, {
      data() {
        return {
          Service 
        }
      }
    })

    expect(component.exists()).toBeTruthy()

    expect(component.findComponent(Loader).isVisible()).toBeTruthy()
    expect(component.find('.sponsors').exists()).toBeFalsy()
    
    await component.vm.$nextTick()

    expect(Service.getTeamSponsors.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
    expect(component.find('.sponsors').isVisible()).toBeTruthy()
    const wrappers = component.findAll('.sponsor')
    expect(wrappers.length).toBe(2)
    expect(wrappers.at(0).find('img').attributes('src')).toEqual(data[0].logo)
    expect(wrappers.at(0).find('img').attributes('alt')).toEqual(data[0].name)
    expect(wrappers.at(0).find('a').attributes('href')).toEqual(data[0].url)
    expect(wrappers.at(0).find('a').attributes('title')).toEqual(data[0].name)
    expect(wrappers.at(0).find('a').attributes('target')).toEqual('_blank')

    expect(wrappers.at(1).find('img').attributes('src')).toEqual(data[1].logo)
    expect(wrappers.at(1).find('img').attributes('alt')).toEqual(data[1].name)
    expect(wrappers.at(1).find('a').attributes('href')).toEqual(data[1].url)
    expect(wrappers.at(1).find('a').attributes('title')).toEqual(data[1].name)
    expect(wrappers.at(1).find('a').attributes('target')).toEqual('_blank')
  })

  test('renders default values if the response from the api is an error', async () => {

    const Service = {
      getTeamSponsors: jest.fn().mockRejectedValue(new Error('oups'))
    }

    const component = shallowMount(RestQASponsors, {
      data() {
        return {
          Service 
        }
      }
    })

    expect(component.exists()).toBeTruthy()
    expect(component.findComponent(Loader).isVisible()).toBeTruthy()
    expect(component.find('.sponsors').exists()).toBeFalsy()
    
    await component.vm.$nextTick()

    expect(Service.getTeamSponsors.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    const wrappers = component.findAll('.sponsor')
    expect(wrappers.length).toBe(1)
    expect(wrappers.at(0).find('img').attributes('src')).toEqual('https://atalent-consulting.com/logo.png')
    expect(wrappers.at(0).find('img').attributes('alt')).toEqual('Atalent Consulting')
    expect(wrappers.at(0).find('a').attributes('href')).toEqual('https://atalent-consulting.com')
    expect(wrappers.at(0).find('a').attributes('title')).toEqual('Atalent Consulting')
    expect(wrappers.at(0).find('a').attributes('target')).toEqual('_blank')
  })
})

