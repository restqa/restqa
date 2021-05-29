import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { ForbiddenError } from '@/services/http'
import RestQATeamNote from '@/components/restqa/team-note/RestQATeamNote.vue'
import RestQATeamBlog from '@/components/restqa/team-blog/RestQATeamBlog.vue'
import RestQATeamVideo from '@/components/restqa/team-video/RestQATeamVideo.vue'
import RestQASponsors from '@/components/restqa/sponsors/RestQASponsors.vue'
import RestQAProjectInit from '@/components/restqa/project-init/RestQAProjectInit.vue'

import DashboardRestQA from './DashboardRestQA.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

afterEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})


describe('DashboardRestQA', () => {
  test.skip('Should show the init component because the config does not exist', async () => {
    const mockErr = new ForbiddenError('Please share a project name.')
    jest.mock('../services/restqa/project', () => {
      return {
        getConfig: jest.fn().mockRejectedValue(mockErr)
      }
    })

    const store = Store

    const component = shallowMount(DashboardRestQA, { store, localVue })

    expect(component.exists()).toBeTruthy()

    await component.vm.$nextTick()

    expect(component.findComponent(RestQATeamNote).exists()).toBeTruthy()
    expect(component.findComponent(RestQATeamNote).isVisible()).toBeTruthy()
  })
})
