<script>
import { defineComponent, reactive, ref, h, resolveComponent, computed, toRefs } from 'vue'
import { Tabs, Tab, Search, Popup, Form, Button, Cell } from 'vant'
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

        for (let i = 0; i < 10; i++) {
          list.value.push(list.value.length + 1)
        }
        refreshContext.loading = false

        if (list.value.length >= 40) {
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
            return <Cell key={item} title={item}></Cell>
          })
        }
      </div>
    }
    const renderNormal = () => {
      return <div class="render-view">
        {
          this.list.length && this.list.map(item => {
            return <Cell key={item} title={item}></Cell>
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
  background: red;
}
.serach-form-bottom {
  display: flex;
  justify-content: space-around;
  padding: 10px;
}
</style>
