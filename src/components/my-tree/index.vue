<template>
  <div class="my-tree">
    <div class="tree-row" v-for="row in data" :key="row.category_id">
      <svg-icon icon-class="triangle" :class="{'disabled': !(row._child&&row._child.length)}" @click.native="toggleChildren(row.category_id)"></svg-icon>

      <span class="tree-item">{{row.category_name}}</span>

      <el-button class="add-btn el-icon-circle-plus-outline tree-plus" @click="addChild(row.category_id)"></el-button>
      <span class="tree-item">{{row.short_name}}</span>
      <span class="tree-item">{{row.sort}}</span>
      <span class="tree-item">{{row.is_visible}}</span>

      <el-button class="edit-btn" type="text" size="mini" plain @click.native="editDom(row.category_id)">修改</el-button>
      <el-button class="delete-btn" type="text" size="mini" plain @click.native="deleteDom(row.category_id)">删除</el-button>
      <transition name="drop" mode="out-in">
        <my-tree class="tree-row-children" v-if="row._child&&row._child.length" v-show="domDisplay(row.category_id)" :data="row._child" :parentId="row.category_id" @getChildDom="getChildDom"></my-tree>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import {deepClone} from '@/utils'
import {MessageBox} from 'element-ui'

export default {
  name: 'MyTree',
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    hasParent: {
      type: Boolean,
      default: true
    },
    parentId: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      checked: false,
      treeDom: {}
    }
  },
  // computed: {
  //   domDisplay (id) {
  //     return this.treeDom[id].showChildren
  //   }
  // },
  methods: {
    initData () {
      this.data.forEach(element => {
        const id = element.category_id
        let attr = {
          showChildren: false,
          selected: false
        }
        this.$set(this.treeDom, id, attr)
      })
      if (this.hasParent && this.parentId !== -1) {
        this.$emit('getChildDom', this.parentId, this.treeDom)
      }
    },
    toggleChildren (id) {
      // let newTreeDom = deepClone(this.treeDom)
      // newTreeDom[id].showChildren = !newTreeDom[id].showChildren
      // this.treeDom = newTreeDom
      let attr = this.treeDom[id]
      attr.showChildren = !attr.showChildren
      this.$set(this.treeDom, id, attr)
      console.log(this.treeDom)
    },
    domDisplay (id) {
      // return this.treeDom[id].showChildren
      return true
    },
    domSelected (id) {
      // return this.treeDom[id].selected
      return this.checked
    },
    selectItem () {
      console.log('hello world')
    },
    getChildDom (id, dom) {
      let attr = this.treeDom[id] || {}
      this.$set(attr, 'children', dom)
      this.$set(this.treeDom, id, attr)
    },
    addChild (id) {
      // MessageBox.prompt('请输入子分类的名字', '添加子分类', {
      //   confirmButtonText: '增加',
      //   cancelButtonText: '取消'
      // }).then(res => {
      //   console.log(res.value)
      //   this.toggleChildren(id)
      // }).catch(res => {
      //   console.log(res)
      // })
      this.$emit('addCategory', id)
    },
    deleteDom (id) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        this.request({
          url: '/admin/goods/deleteGoodsCategory',
          method: 'post',
          data: {id}
        }).then(res => {
          console.log(res)
        })
      }).catch(res => {
        console.log(res)
      })
    },
    editDom (id) {
      MessageBox.prompt('请输入您想要修改的类名', '修改提示', {
        confirmButtonText: '修改',
        cancelButtonText: '取消'
      }).then(res => {
        console.log(res.value)
      }).catch(res => {
        console.log(res)
      })
    }
  },
  created () {
    this.initData()
  }
}
</script>

<style scoped lang="stylus">
.my-tree
  .tree-row
    margin 20px 0
    position relative

    .svg-icon
      color #c1c4cc
      font-size 14px
      vertical-align -2px
      cursor pointer

      &.disabled
        color #efefef

      &.active
        transition all 0.2s cubic-bezier(0.5, 0.01, 0.18, 1)
        transform rotate(90deg)
        color #777

    .tree-item
      display inline-block
      min-width 112px
      max-width 130px
      color #777

    .tree-plus
      margin 0 10px

    >>>.el-checkbox
      padding 3px 0

      .el-checkbox__inner
        width 14px
        height 14px

      .el-checkbox__label
        font-size 16px
        font-weight 400

    .edit-btn, .delete-btn, .add-btn
      color #888
      border 0 none
      font-size 14px
      margin-left 20px
      font-weight 400

      &:hover
        color #f66c6b

    .edit-btn
      margin-left 40px

      &:hover
        color #66c23a

    .add-btn
      font-size 18px
      margin-left 0px
      padding 10px

      &:hover
        background-color transparent

      &:focus
        background-color transparent

      &:visited
        background-color transparent

    .tree-row-children
      margin-left 50px

      &.drop-enter-active, &.drop-leave-active
        transition all 0.2s cubic-bezier(0.5, 0.01, 0.18, 1)

      &.drop-enter, &.drop-leave-to
        opacity 0
</style>
