<template>
  <div class="goods-sort">
    <div style="margin-bottom:40px">
      <el-button plain icon="el-icon-circle-plus-outline" @click="addTopCategory">新增一级分类</el-button>
    </div>
    <!-- <div>
      <span>名称</span>
      <span>增加分类</span>
      <span>简称</span>
      <span>操作</span>
    </div> -->
    <!-- <my-tree :data="goodsCateList" :hasParent="false" @addCategory="addCategory"></my-tree> -->
    <sort-table :data="goodsCateList" @addCategory="addCategory" @editCategory="editCategory" @refresh="refresh"></sort-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
    <el-dialog title="添加子分类" :visible.sync="childFormShow" :append-to-body="true" :center="true">
      <el-form :model="childForm" label-width="100px">
        <el-form-item label="分类名称" prop="attr_name">
          <el-input v-model="childForm.category_name "></el-input>
        </el-form-item>
        <el-form-item label="分类简称" prop="short_name">
          <el-input v-model="childForm.short_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型名称" prop="attr_name">
          <el-input v-model="childForm.attr_name"></el-input>
        </el-form-item> -->
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="childForm.sort" style="max-width:140px" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="childForm.is_visible">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="childForm.keywords" type="textarea" :rows="6"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="childForm.description" type="textarea" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="childFormShow = false">取 消</el-button>
        <el-button type="primary" @click="submitChildForm">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="sortFormTitle" :visible.sync="sortFormShow" :append-to-body="true" :center="true">
      <el-form :model="sortForm" label-width="100px">
        <el-form-item label="分类名称" prop="attr_name">
          <el-input v-model="sortForm.category_name "></el-input>
        </el-form-item>
        <el-form-item label="分类简称" prop="short_name">
          <el-input v-model="sortForm.short_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型名称" prop="attr_name">
          <el-input v-model="sortForm.attr_name"></el-input>
        </el-form-item> -->
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="sortForm.sort" style="max-width:140px" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="sortForm.attr_id" placeholder="请选择分类类型" @visible-change="selectType" @change="setAttrName">
            <el-option v-for="item in typeOptions" :key="item.attr_id" :label="item.attr_name" :value="item.attr_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="sortForm.is_visible">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="sortForm.keywords" type="textarea" :rows="6"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="sortForm.description" type="textarea" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sortFormShow = false">取 消</el-button>
        <el-button type="primary" @click="submitSortForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import MyTree from '@/components/my-tree'
import SortTable from './sort-table'
import {getGoodsCategoryList, addGoodsCategory, getGoodsTypeList, getGoodsType, updateGoodsCategory} from '@/api/goods'
import {pageMixin} from '@/utils/mixins'
export default {
  mixins: [pageMixin],
  data () {
    return {
      goodsCateList: [],
      childFormShow: false,
      childForm: {
      },
      sortFormShow: false,
      sortForm: {},
      sortFormTitle: '添加一级分类',
      typeOptions: [],
      total_count: 12,
      updateFlag: false
    }
  },
  components: {
    MyTree,
    SortTable
  },
  methods: {
    refresh () {
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      getGoodsCategoryList(params)
        .then(res => {
          if (res.data.status) {
            this.goodsCateList = res.data.data.goodsCateList.cate
            // this.totalCount = res.data.data.total_count
            console.log(res)
          }
        })
        .catch(err => console.log(err))
    },
    addCategory (dataObj) {
      this.childFormShow = true
      Object.keys(dataObj).forEach(
        key => {
          this.$set(this.childForm, key, dataObj[key])
        }
      )
    },
    postNewCategory () {
      console.log('new')
      addGoodsCategory(this.sortForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.sortForm = {}
            this.sortFormShow = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    addTopCategory () {
      this.sortFormShow = true
      this.updateFlag = false
      this.$set(this.sortForm, 'pid', 0)
      this.sortFormTitle = '新增一级分类'
    },
    editCategory (data) {
      console.log(data)
      this.sortForm = data
      this.sortFormShow = true
      this.updateFlag = true
      this.sortFormTitle = '修改分类信息'
    },
    updateCategory () {
      console.log('update')
      updateGoodsCategory(this.sortForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.sortFormShow = false
            this.sortForm = {}
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    selectType (isOpen) {
      if (isOpen && !this.typeOptions.length) {
        getGoodsTypeList()
          .then(res => {
            this.typeOptions = res.data.data.AttriButeList
          })
          .catch(err => console.log(err))
      }
    },
    setAttrName (id) {
      console.log(id)
      getGoodsType(id)
        .then(res => {
          // console.log(res)
          if (res.data.status) {
            this.$set(this.sortForm, 'attr_name', res.data.data.attribute_detail.attr_name)
          }
        })
    },
    submitChildForm () {
      addGoodsCategory(this.childForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.childFormShow = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    submitSortForm () {
      console.log(this.sortForm)
      !this.updateFlag && this.postNewCategory()
      this.updateFlag && this.updateCategory()
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style scoped lang="stylus">
.goods-sort
  padding 20px
  background-color #fff
  min-height 100%

  .pagination
    margin 70px auto
    text-align center
</style>
