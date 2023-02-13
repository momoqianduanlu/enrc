<script>
import { computed, defineComponent, toRefs } from 'vue'
import { Picker } from 'vant'

export default defineComponent({
  name: 'popup-picker',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    pickerData: {
      type: String,
      default: ''
    },
    showToolbar: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    placement: {
      type: String,
      default: 'bottom'
    }
  },
  emits: ['update:modelValue', 'update:pickerData'],
  setup (props, ctx) {
    const { modelValue } = toRefs(props)
    const model = computed({
      get: () => {
        return modelValue.value
      },
      set: (val) => {
        ctx.emit('update:modelValue', val)
      }
    })
    const onPickerArea = (val) => {
      const value = val.selectedValues[0]
      ctx.emit('update:pickerData', value)
      ctx.emit('update:modelValue', false)
    }
    return {
      model,
      onPickerArea
    }
  },
  render () {
    return <>
        <Popup v-model:show={this.model} position={this.placement}>
          <Picker
            show-toolbar={this.showToolbar}
            columns={this.columns}
            onClickOption={this.onPickerArea}
          />
        </Popup>
      </>
  }
})
</script>
