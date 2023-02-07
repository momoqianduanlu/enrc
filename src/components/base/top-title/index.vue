<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'top-title',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  setup () {
    //
  },
  render () {
    return <div class='top-title'>{this.title}</div>
  }
})
</script>
