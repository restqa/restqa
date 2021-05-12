import { shallowMount } from '@vue/test-utils'
import RestQATeamBlog	 from './RestQATeamBlog.vue'
import Loader from '../../utils/loader/Loader'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQATeamBlog', () => {
  test('renders a team blog article', async () => {

    const data = {
      url: 'https://medium.com/restqa-super',
      last: {
        title: 'We are doing TDD!',
        date: '2012-12-12 00:00:00',
        image: 'https://example.com/img.png',
        author: {
          username: '@Olivierodo',
          avatar: 'https://exampple.com/avatar.png'
        },
        url: 'https://medium.com/my-article'
      }
    }
    const Service = {
      getTeamBlog: jest.fn().mockResolvedValue(data)
    }

    const component = shallowMount(RestQATeamBlog, {
      data() {
        return {
          Service 
        }
      }
    })

    expect(component.exists()).toBeTruthy()

    expect(component.findComponent(Loader).isVisible()).toBeTruthy()
    expect(component.find('.team-blog').exists()).toBeFalsy()
    
    await component.vm.$nextTick()

    expect(Service.getTeamBlog.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
    expect(component.find('.team-blog').isVisible()).toBeTruthy()

    expect(component.find('.article .title').text()).toEqual('We are doing TDD!')
    expect(component.find('.article .date').text()).toEqual('Dec 12, 2012')
    expect(component.find('.article img').attributes('src')).toEqual('https://example.com/img.png')
    expect(component.find('.article a').attributes('href')).toEqual('https://medium.com/my-article')
    expect(component.find('.article a').attributes('target')).toEqual('_blank')
    expect(component.find('.author img').attributes('src')).toEqual('https://exampple.com/avatar.png')
    expect(component.find('.blog a').attributes('href')).toEqual('https://medium.com/restqa-super')
    expect(component.find('.blog a').attributes('target')).toEqual('_blank')
  })

  test('renders default values if the response from the api is an error', async () => {

    const Service = {
      getTeamBlog: jest.fn().mockRejectedValue(new Error('oups'))
    }

    const component = shallowMount(RestQATeamBlog, {
      data() {
        return {
          Service 
        }
      }
    })

    expect(component.exists()).toBeTruthy()
    expect(component.findComponent(Loader).isVisible()).toBeTruthy()
    expect(component.find('.team-blog').exists()).toBeFalsy()
    
    await component.vm.$nextTick()

    expect(Service.getTeamBlog.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    expect(component.findComponent(Loader).props('show')).toBeFalsy()
    expect(component.find('.team-blog').isVisible()).toBeTruthy()

    const data = {
      url: 'https://medium.com/restqa',
      last: {
        title: 'RestQA is here! Do your end-to-end API test integration, the right way!',
        date: '2021-02-02 02:24:19',
        image: 'https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png',
        author: {
          username: '@Olivierodo',
          avatar: 'https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg'
        },
        url: 'https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291'
      }
    }

    expect(component.find('.article .title').text()).toEqual(data.last.title)
    expect(component.find('.article .date').text()).toEqual('Feb 2, 2021')
    expect(component.find('.article img').attributes('src')).toEqual(data.last.image)
    expect(component.find('.article a').attributes('href')).toEqual(data.last.url)
    expect(component.find('.article a').attributes('target')).toEqual('_blank')
    expect(component.find('.author img').attributes('src')).toEqual(data.last.author.avatar)
    expect(component.find('.blog a').attributes('href')).toEqual(data.url)
    expect(component.find('.blog a').attributes('target')).toEqual('_blank')
  })
})

