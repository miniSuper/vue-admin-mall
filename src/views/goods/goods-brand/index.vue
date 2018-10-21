<template>
  <div class="goods-brand">
    <div class="buttons">
      <el-button type="danger" icon="el-icon-delete" @click.native="deleteSomeBrands">批量删除</el-button>
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addBrand">添加品牌</el-button>
    </div>
    <el-table :data="brandList" :default-sort="{prop: 'brand_name', order: 'descending'}" @selection-change="selectBrand">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="brand_name" label="品牌" sortable fixed>
      </el-table-column>
      <el-table-column prop="brand_pic" label="LOGO图片">
        <template slot-scope="scope">
          <div class="img-wrapper">
            <img :src="getPicUrl(scope.row.brand_pic)" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="brand_ads" label="广告图片">
        <template slot-scope="scope">
          <div class="img-wrapper">
            <img :src="getPicUrl(scope.row.brand_ads)" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="brand_recommend" label="推荐" :fit="false" width="80">
        <template slot-scope="scope">
          <span class="radio" :class="{'disabled': scope.row.brand_recommend === 0}" @click="toggleRecommend(scope.row)">
            <svg-icon v-if="scope.row.brand_recommend" icon-class="check"></svg-icon>
            <svg-icon v-else icon-class="forbid "></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="editBrand(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="deleteOneBrand(scope.$index, scope.row)" style="color:#f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
    <el-dialog title="品牌信息修改" :visible.sync="brandFormShow" :append-to-body="true" :center="true">
      <el-form :model="brandForm" label-width="100px">
        <el-form-item label="品牌名字" prop="brand_name">
          <el-input v-model="brandForm.brand_name"></el-input>
        </el-form-item>
        <el-form-item label="品牌首字母" prop="brand_initial">
          <el-input v-model="brandForm.brand_initial"></el-input>
        </el-form-item>
        <el-form-item label="是否推荐" prop="brand_recommend">
          <el-radio-group v-model="brandForm.brand_recommend">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品牌图片" prop="brand_pic">
          <el-upload action="http://xx00.com" :limit="1" list-type="picture">
            <el-button size="small">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传1张jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌广告图" prop="brand_ads">
          <el-upload action="http://xx00.com" :limit="1" list-type="picture">
            <el-button size="small">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传1张jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="brandFormShow = false">取 消</el-button>
        <el-button type="primary" @click="updateBrand">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getBrandList, delGoodsBrand, getGoodsBrand, updateGoodsBrand} from '@/api/goods'
import {getSelectionStr} from '@/utils'
import {MessageBox} from 'element-ui'
import {pageMixin} from '@/utils/mixins'
import {baseUrl} from '@/config'
export default {
  mixins: [pageMixin],
  data () {
    return {
      brandList: [
      ],
      selectedBrandIds: '',
      brandFormShow: false,
      brandForm: {
        brand_name: '',
        brand_initial: '',
        brand_recommend: false,
        brand_pic: '',
        brand_ads: ''
      }
    }
  },
  methods: {
    refresh () {
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      getBrandList(params)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.brandList = res.data.data.GoodsBrand
            this.totalCount = res.data.data.total_count
          }
        })
        .catch(err => console.log(err))
    },
    getPicUrl (url) {
      return baseUrl + '/public' + url
    },
    addBrand () {
      this.$router.push('/goods/goods-brand/add-brand')
    },
    toggleRecommend (row) {
      console.log(row)
    },
    selectBrand (brands) {
      this.selectedBrandIds = getSelectionStr(brands, 'brand_id')
    },
    editBrand (index, row) {
      console.log(index, row)
      this.brandFormShow = true
      getGoodsBrand(row.brand_id)
        .then(res => {
          console.log(res)
          this.brandForm = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteOneBrand (index, row) {
      console.log(row.brand_id)
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsBrand(row.brand_id)
          .then(res => {
            console.log(res)
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
            this.refresh()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: err.msg
            })
          })
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSomeBrands () {
      console.log(this.selectedBrandIds)
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsBrand(this.selectedBrandIds)
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
    updateBrand () {
      updateGoodsBrand(this.brandForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.refresh()
            this.brandFormShow = false
          } else {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
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
.goods-brand
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

  >>>.el-table
    .img-wrapper
      width 50px
      height 50px
      overflow hidden

      img
        width 100%
        height 100%

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
