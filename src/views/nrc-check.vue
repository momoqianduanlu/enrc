<script>
import { defineComponent, ref, h, resolveComponent, onMounted } from 'vue'
import { Tabbar, TabbarItem, Search, SwipeCell, Tag, showImagePreview } from 'vant'
import { useFilterField } from '@/use/useSearchField'
import { getNrcCheckData, getNrcCheckImgData } from '@/api/nrcCheck'
import usePage from '@/use/usePage'
import { FLOW_STATUS } from '@/utils/constants'

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
    const nrcList = ref([])
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
    const onClickHandle = (item, handle) => {
      if (handle === 'edit' || handle === 'copy') {
        //
      } else if (handle === 'delete') {
        //
      } else if (handle === 'preview') {
        console.log(item)
        getNrcCheckImgData(item.id).then(res => {
          if (res) {
            showImagePreview(['https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', ...res])
          }
        })
      }
    }
    const processNrcList = (list) => {
      return list.map((item) => {
        const { fileNo, status } = item
        let buttonList = []
        const map = new Map([
          [
            '00',
            [
              {
                type: 'default',
                handle: 'all',
                name: '全部'
              }
            ]
          ],
          [
            '01',
            [
              {
                type: 'primary',
                handle: 'edit',
                name: '编辑'
              },
              {
                type: 'warning',
                handle: 'copy',
                name: '拷贝'
              }
            ]
          ],
          [
            '02',
            [
              {
                type: 'primary',
                handle: 'edit',
                name: '编辑'
              },
              {
                type: 'danger',
                handle: 'delete',
                name: '删除'
              }
            ]
          ],
          [
            '03',
            [
              {
                type: 'warning',
                handle: 'copy',
                name: '拷贝'
              }
            ]
          ]
        ])
        const mapItem = map.get(status)
        if (mapItem) {
          buttonList = buttonList.concat(mapItem)
        }
        // 有照片添加照片预览
        if (fileNo !== '0') {
          buttonList.push({
            type: 'default',
            handle: 'preview',
            name: '照片'
          })
        }
        return {
          ...item,
          buttonList,
          _status: FLOW_STATUS[status]
        }
      })
    }
    onMounted(() => {
      getNrcCheckData().then((res) => {
        console.log(res)
        if (res) {
          nrcList.value = processNrcList(res.list)
        }
      })
    })
    return {
      active,
      tabList,
      nrcList,
      visible,
      searchQuery,
      searchContext,
      onFocus,
      onClickButton,
      onClickHandle
    }
  },
  render () {
    const { onFocus, onClickButton, onClickHandle } = this
    const renderFilter = () => {
      return (
        <Form>
          <div class="serach-form-center">
            {this.searchContext
              ? this.searchContext.map((schame) => {
                return renderFilterComponent(schame)
              })
              : null}
          </div>
          <div class="serach-form-bottom">
            <Button type="primary">查询</Button>
          </div>
        </Form>
      )
    }
    const renderFilterComponent = (schema) => {
      return h(resolveComponent(`${schema.model}`), {
        ...schema.props,
        'onUpdate:modelValue': (val) => {
          console.log('val', val)
          schema.props.modelValue = val
        }
      })
    }
    const renderSwipeCell = (item) => {
      return (
        <SwipeCell>
          {{
            default: () => {
              return renderCellItem(item)
            },
            right: () => {
              return renderCellButton(item)
            }
          }}
        </SwipeCell>
      )
    }
    const renderCellItem = (item) => {
      return (
        <div class="cell-view">
          <div class="cell-item">
            <div class="wrapper">
              <div class="title">
                <i>{item.createTime}</i>
                <span>{item.originalJobNo}</span>
              </div>
              <div class="extra">
                <span>创建人：{item.createBy}</span>
                <span>
                  状态：<Tag type="primary">{item._status}</Tag>
                </span>
              </div>
              <div class="desc">
                <p>{item.defectDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    const renderCellButton = (item) => {
      return (
        <div class="cell-button">
          {item.buttonList
            ? item.buttonList.map((btn) => {
              return (
                  <Button square type={btn.type} class="delete-button" onClick={() => {
                    onClickHandle(item, btn.handle)
                  }}>
                    {btn.name}
                  </Button>
              )
            })
            : null}
        </div>
      )
    }
    return (
      <div class="nrc-check-container">
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
        <div class="swipe-cell">
          {this.nrcList.map((item) => {
            return renderSwipeCell(item)
          })}
        </div>
        <Popup
          v-model:show={this.visible}
          position="bottom"
          style="{ height: '45%' }"
        >
          {renderFilter()}
        </Popup>
        <Tabbar v-model={this.active}>
          {this.tabList.map((item) => {
            return <TabbarItem to={item.url}>{item.name}</TabbarItem>
          })}
        </Tabbar>
      </div>
    )
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
          flex: 1;
          font-size: $font-size-medium;
          font-style: normal;
          overflow: hidden;
        }

        span {
          flex: 0 0 120px;
          font-size: $font-size-medium;
          overflow: hidden;
        }
      }

      .extra {
        display: flex;
        font-size: $font-size-medium;
        margin-bottom: 5px;

        span {
          margin-right: 5px;
        }
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
