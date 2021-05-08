import { shallowMount } from '@vue/test-utils'
import RestQATeamVideo from './RestQATeamVideo.vue'
import Loader from '../../utils/loader/Loader'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQATeamVideo', () => {
  test('renders a team video', async () => {

    const data = {
      url: 'https://www.youtube.com/channel/restqa',
      last: {
        title: 'RestQA Channel',
        date: '2021-02-21 00:00:00',
        image: 'https://example.com/tdd.png',
        url: 'https://www.youtube.com/watch?v=TDD'
      }
    }
    const Service = {
      getTeamVideo: jest.fn().mockResolvedValue(data)
    }

    const component = shallowMount(RestQATeamVideo, {
      data() {
        return {
          Service 
        }
      }
    })

    expect(component.exists()).toBeTruthy()

    expect(component.findComponent(Loader).isVisible()).toBeTruthy()
    expect(component.find('.team-video').exists()).toBeFalsy()
    
    await component.vm.$nextTick()

    expect(Service.getTeamVideo.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
    expect(component.find('.team-video').isVisible()).toBeTruthy()

    expect(component.find('.video .title').text()).toEqual('RestQA Channel')
    expect(component.find('.video .date').text()).toEqual('Feb 21, 2021')
    expect(component.find('.video img').attributes('src')).toEqual('https://example.com/tdd.png')
    expect(component.find('.video a').attributes('href')).toEqual('https://www.youtube.com/watch?v=TDD')
    expect(component.find('.video a').attributes('target')).toEqual('_blank')
    expect(component.find('.channel a').attributes('href')).toEqual('https://www.youtube.com/channel/restqa')
    expect(component.find('.channel a').attributes('target')).toEqual('_blank')
  })

  test('renders default values if the response from the api is an error', async () => {

    const Service = {
      getTeamVideo: jest.fn().mockRejectedValue(new Error('oups'))
    }

    const component = shallowMount(RestQATeamVideo, {
      data() {
        return {
          Service 
        }
      }
    })

    expect(component.exists()).toBeTruthy()
    expect(component.findComponent(Loader).isVisible()).toBeTruthy()
    expect(component.find('.team-video').exists()).toBeFalsy()
    
    await component.vm.$nextTick()

    expect(Service.getTeamVideo.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    const data = {
      url: 'https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q',
      last: {
        title: 'RestQA trailer',
        date: '2021-04-17 03:00:30',
        image: 'https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=EberYFGPZPo'
      }
    }

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
    expect(component.find('.team-video').isVisible()).toBeTruthy()

    expect(component.find('.video .title').text()).toEqual(data.last.title)
    expect(component.find('.video .date').text()).toEqual('Apr 17, 2021')
    expect(component.find('.video img').attributes('src')).toEqual(data.last.image)
    expect(component.find('.video a').attributes('href')).toEqual(data.last.url)
    expect(component.find('.video a').attributes('target')).toEqual('_blank')
    expect(component.find('.channel a').attributes('href')).toEqual(data.url)
    expect(component.find('.channel a').attributes('target')).toEqual('_blank')
  })
})
