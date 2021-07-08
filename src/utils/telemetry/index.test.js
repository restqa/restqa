const querystring = require('querystring')

const date = new Date('04 Dec 1995 00:12:00 GMT')

beforeAll(function () {
  this.originalPlatform = process.platform
  this.originalNodeVersion = process.version
})

beforeEach(() => {
  jest.useFakeTimers('modern')
  jest.setSystemTime(date.getTime())
})

afterEach(() => {
  Object.defineProperty(process, 'platform', {
    value: this.originalPlatform
  })

  Object.defineProperty(process, 'version', {
    value: this.originalNodeVersion
  })
  jest.useRealTimers()

  jest.clearAllMocks()
})

describe('# utils - telemetry - index', () => {
  jest.mock('child_process', () => {
    return {
      fork: jest.fn().mockReturnValue({
        send: require('./provider'),
        unref: jest.fn(),
        disconnect: jest.fn()
      })
    }
  })

  const mockRequestWrite = jest.fn()
  const mockRequestEnd = jest.fn()

  const mockRequest = jest.fn((e) => {
    return {
      write: mockRequestWrite,
      end: mockRequestEnd
    }
  })

  jest.mock('https', () => {
    return {
      request: mockRequest
    }
  })

  const Telemetry = require('./index')

  test('Create a telemetry instance and push the data if the options is set as true', () => {
    const mockMath = Object.create(global.Math)
    mockMath.random = () => 0.5
    global.Math = mockMath

    Object.defineProperty(process, 'version', {
      value: '12.6'
    })

    const options = {
      name: '@restqa/restqa',
      version: '0.0.1',
      trackingCode: 'U-0000001'
    }

    const telemetry = new Telemetry(options)

    expect(telemetry.consent).toBe(false)
    telemetry.consent = true

    telemetry.track('eventCategory', 'eventAction', 'eventLabel')

    const expectedEvent = {
      v: 1,
      t: 'event',
      aip: 1,
      tid: 'U-0000001',
      cid: 5000,
      cd1: '',
      cd2: '12.6',
      cd3: '0.0.1',
      z: date.getTime(),
      ec: 'eventCategory',
      ea: 'eventAction',
      el: 'eventLabel'
    }

    expect(mockRequest).toHaveBeenCalledTimes(1)

    const httpsOptions = {
      host: 'www.google-analytics.com',
      port: '443',
      path: '/collect',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(querystring.stringify(expectedEvent))
      }
    }

    expect(mockRequest.mock.calls[0][0]).toEqual(httpsOptions)

    expect(mockRequestWrite).toHaveBeenCalledTimes(1)
    expect(mockRequestWrite.mock.calls[0][0]).toEqual(querystring.stringify(expectedEvent))

    expect(mockRequestEnd).toHaveBeenCalledTimes(1)
  })

  test('Create a telemetry instance and do not push the data if the consent options is set as false', () => {
    process.version = '12.6'

    const options = {
      name: '@restqa/restqa',
      version: '0.0.1',
      trackingCode: 'U-0000001'
    }

    const telemetry = new Telemetry(options)

    expect(telemetry.consent).toBe(false)

    telemetry.track({
      category: 'eventCategory',
      action: 'eventAction',
      label: 'eventLabel',
      value: 'eventValue'
    })

    expect(mockRequest).toHaveBeenCalledTimes(0)
  })
})
