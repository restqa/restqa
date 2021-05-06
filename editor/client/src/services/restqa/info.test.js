beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
  jest.useFakeTimers('modern')
  console.log(jest)
  jest.setSystemTime(new Date('20 Aug 2020 00:12:00 GMT'))
  window.localStorage.removeItem('remote-info')
})

afterEach(() => {
  jest.useRealTimers()
})


describe('Service - RestQA - TeamNote', () => {
  describe('team note', () => {
    test('Return the Team note Information', async () => {
      const mockData = {
        data: {
          team: {
            note: {
              message: 'We love RestQA',
              from: 'John Doe',
              avatar: '/avatar/john.png'
            }
          }
        }
      }

      const mockGet = jest.fn().mockResolvedValue(mockData)
      jest.mock('axios', () => {
        return {
          get: mockGet
        }
      })
      const TeamNote = require('./info')
      const result = await TeamNote.getTeamNote()
      expect(result).toEqual(mockData.data.team.note)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/info')
    })

    test('Return the Team note Information from the cache if it has been retrieved already', async () => {
      const mockData = {
        data: {
          team: {
            note: {
              message: 'We love RestQA',
              from: 'John Doe',
              avatar: '/avatar/john.png'
            }
          }
        }
      }

      const mockGet = jest.fn().mockResolvedValue(mockData)
      jest.mock('axios', () => {
        return {
          get: mockGet
        }
      })
      const TeamNote = require('./info')
      const result1 = await TeamNote.getTeamNote()
      expect(result1).toEqual(mockData.data.team.note)

      const result2 = await TeamNote.getTeamNote()
      expect(result2).toEqual(mockData.data.team.note)

      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/info')
    })

    test('Return the Team note Information from the remote if the info from the cache from yesterday', async () => {
      const mockData = {
        data: {
          team: {
            note: {
              message: 'We love RestQA',
              from: 'John Doe',
              avatar: '/avatar/john.png'
            }
          }
        }
      }

      const mockGet = jest.fn().mockResolvedValue(mockData)
      jest.mock('axios', () => {
        return {
          get: mockGet
        }
      })

      const TeamNote = require('./info')
      const result1 = await TeamNote.getTeamNote()
      expect(result1).toEqual(mockData.data.team.note)

      const result2 = await TeamNote.getTeamNote()
      expect(result2).toEqual(mockData.data.team.note)

      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/info')
    })
  })
})

