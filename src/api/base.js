import request from '@/utils/request.js'

/**
 * 获取企业微信回调地址
 * @params
 * @returns url
 */
export function getWxAuthorize () {
  return request({
    url: '/enrc/getTokenUrl',
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getEnrcTokenUrl'
    }
  })
}

/**
 * 获取token
 * @params
 * @returns token
 */
export function getToken () {
  return request({
    url: '/enrc/getToken',
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getEnrcToken'
    }
  })
}

/**
 * 获取用户信息
 * @params
 * @returns {}
 */
export function getUserInfo (param) {
  return request({
    url: `/enrc/getUsers?token=${param.token}`,
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getWeComUsers'
    }
  })
}
