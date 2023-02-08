import request from '@/utils/request.js'

/**
 * nrc标准模板查询
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
