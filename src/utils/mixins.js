export const pageMixin = {
  data () {
    return {
      pageSize: 10,
      pageIndex: 1,
      totalCount: 10
    }
  },
  methods: {
    setCurrentpage (page) {
      this.pageIndex = page
      this.refresh()
    },
    setPageSize (pageSize) {
      this.pageSize = pageSize
      this.refresh()
    }
  }
}
