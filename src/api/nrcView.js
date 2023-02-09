import request from '@/utils/request.js'

/**
 * nrc历史数据查询
 * @params
 * @returns []
 */
export function getHistoryData (data) {
  return request({
    url: '/enrc/queryNrcHisDataInterface',
    method: 'post',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.queryNrcHistoricalDatas'
    },
    data
  })
}

/**
 * nrc标准模板查询
 * @params
 * @returns []
 */
export function getNormalTemplateData (data) {
  return request({
    url: '/enrc/queryNrcDatabaseTempData',
    method: 'post',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.queryEnrcNrcDatabaseTemplateData'
    },
    data
  })
}
