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

/**
 * 查询nrc非例行工卡的图片数据
 * @params 'id'
 * @returns []
 */
export function getNrcCheckImgData (id) {
  return request({
    url: `/enrc/queryPictures?id=${id}`,
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getFiles'
    }
  })
}
