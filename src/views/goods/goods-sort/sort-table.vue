<template>
  <el-table :data="cateData" class="sort-table">
    <el-table-column label="" width="100">
      <template slot-scope="scope">
        <svg-icon icon-class="triangle" :class="getLevel(scope.row.level)" :style="levelColor(scope.row.level)" @click.native="showChildren(scope.$index, scope.row)"></svg-icon>
      </template>
    </el-table-column>
    <el-table-column prop="category_name" label="分类名称" width="200">
      <template slot-scope="scope">
        <div :class="getLevel(scope.row.level)" :style="levelColor(scope.row.level)">
          <span>{{scope.row.category_name}}</span>
          <svg-icon class="icon-plus" icon-class="plus-circle" @click.native="addCategory(scope.$index, scope.row)"></svg-icon>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="category_name" label="简称">
      <template slot-scope="scope">
        <span :style="levelColor(scope.row.level)"> {{scope.row.category_name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="attr_name" label="关联类型">
      <template slot-scope="scope">
        <span :style="levelColor(scope.row.level)"> {{scope.row.attr_name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="is_visible" label="是否显示" width="80" align="center">
      <template slot-scope="scope">
        <span :style="levelColor(scope.row.level)">
          {{scope.row.is_visible === 1 ? "是":"否"}}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="sort" label="排序" width="60" align="center">
      <template slot-scope="scope">
        <!-- <el-input :value="scope.row.sort" :style="levelColor(scope.row.level)"></el-input> -->
        <span :style="levelColor(scope.row.level)"> {{scope.row.sort}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" :fit="false" width="140" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="editCategory(scope.$index, scope.row)">修改</el-button>
        <el-button size=" mini " type="text " style="color:#f56c6c " @click="deleteCategory(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script type="text/ecmascript-6">
import {MessageBox} from 'element-ui'
import {deleteGoodsCategory} from '@/api/goods'
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  // computed: {
  //   cateData () {
  //     return this.data
  //   }
  // },
  data () {
    return {
      cateData: [],
      displayBook: {}
    }
  },
  watch: {
    data () {
      this.cateData = this.data.slice()
    }
  },
  components: {

  },
  methods: {
    refresh () {
      this.$emit('refresh')
    },
    deleteCategory (index, row) {
      console.log(index, row)
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoodsCategory(row.category_id)
          .then(res => {
            // console.log(res)
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.refresh()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    editCategory (index, row) {
      // console.log('edit')
      this.$emit('editCategory', row)
    },
    addCategory (index, row) {
      // console.log(index, row)
      let pid = row.category_id
      /* eslint-disable camelcase */
      let attr_id = row.attr_id
      let attr_name = row.attr_name
      this.$emit('addCategory', {pid, attr_id, attr_name})
    },
    showChildren (index, row) {
      // 第一次点击 ？
      if (this.displayBook[row.category_id] === undefined) {
        // 判断是否有子分类，如果没有 退出
        if (!row._child || !row._child.length) {
          this.$message({
            type: 'info',
            message: '该类别下没有子分类了'
          })
          return
        }
        // 如果有，保存它的树状信息
        this.$set(this.displayBook, row.category_id, {
          showChildren: true,
          childrenLength: row._child.length
          // pid: row.pid
        })

        // 如果有，则显示子分类
        for (let i = 0; i < row._child.length; i++) {
          this.cateData.splice(index + 1 + i, 0, row._child[i])
        }
        this.displayBook[row.category_id].showChildren = true
      } else {
        // 将该类别的 子分类显示属性 设置为 跟之前相反
        this.displayBook[row.category_id].showChildren = !this.displayBook[row.category_id].showChildren
        // 如果当前  id 对应的字典 是显示子元素
        if (this.displayBook[row.category_id].showChildren) {
          for (let i = 0; i < row._child.length; i++) {
            this.cateData.splice(index + 1 + i, 0, row._child[i])
          }
        } else {
          // 如果当前的 id 对应的字典是 隐藏子元素
          for (let i = 0; i < row._child.length; i++) {
            this.cateData.splice(index + 1, 1)

            // 再问问当前 子元素 的 子元素 是否是显示的，如果是，则还要删除
            if (this.displayBook[row._child[i].category_id] && this.displayBook[row._child[i].category_id].showChildren) {
              for (let j = 0; j < this.displayBook[row._child[i].category_id].childrenLength; j++) {
                this.cateData.splice(index + 1, 1)
              }
              // 孙子元素已经被折叠，设置属性为 不显示
              this.displayBook[row._child[i].category_id].showChildren = false
            }
            this.displayBook[row.category_id].showChildren = false
          }
        }
      }
    },
    levelColor (level) {
      let color = '#777'
      switch (level) {
        case 2:
          color = '#7a9eda'
          break
        case 3:
          color = '#7ab77b'
          break
        case 4:
          color = '#e09357'
          break
        default:
          color = '#888'
          break
      }
      return {color}
    },
    getLevel (num) {
      if (num === 2) {
        return 'second-level'
      } else if (num === 3) {
        return 'third-level'
      } else if (num === 4) {
        return 'fourth-level'
      } else if (num === 5) {
        return 'fifth-level'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.sort-table
  .second-level
    margin-left 20px
    color #7a9eda

  .third-level
    margin-left 40px
    color #7ab77b

  .fourth-level
    margin-left 60px
    color #e09357

  .icon-plus
    font-size 18px
    line-height 27px
    margin 0
    padding 0 10px
    margin-top -2px
    vertical-align middle
</style>
