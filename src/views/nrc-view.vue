<script>
import { defineComponent, reactive, ref, h, resolveComponent, computed, toRefs } from 'vue'
import { Tabs, Tab, Search, Popup, Form, Button, Tag } from 'vant'
import { useSearchField } from '@/use/useSearchField'
import ContentList from '@/components/content-list'

export default defineComponent({
  name: 'nrc-view',
  setup () {
    const active = ref(0)
    const tabData = ref([
      {
        name: 'NRC历史数据',
        index: 0,
        componentName: 'renderHistory'
      },
      {
        name: 'NRC标准数据库',
        index: 1,
        componentName: 'renderNormal'
      }
    ])
    const searchQuery = ref('')
    const visible = ref(false)
    const list = ref([1, 2, 3, 4, 5, 6])
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
    const onRefreshHandle = () => {
      // setTimeout(() => {
      //   showToast('刷新成功')
      //   refreshContext.refreshing = false
      // }, 1000)
    }
    const onLoadedHandle = () => {
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        if (refreshContext.refreshing) {
          list.value = []
          refreshContext.refreshing = false
        }

        for (let i = 0; i < 1; i++) {
          list.value.push(list.value.length + 1)
        }
        refreshContext.loading = false

        if (list.value.length >= 1) {
          refreshContext.finished = true
        }
      }, 1000)
    }
    return {
      active,
      tabData,
      visible,
      searchQuery,
      searchContext,
      ...toRefs(refreshContext),
      currentTab,
      list,
      onFocus,
      onClickButton,
      onRefreshHandle,
      onLoadedHandle
    }
  },
  render () {
    const { onFocus, onClickButton, onRefreshHandle, onLoadedHandle } = this
    const renderHistory = () => {
      return <div class="render-view">
        {
          this.list.length && this.list.map(item => {
            return <div class="overview">
              <div class="wrapper">
                <div class="title">
                  <i>No：</i>
                  <span>Action：</span>
                </div>
                <div class="extra">
                  <span>Mhr：<Tag mark type="primary">1</Tag></span>
                  <span>Trade：<Tag mark type="primary">AE</Tag></span>
                  <span>Sws：<Tag mark type="primary">有</Tag></span>
                </div>
                <div class="desc">
                  <p>支持NRC附属补充工作单勾选后，在NRC提交后自动跳转至补充工单生成页面，并将各个步骤全部复制至相应位置；</p>
                </div>
              </div>
            </div>
          })
        }
      </div>
    }
    const renderNormal = () => {
      return <div class="render-view">
        {
          this.list.length && this.list.map(item => {
            return <div class="overview">
              <div class="wrapper">
                <div class="title">
                  <i>No：</i>
                  <span>Action：</span>
                </div>
                <div class="extra">
                  <span>Mhr：<Tag mark type="primary">1</Tag></span>
                  <span>Trade：<Tag mark type="primary">AE</Tag></span>
                  <span>Sws：<Tag mark type="primary">有</Tag></span>
                </div>
                <div class="desc">
                  <p>支持NRC附属补充工作单勾选后，在NRC提交后自动跳转至补充工单生成页面，并将各个步骤全部复制至相应位置；</p>
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
      <Tabs v-model:active={this.active} sticky offset-top={46}>
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
                    tab.index === 0 ? renderHistory() : renderNormal()
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
    min-height: 85px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 10px;
    .wrapper {
      padding: 10px;
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
          -webkit-line-clamp: 3; //显示的行
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
