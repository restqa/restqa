module.exports = {
  verbose: true,
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    "\\.[jt]sx?$": "babel-jest"
  },
  testMatch: [
    "<rootDir>/src/**/*.test.js"
  ]
}
