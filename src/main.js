import { createApp } from 'vue'
import { showFailToast } from 'vant'
import App from './App.vue'
import router from './router'
import { register } from './utils/register'
import { urlParse, isWeChat } from './utils'
import { saveUserInfo } from './utils/cache'
import { getWxAuthorize, getUserInfo } from '@/api/base'

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

if (isWeChat(navigator.userAgent)) {
  if (searchObject.code) {
    getUserInfo(searchObject.code).then(res => {
      console.log('res', res)
      if (res) {
        initApp()
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
