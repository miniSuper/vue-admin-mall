<template>
  <div class="app-wrapper">
    <div v-if=" device === 'mobile' && !sidebar.collapse " class="drawer-bg" @click="clickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container" :class="{'sidebarCollapsed': sidebar.collapse ,'mobile': device === 'mobile' }">
      <navbar></navbar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Sidebar, Navbar, AppMain} from './base'
// import { mapState } from 'vuex'
import ResizeMixin from './mixins/resize'

export default {
  name: 'layout',
  mixins: [ResizeMixin],
  computed: {
    // ...mapState({
    //   'sidebar': state => state.app.sidebar,
    //   'device': state => state.app.device
    // })
  },
  methods: {
    clickOutside () {
      console.log('clickOutside')
      this.closeSideBar()
    }
    // ...mapActions({
    //   closeSideBar: 'app/closeSideBar'
    // })
  },
  components: {
    Sidebar, Navbar, AppMain
  }
}
</script>

<style scoped lang="stylus">
.app-wrapper
  width 100%
  height 100%
  overflow hidden

  .drawer-bg
    background #000
    opacity 0.3
    width 100%
    top 0
    height 100%
    position absolute
    z-index 900

  .sidebar-container
    position fixed
    top 0
    left 0
    bottom 0
    width 200px
    background-color #304156
    border-right 1px solid #dddddd
    z-index 950

  .main-container
    position relative
    margin-left 200px
    min-height 100%
    overflow scroll
    transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)

    &.sidebarCollapsed
      margin-left 64px

    &.mobile
      margin-left 64px
</style>
