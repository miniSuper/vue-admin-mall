<template>
  <div class="goods-label">
    <div class="buttons">
      <el-button type="danger" icon="el-icon-delete" @click="deleteSomeLabels">批量删除</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addLabel">添加标签</el-button>
    </div>
    <el-table :data="labelList" @selection-change="selectLabel">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="label_name" label="标签名字" fixed>
        <template slot-scope="scope">
          <el-input v-model="scope.row.label_name" style="min-width:100px" @blur="inputBlur(scope.row.label_id,scope.row.label_name)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="label_sort" label="排序" :fit="false" width="140" align="center" sortable>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="deleteOneLabel(scope.$index, scope.row)" style="color:#f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
    <el-dialog title="标签修改" :visible.sync="labelFormShow" :append-to-body="true" :center="true">
      <el-form :model="labelForm" label-width="100px">
        <el-form-item label="标签名字">
          <el-input v-model="labelForm.label_name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="label_sort">
          <el-input-number v-model="labelForm.label_sort" style="max-width:140px" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="标签图片">
          <el-upload action="http://xx00.com" :limit="1" list-type="picture">
            <el-button size="small">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传1张jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签描述" prop="label_desc">
          <el-input type="textarea" rows="10" cols="10" v-model="labelForm.label_desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="labelFormShow = false">取 消</el-button>
        <el-button type="primary" @click="updateLabel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {MessageBox} from 'element-ui'
import {getGoodsLabelList, getGoodsLabel, updateGoodsLabel, deleteGoodsLabel} from '@/api/goods'
import {getSelectionStr} from '@/utils'
import {pageMixin} from '@/utils/mixins'
export default {
  mixins: [pageMixin],
  data () {
    return {
      labelList: [
        {
          label_id: 1000,
          label_name: '热卖',
          label_sort: 2,
          label_img: '',
          label_desc: ''
        }
      ],
      labelFormShow: false,
      labelForm: {
        label_name: '热卖',
        label_sort: 2,
        label_img: '',
        label_desc: ''
      },
      selectedLabelIds: []
    }
  },
  methods: {
    refresh () {
      let params = {
        page_index: this.pageIndex,
        page_size: this.pageSize
      }
      getGoodsLabelList(params)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.labelList = res.data.data.labelList
            this.totalCount = res.data.data.total_count
          }
        })
        .catch(err => console.log(err))
    },
    addLabel () {
      this.$router.push('/goods/goods-label/add-label')
    },
    handleEdit (index, row) {
      console.log(index, row)
      getGoodsLabel(row.label_id)
        .then(res => {
          console.log(res)
          this.labelForm = res.data.data
        })
        .catch(err => console.log(err))
      this.labelFormShow = true
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    inputBlur (id, name) {
      console.log(id, name)
      getGoodsLabel(id)
        .then(res => {
          console.log(res)
          // this.labelForm = res.data.data
          let beforeLabel = res.data.data
          let beforeName = res.data.data.label_name
          if (name !== beforeName) {
            MessageBox.confirm('标签名字已修改，您确认修改吗？', '修改提示', {
              confirmButtonText: '修改',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              beforeLabel.label_name = name
              updateGoodsLabel(beforeLabel)
                .then(res => {
                  console.log(res)
                  if (res.data.status) {
                    this.$message({
                      type: 'success',
                      message: '标签名修改成功'
                    })
                    this.labelFormShow = false
                    this.refresh()
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.data.msg
                    })
                  }
                })
                .catch(
                  err => console.log(err)
                )
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消修改'
              })
              this.refresh()
            })
          }
        })
        .catch(err => console.log(err))
      // 接下来 查询该id对应的nam ,判断现在的name 和 服务器的是否一致，如果不一致，则弹出对话框询问用户要不要修改
      // MessageBox.confirm('标签名字已修改，您确认修改吗？', '修改提示', {
      //   confirmButtonText: '修改',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {

      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   })
      // })
    },
    updateLabel () {
      console.log(this.labelForm)
      updateGoodsLabel(this.labelForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
            this.labelFormShow = false
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(
          err => console.log(err)
        )
    },
    deleteOneLabel (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLabel(row.label_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSomeLabels () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLabel(this.selectedLabelIds)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteLabel (id) {
      deleteGoodsLabel(id)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功'
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
    },
    selectLabel (labels) {
      // console.log(labels)
      this.selectedLabelIds = getSelectionStr(labels, 'label_id')
      console.log(this.selectedLabelIds)
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style scoped lang="stylus">
.goods-label
  width 100%
  height 1000px
  background-color #fff

  .buttons
    padding 30px 20px
    border-bottom 1px solid #eee
    margin-bottom 4px
    background-color #fff

  .pagination
    width 380px
    margin 100px auto
</style>
