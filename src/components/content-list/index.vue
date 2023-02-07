<script>
import { computed, defineComponent, toRefs } from 'vue'
import { List, PullRefresh } from 'vant'

export default defineComponent({
  name: 'content-list',
  props: {
    isPullRefresh: { // 是否禁用下拉刷新
      type: Boolean,
      default: false
    },
    refreshing: { // 是否处于加载中状态
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh', 'loaded', 'update:refreshing', 'update:loading'],
  setup (props, ctx) {
    const { refreshing, loading } = toRefs(props)
    const isRefreshing = computed({
      get () {
        return refreshing.value
      },
      set (val) {
        ctx.emit('update:refreshing', val)
      }
    })
    const isLoading = computed({
      get () {
        return loading.value
      },
      set (val) {
        ctx.emit('update:loading', val)
      }
    })
    const onRefresh = () => {
      ctx.emit('refresh')
    }
    const onLoaded = () => {
      ctx.emit('loaded')
    }
    return {
      isRefreshing,
      isLoading,
      onRefresh,
      onLoaded // 加载过程中和加载
    }
  },
  render () {
    return (
      <PullRefresh
        v-model={this.isRefreshing}
        disabled={this.isPullRefresh}
        onRefresh={this.onRefresh}
      >
        <List
          v-model:loading={this.isLoading}
          finished={this.finished}
          finished-text="没有更多了"
          onLoad={this.onLoaded}
        >
          {this.$slots.default()}
        </List>
      </PullRefresh>
    )
  }
})
</script>

<style lang="scss" scoped>
.content-list {
  height: auto;
}
</style>
