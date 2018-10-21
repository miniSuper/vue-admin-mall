<template>
  <div class="edit-type">
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
          <el-radio-button :label="1">是</el-radio-button>
          <el-radio-button :label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联规格">
        <span class="link-item" v-for="(item,index) in linkedModelList" :key="index" size="mini">
          {{item.spec_name}}
        </span>
        <el-button type="primary" size="mini" @click.native="toggleModelForm">+</el-button>
      </el-form-item>
      <el-form-item label="关联品牌">
        <span class="link-item" v-for="(item,index) in linkedBrandList" :key="index" size="mini">
          {{item.brand_name}}
        </span>
        <el-button type="primary" size="mini" @click.native="toggleBrandForm">+</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item> -->
    </el-form>
    <el-table :data="typeForm.value_list" class="type-attr-list" label-width="180">
      <el-table-column label="排序" prop="sort" :fit="false" width="80" align="center" sortable>
        <template slot-scope="scope">
          <el-input :value="scope.row.sort" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="属性名称" prop="attr_value_name" align="center">
        <template slot-scope="scope">
          <el-input :value="scope.row.attr_value_name" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="所属类型" prop="type" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择" :disabled="true">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="是否筛选" prop="is_search" align="center">
        <template slot-scope="scope">
          <span class="radio" :class="{'disabled': scope.row.is_search === 0}">
            <svg-icon v-if="scope.row.is_search === 1" icon-class="check"></svg-icon>
            <svg-icon v-else icon-class="forbid"></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="属性值" prop="value">
        <template slot-scope="scope">
          <span v-text="transSpace(scope.row.value)">
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope ">
          <el-button size="mini" type="text" @click="beforeUpdateTypeAttr(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" style="color:#f56c6c" @click="deleteAttr(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="规格关联设置" :visible.sync="modelListShow" :append-to-body="true">
      <el-table :data="modelList" @selection-change="modelSelectionChange" height="500">
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
      <el-table :data="brandList" @selection-change="brandSelectionChange" height="500">
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
    <el-dialog :title="dialogTitle" :visible.sync="attrFormShow" :append-to-body="true" :center="true">
      <el-form :model="attrForm" label-width="100px">
        <el-form-item label="类型名称" prop="attr_name">
          <el-input v-model="attrForm.attr_value_name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="attrForm.type" placeholder="请选择" @change="typeSelectionChange">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_value" v-if="selectedType === 1">
          <el-input v-model="attrForm.value"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_value" v-if="selectedType !== 1">
          <el-input type="textarea" rows="10" cols="10" v-model="attrForm.value"></el-input>
          <p class="tips">一行为一个属性值，多个属性值用换行输入</p>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="attrForm.sort" style="max-width:140px" controls-position="right"></el-input-number>
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
        <el-button v-if="updateFlag" type="primary" @click="updateTypeAttr">修改</el-button>
        <el-button v-else type="primary" @click="addTypeAttr">确定</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-top:20px" @click="beforeAddTypeAttr">
      添加商品属性
    </el-button>
    <div class="foot-buttons">
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="back">返回</el-button>
    </div>
    <!-- <el-dialog title="添加属性" :visible.sync="newAttrFormShow" :append-to-body="true" :center="true">
      <el-form :model="newAttrForm" label-width="100px">
        <el-form-item label="属性名称" prop="attr_name">
          <el-input v-model="newAttrForm.attr_value_name"></el-input>
        </el-form-item>
        <el-form-item label="属性值" prop="attr_value">
          <el-input v-model="newAttrForm.value"></el-input>
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
    </el-dialog> -->
  </div>
</template>

<script type="text/ecmascript-6">
import {getSelectionStr, transSpaceToComma, deepClone} from '@/utils'
import {updateGoodsType, getGoodsType, deleteGoodsTypeAttr, updateGoodsTypeAttr} from '@/api/goods'
import {MessageBox} from 'element-ui'
export default {
  data () {
    return {
      typeForm: {
        attr_id: '',
        attr_name: '',
        is_use: '',
        sort: '',
        spec_ids: '',
        brand_ids: '',
        attr_value_str: '',
        value_list: [
          // {
          //   attr_value_id: 111,
          //   sort: 2,
          //   attr_value_name: '属性名字',
          //   type: 1,
          //   value: '属性值',
          //   is_search: 1
          // }
        ]
      },
      currentTypeId: 0,
      modelListShow: false,
      modelList: [{
        spec_id: 11,
        spec_name: '规格',
        spec_des: '规格描述'
      }],
      linkedModelList: [],
      brandListShow: false,
      brandList: [
        {
          brand_id: 1001,
          brand_name: '小米',
          brand_pic: '/static/logo.png'
        }
      ],
      attrFormShow: false,
      attrForm: {
      },
      linkedBrandList: [],
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
      selectedType: 1,
      dialogTitle: '修改商品类型属性',
      // 判断是新增 还是 更新
      updateFlag: false
    }
  },
  methods: {
    refresh () {
      let id = this.$route.query.attrId
      this.currentTypeId = id
      console.log(id)
      getGoodsType(id)
        .then(res => {
          console.log(res)
          this.typeForm = res.data.data.attribute_detail
          this.modelList = res.data.data.goodSpeList.GoodsSpeList
          this.brandList = res.data.data.goodsBrandList
          this.linkedModelList = res.data.data.attribute_detail.spec_name
          this.linkedBrandList = res.data.data.attribute_detail.brand_name
        })
        .catch(err => console.log(err))
    },
    back () {
      this.$router.back()
    },
    onSubmit () {
      console.log(this.typeForm)
      updateGoodsType(this.typeForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
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
    toggleModelForm () {
      console.log('toggleModelForm')
      this.modelListShow = !this.modelListShow
    },
    toggleBrandForm () {
      this.brandListShow = !this.brandListShow
    },
    transSpace (str) {
      return transSpaceToComma(str)
    },
    modelSelectionChange (models) {
      this.$set(this.typeForm, 'spec_ids', getSelectionStr(models, 'spec_id'))
      console.log(this.typeForm.spec_ids)
      // this.linkedModelList
      let arr = []
      models.forEach(model => {
        arr.push(model)
      })
      this.linkedModelList = arr
      console.log(this.linkedModelList)
    },
    brandSelectionChange (brands) {
      console.log(brands)
      this.$set(this.typeForm, 'brand_ids', getSelectionStr(brands, 'brand_id'))
      console.log(this.typeForm.brand_ids)
      let arr = []
      brands.forEach(brand => {
        arr.push(brand)
      })
      this.linkedBrandList = arr
    },
    deleteAttr (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGoodsTypeAttr(this.currentTypeId, row.attr_value_id)
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
        this.refresh()
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    beforeUpdateTypeAttr (index, row) {
      this.selectedType = row.type
      // 设置form表单标识位为 修改
      this.updateFlag = true
      this.currentAttrIndex = index
      this.attrForm = deepClone(row)
      this.attrFormShow = true
    },
    updateTypeAttr () {
      // 后台是通过有没有 attr_id 来判断是修改还是新增加
      this.$set(this.attrForm, 'attr_id', '')
      // this.$set(this.attrForm, 'value', transSpaceToComma(this.attrForm.value))
      console.log(this.attrForm)
      updateGoodsTypeAttr(this.attrForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.attrFormShow = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    beforeAddTypeAttr () {
      // 设置form表单标识位为  新增
      this.updateFlag = false
      this.dialogTitle = '添加商品属性'
      this.attrFormShow = true
    },
    addTypeAttr () {
      // 后台是通过有没有 attr_id 来判断是修改还是新增加 ， 有类型ID 表示是新增
      this.$set(this.attrForm, 'attr_id', this.typeForm.attr_id)
      // this.$set(this.attrForm, 'value', transSpaceToComma(this.attrForm.value))
      updateGoodsTypeAttr(this.attrForm)
        .then(res => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.attrFormShow = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    typeSelectionChange (value) {
      // console.log(value)
      this.selectedType = value
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
.edit-type
  overflow scroll

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

  >>>.el-table
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

  .foot-buttons
    width 200px
    margin 60px auto
</style>
