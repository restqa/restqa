import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import RestQATeamVideo from './RestQATeamVideo.vue'
import ElementPlus from 'element-plus';

describe('RestQATeamVideo', () => {

  let store
  let mockTeam
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
                team: mockTeam
              }
            }
          }
        }
      }
    })
  })

  afterEach(() => {
    mockTeam = null;
  })

  test('renders a team video', async () => {

    mockTeam = { 
      video: {
        url: 'https://www.youtube.com/channel/restqa',
        last: {
          title: 'RestQA Channel',
          date: '2021-02-21 00:00:00',
          image: 'https://example.com/tdd.png',
          url: 'https://www.youtube.com/watch?v=TDD'
        }
      }
    }

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      }
    }

    const component = mount(RestQATeamVideo, options)

    expect(component.exists()).toBeTruthy()

    expect(component.find('.team-video').isVisible()).toBeTruthy()

    expect(component.find('.video .title').text()).toEqual('RestQA Channel')
    expect(component.find('.video .date').text()).toEqual('Feb 21, 2021')
    expect(component.find('.video img').attributes('src')).toEqual('https://example.com/tdd.png')
    expect(component.find('.video a').attributes('href')).toEqual('https://www.youtube.com/watch?v=TDD')
    expect(component.find('.video a').attributes('target')).toEqual('_blank')
    expect(component.find('.channel a').attributes('href')).toEqual('https://www.youtube.com/channel/restqa')
    expect(component.find('.channel a').attributes('target')).toEqual('_blank')
  })
})
