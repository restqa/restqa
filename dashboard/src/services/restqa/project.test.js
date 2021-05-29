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
})
