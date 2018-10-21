<template>
  <div class="register">
    <el-form class="register-form" label-width="100px" :rules="registerRules" label-position="top" :model="registerForm">
      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>
      <el-form-item label="用户名" prop="username" required>
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" required>
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" required>
        <el-input v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-button class="submit-button" type="primary" @click.native.prevent="handleRegister">提交</el-button>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {isValidUsername, isValidateEmail} from '@/utils/validate'

export default {
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isValidUsername(value)) {
        callback(new Error('您输入的用户名格式不正确'))
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
    const validateEmail = (rule, value, callback) => {
      if (!isValidateEmail(value)) {
        callback(new Error('您输入的邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        email: ''
      },
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      }
    }
  },
  methods: {
    handleRegister () {
      console.log('register')
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/styles/mixins.styl'

.register
  width 100%
  height 100%
  color #ffffff
  background-color #2d3a4b
  display flex
  flex-flow column nowrap
  align-items center
  justify-content center

  .register-form
    width 50%
    margin-bottom 100px

    .title-container
      padding 40px

      .title
        color #ffffff
        font-size 30px
        text-align center
        font-weight bold

    >>>.el-form-item
      width 100%

      .el-form-item__label
        color #ffffff !important

      .el-form-item__content
        width 100%

        .el-form-item__error
          margin 4px 0

    .submit-button
      width 100%
      margin-top 30px
</style>
