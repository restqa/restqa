beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
})

describe('Service - RestQA - RestQA', () => {
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

      const mockGet = jest.fn().mockResolvedValue(mockData)
      jest.mock('axios', () => {
        return {
          create: function() {
            return this
          },
          get: mockGet
        }
      })
      const Project = require('./project')
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

      const mockGet = jest.fn().mockResolvedValue(mockData)
      jest.mock('axios', () => {
        return {
          create: function() {
            return this
          },
          get: mockGet
        }
      })
      const Project = require('./project')
      const result = await Project.getStepDefinition('given')
      expect(result).toEqual(mockData.data)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/restqa/steps')
      expect(mockGet.mock.calls[0][1]).toEqual({ params: { keyword: 'given' } })
    })
  })
})
