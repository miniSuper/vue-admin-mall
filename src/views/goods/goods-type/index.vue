<template>
  <div class="goods-type">
    <div class="buttons">
      <el-button type="danger" icon="el-icon-delete" @click="deleteSomeTypes">批量删除</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click.native="addType">添加类型</el-button>
    </div>
    <el-table :data="typeList" @selection-change="selectType">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="attr_name" label="类型名称" fixed>
      </el-table-column>
      <el-table-column prop="value_str" label="属性标签">
      </el-table-column>
      <el-table-column prop="is_use" label="是否可视" :fit="false" width="80">
        <template slot-scope="scope">
          <span class="radio" :class="{'disabled': scope.row.is_visible === 0}" @click="toggleUse(scope.row)">
            <svg-icon v-if="scope.row.is_visible" icon-class="check"></svg-icon>
            <svg-icon v-else icon-class="forbid "></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" sortable>
        <template slot-scope="scope">
          <el-input controls-position="right" v-model="scope.row.sort"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="deleteOneType(scope.$index, scope.row)" style="color:#f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
    <el-dialog title="类型修改" :visible.sync="typeFormShow" :append-to-body="true" :center="true">
      <el-form :model="typeForm" label-width="100px">
        <el-form-item label="类型名称">
          <el-input v-model="typeForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <el-input v-model="typeForm.value_str"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="label_sort">
          <el-input-number v-model="typeForm.sort" style="max-width:140px" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="typeForm.is_use">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="标签描述" prop="label_desc">
          <el-input type="textarea" rows="10" cols="10" v-model="typeForm.label_desc"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="typeFormShow = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {MessageBox} from 'element-ui'
import {getGoodsTypeList, deleteGoodsType} from '@/api/goods'
import {pageMixin} from '@/utils/mixins'
import {getSelectionStr} from '@/utils'
export default {
  mixins: [pageMixin],
  data () {
    return {
      typeList: [
        // {
        //   attr_id: 1000,
        //   attr_name: '电脑',
        //   is_use: 1,
        //   value_str: '操作系统,外观设计,硬件设备',
        //   sort: 0
        // }
      ],
      typeFormShow: false,
      typeForm: {
        attr_name: '',
        is_use: 1,
        value_str: '',
        sort: 0
      },
      selectedTypeIds: -1
    }
  },
  methods: {
    refresh () {
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      getGoodsTypeList(params)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.typeList = res.data.data.AttriButeList
            this.totalCount = res.data.data.total_count
          }
        })
        .catch(err => console.log(err))
    },
    addType () {
      this.$router.push('/goods/goods-type/add-type')
    },
    handleEdit (index, row) {
      // console.log(index, row)
      // getGoodsType(row.label_id)
      //   .then(res => {
      //     console.log(res)
      //     // this.labelForm = res.data.data
      //     this.typeFormShow = true
      //   })
      //   .catch(err => console.log(err))
      // this.labelFormShow = true
      // console.log(row.attr_id)
      this.$router.push({
        path: '/goods/goods-type/edit-type',
        query: {
          attrId: row.attr_id
        }
      })
    },
    deleteType (id) {
      deleteGoodsType(id)
        .then(res => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            console.log(res)
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    deleteOneType (index, row) {
      console.log(row)
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteType(row.attr_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSomeTypes () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteType(this.selectedTypeIds)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    toggleUse (row) {
      console.log(row.attr_id)
    },
    selectType (types) {
      // console.log(types)
      this.selectedTypeIds = getSelectionStr(types, 'attr_id')
      console.log(this.selectedTypeIds)
    }
  },
  created () {
    this.refresh()
  },
  activated () {
    this.refresh()
  }
}
</script>

<style scoped lang="stylus">
.goods-type
  width 100%
  height 100%
  background-color #fff

  .buttons
    padding 30px 20px
    border-bottom 1px solid #eee
    margin-bottom 4px
    background-color #fff

  .pagination
    margin 100px auto
    text-align center
    background-color #fff

  >>>.el-table
    .el-input
      input
        width 40px
        padding 0 10px
        text-align center

    .radio
      display inline-block
      position relative
      width 18px
      height 18px
      border-radius 10px
      background-color #419efe

      .svg-icon
        position absolute
        top 0
        left 0
        color #ffffff
        margin 0
        padding 1px
        font-size 16px

      &.disabled
        background-color #fff

        .svg-icon
          font-size 18px
          color #888
</style>
