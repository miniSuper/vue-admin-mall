<template>
  <div class="add-type">
    <!-- <el-button class="back" size="medium" type="text" icon="el-icon-arrow-left" @click.native="back">返回上一级</el-button> -->
    <el-form :model="typeForm" label-width="100px">
      <el-form-item label="类型名称">
        <el-input v-model="typeForm.attr_name"></el-input>
      </el-form-item>
      <el-form-item label="属性排序">
        <el-input-number v-model="typeForm.sort" controls-position="right" :min="0" :max="100"></el-input-number>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio-group v-model="typeForm.is_visible">
          <el-radio-button :label="true">是</el-radio-button>
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联规格">
        <span class="link-item" v-for="(item,index) in selectedModelList" :key="index" size="mini">
          {{item}}
        </span>
        <el-button type="primary" size="mini" @click="showModelForm">+</el-button>
      </el-form-item>
      <el-form-item label="关联品牌">
        <span class="link-item" v-for="(item,index) in selectedBrandList" :key="index" size="mini">
          {{item}}
        </span>
        <el-button type="primary" size="mini" @click="showBrandForm">+</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item> -->
    </el-form>
    <el-dialog title="规格关联设置" :visible.sync="modelListShow" :append-to-body="true">
      <el-table :data="modelList" @selection-change="modelSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="spec_name" label="规格" width="120">
        </el-table-column>
        <el-table-column prop="spec_des" label="规格描述">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelListShow = false">取 消</el-button>
        <el-button type="primary" @click="modelListShow = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="品牌关联设置" :visible.sync="brandListShow" :append-to-body="true">
      <el-table :data="brandList" height="500" @selection-change="brandSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="brand_name" label="品牌名称" width="120">
        </el-table-column>
        <el-table-column prop="brand_pic" label="品牌图片">
          <template slot-scope="scope">
            <div class="img-wrapper">
              <img :src="scope.row.brand_pic" alt="">
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="brandListShow = false">取 消</el-button>
        <el-button type="primary" @click="brandListShow = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="modelAttrList" label-width="180" class="model-attr-list">
      <el-table-column label="排序" prop="sort" :fit="false" width="80" align="center" sortable>
        <template slot-scope="scope">
          <el-input :value="scope.row.sort" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="属性名称" prop="attr_value_name" align="center">
        <template slot-scope="scope">
          <el-input :value="scope.row.attr_name" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="所属类型" prop="type" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择" disabled>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否筛选" prop="is_search" align="center">
        <template slot-scope="scope">
          <span class="radio" :class="{'disabled': scope.row.is_search === 0}">
            <svg-icon v-if="scope.row.is_search" icon-class="check"></svg-icon>
            <svg-icon v-else icon-class="forbid "></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="属性值" prop="attr_value">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="editTypeAttr(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" style="color:#f56c6c" @click="deleteTypeAttr(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-top:20px" @click="newAttrFormShow = true">
      添加商品属性
    </el-button>
    <div class="foot-buttons">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="back">返回</el-button>
    </div>
    <el-dialog title="添加商品类型属性" :visible.sync="newAttrFormShow" :append-to-body="true" :center="true">
      <el-form :model="newAttrForm" label-width="100px">
        <el-form-item label="类型名称" prop="attr_name">
          <el-input v-model="newAttrForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_value">
          <el-input v-model="newAttrForm.attr_value"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="newAttrForm.sort" style="max-width:140px" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="newAttrForm.type" placeholder="请选择">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否筛选">
          <el-radio-group v-model="newAttrForm.is_search">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAttrFormShow = false">取 消</el-button>
        <el-button type="primary" @click="addTypeAttr">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改商品类型属性" :visible.sync="attrFormShow" :append-to-body="true" :center="true">
      <el-form :model="attrForm" label-width="100px">
        <el-form-item label="类型名称" prop="attr_name">
          <el-input v-model="attrForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_value">
          <el-input v-model="attrForm.attr_value"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="attrForm.sort" style="max-width:140px" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="attrForm.type" placeholder="请选择" @change="typeSelectionChange">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否筛选">
          <el-radio-group v-model="attrForm.is_search">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attrFormShow = false">取 消</el-button>
        <el-button type="primary" @click="finishAttrForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSelectionStr, deepClone, transObjArrToStr} from '@/utils'
import {addGoodsType, getBrandList, getModelList} from '@/api/goods'
export default {
  data () {
    return {
      typeForm: {
        attr_name: '',
        is_visible: '',
        sort: '',
        spec_ids: '',
        brand_ids: '',
        attr_value_str: ''
      },
      modelListShow: false,
      modelList: [],
      brandListShow: false,
      selectedModelList: [],
      selectedBrandList: [],
      brandList: [
      ],
      typeOptions: [
        {
          value: 1,
          label: '输入框'
        },
        {
          value: 2,
          label: '单选框'
        },
        {
          value: 3,
          label: '复选框'
        }
      ],
      modelAttrList: [
      ],
      newAttrFormShow: false,
      newAttrForm: {},
      attrFormShow: false,
      attrForm: {
      },
      currentAttrIndex: 0
    }
  },
  watch: {
    modelAttrList () {
      this.typeForm.attr_value_str = transObjArrToStr(this.modelAttrList)
      console.log(this.typeForm.attr_value_str)
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    resetForm () {
      this.typeForm = {
        attr_name: '',
        is_visible: '',
        sort: '',
        spec_ids: '',
        brand_ids: '',
        attr_value_str: ''
      }
    },
    onSubmit () {
      console.log(this.typeForm)
      addGoodsType(this.typeForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.resetForm()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    showModelForm () {
      console.log('showModelForm')
      this.modelListShow = !this.modelListShow
      getModelList()
        .then(res => {
          console.log(res)
          this.modelList = res.data.data.GoodsSpeList
        })
        .catch(err => console.log(err))
    },
    showBrandForm () {
      this.brandListShow = !this.brandListShow
      getBrandList()
        .then(res => {
          console.log(res)
          this.brandList = res.data.data.GoodsBrand
        })
        .catch(err => console.log(err))
    },
    modelSelectionChange (models) {
      console.log(models)
      this.$set(this.typeForm, 'spec_ids', getSelectionStr(models, 'spec_id'))
      console.log(this.typeForm.spec_ids)
      let arr = []
      models.forEach(model => {
        arr.push(model.spec_name)
      })
      this.selectedModelList = arr
    },
    brandSelectionChange (brands) {
      console.log(brands)
      this.$set(this.typeForm, 'brand_ids', getSelectionStr(brands, 'brand_id'))
      console.log(this.typeForm.brand_ids)
      let arr = []
      brands.forEach(brand => {
        arr.push(brand.brand_name)
      })
      this.selectedBrandList = arr
    },
    resetNewArrForm () {
      this.newAttrForm = {}
    },
    addTypeAttr () {
      console.log(this.newAttrForm)
      let newValueObj = deepClone(this.newAttrForm)
      this.modelAttrList.push(newValueObj)
      this.resetNewArrForm()
      this.newAttrFormShow = false
    },
    deleteTypeAttr (index, row) {
      console.log(index, row)
      // console.log(this.modelAttrList)
      let arr = this.modelAttrList.slice()
      arr.splice(index, 1)
      this.modelAttrList = arr
      console.log(arr)
    },
    editTypeAttr (index, row) {
      this.currentAttrIndex = index
      console.log(row)
      this.attrForm = row
      this.attrFormShow = true
    },
    finishAttrForm () {
      // console.log(this.attrForm)
      this.modelAttrList.splice(this.currentAttrIndex, 1, deepClone(this.attrForm))
      this.attrFormShow = false
      console.log(this.modelAttrList)
    },
    typeSelectionChange (value) {
      console.log(value)
    }
  }
}
</script>

<style scoped lang="stylus">
.add-type
  .back
    position absolute
    top 20px
    left 60px

  >>>.el-form
    width 70%
    margin 0 auto
    margin-top 80px

    .link-item
      display inline-block
      padding 0 10px
      margin 0 2px
      font-size 12px
      line-height 28px
      height 28px
      color #606266
      background-color #fff
      border-radius 4px
      border 1px solid #dcdfe6

  >>>.el-dialog
    .img-wrapper
      width 50px
      height 50px
      overflow hidden

      img
        width 100%
        height 100%

  .foot-buttons
    width 200px
    margin 60px auto

  >>>.el-table
    &.model-attr-list
      color #909399

      .el-input
        &.is-disabled
          input
            background-color #fff
            color #909399

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
