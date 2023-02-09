<script>
import { defineComponent, reactive, ref, h, resolveComponent, computed, toRefs } from 'vue'
import { Tabs, Tab, Search, Popup, Checkbox, Tag } from 'vant'
import { useSearchField } from '@/use/useSearchField'
import { getHistoryData, getNormalTemplateData } from '@/api/nrcView'
import { showDialog } from '@/components/base/base-dialog/index'
import ContentList from '@/components/content-list'

export default defineComponent({
  name: 'nrc-view',
  setup () {
    const active = ref(1)
    const tabData = ref([
      {
        name: 'NRC历史数据',
        index: 0,
        componentName: 'renderHistory',
        dataList: []
      },
      {
        name: 'NRC标准数据库',
        index: 1,
        componentName: 'renderNormal',
        dataList: []
      }
    ])
    const pageObj = reactive({
      pageIndex: 1,
      pageLength: 10
    })
    const lastPage = ref(0)
    const searchQuery = ref('')
    const visible = ref(false)
    const searchContext = reactive(useSearchField())
    const refreshContext = reactive({
      refreshing: false,
      loading: false,
      finished: false
    })
    const currentTab = computed(() => tabData.value[active.value])

    const onFocus = () => {
      visible.value = true
    }
    const onClickButton = () => {
      visible.value = false
    }
    const onTagHnadle = () => {
      // 以api的方式调用组件
      showDialog().show({ showCancelButton: true }).then(res => {
        console.log('///', res)
      })
    }
    const onRefreshHandle = () => {
      // 是否已加载完成，加载完成后不再触发 load 事件
      refreshContext.finished = false
      // 重新加载数据 将 loading 设置为 true，表示处于加载状态
      refreshContext.loading = true
    }
    const onLoadedHandle = () => {
      console.log(111)

      if (refreshContext.refreshing) {
        refreshContext.refreshing = false
      }

      const params = Object.assign(pageObj, {
        //
      })
      if (active.value) {
        _getNormalTemplateData(params)
      } else {
        _getHistoryData(params)
      }
    }
    // tab切换重置加载状态
    const onBeforeChange = (index) => {
      refreshContext.finished = false
      refreshContext.loading = false
      refreshContext.refreshing = false
      return true
    }
    const processDataListResponse = res => {
      if (res && res.list && res.list.length) {
        const { list, total } = res
        const dataList = tabData.value[active.value].dataList

        lastPage.value = Math.ceil(total / pageObj.pageLength)
        tabData.value[active.value].dataList = dataList.concat(list.map(item => {
          return {
            ...item,
            checked: false
          }
        }))
        // 加载状态结束
        refreshContext.loading = false
        // 当前页数自增
        pageObj.pageIndex++

        if (dataList.length >= total) {
          // 数据全部加载完成
          refreshContext.finished = true
        } else {
          // 可继续加载数据
          refreshContext.finished = false
        }
      } else {
        refreshContext.loading = false
        refreshContext.finished = true
      }
    }
    const _getNormalTemplateData = (params) => {
      if (params.pageIndex === lastPage.value) {
        refreshContext.loading = false
        refreshContext.finished = true
        return
      }
      getNormalTemplateData(params).then(res => {
        console.log('///', res)
        processDataListResponse(res)
      })
    }
    const _getHistoryData = (params) => {
      if (params.pageIndex === lastPage.value) {
        refreshContext.loading = false
        refreshContext.finished = true
        return
      }
      getHistoryData(params).then(res => {
        console.log(res)
        processDataListResponse(res)
      })
    }

    return {
      active,
      tabData,
      visible,
      searchQuery,
      searchContext,
      ...toRefs(refreshContext),
      currentTab,
      onFocus,
      onClickButton,
      onTagHnadle,
      onRefreshHandle,
      onLoadedHandle,
      onBeforeChange
    }
  },
  render () {
    const { onFocus, onClickButton, onTagHnadle, onRefreshHandle, onLoadedHandle, onBeforeChange } = this
    const renderHistory = (list) => {
      return <div class="render-view">
        {
          list.length && list.map(item => {
            return <div class="overview">
              <div class="checked">
                <Checkbox v-model={item.checked} />
              </div>
              <div class="wrapper">
                <div class="title">
                  <i>No：{item.ataNo}</i>
                  <span>Action：{item.action}</span>
                </div>
                <div class="extra">
                  <span>Mhr：<Tag plain type="primary">{item.manHour}</Tag></span>
                  <span>Trade：<Tag plain type="primary">{item.trade}</Tag></span>
                  <span>Sws：<Tag type="primary">有</Tag></span>
                </div>
                <div class="desc">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          })
        }
      </div>
    }
    const renderNormal = (list) => {
      return <div class="render-view">
        {
          list.length && list.map(item => {
            return <div class="overview">
              <div class="checked">
                <Checkbox v-model={item.checked} />
              </div>
              <div class="wrapper">
                <div class="title">
                  <i>No：{item.ataNo}</i>
                  <span>Action：{item.action}</span>
                </div>
                <div class="extra">
                  <span>Mhr：<Tag plain type="primary">{item.manHour}</Tag></span>
                  <span>Trade：<Tag plain type="primary">{item.trade}</Tag></span>
                  <span>Sws：<Tag type="primary" onClick={onTagHnadle}>有</Tag></span>
                </div>
                <div class="desc">
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          })
        }
      </div>
    }
    const rederSearch = () => {
      return <Form>
        <div class="serach-form-center">
          {this.searchContext
            ? this.searchContext[this.currentTab.componentName].map(schame => {
              return renderFilterComponent(schame)
            })
            : null}
        </div>
        <div class="serach-form-bottom">
            <Button
              type="primary"
            >
              查询
            </Button>
            <Button
              type="success"
            >
              提取
            </Button>
        </div>
      </Form>
    }
    // 渲染搜索组件
    const renderFilterComponent = schema => {
      return h(resolveComponent(`${schema.model}`), {
        ...schema.props,
        'onUpdate:modelValue': val => {
          console.log('val', val)
          schema.props.modelValue = val
        }
      })
    }

    return <div class="nrc-view-container">
      <Search
        v-model={this.searchQuery}
        show-action
        placeholder="请输入搜索关键词"
        onFocus={onFocus}
      >
        {{
          action: () => <div onClick={onClickButton}>取消</div>
        }}
      </Search>
      <Tabs v-model:active={this.active} sticky offset-top={46} before-change={onBeforeChange}>
        {
          this.tabData.map(tab => {
            return (
              <Tab title={tab.name}>
                <ContentList
                  isPullRefresh={false}
                  v-model:refreshing={this.refreshing}
                  v-model:loading={this.loading}
                  finished={this.finished}
                  onRefresh={onRefreshHandle}
                  onLoaded={onLoadedHandle}
                >
                  {
                    tab.index === 0 ? renderHistory(tab.dataList) : renderNormal(tab.dataList)
                  }
                </ContentList>
              </Tab>
            )
          })
        }
      </Tabs>
      <Popup v-model:show={this.visible} position="bottom" style="{ height: '45%' }">
        { rederSearch() }
      </Popup>
    </div>
  }
})
</script>

<style lang="scss" scoped>
.nrc-view-container {
  position: fixed;
  width: 100%;
  top: 36px;
  bottom: 0;
  overflow: scroll;
}
.render-view {
  margin: 10px;
  .overview {
    position: relative;
    height: 90px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 10px;
    .checked {
      position: absolute;
      top: 38%;
      left: 3px;
    }
    .wrapper {
      padding: 10px;
      margin-left: 20px;
      .title {
        display: flex;
        justify-content: space-between;
        height: 20px;
        margin-bottom: 5px;
        color: $color-text;
        i {
          font-size: $font-size-medium-x;
          font-style: normal;
        }
        span {
          font-size: $font-size-medium;
        }
      }
      .extra {
        display: flex;
        justify-content: space-between;
        font-size: $font-size-medium;
        margin-bottom: 5px;
      }
      .desc {
        p {
          line-height: 16px;
          font-size: $font-size-small;
          color: $color-text-d;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box; //作为弹性伸缩盒子模型显示。
          -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
          -webkit-line-clamp: 2; //显示的行
        }
      }
    }
  }
}
.serach-form-bottom {
  display: flex;
  justify-content: space-around;
  padding: 10px;
}
</style>
