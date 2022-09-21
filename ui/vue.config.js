const path = require('path')
module.exports = {
  publicPath: '',
  outputDir: path.resolve(__dirname, '..','cli','dist','ui'),
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  chainWebpack: config => {
    config.module.rules.delete('eslint');
  },
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
