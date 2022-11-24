describe('#services - Channels', () => {
  test('init module', () => {
    const index = require('./index')
    expect(Object.keys(index).length).toEqual(3)
    expect(Object.keys(index)).toEqual(['google-sheet', 'confluence', 'csv'])
  })
})
