const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      sass: {
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    proxy: {
      '/enrc': {
        target: 'http://192.168.12.115:8088/' // 我们要代理的真实接口地址
      }
    }
  }
})
