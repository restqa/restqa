process.env.TZ = 'UTC';
module.exports = {
  verbose: true,
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.vue$': 'vue-jest',
    "\\.[jt]sx?$": "babel-jest"
  },
  testMatch: [
    "<rootDir>/src/**/*.test.js"
  ],
  moduleNameMapper: {
    "\\.(css)$": "identity-obj-proxy"
  }
}
