<script>
import { defineComponent } from 'vue'
import { Icon } from 'vant'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'success',
  setup (props, ctx) {
    //
  },
  render () {
    return <div class='success-view'>
      <div class="center">
        <div class="icon">
          <Icon name='success' size="45" color="#ffffff"></Icon>
        </div>
      </div>
      <div class="content">
        <span>操作成功</span>
        111111111111111111111111111111111111 111111111111111111111111111111111111
      </div>
    </div>
  }
})
</script>

<style lang="scss" scoped>
.success-view {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .center {
    padding: 30px;
    .icon {
      width: 80px;
      height: 80px;
      line-height: 95px;
      text-align: center;
      border-radius: 50%;
      background: rgb(35, 181, 74);
    }
  }
  .content {
    min-height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: $font-size-small;
    color: $color-text-d;
    span {
      display: block;
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>
