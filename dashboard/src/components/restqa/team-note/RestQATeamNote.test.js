import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus';
import RestQATeamNote	 from './RestQATeamNote.vue'

describe('RestQATeamNote', () => {

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

  test('renders a team notes', async () => {

    mockTeam = {
      note: {
        message: 'May the force be with you!',
        from: 'Obi-Wan Kenobi',
        avatar: '/starwars/obi.jpg'
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

    const component = mount(RestQATeamNote, options)

    expect(component.exists()).toBeTruthy()

    expect(component.find('.team-note').exists()).toBeTruthy()
    
    expect(component.find('.team-note').isVisible()).toBeTruthy()
    expect(component.find('.message').text()).toEqual('"May the force be with you!"')
    expect(component.find('.from').text()).toEqual('Obi-Wan Kenobi')
    expect(component.find('img').attributes('src')).toEqual('/starwars/obi.jpg')
  })
})
