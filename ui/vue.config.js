const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{
          from:'@restqa/docs/content/images',
          to:'images/documentation',
          context: 'node_modules'
        }]
      }), 
    ],
  },
  devServer: {
    port: 3000
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   }
  }
}
