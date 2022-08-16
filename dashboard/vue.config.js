const path = require('path')

module.exports = {
  publicPath: '.',
  outputDir: path.resolve(__dirname, './dist'),
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  configureWebpack: {
    target: ['web', 'es5'],
    optimization: {
      splitChunks: false
    },
    output: {
      scriptType: false
    }
  },
  chainWebpack: config => {
    /* disable insertion of assets as data urls b/c Phaser doesn't support it */
    const rules = ['images', 'media']

    rules.forEach(rule => {
      const ruleConf = config.module.rule(rule)
      ruleConf.type('asset/resource')
    })
  },
  devServer: {
    port: 3000
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   }
  }
}
