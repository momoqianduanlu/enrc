<script>
import { defineComponent, ref, toRefs } from 'vue'
import { Dialog, Tag } from 'vant'

export default defineComponent({
  name: 'base-dialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    showConfirmButton: {
      type: Boolean,
      default: false
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    cancelButtonText: {
      type: String,
      default: '关闭'
    }
  },
  setup (props, ctx) {
    const visible = ref(true)
    const resolve = ref(() => { })
    const reject = ref(() => { })
    const show = () => {
      return new Promise((_resolve, _reject) => {
        visible.value = true
        resolve.value = _resolve
        reject.value = _reject
      })
    }
    const hide = () => {
      visible.value = false
    }
    return {
      visible,
      ...toRefs(props),
      show,
      hide
    }
  },
  render () {
    return <Dialog
              v-model:show={this.visible}
              showConfirmButton={this.showConfirmButton}
              showCancelButton={this.showCancelButton}
              cancelButtonText={this.cancelButtonText}
            >
              <div class="overview">
                <div class="wrapper">
                  <div class="title">
                    <i>No：</i>
                  </div>
                  <div class="extra">
                    <span>Mhr：<Tag plain type="primary">1</Tag></span>
                    <span>Trade：<Tag plain type="primary">AE</Tag></span>
                    <span>Job Type：<Tag plain type="primary">有</Tag></span>
                  </div>
                  <div class="desc">
                    <p>支持NRC附属补充工作单勾选后，在NRC提交后自动跳转至补充工单生成页面，并将各个步骤全部复制至相应位置；</p>
                  </div>
                </div>
              </div>
            </Dialog>
  }
})
</script>

<style lang="scss" scoped>
.overview {
  height: 130px;
  overflow: auto;
    .wrapper {
      padding: 15px;
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
        }
      }
    }
  }
</style>
