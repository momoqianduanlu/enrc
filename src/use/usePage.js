import { ref, reactive } from 'vue'

export default function usePage (useField) {
  const pageObj = reactive({
    pageIndex: 1,
    pageSize: 10
  })
  const lastPage = ref(0)
  const searchQuery = ref('')
  const searchContext = reactive(useField())
  const refreshContext = reactive({
    refreshing: false,
    loading: false,
    finished: false
  })
  return {
    pageObj,
    lastPage,
    searchQuery,
    searchContext,
    refreshContext
  }
}
