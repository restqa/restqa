describe('latest version', () => {
  afterEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  test('Do not share any message when the latest version is matching the current version', () => {
    const mockPackageJson = jest.fn().mockResolvedValue({ version: '0.0.1' })
    jest.mock('package-json', () => {
      return mockPackageJson
    })
    const LatestVersion = require('./latest-version')
    return expect(LatestVersion('0.0.1')).resolves.toBe(true)
  })

  test('Share a message when the latest version is not matching the current version', async () => {
    const mockPackageJson = jest.fn().mockResolvedValue({ version: '0.0.2' })
    jest.mock('package-json', () => {
      return mockPackageJson
    })
    const mockLoggerInfo = jest.fn()
    jest.mock('./logger', () => {
      return {
        info: mockLoggerInfo
      }
    })
    const LatestVersion = require('./latest-version')
    await expect(LatestVersion('0.0.1')).resolves.toBe(false)
    expect(mockLoggerInfo.mock.calls).toHaveLength(1)
    const expectedInfoMessage = `
 --
|
| ⚡Your RestQA version (0.0.1) is not up to date.
| 🦏 The latest version is 0.0.2
|
| To update your RestQA version run the following command:           
| npm i -g @restqa/restqa@latest
|
 --
    `
    expect(mockLoggerInfo.mock.calls[0][0]).toEqual(expectedInfoMessage)
  })

  test('If any issue occured resolved the promise but return false', async () => {
    const mockPackageJson = jest.fn().mockRejectedValue(new Error('No internet connection'))
    jest.mock('package-json', () => {
      return mockPackageJson
    })
    const mockLoggerInfo = jest.fn()
    jest.mock('./logger', () => {
      return {
        info: mockLoggerInfo
      }
    })
    const LatestVersion = require('./latest-version')
    await expect(LatestVersion('0.0.1')).resolves.toBe(false)
    expect(mockLoggerInfo.mock.calls).toHaveLength(0)
  })
})
