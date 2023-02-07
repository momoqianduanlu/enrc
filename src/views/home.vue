<script>
import { defineComponent } from 'vue'
import { Swipe, SwipeItem, Grid, GridItem } from 'vant'
import { useRouter } from 'vue-router'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'home',
  setup (props, ctx) {
    const router = useRouter()
    const imgList = [
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
    ]
    const gridList = [
      {
        name: '非例行工卡',
        url: '/work-card',
        icon: 'photo-o'
      },
      {
        name: '补充工作单',
        url: '',
        icon: 'photo-o'
      },
      {
        name: 'NRC查询',
        url: '',
        icon: 'photo-o'
      },
      {
        name: 'NRC模板',
        url: '',
        icon: 'photo-o'
      }
    ]
    const onRouteTo = () => {
      router.push({
        path: '/work-card'
      })
    }
    return {
      imgList,
      gridList,
      onRouteTo
    }
  },
  render () {
    const {
      imgList,
      gridList,
      onRouteTo
    } = this
    return <div class='home-container'>
      <div class='home-swipe'>
        <Swipe autoplay={3000} height={200} lazy-render>
          {
            imgList.map((item, index) => {
              return (
                <SwipeItem key={index}>
                  <img src={item} />
                </SwipeItem>
              )
            })
          }
        </Swipe>
      </div>
      <div class='home-grid'>
        <Grid square={true}>
          {
            gridList.map((grid) => {
              return (
                <GridItem icon={grid.icon} text={grid.name} onClick={onRouteTo}></GridItem>
              )
            })
          }
        </Grid>
      </div>
    </div>
  }
})
</script>

<style lang="scss" scoped>
.home-container {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  overflow: scroll;
  background: $color-background-d;

  .home-swipe {
    padding: 15px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .home-grid {
    padding: 15px;
  }
}
</style>
