<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" @click.native="toggleSideBar"></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <screenfull class="right-menu-item screenfull-container"></screenfull>
      <div class="right-menu-item avatar-container">
        <avatar></avatar>
      </div>
      <el-button round size="mini" @click.native="logOutConfirm">退出</el-button>
    </div>
  </el-menu>
</template>

<script type="text/ecmascript-6">
import Hamburger from '@/components/hamburger'
import Breadcrumb from '@/components/breadcrumb'
import Screenfull from '@/components/screenfull'
import Avatar from '@/components/avatar'
import {MessageBox} from 'element-ui'
import {mapActions} from 'vuex'
export default {
  data () {
    return {

    }
  },
  methods: {
    logOutConfirm () {
      MessageBox.confirm('您正在退出当前账号，请确认是否退出', '退出提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logOut()
        this.$router.push('/login')
      }).catch(res => {
        console.log(res)
      })
    },
    ...mapActions({
      logOut: 'logOut',
      toggleSideBar: 'app/toggleSideBar'
    })
  },
  components: {
    Hamburger,
    Breadcrumb,
    Screenfull,
    Avatar,
    MessageBox
  }
}
</script>

<style scoped lang="stylus">
@import '~@/styles/mixins.styl'

.navbar
  position absolute
  top 0
  left 0
  right 0
  height 50px
  line-height 50px
  background-color #ffffff
  border-bottom 1px solid #e6e6e6

  .hamburger-container
    float left
    height 50px
    line-height 50px
    padding 0 10px

  .breadcrumb-container
    line-height 50px
    margin-left 10px

  .right-menu
    margin-right 30px
    float right

    &:focus
      outline none

    .right-menu-item
      float left
      display inline-block
      margin 0 8px
      margin-right 20px

    .screenfull-container
      height 50px

    .avatar-container
      padding 8px
</style>
