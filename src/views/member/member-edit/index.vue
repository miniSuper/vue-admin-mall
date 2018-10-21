<template>
  <div class="member-edit">
    <!-- <el-button class="back" size="medium" type="text" icon="el-icon-arrow-left" @click.native="back">返回上一级</el-button> -->

    <el-form class="memeber-form" :model="form" label-width="80px">
      <el-form-item>
        <div class="avatar-wrapper">
          <img class="avatar" src="/static/avatar.jpg" />
        </div>
      </el-form-item>
      <el-form-item label="会员ID">
        <el-input v-model="form.id" style="max-width:194px" disabled></el-input>
      </el-form-item>
      <el-form-item label="会员名">
        <el-input v-model="form.username" style="max-width:194px"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.mobile" style="max-width:194px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="余额">
        <el-input-number v-model="form.balance" controls-position="right" :min="1" :max="100000000" style="max-width:194px"></el-input-number>
      </el-form-item>
      <el-form-item label="积分">
        <el-input-number v-model="form.point" controls-position="right" :min="1" :max="100000000" style="max-width:194px"></el-input-number>
      </el-form-item>
      <el-form-item label="账户状态">
        <el-select v-model="form.status" placeholder="请选择等级">
          <el-option label="正常" value="0"></el-option>
          <el-option label="冻结" value="1"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="性别">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
          <el-option label="保密" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="会员等级">
        <el-select v-model="form.sex" placeholder="请选择等级">
          <el-option label="青铜" value="1"></el-option>
          <el-option label="白银" value="2"></el-option>
          <el-option label="黄金" value="3"></el-option>
          <el-option label="钻石" value="3"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="账户类型">
        <el-select v-model="form.user_type" placeholder="请选择账户类型">
          <el-option label="普通用户" :value="1"></el-option>
          <el-option label="推广员" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="修改头像">
        <el-upload :action="uploadUrl" :headers="headers" :data="data" :on-success="handleSuccess" :limit="1" :file-list="form.pic" list-type="picture">
          <el-button size="small">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传1张jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import {getMemberInfo, setMemberInfo} from '@/api/member'
export default {
  data () {
    return {
      form: {

      },
      uploadUrl: 'http://shop.qzshmy.cn/public/index.php/admin/upload/PhotoUpload'
    }
  },
  computed: {
    headers () {
      return {
        'X-token': this.token
      }
    },
    data () {
      return {
        'path_type': 'goods_brand'
      }
    },
    ...mapState(['token'])
  },
  methods: {
    handleSuccess (response, file, fileList) {
      console.log(file)
    },
    onSubmit () {
      console.log('提交')
      setMemberInfo(this.form)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              message: '会员信息修改成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '修改失败,错误原因: ' + res.data.msg,
              type: 'warning'
            })
          }
        })
        .catch(err => console.log(err))
    },
    back () {
      this.$router.back()
      console.log('back')
    },
    refresh () {
      let id = this.$route.query.memberId
      getMemberInfo(id)
        .then(res => {
          console.log(res.data.data)
          /* eslint-disable camelcase */
          let {id, username, mobile, sex, status, user_type} = res.data.data
          this.form = {id, username, mobile, sex, status, user_type}
        })
        .catch(err => console.log(err))
    }
  },
  created () {
    // console.log(this.$route.query.memberId)
    this.refresh()
  },
  activated () {
    // console.log(this.$route.query.memberId)
    this.refresh()
  }
}
</script>

<style scoped lang="stylus">
.member-edit
  .back
    position absolute
    top 20px
    left 60px

  >>>.el-form
    min-width 300px
    width 50%
    margin 0 auto
    margin-top 80px

    .avatar-wrapper
      width 40px
      height 40px
      border-radius 50%
      overflow hidden
      margin-left 50px

      .avatar
        width 100%
        height 100%

    .el-input
      &.is-disabled
        input
          color #606266
          background-color #fff
</style>
