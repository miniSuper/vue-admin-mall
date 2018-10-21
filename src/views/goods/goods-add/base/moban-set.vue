<template>
  <div class="moban-set">
    <el-form :model="form" label-width="80px">
      <div class="title-container">
        <h3>模版设置</h3>
      </div>
      <el-form-item label="电脑端:">
        template/shop/blue/Goods/
        <el-input></el-input>
        .html
        <div class="item-tips">用户自定义模板必须存放在template/shop/blue/Goods/下，模板名只能由英文组成</div>
      </el-form-item>
      <el-form-item label="手机端:">
        template/wap/default_new/Goods/
        <el-input></el-input>
        .html
        <div class="item-tips">用户自定义模板必须存放在template/wap/default_new/Goods/下，模板名只能由英文组成</div>
      </el-form-item>
    </el-form>
    <div class="buttons">
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      form: {}
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
.moban-set
  margin 40px 0 140px 0

  .buttons
    margin-top 20px
    margin-left 54px

  >>>.el-form
    .item-tips
      font-size 12px
      color #999
      font-weight 200

    .el-input
      display inline-block
      width 120px

      input
        width 100%
</style>
