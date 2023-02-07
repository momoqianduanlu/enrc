import axios from 'axios'
import { showLoadingToast, closeToast } from 'vant'
import { HEADER_KEY, HEADER_VAL } from './constants'

const service = axios.create({
  baseURL: '',
  timeout: 60 * 1000
})

let toastInstance = null
let requestCount = 0

const doRequestDone = () => {
  setTimeout(() => {
    if (requestCount > 0) {
      requestCount--
    }
    if (requestCount === 0) {
      closeToast()
      toastInstance = null
    }
  }, 500)
}

const mergeConfigHeader = (headers) => {
  Object.keys(HEADER_KEY).forEach(key => {
    const val = HEADER_KEY[key]
    headers[val] = HEADER_VAL[key]
  })
}

service.interceptors.request.use(
  (config) => {
    requestCount++
    if (!toastInstance) {
      toastInstance = showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
    }
    // 添加接口请求头配置
    mergeConfigHeader(config.headers)
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    doRequestDone()
    // console.log(response)
    if (response.status === 401 || response.data.errcode === 404) {
      return Promise.reject(response.data.errmsg)
    } else if (response.status === 200) {
      return response.data.data || response.data
    }
  },
  (error) => {
    doRequestDone()
    // err('授权失败，请稍候重试~~')
    return Promise.reject(error)
  }
)
export default service
