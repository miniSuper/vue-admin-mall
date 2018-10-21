<template>
  <div class="media-set">
    <el-form :model="form" label-width="80px">
      <div class="title-container">
        <h3>首图</h3>
      </div>
      <!-- <el-form-item>
        <el-upload :action="imgUrl" :headers="headers" name="image" :data="data" :limit="1" :on-success="handleAvatarSuccess" :file-list="fileList1" list-type="picture-card">
          <el-button size="small" type="primary">上传首图</el-button>
          <div slot="tip" class="el-upload__tip">只能上传一张图片，格式为jpg/png文件，且不超过800kb，尺寸建议: 800 x 800</div>
        </el-upload>
      </el-form-item> -->
      <el-form-item>
        <el-upload class="avatar-uploader" :class="{'online-avatar': hasOnlineAvatar}" :action="imgUrl" :headers="headers" name="image" :data="data" :show-file-list="false" :on-success="handleAvatarSuccess">
          <img v-if="goods_pic.picture" :src="getFullUrl(goods_pic.picture)" class="avatar avatar-online">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <i v-if="goods_pic.picture" class="el-icon-delete delete-btn" @click.stop="deleteAvatar"></i>
          <i v-if="goods_pic.picture" class="el-icon-edit-outline edit-btn"></i>
          <div v-if="goods_pic.picture" class="mask"></div>
        </el-upload>
      </el-form-item>
      <div class="title-container">
        <h3>商品图片</h3>
      </div>
      <el-form-item>
        <el-upload class="detail-uploader" :action="imgUrl" :headers="headers" name="image" :data="data" :on-success="handleSuccess" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传一张或多张，格式为jpg/png文件，且不超过800kb，尺寸建议: 800 x 800</div>
        </el-upload>
        <div class="detail-wrapper" v-for="item in onlineImgList" :key="item.index">
          <img class="detail-pic" :src="getFullUrl(item.pic_cover)" alt="">
          <p class="detail-text">已上传到服务器</p>
          <i class="el-icon-close detail-close" @click="deleteDetailImg(item)"></i>
        </div>
      </el-form-item>
      <!-- <div class="title-container">
        <h3>展示视频</h3>
      </div>
      <el-form-item>
        <el-upload class="upload-demo" :action="imgUrl" :headers="headers" name="image" :data="data" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture-card">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">

            <P>
              1、检查upload文件夹是否有读写权限。
            </P>
            <p>
              2、PHP默认上传限制为2MB，需要在php.ini配置文件中修改“post_max_size”和“upload_max_filesize”的大小。
            </p>
            <p>
              3、视频支持手动输入外链视频地址或者上传本地视频文件
            </p>
            <P>
              4、必须上传.mp4视频格式
            </P>
            <P>
              5、视频文件大小不能超过500MB
            </P>
          </div>
        </el-upload>
        <el-form-item class="buttons">
          <el-button type="primary" size="medium">保存</el-button>
          <el-button size="medium">取消</el-button>
        </el-form-item>
      </el-form-item> -->
    </el-form>
    <div class="foot-buttons">
      <el-button type="primary" @click="saveSettings">保存</el-button>
      <el-button>清空</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapState} from 'vuex'
import {baseUrl, uploadUrl} from '@/config'
import {getGoodsMediaInfo, deleteGoodsDetailImgs, deleteGoodsAvatar} from '@/api/goods'
// import {deepClone} from '@/utils'
export default {
  props: {
    goodsId: 0
  },
  data () {
    return {
      form: {},
      imgList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileList1: [],
      // 商品主图  -by 后端
      goods_pic: {
        picture: ''
      },
      // 商品展示图  -by 后端
      goods_media: [],
      uploadSuccessList: [],
      hasOnlineAvatar: false // 首图是否是线上的
    }
  },
  filters: {
    online (arr) {
      let newArr
      arr.forEach(item => {
        if (item.online) {
          newArr.push(item)
        }
      })
      return newArr
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
    imgUrl () {
      return baseUrl + uploadUrl
    },
    onlineImgList () {
      let newArr = []
      this.goods_media.forEach(item => {
        if (item.pic_id) {
          newArr.push(item)
        }
      })
      return newArr
    },
    ...mapState(['token'])
  },
  watch: {
    'form.goods_media' () {
      this.autoSave()
    }
  },
  methods: {
    autoSave () {
      this.goods_media = this.goods_media.concat(this.uploadSuccessList)
      this.$set(this.goods_pic, 'goods_id', this.goodsId)
      console.log('this.goods_media', this.goods_media)
      let data = {goods_pic: JSON.stringify(this.goods_pic), goods_media: JSON.stringify(this.goods_media)}
      this.$emit('saveSettings', data)
    },
    saveSettings () {
      this.autoSave()
      this.$message({
        type: 'success',
        message: '信息已保存'
      })
    },
    deleteAvatar () {
      console.log('删除头像')
      if (!this.hasOnlineAvatar) {
        this.goods_pic.picture = ''
        return
      }
      let data = {goods_id: parseInt(this.goodsId)}
      deleteGoodsAvatar(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.goods_pic.picture = ''
            this.pullGoodsMedia()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
        .catch(err => console.log(err))
    },
    deleteDetailImg (item) {
      let data = {goods_id: parseInt(item.goods_id), pic_id: item.pic_id}
      console.log('删除序列图', data)

      deleteGoodsDetailImgs(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.pullGoodsMedia()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
        .catch(err => console.log(err))
    },
    getFullUrl (url) {
      return baseUrl + '/public' + url
    },
    handleChange () {
      console.log('更改库存')
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handleAvatarSuccess (response, file, fileList) {
      this.$set(this.goods_pic, 'picture', file.response.data.data.path)
      console.log(file)
      this.$set(this.goods_pic, 'goods_id', this.goodsId)
    },
    handleSuccess (response, file, fileList) {
      let imgArray = []
      fileList.forEach(item => {
        imgArray.push({'pic_cover': item.response.data.data.path, 'goods_id': this.goodsId})
      })
      this.uploadSuccessList = imgArray
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleTabClick () {
      console.log('tabClick')
    },
    addPathToMedia (list) {
      let arr = []
      list.forEach(item => {
        arr.push({'pic_cover': item.pic_cover, 'goods_id': this.goodsId, 'pic_id': item.pic_id})
      })
      this.goods_media = arr
    },
    pullGoodsMedia () {
      if (this.goodsId === 0) {
        return
      }
      getGoodsMediaInfo(this.goodsId)
        .then(res => {
          console.log(res)
          if (res.data.data.GoodsImg.pic.length || res.data.data.GoodsImg.picture) {
            this.$emit('firstCommit', false)
          }
          this.$set(this.goods_pic, 'picture', res.data.data.GoodsImg.picture)
          this.$set(this.goods_pic, 'goods_id', this.goodsId)
          if (res.data.data.GoodsImg.picture === '') {
            this.hasOnlineAvatar = false
          } else {
            this.hasOnlineAvatar = true
          }

          if (res.data.data.GoodsImg.pic.length) {
            this.addPathToMedia(res.data.data.GoodsImg.pic)
          } else {
            this.addPathToMedia([]) // 确保页面刷新
          }
        })
        .catch(err => console.log(err))
    }
  },
  mounted () {
    this.pullGoodsMedia()
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
.media-set
  width 100%
  height 100%
  margin 40px 0 140px 0

  .foot-buttons
    margin-left 80px
    margin-top 40px

  >>>.el-form
    .avatar-uploader
      .el-upload
        position relative
        border 1px dashed #d9d9d9
        border-radius 6px
        cursor pointer
        overflow hidden

        &:hover
          border-color #409EFF

          .delete-btn, .edit-btn
            display block

          .mask
            display block

        .delete-btn, .edit-btn
          display none
          position absolute
          z-index 900
          top 50%
          left 50%
          font-size 30px
          margin-top -15px
          margin-left 15px
          color #ffffff

        .edit-btn
          margin-left -45px

        .mask
          display none
          position absolute
          z-index 800
          top 0
          left 0
          right 0
          bottom 0
          background-color rgba(0, 0, 0, 0.5)

      &.online-avatar
        .el-upload
          &::before
            position absolute
            content ''
            display block
            width 30px
            height 30px
            right 0
            top 0
            background-image url('/static/online.png')
            background-size cover
            z-index 2000

      .avatar-uploader-icon
        font-size 28px
        color #8c939d
        width 178px
        height 178px
        line-height 178px
        text-align center

      .avatar
        width 178px
        height 178px
        display block

    .detail-uploader
      .el-upload-list
        max-width 450px

    .detail-wrapper
      position relative
      overflow hidden
      z-index 0
      background-color #fff
      border 1px solid #c0ccda
      border-radius 6px
      -webkit-box-sizing border-box
      box-sizing border-box
      margin-top 10px
      padding 10px 10px 10px 90px
      height 92px
      max-width 450px

      &::before
        position absolute
        content ''
        display block
        width 30px
        height 30px
        right 0
        top 0
        background-image url('/static/online.png')
        background-size cover
        z-index 2000

      &:hover
        &::before
          display none

      .detail-pic
        vertical-align middle
        display inline-block
        width 70px
        height 70px
        float left
        position relative
        z-index 1
        margin-left -80px

      .detail-text
        height 100%
        float left
        line-height 72px
        color #888888

      .detail-close
        position absolute
        top 0
        right 0
        color #888
        padding 4px

        &:hover
          color #f56c6c
          font-weight bold

    .buttons
      margin-top 20px
</style>
