<template>
  <div class="dropdown">
    <svg-icon icon-class="down" @click.native="toggleFormShow"></svg-icon>
    <transition name="dropdown" mode="out-in">
      <el-form v-if="formShow">
        <el-form-item label="商品编码" label-width="80px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" label-width="80px">
          <el-select v-model="form.model" placeholder="请选择商品类型">
            <el-option label="化妆品" value="化妆品"></el-option>
            <el-option label="办公用品" value="办公用品"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品标签" label-width="80px">
          <el-select v-model="form.label" placeholder="请选择商品标签">
            <el-option label="化妆品" value="化妆品"></el-option>
            <el-option label="办公用品" value="办公用品"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="buttons">
          <el-button size="mini" type="primary">完成</el-button>
          <el-button size="mini" @click="formShow =  false">取消</el-button>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    propName: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      form: {},
      formShow: false
    }
  },
  methods: {
    toggleFormShow () {
      this.formShow = !this.formShow
    }
  }
}
</script>

<style scoped lang="stylus">
.dropdown
  position relative

  .svg-icon
    font-size 16px
    padding 8px 5px
    margin 0

  >>>.el-form
    position absolute
    top 40px
    left -200px
    width 300px
    padding 20px
    height 220px
    overflow hidden
    background-color #fff
    box-shadow 0 4px 20px rgba(0, 0, 0, 0.2)

    &.dropdown-enter-active, &.dropdown-leave-active
      transition all 0.2s ease

    &.dropdown-enter, &.dropdown-leave-active
      height 0

    .buttons
      text-align center
</style>
