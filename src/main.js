import { createApp } from 'vue'
import { showFailToast } from 'vant'
import App from './App.vue'
import router from './router'
import { register } from './utils/register'
import { urlParse, isWeChat } from './utils'
import { saveUserInfo } from './utils/cache'
import { getWxAuthorize, getWxTicketData, getUserInfo } from '@/api/base'

// 引入全局样式
import '@/assets/scss/index.scss'

// 引入组件样式
import 'vant/lib/index.css'

import Vconsole from 'vconsole'

// eslint-disable-next-line no-unused-vars
const vConsole = new Vconsole()

const { searchObject } = urlParse(window.location.href)

const initApp = () => {
  const app = createApp(App)
  register(app)
  app.use(router)
  app.mount('#app')
}

const initWxConfig = () => {
  getWxTicketData(window.location.href).then(res => {
    console.log('res2', res)
    const { appId, timestamp, noncestr, signature } = res
    // eslint-disable-next-line no-undef
    wx.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId, // 必填，企业微信的corpID
      timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录1
      jsApiList: [
        'selectEnterpriseContact'
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
  })
}

if (isWeChat(navigator.userAgent)) {
  if (searchObject.code) {
    getUserInfo(searchObject.code).then(res => {
      console.log('---', res)
      if (res) {
        initApp()
        initWxConfig()
        saveUserInfo({
          ...res,
          code: searchObject.code
        })
        router.push({
          path: '/'
        })
      }
    })
  } else {
    getWxAuthorize()
      .then(res => {
        if (res) {
          window.location.href = res
        }
      })
      .catch(err => {
        console.log(err)
        showFailToast('获取微信url失败！')
      })
  }
} else {
  initApp()
}
