<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path" v-if="item.meta.title">
        <router-link :to="item.redirect || item.path">
          {{item.meta.title}}
        </router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      // const first = matched[0]
      this.levelList = matched
    }
  },
  created () {
    this.getBreadcrumb()
  }
}
</script>

<style scoped lang="stylus">
.app-breadcrumb
  display inline-block

  .el-breadcrumb
    display inline-block
    font-size 14px
    line-height 50px
    margin-left 10px

    .no-redirect
      color #97a8be
      cursor text

.breadcrumb-enter-active, .breadcrumb-leave-active
  transition all 0.5s

.breadcrumb-enter, .breadcrumb-leave-active
  opacity 0
  transform translateX(20px)

.breadcrumb-move
  transition all 0.5s

.breadcrumb-leave-active
  position absolute
</style>
