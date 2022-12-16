const Faker = require('faker')
const assert = require('assert')

module.exports = function ({ Then }) {
  Then('Check {string} is an actual value from faker', function (key) {
    const result = this.data.get(key)
    assert.ok(Faker.definitions.music.genre.includes(result))
  })
}
