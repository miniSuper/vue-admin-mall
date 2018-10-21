<template>
  <div class="login-container">
    <el-form class="login-form" :model="loginForm" status-icon :rules="loginRules" ref="loginForm" label-width="100px" label-position="top">
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input type="text" v-model="loginForm.username" auto-complete="on" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="passwordType" v-model="loginForm.password" auto-complete="on" placeholder="请输入密码"></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <!-- <el-form-item prop="idcode" class="idcode">
        <el-input type="text" v-model="loginForm.idcode" auto-complete="on" placeholder="请输入验证码"></el-input>
        <div class="idcode-img-wrapper">
          <img class="idcode-img" src="/static/captcha.png">
        </div>
      </el-form-item> -->
      <el-button style="width:100%;margin-bottom:30px;" type="primary" @click.native.prevent="submitForm">提交</el-button>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {isValidUsername} from '@/utils/validate'
import {mapActions} from 'vuex'
export default {
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isValidUsername(value)) {
        callback(new Error('您输入的用户名不正确'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('用户密码至少得6位字母或数字'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        idcode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password'
    }
  },
  methods: {
    submitForm () {
      // console.log('submit form')
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.LoginByUsername(this.loginForm).then(res => {
            this.loading = false
            this.$router.push({ path: '/dashboard' })
            console.log(res)
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    ...mapActions({
      LoginByUsername: 'LoginByUsername',
      generateRoutes: 'permission/generateRoutes',
      setModuleList: 'permission/setModuleList'
    })
  }
}
</script>
<style  lang="stylus">
@import '~@/styles/mixins.styl'

.login-container
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #2d3a4b
  display flex
  flex-flow column nowrap
  align-items center
  justify-content center

  .login-form
    width 40%
    padding 50px
    padding-bottom 100px

    .title-container
      padding 40px

      .title
        color #ffffff
        font-size 30px
        text-align center
        font-weight bold

    .el-form-item
      margin-bottom 40px
      border 1px solid rgba(255, 255, 255, 0.1)
      background rgba(0, 0, 0, 0.1)
      border-radius 5px
      color #454545

      .svg-container
        display inline-block
        // padding 6px 5px 6px 15px
        width 12%
        font-size 18px
        color #889aa4
        text-align center

        &_login
          font-size 25px

        .svg-icon
          vertical-align -0.15em
          margin-right 0

      .el-input
        width 85%
        height 47px

        input
          background transparent
          border 0px
          -webkit-appearance none
          border-radius 0px
          padding 12px 5px 12px 15px
          color #eeeeee
          height 47px

          &:-webkit-autofill
            -webkit-box-shadow 0 0 0px 1000px #293443 inset !important
            -webkit-text-fill-color #fff !important

      .el-input__suffix
        display none

      .el-form-item__error
        margin-left 20px
        margin-top 12px

      .show-pwd
        position absolute
        right 10px
        top 7px
        font-size 16px
        color #889aa4
        cursor pointer
        user-select none

      &.idcode
        .idcode-img-wrapper
          position absolute
          top 0
          right 0
          height 100%
          background-color #fff
          flex-col(center)

          .idcode-img
            // width 100%
            // height 100%
</style>
