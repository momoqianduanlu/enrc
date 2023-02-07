import request from '@/utils/request.js'

/**
 * 获取下拉数据
 * @params 'area'，'stage'，'stage'
 * @returns []
 */
export function getSelectList (params) {
  return request({
    url: `enrc/getEnrcDropDownDatas?type=${params}`,
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getRelevantDropDownData'
    }
  })
}

/**
 * 获取下拉组件数据
 * @params 'ENRC_PART'，'ENRC_DEFECT_TYPE'，'ENRC_RECOMMENDED_ACTION'
 * @returns []
 */
export function getSelectComponentList (params) {
  return request({
    url: `/enrc/getDictionaryEntriesByType?dicttypeid=${params}`,
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getEosDictEntryDataByDicttypeid'
    }
  })
}

/**
 * 根据Id获取project或者job信息
 * @params 'id'，'user'，'type'
 * @returns []
 */
export function getJobInfoById (params) {
  return request({
    url: `/enrc/getPrjectIdOrJobNoData?id=${params.id}&user=${params.user}&type=${params.type}`,
    method: 'get',
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.getProjectOrJobById'
    }
  })
}

/**
 * 保存/暂存 非例行工卡录入
 * @params
 * @returns []
 */
export function submitWorkCard (data) {
  return request({
    url: '/enrc/saveOrStagingNonroutineJobCard',
    method: 'post',
    data,
    headers: {
      OperationCode: 'staeco.enrc.testLocalhost.saveOrStagingEnrcWorkCardModelData'
    }
  })
}
