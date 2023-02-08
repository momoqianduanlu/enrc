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
// export function getToken () {
//   return request({
//     url: '/enrc/getToken',
//     method: 'get',
//     headers: {
//       OperationCode: 'staeco.enrc.testLocalhost.getEnrcToken'
//     }
//   })
// }

/**
 * 获取企业微信权限签名
 * @params
 * @returns {}
 */
export function getWxTicketData (url) {
  return request({
    url: `/enrc/getTicketData?url=${url}`,
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getTicket'
    }
  })
}

// /enrc/getTicketData

/**
 * 通过企业微信code获取用户信息
 * @params
 * @returns {}
 */
export function getUserInfo (code) {
  return request({
    url: `/enrc/getUserInfo?code=${code}`,
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getUserId'
    }
  })
}
