<template>
  <div class="goods-model">
    <div class="buttons">
      <el-button type="danger" icon="el-icon-delete" @click="deleteSomeModels">批量删除</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addModel">添加规格</el-button>
    </div>
    <el-table :data="modelList" @selection-change="selectModels">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="spec_name" label="规格">
      </el-table-column>
      <el-table-column prop="spec_value_list_name" label="规格属性">
      </el-table-column>
      <el-table-column prop="is_visible" label="是否启用" :fit="false" width="100" align="center">
        <template slot-scope="scope">
          <span class="radio" :class="{'disabled': scope.row.is_visible === 0}" @click="toggleVisible(scope.row)">
            <svg-icon v-if="scope.row.is_visible" icon-class="check"></svg-icon>
            <svg-icon v-else icon-class="forbid "></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="is_screen" label="是否参与筛选" :fit="false" width="110" align="center">
        <template slot-scope="scope">
          <span class="radio" :class="{'disabled': scope.row.is_screen !== 1}" @click="toggleScreen(scope.row)">
            <svg-icon v-if="scope.row.is_screen" icon-class="check"></svg-icon>
            <svg-icon v-else icon-class="forbid "></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" :fit="false" width="120" align="center" sortable>
        <template slot-scope="scope">
          <el-input v-model="scope.row.sort"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="editModel(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="deleteOneModel(scope.$index, scope.row)" style="color:#f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
    <el-dialog title="规格修改" :visible.sync="modelFormShow" :append-to-body="true" :center="true">
      <el-form :model="modelForm">
        <el-form-item label="规格名字" label-width="100px">
          <el-input v-model="modelForm.spec_name"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" label-width="100px">
          <el-radio-group v-model="modelForm.is_visible">
            <el-radio-button label="是"></el-radio-button>
            <el-radio-button label="否"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否参与筛选" label-width="100px">
          <el-radio-group v-model="modelForm.is_screen">
            <el-radio-button label="是"></el-radio-button>
            <el-radio-button label="否"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" label-width="100px">
          <el-input-number v-model="modelForm.sort" controls-position="right" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="展示方式" label-width="100px">
          <el-radio-group v-model="modelForm.show_type" size="medium">
            <el-radio border :label="1">文字</el-radio>
            <el-radio border :label="2">颜色</el-radio>
            <el-radio border :label="3">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规格值" prop="desc" label-width="100px">
          <el-input type="textarea" rows="10" cols="10" v-model="modelForm.spec_value_str"></el-input>
          <p class="tips">一行为一个规格项，多个规格项用换行输入</p>
        </el-form-item>
        <el-form-item label="规格说明" prop="desc" label-width="100px">
          <el-input type="textarea" rows="10" cols="10" v-model="modelForm.spec_des"></el-input>
          <p class="tips">输入规格说明</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelFormShow = false">取 消</el-button>
        <el-button type="primary" @click="updateModel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getModelList, delGoodsModel, getGoodsModel, updateGoodsModel} from '@/api/goods'
import {getSelectionStr, transSpaceToComma} from '@/utils'
// import {transSpaceToComma} from '@/utils'
import {MessageBox} from 'element-ui'
import {pageMixin} from '@/utils/mixins'
export default {
  mixins: [pageMixin],
  data () {
    return {
      modelList: [],
      selectedIdsStr: '',
      modelFormShow: false,
      modelForm: {
        spec_id: 0,
        spec_name: '',
        spec_value_name_list: '',
        spec_value_str: '',
        is_visible: 0, // 是否启用 1 启用 0 不启用
        is_screen: 0, // 是否筛选 1 参与 0 不参与
        sort: 0
      }
    }
  },
  methods: {
    refresh () {
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      getModelList(params)
        .then(res => {
          if (res.data.status) {
            this.modelList = res.data.data.GoodsSpeList
            this.totalCount = res.data.data.total_count
            console.log(res)
          }
        })
        .catch(err => console.log(err))
    },
    addModel () {
      this.$router.push({path: '/goods/add-model'})
    },
    selectModels (models) {
      console.log(models)
      this.selectedIdsStr = getSelectionStr(models, 'spec_id')
      console.log(this.selectedIdsStr)
    },
    editModel (index, row) {
      console.log(row.spec_id)
      this.modelFormShow = true
      getGoodsModel(row.spec_id)
        .then(res => {
          console.log(res.data.data)
          this.modelForm = res.data.data
        })
        .catch(err => console.log(err))
    },
    updateModel () {
      let formObj = {}
      let me = this
      Object.keys(this.modelForm).forEach(function (key) {
        formObj[key] = me.modelForm[key]
        console.log(key)
      })
      formObj.spec_value_str = transSpaceToComma(this.modelForm.spec_value_str)
      updateGoodsModel(formObj)
        .then(res => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.modelFormShow = false
            this.refresh()
          } else {
            this.$message({
              type: 'warning',
              message: '修改失败，错误原因:' + res.data.msg
            })
          }
          console.log(res.data.status)
        })
        .catch(err => console.log(err))
    },
    deleteSomeModels () {
      // delGoodsModel(this.selectedIdsStr)
      //   .then(res => console.log(res))
      //   .catch(err => console.log(err))
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsModel(this.selectedIdsStr)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refresh()
          })
          .catch(err => {
            // console.log(err)
            this.$message({
              type: 'warning',
              message: '删除失败' + err.msg
            })
          })
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteOneModel (index, row) {
      console.log(row.spec_id)
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsModel(row.spec_id)
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.refresh()
          })
          .catch(err => {
            // console.log(err)
            this.$message({
              type: 'warning',
              message: '删除失败' + err.msg
            })
          })
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    toggleVisible (row) {
      console.log(row)
    },
    toggleScreen (row) {
      console.log(row)
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
.goods-model
  width 100%
  height 100%
  overflow scroll
  background-color #fff

  .buttons
    padding 30px 20px
    border-bottom 1px solid #eee
    margin-bottom 4px
    background-color #fff

  .pagination
    margin 70px auto
    text-align center

  >>>.el-table
    .el-input
      input
        padding 4px
        width 40px
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
