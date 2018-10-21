<template>
  <div class="member-add">
    <!-- <el-button class="back" size="medium" type="text" icon="el-icon-arrow-left" @click.native="back">返回上一级</el-button> -->

    <el-form class="new-memeber-form" :model="form" label-width="80px">
      <el-form-item label="会员名" required>
        <el-input v-model="form.username" style="max-width:194px"></el-input>
      </el-form-item>
      <el-form-item label="密码" required>
        <el-input v-model="form.password" style="max-width:194px" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" required>
        <el-input v-model="form.password1" style="max-width:194px" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="手机号" required>
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
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
          <el-option label="保密" value="3"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="会员等级">
        <el-select v-model="form.level" placeholder="请选择等级">
          <el-option label="青铜" value="1"></el-option>
          <el-option label="白银" value="2"></el-option>
          <el-option label="黄金" value="3"></el-option>
          <el-option label="钻石" value="3"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="账户类型">
        <el-select v-model="form.user_type" placeholder="请选择账户类型">
          <el-option label="普通用户" value="1"></el-option>
          <el-option label="推广员" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户状态">
        <el-select v-model="form.status" placeholder="请选择账户类型">
          <el-option label="冻结" value="1"></el-option>
          <el-option label="正常" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户头像">
        <el-upload :action="uploadUrl" :headers="headers" :data="data" :on-success="handleSuccess" :limit="1" :file-list="form.pic" list-type="picture">
          <el-button size="small">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传1张jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import {addMember} from '@/api/member'
export default {
  data () {
    return {
      form: {
        username: '',
        mobile: '',
        password: '',
        password1: '',
        sex: '',
        // level: '',
        status: '',
        user_type: ''
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
      console.log(this.form)
      // this.$message({
      //   message: '添加会员成功',
      //   type: 'success'
      // })
      addMember(this.form)
        .then(res => {
          console.log(res)

          if (res.data.status) {
            this.$message({
              message: '添加会员成功',
              type: 'success'
            })
            this.resetForm()
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        })
        .catch(err => {
          // 只有网络错误才会到达这个通道，用户名错误什么的都不会进入这个通道
          console.log(err)
        })
    },
    back () {
      this.$router.back()
      console.log('back')
    },
    resetForm () {
      let obj = {}
      // this.form.forEach(item => {
      //   obj.item = ''
      // })
      // this.form = obj
      for (let key in this.form) {
        obj[key] = ''
      }
      this.form = obj
    }
  }
}
</script>

<style scoped lang="stylus">
.member-add
  .back
    position absolute
    top 20px
    left 60px

  .el-form
    min-width 300px
    width 50%
    margin 0 auto
    margin-top 80px
</style>
