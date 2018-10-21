<template>
  <div class="app-main" :class="{'sidebarCollapsed': sidebar.collapse,'mobile': device === 'mobile'}">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.fullPath
    },
    ...mapState({
      'sidebar': state => state.app.sidebar,
      'device': state => state.app.device
    })
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
.app-main
  position fixed
  left 200px
  top 51px
  right 0
  bottom 0
  padding 20px
  overflow scroll
  transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)

  &.sidebarCollapsed
    left 64px

  &.mobile
    left 64px
</style>
