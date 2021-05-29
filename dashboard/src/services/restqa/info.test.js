beforeEach(() => {
  jest.resetModules()
  jest.resetAllMocks()
  window.localStorage.removeItem('remote-info')
})

describe('Service - RestQA - TeamNote', () => {
  let mockGet
  jest.mock('axios', () => {
    const originalModule = jest.requireActual('axios')
    return {
      ...originalModule,
      create: function() {
        return this
      },
      get: function () {
        return mockGet.apply(this, arguments)
      }
    }
  })

  afterEach(() => {
    mockGet = undefined
  })

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

      mockGet = jest.fn().mockResolvedValue(mockData)
      const Info = require('./info')
      const result = await Info.getTeamNote()
      expect(result).toEqual(mockData.data.team.note)
      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toEqual('/api/info')
    })

    test('Return the Team note Information from the cache because we are on the same day', async () => {
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

      const date = new Date()
      window.localStorage.setItem('remote-info', JSON.stringify({
        today: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        data: mockData.data
      }))

      mockGet = jest.fn()

      const Info = require('./info')
      const result1 = await Info.getTeamNote()
      expect(result1).toEqual(mockData.data.team.note)

      const result2 = await Info.getTeamNote()
      expect(result2).toEqual(mockData.data.team.note)

      const result3 = await Info.getTeamNote()
      expect(result3).toEqual(mockData.data.team.note)

      expect(mockGet.mock.calls).toHaveLength(0)
    })

    test('Return the Team note Information from the remote server because the current day is different from the one in the cache', async () => {
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

      const date = new Date()
      window.localStorage.setItem('remote-info', JSON.stringify({
        today: '2021-01-01',
        data: mockData.data
      }))

      mockGet = jest.fn().mockResolvedValue(mockData)

      const Info = require('./info')
      const result1 = await Info.getTeamNote()
      expect(result1).toEqual(mockData.data.team.note)

      const result2 = await Info.getTeamNote()
      expect(result2).toEqual(mockData.data.team.note)

      const result3 = await Info.getTeamNote()
      expect(result3).toEqual(mockData.data.team.note)

      expect(mockGet.mock.calls).toHaveLength(1)
      expect(mockGet.mock.calls[0][0]).toBe('/api/info')
    })
  })

  describe('blogs', () => {
    test('Return the Team blog Information', async () => {
      const mockData = {
        data: {
          team: {
             blog: {
             url: "https://medium.com/restqa",
               last: {
                 title: "RestQA is here! Do your end-to-end API test integration, the right way!",
                 date: "2021-02-02 02:24:19",
                 image: "https://cdn-images-1.medium.com/max/1024/1*iyyY6QkAAE2bOzNRevfCuw.png",
                 author: {
                   username: "@Olivierodo",
                   avatar: "https://cdn-images-1.medium.com/fit/c/150/150/1*acYALd6w84KRScRNMpFLUg.jpeg"
                 },
                 url: "https://medium.com/restqa/restqa-is-here-do-your-end-to-end-api-test-integration-the-right-way-84b7313e1291"
               }
             }
          }
        }
      }

      mockGet = jest.fn().mockResolvedValue(mockData)
      const Info = require('./info')
      const result = await Info.getTeamBlog()
      expect(result).toEqual(mockData.data.team.blog)
      expect(mockGet.mock.calls).toHaveLength(1)
    })
  })

  describe('videos', () => {
    test('Return the Team video Information', async () => {
      const mockData = {
        data: {
          team: {
            video: {
               url: "https://www.youtube.com/channel/UCdT6QenNLmnxNT-aT8nYq_Q",
               last: {
                 title: "RestQA",
                 date: "2021-04-17 03:00:30",
                 image: "https://i2.ytimg.com/vi/EberYFGPZPo/hqdefault.jpg",
                 url: "https://www.youtube.com/watch?v=EberYFGPZPo"
               }
             }
          }
        }
      }

      mockGet = jest.fn().mockResolvedValue(mockData)
      const Info = require('./info')
      const result = await Info.getTeamVideo()
      expect(result).toEqual(mockData.data.team.video)
      expect(mockGet.mock.calls).toHaveLength(1)
    })
  })

  describe('sponsors', () => {
    test('Return the Team sponsors Information', async () => {
      const mockData = {
        data: {
          sponsors: [{
            url: "https://atalent-consulting.com",
            name: "RestQA is here! Do your end-to-end API test integration, the right way!",
            logo: "https://atalent-consulting.com/logo.png"
          }]
        }
      }

      mockGet = jest.fn().mockResolvedValue(mockData)
      const Info = require('./info')
      const result = await Info.getTeamSponsors()
      expect(result).toEqual(mockData.data.sponsors)
      expect(mockGet.mock.calls).toHaveLength(1)
    })
  })
})

