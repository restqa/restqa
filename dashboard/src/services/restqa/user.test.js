afterAll(() => {
  jest.clearAllMocks()
})

describe('Service - RestQA - User', () => {

  let mockGet
  let mockPost
  let mockPut
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
      },
      put: function () {
        return mockPut.apply(this, arguments)
      }
    }
  })

  afterEach(() => {
    mockGet = undefined
    mockPost = undefined
    mockPut = undefined
  })

  const User = require('./user')

  describe('preferences', () => {
    test('Retrieve the preferences', async () => {
      const data = {
        telemetry: true
      }
      mockGet = jest.fn().mockResolvedValue({ data })

      const result = await User.getPreferences()
      expect(result).toEqual(data)
      expect(mockGet).toHaveBeenCalledTimes(1)
      expect(mockGet).toHaveBeenCalledWith('/preferences')
    })
  })
})
