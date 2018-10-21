<template>
  <div class="goods-commit">
    <el-tabs v-model="currentTab" @tab-click="handleTabClick" :class="{'sidebarCollapsed': sidebar.collapse}">
      <el-tab-pane label="基础设置" name="basic"></el-tab-pane>
      <el-tab-pane label="商品类型" name="goodsType"></el-tab-pane>
      <el-tab-pane label="商品规格" name="goodsModel"></el-tab-pane>
      <el-tab-pane label="媒体设置" name="media"></el-tab-pane>
      <el-tab-pane label="商品详情" name="detail"></el-tab-pane>
    </el-tabs>
    <component ref="child" :is="currentTab" :data="goodsForm" :goodsId="goods_id" @saveSettings="saveSettings" @firstCommit="setUpdateFlag"></component>
    <div class="footer" :class="{'sidebarCollapsed': sidebar.collapse}">
      <div class="buttons">
        <el-button type="primary" size="mini" v-if="currentStep !== 0" @click="prevStep">上一步</el-button>
        <el-button type="primary" size="mini" v-if="currentStep !== 5" @click="nextStep">下一步</el-button>
        <el-button type="success" size="mini" v-if="currentStep === 5" @click="publishGoodsDetails">发布</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {addGoods, commitGoodsType, commitGoodsModel, commitGoodsMedia, commitGoodsDetails} from '@/api/goods'
import {mapState, mapActions} from 'vuex'
import {Basic, GoodsType, GoodsModel, Media, Detail} from './base'
import {MessageBox} from 'element-ui'
export default {
  data () {
    return {
      goodsForm: {
        goods_name: '冬季衬衫2018'
      },
      goods_id: 0,
      currentTab: 'basic',
      currentStep: 1,
      flag: false // false表示是发布商品
    }
  },
  computed: {
    ...mapState({
      'sidebar': state => state.app.sidebar,
      'publishStep': state => state.app.publishStep,
      'unfinishFlag': state => state.app.unfinishFlag,
      'unfinishId': state => state.app.unfinishId
    })
  },
  watch: {
    goods_id (newId, oldId) {
      if (newId !== 0) {
        this.flag = true
      } else {
        this.flag = false
      }
    }
  },
  methods: {
    saveSettings (data) {
      console.log('总部已经收到', data)
      this.goodsForm = data
    },
    setUpdateFlag (isFirstCommit) {
      if (isFirstCommit) {
        this.flag = false
      } else {
        this.flag = true
      }
      // this.$set(this.goodsForm, 'flag', this.flag)
      console.log('以更新方式提交？', this.flag)
    },
    handleTabClick (tab, event) {
      // console.log(tab, event)
      // 通过判断 goods_id 得知 是否提交了 基础设置
      if (this.goods_id === 0) {
        this.$message({
          type: 'warning',
          message: '请先填写基础信息!'
        })
        setTimeout(() => {
          this.currentTab = 'basic'
        }, 300)
      } else {
        switch (tab.paneName) {
          case 'basic':
            this.currentStep = 0
            break
          case 'goodsType':
            this.currentStep = 1
            break
          case 'goodsModel':
            this.currentStep = 2
            break
          case 'media':
            this.currentStep = 3
            break
          case 'detail':
            this.currentStep = 4
            break
          default:
            break
        }
      }
    },
    publishGoodsBasic () {
      if (this.flag) {
        this.$set(this.goodsForm, 'goods_id', this.goods_id)
      } else {
        this.$delete(this.goodsForm, 'goods_id')
      }
      let data = {
        flag: this.flag,
        product: JSON.stringify(this.goodsForm)
      }
      addGoods(data)
        .then(res => {
          // console.log('添加商品', res)
          if (!this.flag && this.goods_id === 0) {
            this.goods_id = res.data.data.goods_id
            console.log('获取返回的商品ID', res.data.data.goods_id)
          }
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '基本信息提交成功!'
            })
            this.setUnfinishFlag(true)
            this.setUnfinishId(this.goods_id)
            this.goNext()
          } else {
            console.log(res)
          }
        })
        .catch(err => console.log(err))
    },
    publishGoodsType () {
      if (!this.goodsForm.goods_attribute) {
        this.goodsForm.goods_attribute = JSON.stringify(new Array(0))
      }
      let arr = JSON.parse(this.goodsForm.goods_attribute)
      if (arr.length === 0) {
        this.$message({
          type: 'error',
          message: '商品类型信息必须填写!'
        })
        return
      }
      console.log(arr)
      let data = {
        flag: this.flag,
        goods_attribute: this.goodsForm.goods_attribute
      }
      commitGoodsType(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '商品类型提交成功!'
            })
            this.goNext()
          }
        })
        .catch(err => console.log(err))
    },
    publishGoodsModel () {
      let data = {
        flag: this.flag,
        goods_sku: this.goodsForm.goods_sku,
        goods_spec: this.goodsForm.goods_spec,
        sku_media: this.goodsForm.sku_media
      }
      commitGoodsModel(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '商品规格提交成功!'
            })
            this.goNext()
          }
        })
        .catch(err => console.log(err))
    },
    publishGoodsMedia () {
      commitGoodsMedia(this.goodsForm)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '商品媒体提交成功!'
            })
            this.goNext()
          }
        })
        .catch(err => console.log(err))
    },
    publishGoodsDetails () {
      commitGoodsDetails(this.goodsForm)
        .then(res => {
          // console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '商品详情提交成功!'
            })
            this.setUnfinishFlag(false)
            this.setUnfinishId(0)
          } else {
            this.$message({
              type: 'success',
              message: '商品详情提交失败!'
            })
          }
        })
        .catch(err => console.log(err))
    },
    toggleTab (step) {
      console.log('toggle', this.publishStep)
      switch (step) {
        case 1:
          this.currentTab = 'basic'
          break
        case 2:
          this.currentTab = 'goodsType'
          break
        case 3:
          this.currentTab = 'goodsModel'
          break
        case 4:
          this.currentTab = 'media'
          break
        case 5:
          this.currentTab = 'detail'
          break
        default:
          break
      }
    },
    prevStep () {
      if (this.currentStep === 1 || this.currentStep < 1) {
        this.currentStep = 1
        return
      }
      this.currentStep = --this.currentStep
      this.toggleTab(this.currentStep)
    },
    nextStep () {
      // 点击下一步前  当前商品提交是属于哪一个步骤
      console.log('currentStep is' + this.currentStep)
      if (this.currentStep === 1) {
        this.publishGoodsBasic()
      } else if (this.currentStep === 2) {
        this.publishGoodsType()
      } else if (this.currentStep === 3) {
        this.publishGoodsModel()
      } else if (this.currentStep === 4) {
        this.publishGoodsMedia()
      } else if (this.currentStep === 5) {
        this.publishGoodsDetails()
      }
    },
    goNext () {
      this.currentStep = ++this.currentStep
      if (this.currentStep === 6) {
        this.currentStep = 5
      }
      this.toggleTab(this.currentStep)
    },
    ...mapActions({
      setUnfinishFlag: 'app/setUnfinishFlag',
      setUnfinishId: 'app/setUnfinishId'
    })
  },
  components: {
    Basic, GoodsType, GoodsModel, Media, Detail
  },
  created () {
    console.log('编辑商品的id', this.$route.query.id)
    if (this.$route.query.id) {
      this.goods_id = this.$route.query.id
      return
    }
    // this.toggleTab(this.publishStep)
    console.log('unfinishFlag', this.unfinishFlag)
    if (this.unfinishFlag) {
      MessageBox.confirm('之前有商品发布过程中途退出，是否继续发布该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '进入成功!'
        })
        if (this.unfinishId !== 0) {
          this.goods_id = this.unfinishId
          console.log('现在的商品ID是' + this.goods_id)
          this.toggleTab(this.publishStep)
          console.log('上次是卡在了哪一个步骤' + this.publishStep)
          // this.$refs.child.refresh()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消进入'
        })
        this.setUnfinishFlag(false)
        this.setUnfinishId(0)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.goods-commit
  width 100%
  height 100%

  .back
    position absolute
    top 20px
    left 20px

  >>>.el-tabs
    position fixed
    top 50px
    left 0
    width 100%
    background-color #fff
    z-index 990

    &.sidebarCollapsed
      .el-tabs__header
        margin-left 84px

    .el-tabs__header
      padding-top 10px
      margin-bottom 0
      margin-left 220px

    .el-tabs__content
      display none

  >>>.el-form
    .title-container
      position relative
      margin 20px 0 20px 10px
      font-size 16px
      color #3f9dff

      &:before
        content ''
        display inline-block
        width 3px
        height 20px
        background-color #3f9dff
        position absolute
        left -10px
        top 0

    .el-form-item
      margin-left 30px

  .footer
    position fixed
    left 0
    bottom 0
    width 100%
    height 60px
    background-color #fff
    z-index 950

    .buttons
      margin-left 220px

    &.sidebarCollapsed
      .buttons
        margin-left 84px

    .el-button
      margin 16px
</style>
