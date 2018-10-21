<template>
  <div class="add-brand">
    <el-button class="back" size="medium" type="text" icon="el-icon-arrow-left" @click.native="back">返回上一级</el-button>
    <el-form :model="brandForm" label-width="100px">
      <el-form-item label="品牌名称" prop="name">
        <el-input v-model="brandForm.brand_name"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母" prop="initial">
        <el-input v-model="brandForm.brand_initial"></el-input>
      </el-form-item>
      <el-form-item label="是否推荐" prop="brand_recommend">
        <el-radio-group v-model="brandForm.brand_recommend">
          <el-radio-button :label="true">是</el-radio-button>
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌图片">
        <el-upload :action="imgUploadUrl" :headers="headers" name="image" :data="data" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccessPic" :limit="1" list-type="picture">
          <el-button size="small">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传1张jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="品牌推荐图">
        <el-upload :action="imgUploadUrl" :headers="headers" name="image" :data="data" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccessAds" :limit="1" list-type="picture">
          <el-button size="small">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传1张的jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click.native="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import {addGoodsBrand} from '@/api/goods'
import {baseUrl, uploadUrl} from '@/config'
export default {
  data () {
    return {
      brandForm: {
        brand_name: '',
        brand_initial: '',
        brand_recommend: false,
        brand_pic: '',
        brand_ads: ''
      }
      // uploadUrl: 'http://shop.qzshmy.cn/public/index.php/admin/uploads/PhotoUpload'
    }
  },
  computed: {
    headers () {
      return {
        'X-token': this.token
      }
    },
    imgUploadUrl () {
      return baseUrl + uploadUrl
    },
    data () {
      return {
        'path_type': 'goods_brand'
      }
    },
    ...mapState(['token'])
  },
  methods: {
    back () {
      this.$router.back()
      console.log('back')
    },
    resetForm () {
      this.brandForm = {
        brand_name: '',
        brand_initial: '',
        brand_recommend: false,
        brand_pic: '',
        brand_ads: ''
      }
    },
    onSubmit () {
      console.log(this.brandForm)
      // let pic = this.brandForm.pic[0]
      // let ads = this.brandForm.ads[0]
      addGoodsBrand(this.brandForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.resetForm()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview (file) {
      // console.log(file)
    },
    handleSuccessPic (response, file, fileList) {
      // console.log(response, file, fileList)
      console.log(file)
      this.brandForm.brand_pic = file.response.data.data.path
    },
    handleSuccessAds (response, file, fileList) {
      // console.log(response, file, fileList)
      console.log(file)
      this.brandForm.brand_ads = file.response.data.data.path
    }
  }
}
</script>

<style scoped lang="stylus">
.add-brand
  overflow scroll

  .back
    position absolute
    top 20px
    left 60px

  .el-form
    width 70%
    margin 0 auto
    margin-top 80px
</style>
