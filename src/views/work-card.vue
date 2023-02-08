<script>
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { Divider, Checkbox, Switch, Radio, RadioGroup, Uploader, Icon, showSuccessToast } from 'vant'
import Compressor from 'compressorjs'
import { useRouter } from 'vue-router'
import PopupPicker from '@/components/popup-picker'
import PushDialog from '@/components/push-dialog'
import TopTitle from '@/components/base/top-title'
import SelectTag from '@/components/select-tag'
import QrCode from '@/components/qr-code'
import { debounce, isObject } from '@/utils'
import { loadUserInfo } from '@/utils/cache'
import { getJobInfoById, getSelectList, getSelectComponentList, submitWorkCard } from '@/api/workCard'

export default defineComponent({
  name: 'work-card',
  setup (props, ctx) {
    const state = reactive({
      id: null,
      originalJobNo: 'AAE08',
      projId: '',
      acRegn: '',
      area: '',
      zone: '',
      stage: '',
      ata: '',
      defectType: [],
      recommendedAction: [],
      performTrade: '',
      manhour: '',
      customerEndorsement: false,
      reportableDefect: false,
      pseDefect: false,
      defectDescription: '',
      part: [],
      sta: {
        staCode: '',
        staFrom: '',
        staTo: ''
      },
      waterLine: {
        waterLineCode: '',
        waterLineFrom: '',
        waterLineTo: ''
      },
      stringer: {
        stringerCode: '',
        stringerFrom: '',
        stringerTo: '',
        stringerFromLr: '',
        stringerToLr: ''
      },
      bbl: {
        bblCode: '',
        bblFrom: '',
        bblTo: '',
        bblFromLr: '',
        bblToLr: ''
      },
      cause: [],
      files: [],
      parentNo: {},
      ifApprovalRequired: 0, // 是否需要审批
      swsIssur: false
    })
    const selectList = reactive({
      areaList: [],
      majorList: [],
      stageList: []
    })
    const selectTagList = reactive({
      defectTypeList: [],
      recommendedActionList: [],
      partList: [],
      causeList: []
    })
    const zoneList = [
      { text: '100', value: '100' },
      { text: '200', value: '200' },
      { text: '300', value: '300' },
      { text: '400', value: '400' },
      { text: '500', value: '500' },
      { text: '600', value: '600' },
      { text: '700', value: '700' },
      { text: '800', value: '800' }
    ]
    const pushData = [
      { text: '全部商品', value: 0 },
      { text: '新款商品', value: 1 },
      { text: '活动商品', value: 2 }
    ]
    const visibleQrCode = ref(false)
    const showPushDialog = ref(false)
    const visibleAreaPicker = ref(false)
    const visibleZonePicker = ref(false)
    const visibleStagePicker = ref(false)
    const visibleMajorPicker = ref(false)
    const route = useRouter()

    watch(() => state.originalJobNo, (oldVal, newVal) => {
      if (newVal !== oldVal && oldVal) {
        debounce(() => {
          getJobInfoById({
            id: oldVal,
            user: '',
            type: 2 // 扫码1 手动输入2
          }).then(res => {
            if (res) {
              const { projId, acRegn } = res
              state.projId = projId
              state.acRegn = acRegn
            }
          })
        }, 1000)()
      }
    })
    const showQrCode = () => {
      visibleQrCode.value = true
    }
    const showAreaPicker = (picker) => {
      visibleAreaPicker.value = true
    }
    const showZonePicker = () => {
      visibleZonePicker.value = true
    }
    const showStagePicker = () => {
      visibleStagePicker.value = true
    }
    const showMajorPicker = () => {
      visibleMajorPicker.value = true
    }
    const onGetQrCodeHandle = (code) => {
      visibleQrCode.value = false
      state.originalJobNo = code
    }
    const onBeforeReadHandle = async (file) => {
      const data = await compressImage(file)
      if (data) {
        console.log('compressImage', data)
        return data
      } else {
        return false
      }
    }
    const onClear = () => {
      state.originalJobNo = ''
    }
    const onPush = () => {
      showPushDialog.value = true
    }
    const onRouterTo = () => {
      route.push({
        path: '/nrc-view'
      })
    }
    // 草稿提交
    const onDraft = () => {
      submitWorkCard({
        type: 1,
        user: loadUserInfo().userId, // 鉴权后用户信息(企业微信返回的code)
        ...transformParams({ ...state })
      }).then(res => {
        if (res && res.code === 200) {
          showSuccessToast(res.message)
        }
        console.log(res)
      })
    }
    // 保存提交
    const onSubmit = () => {
      submitWorkCard({
        type: 2,
        user: loadUserInfo().userId, // 鉴权后用户信息(企业微信返回的code)
        ...transformParams({ ...state })
      }).then(res => {
        if (res && res.code === 200) {
          showSuccessToast(res.message)
        }
        console.log(res)
      })
    }
    const compressImage = (file) => {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new Compressor(file, {
          quality: 0.6,
          success (result) {
            // 返回Blob类型转成File
            if (Object.prototype.toString.call(result) === '[object Blob]') {
              result = new File([result], result.name, { type: result.type })
            }
            resolve(result)
          },
          error (err) {
            reject(err)
          }
        })
      })
    }
    // 序列化参数
    const transformParams = (params) => {
      let _params = {}
      const decludeKey = ['part', 'sta', 'waterLine', 'stringer', 'bbl']
      Object.keys(params).forEach(key => {
        let val = params[key]
        // 文件数组
        if (key === 'files' && Array.isArray(val) && val.length) {
          val = val.map(item => {
            return {
              file: item.content
            }
          })
        }
        if (params.pseDefect) {
          // 嵌套对象
          if (decludeKey.includes(key) && isObject(val)) {
            const _val = { ...val }
            for (const k in _val) {
              _params[k] = _val[k]
            }
            delete params[key]
          }
          _params = Object.assign(_params, {
            [key]: val
          })
        } else {
          // 普通对象
          if (!decludeKey.includes(key)) {
            _params = Object.assign(_params, {
              [key]: val
            })
          }
        }
      })
      return _params
    }
    onMounted(() => {
      const processSelectData = (list, key) => {
        if (Array.isArray(list)) {
          return list.map(item => {
            return {
              text: item[key].trim(),
              value: item[key].trim()
            }
          })
        }
        return list
      }
      Promise.all([
        getSelectList('area'),
        getSelectList('trade'),
        getSelectList('stage')
      ]).then((values) => {
        if (values && values.length) {
          const includeList = ['AreaCode', 'PrimeTrade', 'StageCode']
          Object.keys(selectList).forEach((key, index) => {
            selectList[key] = processSelectData(values[index], includeList[index])
          })
        }
      })
      Promise.all([
        getSelectComponentList('ENRC_DEFECT_TYPE'),
        getSelectComponentList('ENRC_RECOMMENDED_ACTION'),
        getSelectComponentList('ENRC_PART'),
        getSelectComponentList('ENRC_CAUSE')
      ]).then((values) => {
        if (values && values.length) {
          Object.keys(selectTagList).forEach((key, index) => {
            selectTagList[key] = Array.from(values[index], item => {
              return item.dictid
            })
          })
        }
      })
    })
    return {
      zoneList,
      pushData,
      visibleQrCode,
      showPushDialog,
      visibleAreaPicker,
      visibleZonePicker,
      visibleStagePicker,
      visibleMajorPicker,
      showQrCode,
      showAreaPicker,
      showZonePicker,
      showStagePicker,
      showMajorPicker,
      onGetQrCodeHandle,
      onBeforeReadHandle,
      onClear,
      onPush,
      onRouterTo,
      onDraft,
      onSubmit,
      ...toRefs(state),
      ...toRefs(selectList),
      ...toRefs(selectTagList)
    }
  },
  render () {
    const {
      showQrCode,
      showAreaPicker,
      showZonePicker,
      showStagePicker,
      showMajorPicker,
      onGetQrCodeHandle,
      onBeforeReadHandle,
      onClear,
      onPush,
      onRouterTo,
      onDraft,
      onSubmit
    } = this
    const renderTextarea = () => {
      return (
        <Field
          v-model={this.defectDescription}
          rows="2"
          autosize
          label="Defect description"
          type="textarea"
          placeholder="请输入内容"
          label-align="top"
        >
          {{
            button: () => <Button type="primary" size="small" onClick={onRouterTo}>NRC数据库模板</Button>
          }}
        </Field>
      )
    }
    const renderDefect = () => {
      return <div class='defect-form'>
        <Field label='Part'>
          {{
            input: () =>
              <SelectTag
                v-model:selectTag={this.part}
                v-model:tagList={this.partList}
                isInput={true}
                placeholder={'part最多选择3个'}
              />
          }}
        </Field>
        <TopTitle title='STA/Frame' />
        <Field label='Code' placeholder="请输入code" v-model={this.sta.staCode}></Field>
        <Field label='From' placeholder="请输入from" v-model={this.sta.staFrom}></Field>
        <Field label='To' placeholder="请输入to" v-model={this.sta.staTo}></Field>
        <TopTitle title='WaterLine' />
        <Field label='Code' placeholder="请输入code" v-model={this.waterLine.waterLineCode}></Field>
        <Field label='From' placeholder="请输入from" v-model={this.waterLine.waterLineFrom}></Field>
        <Field label='To' placeholder="请输入to" v-model={this.waterLine.waterLineTo}></Field>
        <TopTitle title='Stringer' />
        <Field label='Code' placeholder="请输入code" v-model={this.stringer.stringerCode}></Field>
        <Field label='From'>
          {{
            input: () => {
              return (
                <RadioGroup v-model={this.stringer.stringerFrom} direction="horizontal">
                  <Radio name="L">L</Radio>
                  <Radio name="R">R</Radio>
                </RadioGroup>
              )
            }
          }}
        </Field>
        <Field label='备注' placeholder="请输入备注" v-model={this.stringer.stringerFromLr}></Field>
        <Field label='To'>
          {{
            input: () => {
              return (
                <RadioGroup v-model={this.stringer.stringerTo} direction="horizontal">
                  <Radio name="L">L</Radio>
                  <Radio name="R">R</Radio>
                </RadioGroup>
              )
            }
          }}
        </Field>
        <Field label='备注' placeholder="请输入备注" v-model={this.stringer.stringerToLr}></Field>
        <TopTitle title='BBL' />
        <Field label='Code' placeholder="请输入code" v-model={this.bbl.bblCode}></Field>
        <Field label='From'>
          {{
            input: () => {
              return (
                <RadioGroup v-model={this.bbl.bblFrom} direction="horizontal">
                  <Radio name="L">L</Radio>
                  <Radio name="R">R</Radio>
                </RadioGroup>
              )
            }
          }}
        </Field>
        <Field label='备注' placeholder="请输入备注" v-model={this.bbl.bblFromLr}></Field>
        <Field label='To'>
          {{
            input: () => {
              return (
                <RadioGroup v-model={this.bbl.bblTo} direction="horizontal">
                  <Radio name="L">L</Radio>
                  <Radio name="R">R</Radio>
                </RadioGroup>
              )
            }
          }}
        </Field>
        <Field label='备注' placeholder="请输入备注" v-model={this.bbl.bblToLr}></Field>
      </div>
    }
    return (
      <Form onSubmit={onSubmit}>
        { this.visibleQrCode
          ? <QrCode onGetQrCode={
            (code) => {
              onGetQrCodeHandle(code)
            }
          } />
          : null
        }
        <Field label='Orig.JobNo or ProjectID' v-model={this.originalJobNo} placeholder='请点击扫描条形码'>
          {{
            'right-icon': () => <Icon name="scan" size="30" onClick={showQrCode}/>,
            button: () => <Button size="small" type="primary" onClick={onClear}>清除</Button>
          }}
        </Field>
        <Field label='项目号' disabled v-model={this.projId}></Field>
        <Field label='飞机号' disabled v-model={this.acRegn}></Field>
        {/* Area */}
        <Field
          v-model={this.area}
          is-link
          readonly
          label='区域'
          placeholder="点击选择区域"
          onClick={() => {
            showAreaPicker('visibleAreaPicker')
          }}
        >
        </Field>
        <PopupPicker v-model={this.visibleAreaPicker} v-model:pickerData={this.area} columns={this.areaList}></PopupPicker>
        {/* Zone */}
        <Field
          v-model={this.zone}
          is-link
          readonly
          label='分区'
          placeholder="点击选择分区"
          onClick={showZonePicker}
        >
        </Field>
        <PopupPicker v-model={this.visibleZonePicker} v-model:pickerData={this.zone} columns={this.zoneList}></PopupPicker>
        {/* Stage */}
        <Field
          v-model={this.stage}
          is-link
          readonly
          label='分类'
          placeholder="点击选择分类"
          onClick={showStagePicker}
        >
        </Field>
        <PopupPicker v-model={this.visibleStagePicker} v-model:pickerData={this.stage} columns={this.stageList}></PopupPicker>
        <Field label='章节号' v-model={this.ata} placeholder='请输入章节号'></Field>
        <Divider style='borderColor: #1989fa' />
        <Field label='缺陷类型'>
          {{
            input: () =>
              <SelectTag
                v-model:selectTag={this.defectType}
                tagList={this.defectTypeList}
                placeholder={'缺陷类型最多选择3个'}
              />
          }}
        </Field>
        <Field label='处理措施'>
          {{
            input: () =>
              <SelectTag
                v-model:selectTag={this.recommendedAction}
                tagList={this.recommendedActionList}
                placeholder={'处理措施最多选择3个'}
              />
          }}
        </Field>
        {/* Perform trade */}
        <Field
          v-model={this.performTrade}
          is-link
          readonly
          label='专业'
          placeholder="点击选择专业"
          onClick={showMajorPicker}
        >
        </Field>
        <PopupPicker v-model={this.visibleMajorPicker} v-model:pickerData={this.performTrade} columns={this.majorList}></PopupPicker>
        <Field label='工时' v-model={this.manhour} placeholder="请输入工时"></Field>
        <Field label="Customer Endorsement">
          {{
            input: () => <Checkbox shape="square" v-model={this.customerEndorsement} />
          }}
        </Field>
        <Field label="Reportable defect">
          {{
            input: () => <Checkbox shape="square" v-model={this.reportableDefect} />
          }}
        </Field>
        <Divider style='borderColor: #1989fa' />
        <div class="defect-view">
          <Field label="PSE DEFECT">
            {{
              input: () => <Switch v-model={this.pseDefect} size="22px" />
            }}
          </Field>
          {
            this.pseDefect ? renderDefect() : renderTextarea()
          }
        </div>
        <Field label='Cause'>
          {{
            input: () =>
              <SelectTag
                v-model:selectTag={this.cause}
                tagList={this.causeList}
                placeholder={'最多选择2个'}
              />
          }}
        </Field>
        <Field label='Attach file'>
          {{
            input: () => <Uploader
              v-model={this.files}
              previewSize='5rem'
              multiple
              maxCount={'2'}
              before-read={onBeforeReadHandle}
            />
          }}
        </Field>
        <div class="defect-view">
          <Field label="SWS Issue">
            {{
              input: () => <Switch v-model={this.swsIssur} size="22px" />
            }}
          </Field>
          <Field label='推送' disabled>
            {{
              button: () => <Button type="primary" size='small' onClick={onPush}>推送</Button>
            }}
          </Field>
          <PushDialog v-model:modelValue={this.showPushDialog} v-model:pushInfo={this.parentNo} pushData={this.pushData}></PushDialog>
        </div>
        <Divider style='borderColor: #1989fa' />
        <div style="margin: 16px;">
          <Button type="primary" onClick={onDraft}>草稿</Button>
          <Button type="success" native-type="submit">提交</Button>
        </div>
      </Form>
    )
  }
})
</script>

<style lang="scss" scoped>
.defect-form {
  padding: 0 15px;
}

.top-title {
  height: 20px;
  padding: 10px 0;
  line-height: 20px;
  font-size: $font-size-medium;
  color: $color-text;
}
</style>
