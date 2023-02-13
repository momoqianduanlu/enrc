import request from '@/utils/request.js'

/**
 * nrc数据查询
 * @params
 * @returns []
 */
export function getNrcCheckData (data) {
  return request({
    url: '/enrc/getWorkCardModelDataByParameter',
    method: 'post',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getEnrcWorkCardModelDataByParameter'
    },
    data
  })
}
