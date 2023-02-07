<script>
import { defineComponent, reactive, watch, toRefs } from 'vue'
import { NavBar } from 'vant'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'm-header',
  setup (props, ctx) {
    const router = useRouter()
    const route = useRoute()
    const metaData = reactive({
      name: '',
      arrow: ''
    })
    const onClickLeftHandle = () => {
      router.go(-1)
    }
    watch(
      () => route.meta,
      (val, oldVal) => {
        metaData.name = val.name
        metaData.arrow = val.arrow
      },
      {
        immediate: true
      }
    )
    return {
      onClickLeftHandle,
      ...toRefs(metaData)
    }
  },
  render () {
    return <div class='m-header'>
      <NavBar title={this.name} fixed={true} left-arrow={this.arrow} onClickLeft={this.onClickLeftHandle}></NavBar>
    </div>
  }
})
</script>

<style lang="scss" scoped>
.m-header {
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;
}
</style>
