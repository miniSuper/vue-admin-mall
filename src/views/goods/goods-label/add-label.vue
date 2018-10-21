<template>
  <div class="add-label">
    <el-button class="back" size="medium" type="text" icon="el-icon-arrow-left" @click.native="back">返回上一级</el-button>
    <el-form :model="form" label-width="100px">
      <el-form-item label="标签名称" prop="label_name">
        <el-input v-model="form.label_name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="label_sort">
        <el-input-number v-model="form.label_sort" style="max-width:140px" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="标签图片">
        <el-upload :action="uploadUrl" :headers="headers" :data="data" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :limit="1" :file-list="form.pic" list-type="picture">
          <el-button size="small">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传1张jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="标签描述" prop="label_desc">
        <el-input type="textarea" rows="10" cols="10" v-model="form.label_desc"></el-input>
        <p class="tips">一行为一个规格项，多个规格项用换行输入</p>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
        <el-button @click.native="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import {addGoodsLabel} from '@/api/goods'
export default {
  data () {
    return {
      form: {
        label_name: '',
        label_sort: 0,
        label_img: '',
        // label_display: '',
        label_desc: ''
      },
      uploadUrl: 'http://shop.qzshmy.cn/public/index.php/admin/uploads/PhotoUpload'
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
    back () {
      this.$router.back()
      // console.log('back')
    },
    onSubmit () {
      console.log(this.form)
      addGoodsLabel(this.form)
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
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleSuccess (response, file, fileList) {
      // console.log(response, file, fileList)
      console.log(file)
    },
    resetForm () {
      this.form = {
        label_name: '',
        label_sort: 0,
        label_img: '',
        label_desc: ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.add-label
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
