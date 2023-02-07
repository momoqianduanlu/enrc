<script>
import { defineComponent, toRefs, computed } from 'vue'
import { Dialog, DropdownMenu, DropdownItem } from 'vant'

export default defineComponent({
  name: 'push-dialog',
  props: {
    title: {
      type: String,
      default: '推送至'
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    pushData: {
      type: Array,
      default: () => []
    },
    pushInfo: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['update:modelValue', 'update:pushInfo'],
  setup (props, ctx) {
    const { modelValue, pushData } = toRefs(props)
    const model = computed({
      get: () => {
        return modelValue.value
      },
      set: (val) => {
        ctx.emit('update:modelValue', val)
      }
    })
    const modelInfo = computed({
      get: () => {
        return pushData.value[0] && pushData.value[0].value
      },
      set: (val) => {
        console.log(val)
        ctx.emit('update:pushInfo', val)
      }
    })
    const onChange = (val) => {
      ctx.emit('update:pushInfo', val)
      ctx.emit('update:modelValue', false)
    }
    return {
      model,
      modelInfo,
      onChange
    }
  },
  render () {
    return <Dialog v-model:show={this.model} title={this.title} showConfirmButton={false}>
      <div class="push-popup-view">
          <DropdownMenu overlay={false}>
            <DropdownItem v-model={this.modelInfo} options={this.pushData} onChange={this.onChange} style={'top:110px'}></DropdownItem>
          </DropdownMenu>
        </div>
    </Dialog>
  }
})
</script>

<style lang="scss">
.push-popup-view {
  height: 230px;
  .van-dropdown-item__content {
    height: 180px;
    overflow: auto;
  }
}
</style>
