import store from '@/store'
import { mapState, mapActions } from 'vuex'
import { throttle } from '@/utils'
const { body } = document
const WIDTH = 1024
const RATIO = 3
export default {
  watch: {
    $route (route) {
      if (this.device === 'mobile' && !this.sidebar.collapse) {
        // store.dispatch('closeSideBar')
        this.closeSideBar()
      }
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    })
  },
  methods: {
    isMobile () {
      const rect = body.getBoundingClientRect()
      return rect.width - RATIO < WIDTH
    },
    resizeHandler () {
      if (!document.hidden) {
        const isMobile = this.isMobile()
        // store.dispatch('toggleDevice', isMobile ? 'mobile' : 'desktop')
        this.toggleDevice(isMobile ? 'mobile' : 'desktop')
        isMobile && this.closeSideBar()
        if (isMobile) {
          console.log('移动端啦 移动端啦')
        }
      }
    },
    ...mapActions({
      closeSideBar: 'app/closeSideBar',
      toggleDevice: 'app/toggleDevice'
    })
  },
  beforeMount () {
    window.addEventListener('resize', throttle(this.resizeHandler, 300))
  },
  mounted () {
    const isMobile = this.isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar')
    }
  }
}
