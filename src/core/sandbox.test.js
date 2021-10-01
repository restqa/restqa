const Sandbox = require('./sandbox')

afterEach(() => {
    jest.useRealTimers();
});

describe('Core - Sandbox', () => {
  test('Generate scenario and emit request', () => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2012-10-10'))
    return new Promise((resolve) => {
      const request = {
        foo: 'bar'
      }
      const instance = new Sandbox()
      instance.on('generated', (data) => {
        const expectedData = {
          request,
          status: 'PENDING',
          scenario: 'Scenario: ...',
          createdAt: new Date('2012-10-10')
        }
        expect(data).toEqual(expectedData)
        resolve()
      })
      instance.emit('request', request)
    })


  })
})
