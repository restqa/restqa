import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import ElementPlus from 'element-plus';
import RestQAProjectTree from './RestQAProjectTree.vue'

describe('RestQAProjectTree', () => {
  let store
  let mockFeatures
  let actions = {
    selectedFile: jest.fn(() => {})
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

  test('Should show the feature files', async () => {
    mockFeatures = [{
      label: 'root',
      children: [{
        label: 'child',
        filename: 'root/child'
      }]
    }]


    const options = {
      global: {
        plugins: [
          store,
          ElementPlus
        ]
      }
    }
    const component = mount(RestQAProjectTree, options)


    expect(component.exists()).toBeTruthy()
    await component.vm.$nextTick()

    const tree = component.findComponent({ name: 'el-tree' })
    expect(tree.vm.data).toEqual(mockFeatures)
    expect(actions.selectedFile).toHaveBeenCalledTimes(0)

    tree.vm.$emit('node-click', mockFeatures[0].children[0])

    expect(actions.selectedFile).toHaveBeenCalledTimes(1)
    expect(actions.selectedFile.mock.calls[0][1]).toEqual(mockFeatures[0].children[0])
  })
})
