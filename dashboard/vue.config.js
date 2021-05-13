const path = require('path')
module.exports = {
  publicPath: '/',
  outputDir: path.resolve(__dirname, '../dist'),
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

