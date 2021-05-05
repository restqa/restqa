import { shallowMount } from '@vue/test-utils'
import RestQATeamNote	 from './RestQATeamNote.vue'

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('RestQATeamNote', () => {
  test('renders a team notes', async () => {

    const data = {
      message: 'May the force be with you!',
      from: 'Obi-Wan Kenobi',
      avatar: '/starwars/obi.jpg'
    }
    const Service = {
      get: jest.fn().mockResolvedValue(data)
    }

    const component = shallowMount(RestQATeamNote, {
      data() {
        return {
          Service 
        }
      }
    })

    await component.vm.$nextTick()

    expect(Service.get.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    expect(component.exists()).toBeTruthy()
    expect(component.find('.message').text()).toEqual('"May the force be with you!"')
    expect(component.find('.from').text()).toEqual('Obi-Wan Kenobi')
    expect(component.find('img').attributes('src')).toEqual('/starwars/obi.jpg')
  })

  test('renders default values if the response from the api is an error', async () => {

    const Service = {
      get: jest.fn().mockRejectedValue(new Error('oups'))
    }

    const component = shallowMount(RestQATeamNote, {
      data() {
        return {
          Service 
        }
      }
    })

    await component.vm.$nextTick()

    expect(Service.get.mock.calls).toHaveLength(1)

    await component.vm.$nextTick()

    expect(component.exists()).toBeTruthy()
    expect(component.find('.message').text()).toEqual('"Thanks for testing with RestQA. It\'s a pleasure to support you on increasing the quality of your product."')
    expect(component.find('.from').text()).toEqual('RestQA')
    expect(component.find('img').attributes('src')).toEqual('/logo.png')
  })
})
