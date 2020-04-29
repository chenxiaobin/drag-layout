const path = require('path')
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',
  // webpack配置
  chainWebpack: config => {
    // 设置静态目录别名
    config.resolve.alias
      .set('public', path.join(__dirname, 'public'))
      .set('vue$', 'vue/dist/vue.js')
  },
  // webpack-dev-server 相关配置
  devServer: {
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
