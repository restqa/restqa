const path = require('path')
module.exports = {
  publicPath: '',
  outputDir: path.resolve(__dirname, '..','restqa-core','dist','ui'),
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },
  devServer: {
    port: 3000
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   }
  }
}

