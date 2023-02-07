<script>
import { defineComponent, ref, toRefs } from 'vue'
import { Field, Tag, Button, Popover, showToast, Dialog } from 'vant'

/**
 * 输入框 + 下拉
 * 1. 可以输入
 * 2. 可以点击选中tag，最多可选中3个
 * 3. 选中的数据可以删除
 */

export default defineComponent({
  name: 'select-tag',
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    placeholder: {
      type: String,
      default: '请选择标签'
    },
    tagList: {
      type: Array,
      default: () => []
    },
    selectTag: {
      type: Array,
      default: () => []
    },
    isInput: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:selectTag', 'update:tagList'],
  setup (props, ctx) {
    const { selectTag, tagList } = toRefs(props)
    const showPopover = ref(false)
    const showDialog = ref(false)
    const newTag = ref('')
    // 选择tag
    const onSelectTag = (tag) => {
      if (selectTag.value.length >= 3) {
        showToast({
          message: 'tag最多选择3个',
          position: 'top'
        })
      } else if (selectTag.value.includes(tag)) {
        showToast({
          message: 'tag已经选择',
          position: 'top'
        })
      } else {
        selectTag.value.push(tag)
        ctx.emit('update:selectTag', selectTag)
      }
    }
    // 新增tag
    const onAddTag = () => {
      if (newTag.value === '') {
        showToast({
          message: '新增标签不能为空！',
          position: 'top'
        })
      } else {
        selectTag.value.push(newTag.value)
        ctx.emit('update:selectTag', selectTag)

        tagList.value.push(newTag.value)
        ctx.emit('update:tagList', tagList)
      }
    }
    // 删除tag
    const onClose = (tag, index) => {
      selectTag.value.splice(index, 1)
      ctx.emit('update:selectTag', selectTag)

      if (tagList.value.includes(tag)) {
        tagList.value = tagList.value.filter(item => item !== tag)
        ctx.emit('update:tagList', tagList)
      }
    }
    const onAddTagDialog = () => {
      showDialog.value = true
    }
    return {
      showPopover,
      showDialog,
      newTag,
      onSelectTag,
      onAddTag,
      onClose,
      onAddTagDialog
    }
  },
  render () {
    const renderPopoverView = () => {
      return <div class="popover-view">
        {
          this.tagList.length
            ? this.tagList.map(tag => {
              return <Tag
              plain
              type='primary'
              size='medium'
              style={'margin: 5px'}
              onClick={() => {
                this.onSelectTag(tag)
              }}
            >
              {tag}
            </Tag>
            })
            : null
        }
        {
          this.isInput
            ? <Button
              icon="plus"
              type="primary"
              size='mini'
              style={['width: 40px;', 'height: 20px;', 'margin-left: 10px']}
              onClick={this.onAddTagDialog}
            ></Button>
            : null
        }
        {
          renderDialog()
        }
      </div>
    }
    const renderReferenceView = (value) => {
      return <>{
        value.length
          ? <div class='reference-view'>
            {
              value.map((item, index) => {
                return <Tag
                  type='primary'
                  size='medium'
                  closeable
                  style={'margin-right: 5px'}
                  onClose={() => {
                    this.onClose(item, index)
                  }}
                >
                  {item}
                </Tag>
              })
            }
          </div>
          : <Field placeholder={this.placeholder}></Field>
      }</>
    }
    const renderDialog = () => {
      return <>
        <Dialog v-model:show={this.showDialog} onConfirm={this.onAddTag}>
          <Field v-model={this.newTag} placeholder='请输入内容'></Field>
        </Dialog>
      </>
    }
    return (
      <Popover v-model:show={this.showPopover} placement={this.placement}>
        {{
          default: () => {
            return <>
              {renderPopoverView()}
            </>
          },
          reference: () => {
            return <>
              {renderReferenceView(this.selectTag)}
            </>
          }
        }}
      </Popover>
    )
  }
})
</script>

<style lang="scss" scoped>
.popover-view {
  width: 260px;
  padding: 10px;
  min-height: 50px;
}
.reference-view {
  -width: 100%;
  height: 24px;
}
</style>
