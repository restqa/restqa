describe('Service - RestQA - TeamNote', () => {
  test('Return the backend information', async () => {
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
    const TeamNote = require('./team-note')
    const result = await TeamNote.get()
    expect(result).toEqual(mockData.data.team.note)
    expect(mockGet.mock.calls).toHaveLength(1)
    expect(mockGet.mock.calls[0][0]).toEqual('/api/info')
  })
})

