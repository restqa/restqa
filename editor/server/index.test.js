const request = require('supertest')

describe('#editor > Server', () => {
  test('first test',  async () => {
    const config = {}
    const server = require('./index')(config)
    const response = await request(server).get('/test')
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('pass!')
  })
})
