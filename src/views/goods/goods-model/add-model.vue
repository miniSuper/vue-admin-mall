<template>
  <div class="add-model">
    <el-button class="back" size="medium" type="text" icon="el-icon-arrow-left" @click.native="back">返回上一级</el-button>
    <el-form :model="form" label-width="100px">
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="form.spec_name"></el-input>
      </el-form-item>
      <el-form-item label="排序顺序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" :max="100" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio-group v-model="form.is_visible">
          <el-radio-button :label="true">是</el-radio-button>
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否筛选">
        <el-radio-group v-model="form.is_screen">
          <el-radio-button :label="true">是</el-radio-button>
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="展示方式">
        <el-radio-group v-model="form.show_type" size="medium">
          <el-radio border :label="1">文字</el-radio>
          <el-radio border :label="2">颜色</el-radio>
          <el-radio border :label="3">图片</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规格值" prop="desc">
        <el-input type="textarea" rows="10" cols="10" v-model="form.spec_value_str"></el-input>
        <p class="tips">一行为一个规格项，多个规格项用换行输入</p>
      </el-form-item>
      <el-form-item label="规格说明" prop="desc">
        <el-input type="textarea" rows="10" cols="10" v-model="form.spec_des"></el-input>
        <p class="tips">输入规格说明</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click.native="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {addGoodsModel} from '@/api/goods'
import {transSpaceToComma} from '@/utils'
export default {
  data () {
    return {
      form: {
        spec_name: '',
        sort: '',
        is_visible: '',
        is_screen: '',
        show_type: 1,
        spec_value_str: '',
        spec_des: ''
      }
    }
  },
  methods: {
    back () {
      this.$router.back()
      console.log('back')
    },
    onSubmit () {
      let formObj = {}
      let me = this
      Object.keys(this.form).forEach(function (key) {
        formObj[key] = me.form[key]
        console.log(key)
      })
      formObj.spec_value_str = transSpaceToComma(this.form.spec_value_str)
      console.log(formObj)
      addGoodsModel(formObj)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              message: '添加规格成功',
              type: 'success'
            })
            this.form = {
              spec_name: '',
              sort: '',
              is_visible: '',
              is_screen: '',
              show_type: 1,
              spec_value_str: '',
              spec_des: ''
            }
          } else {
            this.$message({
              message: '添加规格失败,原因:' + res.data.msg,
              type: 'warning'
            })
          }
        })
        .catch(err => console.log(err))
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleSuccess (response, file, fileList) {
      // console.log(response, file, fileList)
      console.log(file)
    }
  }
}
</script>

<style scoped lang="stylus">
.add-model
  overflow scroll

  .back
    position absolute
    top 20px
    left 60px

  .el-form
    width 70%
    margin 0 auto
    margin-top 80px

  .tips
    color #999999
    font-size 14px
</style>
