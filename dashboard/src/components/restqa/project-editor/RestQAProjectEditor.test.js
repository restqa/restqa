import { mount, shallowMount, flushPromises } from '@vue/test-utils'
import { createStore } from 'vuex'
import RestqaStore from '@/store/store'
import ElementPlus from 'element-plus'
import RestQAProjectEditor from './RestQAProjectEditor.vue'

describe('RestQAProjectEditor', () => {
  let store
  let mockSelectedFile
  let actions = {
    selectedFile: jest.fn((_, filename) => mockSelectedFile = filename)
  }

  beforeEach(() => {
    store = createStore({
      modules: {
        restqa: {
          state: {},
          actions,
          getters: {
            features: () => mockFeatures,
          }
        }
      }
    })
  })

  test('Create a new tab', async () => {

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditor, options)
    expect(component.exists()).toBeTruthy()

    const card = component.findComponent({ name: 'card'})
    expect(card.vm.title ).toBe(null)
    expect(card.vm.loading).toBe(false)

    const empty = card.findComponent({ name: 'el-empty'})
    expect(empty.vm.description).toBe('Select a feature file')
    //expect(empty.isVisible()).toBe(true)
    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(0)
    expect(component.vm.currentTab).toBe(null)

    component.vm.$options.watch.file.call(component.vm, 'integration/foo-bar.feature')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(1)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/foo-bar.feature')
    expect(component.findComponent({ name: 'card'}).vm.title).toBe('integration/foo-bar.feature')
    //expect(empty.vm.isVisible()).toBe(false)

    component.vm.$options.watch.file.call(component.vm, 'integration/bar-foo.feature')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(2)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }, {
      title: 'bar-foo',
      name: 'integration/bar-foo.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/bar-foo.feature')
  })

  test('Using a tab already open instead of opening a new one if it was already open', async () => {

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditor, options)
    expect(component.exists()).toBeTruthy()

    const card = component.findComponent({ name: 'card'})
    expect(card.vm.title ).toBe(null)
    expect(card.vm.loading).toBe(false)

    const empty = card.findComponent({ name: 'el-empty'})
    expect(empty.vm.description).toBe('Select a feature file')
    //expect(empty.vm.isVisible()).toBe(true)
    //
    expect(component.vm.tabs).toHaveLength(0)
    expect(component.vm.currentTab).toBe(null)

    component.vm.$options.watch.file.call(component.vm, 'integration/foo-bar.feature')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(1)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/foo-bar.feature')
    expect(component.findComponent({ name: 'card'}).vm.title).toBe('integration/foo-bar.feature')

    component.vm.$options.watch.file.call(component.vm, 'integration/foo-bar.feature')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(1)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/foo-bar.feature')
  })

  test('Delete a tab', async () => {

    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      },
    }

    const component = mount(RestQAProjectEditor, options)
    expect(component.exists()).toBeTruthy()

    const card = component.findComponent({ name: 'card'})
    expect(card.vm.title ).toBe(null)
    expect(card.vm.loading).toBe(false)

    const empty = card.findComponent({ name: 'el-empty'})
    expect(empty.vm.description).toBe('Select a feature file')
    //expect(empty.vm.isVisible()).toBe(true)
    
    expect(component.vm.tabs).toHaveLength(0)
    expect(component.vm.currentTab).toBe(null)

    component.vm.$options.watch.file.call(component.vm, 'integration/foo-bar.feature')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(1)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/foo-bar.feature')
    expect(component.findComponent({ name: 'card'}).vm.title).toBe('integration/foo-bar.feature')

    component.vm.$options.watch.file.call(component.vm, 'integration/bar-foo.feature')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(2)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }, {
      title: 'bar-foo',
      name: 'integration/bar-foo.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/bar-foo.feature')

    component.vm.$options.watch.file.call(component.vm, 'integration/foo-foo.feature')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(3)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }, {
      title: 'bar-foo',
      name: 'integration/bar-foo.feature'
    }, {
      title: 'foo-foo',
      name: 'integration/foo-foo.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/foo-foo.feature')
    expect(component.findComponent({ name: 'card'}).vm.title).toBe('integration/foo-foo.feature')

    component.vm.manageTabs('integration/bar-foo.feature', 'remove')

    expect(component.vm.tabs).toHaveLength(2)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }, {
      title: 'foo-foo',
      name: 'integration/foo-foo.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/foo-foo.feature')

    component.vm.manageTabs('integration/foo-foo.feature', 'remove')

    await component.vm.$nextTick()

    expect(component.vm.tabs).toHaveLength(1)
    expect(component.vm.tabs).toEqual([{
      title: 'foo-bar',
      name: 'integration/foo-bar.feature'
    }])
    expect(component.vm.currentTab).toBe('integration/foo-bar.feature')
    expect(component.findComponent({ name: 'card'}).vm.title).toBe('integration/foo-bar.feature')

    component.vm.manageTabs('integration/foo-bar.feature', 'remove')
    expect(component.vm.tabs).toHaveLength(0)
    expect(component.vm.currentTab).toBe(null)
  })
})
