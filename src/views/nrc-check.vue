<script>
import { defineComponent, ref, h, resolveComponent, onMounted } from 'vue'
import { Tabbar, TabbarItem, Search, SwipeCell, Tag } from 'vant'
import { useFilterField } from '@/use/useSearchField'
import { getNrcCheckData } from '@/api/nrcCheck'
import usePage from '@/use/usePage'

export default defineComponent({
  name: 'nrc-check',
  setup () {
    const active = ref(0)
    const tabList = [
      {
        name: 'Raise NRC',
        url: '/work-card'
      },
      {
        name: 'Raise CWS/DIC',
        url: 'work-card'
      },
      {
        name: '数据库管理',
        url: '/nrc-view'
      }
    ]
    const visible = ref(false)
    const {
      // pageObj,
      // lastPage,
      searchQuery,
      searchContext
      // refreshContext
    } = usePage(useFilterField)
    const onFocus = () => {
      visible.value = true
    }
    const onClickButton = () => {
      visible.value = false
    }
    onMounted(() => {
      getNrcCheckData().then(res => {
        console.log(res)
      })
    })
    return {
      active,
      tabList,
      visible,
      searchQuery,
      searchContext,
      onFocus,
      onClickButton
    }
  },
  render () {
    const { onFocus, onClickButton } = this
    const renderFilter = () => {
      return <Form>
        <div class="serach-form-center">
          {this.searchContext
            ? this.searchContext.map(schame => {
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
        </div>
      </Form>
    }
    const renderFilterComponent = (schema) => {
      return h(resolveComponent(`${schema.model}`), {
        ...schema.props,
        'onUpdate:modelValue': val => {
          console.log('val', val)
          schema.props.modelValue = val
        }
      })
    }
    const renderCellItem = () => {
      return <div class="cell-item">
        <div class="wrapper">
          <div class="title">
            <i>No：{1}</i>
            <span>Action：{1}</span>
          </div>
          <div class="extra">
            <span>Mhr：<Tag plain type="primary">{1}</Tag></span>
          </div>
          <div class="desc">
            <p>{1}</p>
          </div>
        </div>
      </div>
    }
    return <div class="nrc-check-container">
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
      <SwipeCell>
        {{
          default: () => {
            return <div class="cell-view">
              {
                renderCellItem()
              }
            </div>
          },
          right: () => {
            return <div class="cell-button">
              <Button square text="删除" type="danger" class="delete-button">111</Button>
            </div>
          }
        }}
      </SwipeCell>
      <Popup v-model:show={this.visible} position="bottom" style="{ height: '45%' }">
        {renderFilter()}
      </Popup>
      <Tabbar v-model={this.active}>
        {
          this.tabList.map(item => {
            return <TabbarItem to={item.url}>{item.name}</TabbarItem>
          })
        }
      </Tabbar>
    </div>
  }
})
</script>

<style lang="scss">
.cell-view {
  margin: 10px;

  .cell-item {
    position: relative;
    height: 90px;
    border: 1px solid #eee;
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
          flex: 0 0 120px;
          font-size: $font-size-medium-x;
          font-style: normal;
          overflow: hidden;
        }

        span {
          flex: 1;
          font-size: $font-size-medium;
          overflow: hidden;
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

.cell-button {
  height: 90px;

  .van-button {
    height: 100%;
  }
}
</style>
