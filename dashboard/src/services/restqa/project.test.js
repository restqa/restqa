afterAll(() => {
  jest.clearAllMocks()
})

describe('Service - RestQA - Projects', () => {

  let mockGet
  let mockPost
  jest.mock('axios', () => {
    const originalModule = jest.requireActual('axios')
    return {
      ...originalModule,
      create: function() {
        return this
      },
      get: function () {
        return mockGet.apply(this, arguments)
      },
      post: function () {
        return mockPost.apply(this, arguments)
      }
    }
  })

  afterEach(() => {
    mockGet = undefined
    mockPost = undefined
  })

  const Project = require('./project')

  describe('config', () => {
    test('Retrieve the configuration', async () => {
      const data = {
        version: '0.0.1',
        metadata: {
          key: 'API',
          name: 'my project',
          description: 'my description'
        },
        environement: [{
          name: 'uat',
          plugins: [{
            name: '@restqa/restqapi',
            config: {
              url: 'https://api.example.com'
            }
          }],
          outputs: [{
            type: 'html'
          }]
        }]
      }
      mockGet = jest.fn().mockResolvedValue({ data })

      const result = await Project.getConfig()
      expect(result).toEqual(data)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/config')
    })
  })

  describe('initialize', () => {
    test('Retrieve the configuration', async () => {
      const data = {
        configuration: '/tmp/test/.restqa.yml',
        folder: '/tmp/test'
      }
      mockPost = jest.fn().mockResolvedValue({ data })

      const body = {
        name: 'Backend api',
        description: 'All the API used by the different frontends',
        url: 'https://api.example.com',
        env: 'uat',
        ci: 'gitlab-ci'
      }
      const result = await Project.initialize(body)
      expect(result).toEqual(data)
      expect(mockPost.mock.calls).toHaveLength(1)
      expect(mockPost.mock.calls[0][0]).toEqual('/api/restqa/initialize')
      expect(mockPost.mock.calls[0][1]).toEqual(body)
    })
  })

  describe('testFeature', () => {
    test('Retrieve the test result', async () => {
      const data = {
        foo: {
          bar: 'result'
        }
      }
      mockPost = jest.fn().mockResolvedValue({ data })

      const path = 'foo-bar.feature'
      const result = await Project.testFeature(path)
      expect(result).toEqual({
        path,
        data
      })
      expect(mockPost.mock.calls).toHaveLength(1)
      expect(mockPost.mock.calls[0][0]).toEqual('/api/restqa/run')
      expect(mockPost.mock.calls[0][1]).toEqual({ path })
    })
  })

  describe('Steps', () => {
    test('Return the Steps all the steps defintions', async () => {
      const mockData = {
        data: [{
          plugin: '@restqa/restqapi',
          keyword: 'Given',
          step: 'I have the api gateway',
          comment: 'Initiate the api call'
        }, {
          plugin: '@restqa/restqapi',
          keyword: 'When',
          step: 'I call the api',
          comment: 'perform the api call'
        }]
      }
      mockGet = jest.fn().mockResolvedValue(mockData)

      const result = await Project.getStepDefinition()
      expect(result).toEqual(mockData.data)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/restqa/steps')
      expect(mockGet.mock.calls[0][1]).toEqual({ params: {} })
    })

    test('Return the Steps all the steps defintions filtered by keyword', async () => {
      const mockData = {
        data: [{
          plugin: '@restqa/restqapi',
          keyword: 'Given',
          step: 'I have the api gateway',
          comment: 'Initiate the api call'
        }]
      }
      mockGet = jest.fn().mockResolvedValue(mockData)

      const result = await Project.getStepDefinition('given')
      expect(result).toEqual(mockData.data)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/restqa/steps')
      expect(mockGet.mock.calls[0][1]).toEqual({ params: { keyword: 'given' } })
    })
  })

  describe('Features', () => {
    test('retrieve the list of feature files', async () => {
      const mockData = {
        data: [
          'integration/id/delete-todos-id.feature',
          'integration/id/get-todos-id.feature',
          'integration/id/patch-todos-id.feature',
          'integration/id/put-todos-id.feature',
          'integration/post-todos.feature',
          'integration/get-todos.feature'
        ]
      }
      mockGet = jest.fn().mockResolvedValue(mockData)

      const result = await Project.getFeatures()
      const expectedResult = [{
        label: 'integration',
        children: [{
          label: 'id',
          children: [{
            label: 'delete-todos-id.feature',
            children: [],
            filename: 'integration/id/delete-todos-id.feature',
          }, {
            label: 'get-todos-id.feature',
            children: [],
            filename: 'integration/id/get-todos-id.feature',
          }, {
            label: 'patch-todos-id.feature',
            children: [],
            filename: 'integration/id/patch-todos-id.feature',
          }, {
            label: 'put-todos-id.feature',
            children: [],
            filename: 'integration/id/put-todos-id.feature',
          }]
        }, {
          label: 'post-todos.feature',
          children: [],
          filename: 'integration/post-todos.feature',
        }, {
          label: 'get-todos.feature',
          children: [],
          filename: 'integration/get-todos.feature',
        }]
      }]
      expect(result).toEqual(expectedResult)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/project/features')
    })

    test('Get the content of a feature file', async () => {
      const mockData = `
       Feature ...
      `.trim()

      mockGet = jest.fn().mockResolvedValue({data: mockData})

      const result = await Project.getFeatureFile('foo.feature')
      const expectedResult = mockData
      expect(result).toEqual(expectedResult)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/project/features/foo.feature')
    })
  })
})
