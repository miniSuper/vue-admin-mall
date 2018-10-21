<template>
  <div class="goods-list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="出售中" name="selling"></el-tab-pane>
      <el-tab-pane label="已下架" name="noSell"></el-tab-pane>
      <el-tab-pane label="库存预警" name="stockWarn"></el-tab-pane>
      <el-tab-pane label="回收站" name="recycle"></el-tab-pane>
    </el-tabs>
    <div class="buttons">
      <el-button size="mini" @click="deleteSomeGoods">批量删除</el-button>
      <el-button size="mini" @click="addGoods">发布商品</el-button>
      <el-button size="mini" @click="onLineSomeGoods">上架</el-button>
      <el-button size="mini" @click="offLineSomeGoods">下架</el-button>
      <!-- <el-button size="mini">推荐</el-button> -->
      <!-- <el-button size="mini">商品标签</el-button> -->
      <!-- <el-button size="mini">批量处理</el-button> -->
      <!-- <el-button size="mini">设置折扣</el-button> -->
    </div>
    <div class="conditions clearfix">
      <div class="conditions-inner clearfix">
        <span class="goods-options"> 商品分类 </span>
        <el-cascader :options="categoryList" v-model="selectedCategory" expand-trigger="hover" @focus="getCategoryList"></el-cascader>
        <el-input placeholder="要搜索的商品名称" v-model="searchForm.goods_name" style="max-width:173px"></el-input>
        <drop-down-form ref="dropDownForm" class="dropdown-button"></drop-down-form>
        <el-button class="search-btn" type="primary" @click="onSearch">搜索</el-button>
      </div>
    </div>
    <el-table :data="goodsList" :default-sort="{prop: 'goods_id', order: 'descending'}" @selection-change="selectGoods">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="成本">
              <span>{{ props.row.cost_price }}</span>
            </el-form-item>
            <el-form-item label="保质期">
              <span>{{ props.row.shelf_life }}</span>
            </el-form-item>
            <el-form-item label="规格">
              <span>{{ getModelStr(props.row.goods_spec_format) }}</span>
              <!-- <span>{{ props.row.goods_spec_format }}</span> -->
            </el-form-item>
            <el-form-item label="单位">
              <span>{{ props.row.goods_unit}}</span>
            </el-form-item>
            <el-form-item label="一级分类ID">
              <span>{{ props.row.category_id_1 }}</span>
            </el-form-item>
            <el-form-item label="二级分类ID">
              <span>{{ props.row.category_id_2 }}</span>
            </el-form-item>
            <el-form-item label="三级分类ID">
              <span>{{ props.row.category_id_3 }}</span>
            </el-form-item>
            <el-form-item label="商品状态">
              <span>{{ props.row.state===1? '销售中': props.row.state===2? '下架':props.row.state===3 ? '回收站': '未知' }}</span>
            </el-form-item>
            <el-form-item label="商品标题">
              <span>{{ props.row.goods_name }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="goods_id" label="商品id" sortable>
      </el-table-column>
      <el-table-column prop="picture" label="首图">
        <template slot-scope="props">
          <div class="img-wrapper">
            <img :src="getPicUrl(props.row.picture)" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品标题" width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="price" label="价格" sortable>
      </el-table-column>
      <el-table-column prop="sales" label="销量" sortable>
      </el-table-column>
      <el-table-column prop="stock" label="库存" sortable>
      </el-table-column>
      <el-table-column prop="shipping_fee" label="运费">
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="128">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="editGoods(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="scope.row.state===1" size="mini" type="text" @click="offLineOneGoods(scope.$index, scope.row)">下架</el-button>
          <el-button v-if="scope.row.state===0" size="mini" type="text" @click="onLineOneGoods(scope.$index, scope.row)" style="color:#67c23a">上架</el-button>
          <el-button v-if="scope.row.state !== 3" size="mini" type="text" @click="deleteOneGoods(scope.$index, scope.row)" style="color:#f56c6c">删除</el-button>
          <el-button v-if="scope.row.state===3" size="mini" type="text" @click="destroyOneGoods(scope.$index, scope.row)" style="color:#f56c6c">彻底删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import MyTable from '@/components/my-table'
import DropDownForm from '@/components/dropDownForm'
import {getGoodsList, getGoodsCategoryList, deleteGoods, destroyGoods, offLineGoods, onLineGoods, getGoodsDeleteList, getGoodsWarningList} from '@/api/goods'
import {getSelectionStr, cascaderFormatSort} from '@/utils'
import {MessageBox} from 'element-ui'
import {pageMixin} from '@/utils/mixins'
import {baseUrl} from '@/config'
export default {
  mixins: [pageMixin],
  data () {
    return {
      activeName: 'selling',
      goodsList: [],
      selectedGoodsIds: '',
      categoryList: [],
      selectedCategory: [],
      conditions: {
        timeRange: '',
        searchWord: ''
      },
      state: 1,
      searchForm: {}
    }
  },
  watch: {
    selectedCategory (newList) {
      for (let i = 0; i < newList.length; i++) {
        let key = 'category_id_' + i
        let value = newList[i]
        console.log(key, value)
        this.$set(this.searchForm, key, value)
      }
    }
  },
  methods: {
    refresh () {
      let params = {
        state: this.state,
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      getGoodsList(params)
        .then(res => {
          console.log(res)
          this.goodsList = res.data.data.goodsList
          this.totalCount = res.data.data.total_count
        })
        .catch(err => console.log(err))
    },
    handleClick (tab, event) {
      console.log(tab.index)
      switch (tab.index) {
        case '0':
          this.getOnLineList()
          break
        case '1':
          this.getOffLineList()
          break
        case '2':
          this.getWarningList()
          break
        case '3':
          this.getRecycleList()
          break
        default:
          break
      }
    },
    editGoods (index, row) {
      this.$router.push({
        path: '/goods/goods-add',
        query: {
          id: row.goods_id
        }
      })
    },
    addGoods () {
      this.$router.push('/goods/goods-add')
    },
    getPicUrl (url) {
      if (!url) return
      return baseUrl + '/public' + url
    },
    getCategoryList () {
      if (this.cateHttpFlag) {
        return
      }
      getGoodsCategoryList()
        .then(res => {
          let arr = []
          cascaderFormatSort(res.data.data.goodsCateList.cate, arr)
          this.categoryList = arr
          //  请求节流
          this.cateHttpFlag = true
        })
        .catch(err => console.log(err))
    },
    getOnLineList () {
      this.state = 1
      this.refresh()
    },
    getRecycleList () {
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      console.log('回收站')
      getGoodsDeleteList(params)
        .then(res => {
          console.log(res)
          this.goodsList = res.data.data.goodsList
          this.totalCount = res.data.data.total_count
        })
        .catch(err => console.log(err))
    },
    getWarningList () {
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      getGoodsWarningList(params)
        .then(res => {
          console.log(res)
          this.goodsList = res.data.data.GoodsStockWarning
          this.totalCount = res.data.data.total_count
        })
        .catch(err => console.log(err))
    },
    getOffLineList () {
      this.state = 0
      this.refresh()
    },
    getModelStr (arr) {
      let str = ''
      arr = JSON.parse(arr)
      if (arr === null || typeof (arr) !== 'object' || arr.length === 0) {
        return '无'
      }
      arr.forEach(item => {
        str += item.spec_name + ':' + item.spec_value_name + ';'
      })
      return str
    },
    deleteOneGoods (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(row.goods_id)
          .then(res => {
            console.log(res)
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
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
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSomeGoods () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoods(this.selectedGoodsIds)
          .then(res => {
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
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    destroyOneGoods (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroyGoods(row.goods_id)
          .then(res => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '成功将商品从回收站清除!'
              })
              this.getRecycleList()
            }
          })
          .catch(err => console.log(err))
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    destroySomeGoods () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        destroyGoods(this.selectedGoodsIds)
          .then(res => {
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
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    selectGoods (goods) {
      this.selectedGoodsIds = getSelectionStr(goods, 'goods_id')
      console.log(this.selectedGoodsIds)
    },
    offLineOneGoods (index, row) {
      console.log(row.goods_id)
      offLineGoods(row.goods_id)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '下架成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    offLineSomeGoods () {
      offLineGoods(this.selectedGoodsIds)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '下架成功!'
            })
            this.refresh()
          } else {
            this.$message({
              type: 'warning',
              message: '下架失败!  原因:' + res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    onLineOneGoods (index, row) {
      onLineGoods(row.goods_id)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '下架成功'
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
    onLineSomeGoods () {
      onLineGoods(this.selectedGoodsIds)
        .then(res => {
          console.log(res)
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
    },
    onSearch () {
      console.log('search')
      this.refresh()
    }
  },
  components: {
    MyTable,
    DropDownForm
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
.goods-list
  width 100%
  height 100%
  padding-bottom 80px
  background-color #fff

  .pagination
    padding 80px
    text-align center
    background-color #fff

  .buttons
    padding-left 10px
    margin 20px 0 6px 0

    >>>.el-button
      margin-left 0

  .conditions
    position relative
    margin 10px 0
    padding-bottom 40px
    border-bottom 1px solid #eee
    z-index 100

    .conditions-inner
      width 600px
      float right
      vertical-align center

      .goods-options
        color #6f6f6f
        margin-right 6px
        font-size 14px

      .dropdown-button
        display inline-block
        width 26px
        height 34px
        border 1px solid #aaa
        color #333
        vertical-align bottom

      .search-btn
        margin-left 4px

  >>>.el-tabs
    padding-left 10px

    .el-tabs__content
      display none

    .el-tabs__active-bar
      transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)

    .el-tabs__item
      color #58687b

      &.is-active
        color #409EFF

  >>>.el-table
    .img-wrapper
      width 50px
      height 50px
      overflow hidden

      img
        width 100%

    .el-table__expanded-cell
      .table-expand
        font-size 0
        padding 0 50px

        .el-form-item
          margin-right 0
          margin-bottom 0
          width 50%

          label
            width 90px
            color #99a9bf
            font-weight normal
</style>
