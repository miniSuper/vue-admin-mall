<template>
  <el-scrollbar class="sidebar" :class="{'sidebarCollapsed': sidebar.collapse}">
    <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" class="sidebar-menu" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" @open="handleOpen" @close="handleClose" :collapse="sidebar.collapse">
      <sidebar-item v-for="route in permission_routes" :key="route.name" :item="route" :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import SidebarItem from './sidebar-item'
import {allRoutes} from '@/router'
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    routes () {
      return allRoutes
    },
    ...mapState({
      'sidebar': state => state.app.sidebar,
      'permission_routes': state => state.permission.routes
    })
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    hoverSubmenu () {
      // console.log('hover submenu')
    }
  },
  components: {
    SidebarItem
  },
  mounted () {
    console.log('this.sidebar', this.sidebar)
    console.log('this.routes', this.permission_routes)
  }
}
</script>

<style scoped lang="stylus">
.sidebar
  transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)

  &.sidebarCollapsed
    width 64px

    >>>.el-menu
      .el-menu-item
        span
          transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)
          display none

      .el-submenu
        span
          transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)
          display none

  >>>.el-menu
    border 0 none
    transition all 0.25s cubic-bezier(0.5, 0.01, 0.18, 1)

    .el-submenu
      .el-submenu__title
        background-color rgba(0, 0, 0, 0.07) !important

        .svg-icon
          color #bccbda !important
          font-size 18px

    .el-menu-item-group
      .el-menu-item
        background-color #213042 !important

      .el-menu-item-group__title
        padding 0

    .el-menu-item
      color red

      .svg-icon
        color #bccbda !important
        font-size 18px

      &:hover
        background-color rgba(0, 0, 0, 0.07) !important
</style>
