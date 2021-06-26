import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus'
import RestQAProjectEditorRunner from './RestQAProjectEditorRunner.vue'

let mockPost
let mockSelectedEnv

jest.mock('axios', () => {
  const originalModule = jest.requireActual('axios')
  return {
    ...originalModule,
    create: function() {
      return this
    },
    post: function () {
      return mockPost.apply(this, arguments)
    }
  }
})

let store
beforeEach(() => {
  mockPost = undefined
  mockSelectedEnv = undefined
  store = createStore({
    modules: {
      restqa: {
        state: {},
        actions: {},
        getters: {
          selectedEnv: () => mockSelectedEnv,
        }
      }
    }
  })
})

describe('RestQAProjectEditorRunner', () => {

  test('Run a test from a spcific file with all success result', async () => {

    mockSelectedEnv = 'local'

    const data = {
      path: 'integration/foo-bar.feature',
      data: require('./__MOCKS__/success-case.json')
    }

    mockPost = jest.fn().mockResolvedValue(data)

    const options = {
      props: {
        file: 'integration/foo-bar.feature'
      },
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditorRunner, options)
    expect(component.exists()).toBeTruthy()

    expect(component.findComponent({ name: 'card'}).vm.title).toBe(undefined)
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)
    expect(component.vm.result).toBe(null)

    await component.vm.$nextTick()

    const btn = component.findComponent({ name: 'el-button'})
    expect(btn.text()).toBe('Run the test on the local environment')
    await btn.trigger('click')

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(true)

    await component.vm.$nextTick()

    expect(mockPost.mock.calls).toHaveLength(1)
    expect(mockPost.mock.calls[0][1]).toEqual({path: 'integration/foo-bar.feature'})

    expect(component.vm.result).toEqual(data.data)

    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)

    const alert = component.findComponent({name: 'el-alert'})
    expect(alert.vm.type).toBe('success')
    expect(alert.text()).toBe('2 scenarios successfully passed')

    await component.vm.$nextTick()

    const accordion = component.findComponent({ name: 'el-collapse' })
    const sections = accordion.findAllComponents({ name: 'el-collapse-item' })
    expect(sections).toHaveLength(2)

    expect(sections[0].find('.el-collapse-item__header').text()).toBe('Scenario: Delete todos by id')
    expect(sections[0].find('.el-collapse-item__header i').classes()).toContain('el-icon-success')
    const steps1 = sections[0].findAllComponents('.step')
    const noHiddenStep1 =  data.data.features[0].elements[0].steps.filter(_ => _.embeddings || !_.hidden)
    expect(steps1).toHaveLength(noHiddenStep1.length)
    steps1.forEach((step, i) => {
      expect(steps1[i].props('data')).toEqual(noHiddenStep1[i])
    })

    expect(sections[1].find('.el-collapse-item__header').text()).toBe('Scenario: Delete todos by id but id doesn\'t exist')
    expect(sections[1].find('.el-collapse-item__header i').classes()).toContain('el-icon-success')
    const steps2 = sections[1].findAllComponents('.step')
    const noHiddenStep2 =  data.data.features[0].elements[1].steps.filter(_ => _.embeddings || !_.hidden)
    expect(steps2).toHaveLength(noHiddenStep2.length)
    steps2.forEach((step, i) => {
      expect(steps2[i].props('data')).toEqual(noHiddenStep2[i])
    })
    expect(component.vm.activeSection).toEqual([])
  })

  test('Run a test from a spcific file with failed result', async () => {

    mockSelectedEnv = 'uat'

    const data = {
      path: 'integration/foo-bar.feature',
      data: require('./__MOCKS__/all-fail.json')
    }

    mockPost = jest.fn().mockResolvedValue(data)

    const options = {
      props: {
        file: 'integration/foo-bar.feature'
      },
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditorRunner, options)
    expect(component.exists()).toBeTruthy()

    expect(component.findComponent({ name: 'card'}).vm.title).toBe(undefined)
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)
    expect(component.vm.result).toBe(null)

    await component.vm.$nextTick()

    const btn = component.findComponent({ name: 'el-button'})
    expect(btn.text()).toBe('Run the test on the uat environment')
    await btn.trigger('click')

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(true)

    await component.vm.$nextTick()

    expect(mockPost.mock.calls).toHaveLength(1)
    expect(mockPost.mock.calls[0][1]).toEqual({path: 'integration/foo-bar.feature'})

    expect(component.vm.result).toEqual(data.data)

    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)

    const alert = component.findComponent({name: 'el-alert'})
    expect(alert.vm.type).toBe('error')
    expect(alert.text()).toBe('2 scenarios failed')

    await component.vm.$nextTick()

    const accordion = component.findComponent({ name: 'el-collapse' })
    const sections = accordion.findAllComponents({ name: 'el-collapse-item' })
    expect(sections).toHaveLength(2)

    expect(sections[0].find('.el-collapse-item__header').text()).toBe('Scenario: Create A new TODO')
    expect(sections[0].find('.el-collapse-item__header i').classes()).toContain('el-icon-error')
    const steps1 = sections[0].findAllComponents('.step')
    const noHiddenStep1 =  data.data.features[0].elements[0].steps.filter(_ => _.embeddings || !_.hidden)
    expect(steps1).toHaveLength(noHiddenStep1.length)
    steps1.forEach((step, i) => {
      expect(steps1[i].props('data')).toEqual(noHiddenStep1[i])
    })

    expect(sections[1].find('.el-collapse-item__header').text()).toBe('Scenario: Create A new TODO but the userId doesn\'t exists')
    expect(sections[1].find('.el-collapse-item__header i').classes()).toContain('el-icon-error')
    const steps2 = sections[1].findAllComponents('.step')
    const noHiddenStep2 =  data.data.features[0].elements[1].steps.filter(_ => _.embeddings || !_.hidden)
    expect(steps2).toHaveLength(noHiddenStep2.length)
    steps2.forEach((step, i) => {
      expect(steps2[i].props('data')).toEqual(noHiddenStep2[i])
    })

    expect(component.vm.activeSection).toEqual([
      "post-/todos;create-a-new-todo",
      "post-/todos;create-a-new-todo-but-the-userid-doesn't-exists"
    ])
  })

  test('Run a test from a specific file with one skipped scenario', async () => {

    mockSelectedEnv = 'prod'

    const data = {
      path: 'integration/foo-bar.feature',
      data: require('./__MOCKS__/skip-case.json')
    }

    mockPost = jest.fn().mockResolvedValue(data)

    const options = {
      props: {
        file: 'integration/foo-bar.feature'
      },
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunner, options)
    expect(component.exists()).toBeTruthy()

    expect(component.findComponent({ name: 'card'}).vm.title).toBe(undefined)
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)
    expect(component.vm.result).toBe(null)

    await component.vm.$nextTick()

    const btn = component.findComponent({ name: 'el-button'})
    expect(btn.text()).toBe('Run the test on the prod environment')
    await btn.trigger('click')

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(true)

    await component.vm.$nextTick()

    expect(mockPost.mock.calls).toHaveLength(1)
    expect(mockPost.mock.calls[0][1]).toEqual({path: 'integration/foo-bar.feature'})

    expect(component.vm.result).toEqual(data.data)

    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)

    const alerts = component.findAllComponents({name: 'el-alert'})
    expect(alerts.length).toBe(1)
    const alert = alerts[0]
    expect(alert.vm.type).toBe('success')
    expect(alert.text()).toBe('1 scenarios successfully passed')

    await component.vm.$nextTick()

    const accordion = component.findComponent({ name: 'el-collapse' })
    const sections = accordion.findAllComponents({ name: 'el-collapse-item' })
    expect(sections).toHaveLength(2)

    expect(sections[0].find('.el-collapse-item__header').text()).toBe('Scenario: Update of a Todo')
    expect(sections[0].find('.el-collapse-item__header i').classes()).toContain('el-icon-success')
    const steps1 = sections[0].findAllComponents('.step')
    const noHiddenStep1 =  data.data.features[0].elements[0].steps.filter(_ => _.embeddings ||  !_.hidden)
    expect(steps1).toHaveLength(noHiddenStep1.length)
    steps1.forEach((step, i) => {
      expect(steps1[i].props('data')).toEqual(noHiddenStep1[i])
    })

    expect(sections[1].find('.el-collapse-item__header').text()).toBe('Scenario: Update of a Todo when the todo doesn\'t exist')
    expect(sections[1].find('.el-collapse-item__header i').classes()).toContain('el-icon-warning')
    const steps2 = sections[1].findAllComponents('.step')
    const noHiddenStep2 =  data.data.features[0].elements[1].steps.filter(_ => _.embeddings ||  !_.hidden)
    expect(steps2).toHaveLength(noHiddenStep2.length)
    steps2.forEach((step, i) => {
      expect(steps2[i].props('data')).toEqual(noHiddenStep2[i])
    })
    expect(component.vm.activeSection).toEqual([])
  })

  test('Run a test from a specific file with the all feature skipped', async () => {

    mockSelectedEnv = 'dev'

    const data = {
      path: 'integration/foo-bar.feature',
      data: require('./__MOCKS__/all-skipped.json')
    }

    mockPost = jest.fn().mockResolvedValue(data)

    const options = {
      props: {
        file: 'integration/foo-bar.feature'
      },
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      }
    }

    const component = mount(RestQAProjectEditorRunner, options)
    expect(component.exists()).toBeTruthy()

    expect(component.findComponent({ name: 'card'}).vm.title).toBe(undefined)
    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)
    expect(component.vm.result).toBe(null)

    await component.vm.$nextTick()

    const btn = component.findComponent({ name: 'el-button'})
    expect(btn.text()).toBe('Run the test on the dev environment')
    await btn.trigger('click')

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(true)

    await component.vm.$nextTick()

    expect(mockPost.mock.calls).toHaveLength(1)
    expect(mockPost.mock.calls[0][1]).toEqual({path: 'integration/foo-bar.feature'})

    expect(component.vm.result).toEqual(data.data)

    await component.vm.$nextTick()

    expect(component.findComponent({ name: 'card'}).vm.loading).toBe(false)

    const alert = component.findComponent({name: 'el-alert'})
    expect(alert.vm.type).toBe('warning')
    expect(alert.text()).toBe('2 scenarios skipped')


    await component.vm.$nextTick()

    const accordion = component.findComponent({ name: 'el-collapse' })
    const sections = accordion.findAllComponents({ name: 'el-collapse-item' })
    expect(sections).toHaveLength(2)

    expect(sections[0].find('.el-collapse-item__header').text()).toBe('Scenario: Partial update of the Todo')
    expect(sections[0].find('.el-collapse-item__header i').classes()).toContain('el-icon-warning')
    const steps1 = sections[0].findAllComponents('.step')
    const noHiddenStep1 =  data.data.features[0].elements[0].steps.filter(_ => _.embeddings || !_.hidden )
    expect(steps1).toHaveLength(noHiddenStep1.length)
    steps1.forEach((step, i) => {
      expect(steps1[i].props('data')).toEqual(noHiddenStep1[i])
    })

    expect(sections[1].find('.el-collapse-item__header').text()).toBe('Scenario: Partial update of a todo that doesn\'t exist')
    expect(sections[1].find('.el-collapse-item__header i').classes()).toContain('el-icon-warning')
    const steps2 = sections[1].findAllComponents('.step')
    const noHiddenStep2 =  data.data.features[0].elements[1].steps.filter(_ => _.embeddings || !_.hidden)
    expect(steps2).toHaveLength(noHiddenStep2.length)
    steps2.forEach((step, i) => {
      expect(steps2[i].props('data')).toEqual(noHiddenStep2[i])
    })
    expect(component.vm.activeSection).toEqual([])
  })
})



