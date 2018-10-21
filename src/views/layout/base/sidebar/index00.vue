<template>
  <el-scrollbar class="sidebar" :class="{'sidebarCollapsed': sidebar.collapse}">
    <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" class="sidebar-menu" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" @open="handleOpen" @close="handleClose" :collapse="sidebar.collapse">
      <router-link to="/">
        <el-menu-item index="0">
          <svg-icon icon-class="home"></svg-icon>
          <span slot="title">首页</span>
        </el-menu-item>
      </router-link>
      <el-submenu index="1" @mouseenter.native="hoverSubmenu" @click.native="hoverSubmenu">
        <template slot="title">
          <svg-icon icon-class="order"></svg-icon>
          <span slot="title">订单</span>
        </template>
        <el-menu-item-group>
          <router-link to="/order/order-list">
            <el-menu-item index="1-1">订单列表</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <svg-icon icon-class="component"></svg-icon>
          <span slot="title">商品</span>
        </template>
        <el-menu-item-group>
          <router-link to="/goods/goods-list">
            <el-menu-item index="2-1">商品列表</el-menu-item>
          </router-link>
          <router-link to="/goods/goods-add">
            <el-menu-item index="2-2">商品发布</el-menu-item>
          </router-link>
          <router-link to="/goods/goods-sort">
            <el-menu-item index="2-3">商品分类</el-menu-item>
          </router-link>
          <router-link to="/goods/goods-brand">
            <el-menu-item index="2-4">商品品牌</el-menu-item>
          </router-link>
          <router-link to="/goods/goods-label">
            <el-menu-item index="2-5">商品标签</el-menu-item>
          </router-link>
          <router-link to="/goods/goods-model">
            <el-menu-item index="2-6">商品规格</el-menu-item>
          </router-link>
          <router-link to="/goods/goods-type">
            <el-menu-item index="2-7">商品类型</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <svg-icon icon-class="people"></svg-icon>
          <span slot="title">会员</span>
        </template>
        <el-menu-item-group>
          <!-- <span slot="title">分组一</span> -->
          <router-link to="/member/member-list">
            <el-menu-item index="3-1">会员列表</el-menu-item>
          </router-link>
          <router-link to="/member/member-rank">
            <el-menu-item index="3-2">会员等级</el-menu-item>
          </router-link>
          <router-link to="/member/member-points">
            <el-menu-item index="3-3">会员积分</el-menu-item>
          </router-link>
          <router-link to="/member/member-balance">
            <el-menu-item index="3-4">余额管理</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-menu-item index="4" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">运营人员管理</span>
      </el-menu-item> -->
      <el-submenu index="4">
        <template slot="title">
          <svg-icon icon-class="settings"></svg-icon>
          <span slot="title">设置</span>
        </template>
        <el-menu-item-group>
          <router-link to="/settings/admin-list">
            <el-menu-item index="4-1">管理员列表</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title">
          <svg-icon icon-class="system"></svg-icon>
          <span slot="title">系统</span>
        </template>
        <el-menu-item-group>
          <router-link to="/system/module">
            <el-menu-item index="5-1">模块设置</el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-scrollbar>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'

export default {
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    ...mapState({
      'sidebar': state => state.app.sidebar
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
