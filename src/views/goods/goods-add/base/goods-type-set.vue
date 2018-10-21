<template>
  <div class="goods-set">
    <!-- <h1>goods-set</h1> -->
    <el-form :model="typeForm" label-width="100px">
      <el-form-item label="商品类型">
        <el-select v-model="selectedTypeId" placeholder="请选择商品属性" @visible-change="selectType">
          <el-option v-for="(item,index) in typeList" :key="index" :label="item.attr_name" :value="item.attr_id"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <h3 class="title" v-if="attrList.length">属性值</h3>
    <div class="attr-container">
      <div class="attr-item" v-for="item in attrList" :key="item.attr_value_id">
        <el-form label-width="100px">
          <el-form-item :label="item.attr_value_name">
            <el-input v-if="item.type === 1" v-model="inputObj[item.attr_value_id]" style="max-width:300px" @change="inputObjChange"></el-input>
            <el-radio-group v-if="item.type === 2" v-model="radioObj[item.attr_value_id]" @change="radioObjChange">
              <el-radio v-for="(element,index) in transStrToArray(item.value)" :key="index" :label="element"></el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="item.type === 3" v-model="checkObj[item.attr_value_id]" @change="checkObjChange">
              <el-checkbox v-for="(element,index) in transStrToArray(item.value)" :key="index" :label="element"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="foot-buttons">
      <el-button type="primary" @click="saveSettings">保存</el-button>
      <!-- <el-button @click="test">test</el-button> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getGoodsTypeList, getGoodsType, getGoodsTypeInfo} from '@/api/goods'
import {deepClone} from '@/utils'
import { mapActions } from 'vuex'
export default {
  props: {
    goodsId: 0
  },
  data () {
    return {
      typeForm: {
        // 后台约定的数组名
        goods_attribute: []
      },
      typeList: [],
      selectedTypeId: '',
      attrList: [],
      attrListBefore: [],
      attrValueObj: {},
      radioObj: {},
      checkObj: {},
      inputObj: {},
      testList: [],
      currentInputId: 0,
      hasSelectedInput: false,
      hasSelectedCheck: false,
      hasTypeInfo: false,
      typeIdBefore: 0
    }
  },
  watch: {
    selectedTypeId (newId, oldId) {
      if (!newId) {
        this.selectedTypeId = undefined
      }
      if (newId) {
        this.getTypeAttrList(this.selectedTypeId)
      }
    },
    'typeForm.goods_attribute' () {
      // this.autoSave()
      // console.log('已保存')
    },
    attrList () {
      this.initInputObj()
      this.initCheckObj() // checkObj 这边有问题
      this.initRadioObj()
      // 切换类型下拉框 如果切换到和之前服务器保留的一样的 那么就将服务器的数据初始化一下本地表单
      if (this.typeIdBefore === this.selectedTypeId && this.hasTypeInfo) {
        this.setSelectedObj(this.attrListBefore)
      }
    }
  },
  methods: {
    autoSave () {
      let data = {}
      data.goods_attribute = JSON.stringify(this.typeForm.goods_attribute)
      // data.goods_attribute = this.typeForm.goods_attribute
      this.$emit('saveSettings', data)
    },
    saveSettings () {
      this.autoSave()
      this.$message({
        type: 'success',
        message: '信息已保存'
      })
    },
    test () {
      console.log(this.typeForm.goods_attribute)
    },
    addValueToList (obj) {
      let list = this.typeForm.goods_attribute.slice()
      // console.log('即将操作的数组', list.slice())
      Object.keys(obj).forEach(key => {
        for (let i = 0; i < list.length; i++) {
          if (parseInt(list[i].attr_value_id) === parseInt(key)) {
            list.splice(i, 1)
            i = i - 1
          }
        }
        if (typeof (obj[key]) !== 'object') {
          let listItem = {}
          listItem.attr_value_id = key
          this.attrList.forEach(item => {
            if (parseInt(key) === parseInt(item.attr_value_id)) {
              listItem.attr_value = item.attr_value_name
            }
          })
          listItem.attr_value_name = obj[key]
          listItem.goods_id = this.goodsId
          listItem.goods_attribute_id = this.selectedTypeId
          list.push(listItem)
        } else {
          obj[key].forEach(el => {
            let listItem = {}
            listItem.attr_value_id = key
            this.attrList.forEach(item => {
              if (parseInt(key) === parseInt(item.attr_value_id)) {
                listItem.attr_value = item.attr_value_name
              }
            })
            listItem.attr_value_name = el
            listItem.goods_id = this.goodsId
            listItem.goods_attribute_id = this.selectedTypeId
            list.push(listItem)
          })
        }
      })
      this.$set(this.typeForm, 'goods_attribute', list)
    },
    deleteFormArray (item) {
    },
    selectType (isOpen) {
      if (isOpen && !this.typeList.length) {
        this.getTypeList()
      }
    },
    getTypeList () {
      getGoodsTypeList()
        .then(res => {
          // console.log(res)
          this.typeList = res.data.data.AttriButeList
        })
        .catch(err => console.log(err))
    },
    getTypeAttrList (id) {
      getGoodsType(id)
        .then(res => {
          console.log('属性列表', res.data.data.attribute_detail.value_list)
          // this.typeList = res.data.data.AttriButeList
          this.attrList = res.data.data.attribute_detail.value_list
          !this.hasSelectedCheck && this.initCheckObj() // 这步会影响到 ‘上一步’
          !this.hasSelectedInput && this.initInputObj()
          this.inputObjChange()
        })
        .catch(err => console.log(err))
    },
    transStrToArray (str) {
      // console.log(str.split('\n'))
      return str.split('\n')
    },
    setCurrentInputId (id) {
      console.log(id)
      this.currentInputId = id
    },
    initInputObj () {
      this.inputObj = {}
      this.attrList.forEach(item => {
        if (item.type === 1) {
          this.$set(this.inputObj, item.attr_value_id, item.value)
        }
      })
      this.addValueToList(this.inputObj)
      // console.log('初始化的inputObj', this.inputObj)
      // console.log('初始化的提交数组', this.typeForm.goods_attribute)
    },
    initRadioObj () {
      this.radioObj = {}
    },
    initCheckObj () {
      this.checkObj = {}
      this.attrList.forEach(item => {
        if (item.type === 3) {
          // obj[item.attr_value_id] = this.transStrToArray(item.value)
          this.$set(this.checkObj, item.attr_value_id, [])
        }
      })
    },
    inputObjChange () {
      console.log(this.inputObj)
      this.addValueToList(this.inputObj)
    },
    radioObjChange () {
      console.log(this.radioObj)
      this.addValueToList(this.radioObj)
    },
    checkObjChange () {
      // console.log('checkObj', this.checkObj)
      // console.log('checkObj改变前的goods_attribute', this.typeForm.goods_attribute)
      this.addValueToList(this.checkObj)
      // console.log('checkObj后的goods_attribute', this.typeForm.goods_attribute)
    },
    setSelectedObj (list) {
      // console.log('进入了设置 表单', list)
      list.forEach(item => {
        if (item.type === 1) {
          this.hasSelectedInput = true
          this.inputObj[item.attr_value_id] = item.attr_value_name
          this.$set(this.inputObj, item.attr_value_id, item.attr_value_name)
          // console.log('进入了--inputObj', this.inputObj)
          this.addValueToList(this.inputObj)
        } else if (item.type === 2) {
          this.$set(this.radioObj, item.attr_value_id, item.attr_value_name)
          // console.log('radioObj', this.radioObj)
          this.addValueToList(this.radioObj)
        } else if (item.type === 3) {
          this.hasSelectedCheck = true // 这行代码很重要？好像是 下面注释的那行
          let arr = this.checkObj[item.attr_value_id] || []
          arr = arr.slice()
          arr.push(item.attr_value_name)
          this.checkObj[item.attr_value_id] = arr
          this.$set(this.checkObj, item.attr_value_id, arr)
          this.checkObj = deepClone(this.checkObj) // 这行才是最重要的
          this.addValueToList(this.radioObj)
        }
      })
      console.log('表单初始设置完毕之后 attributelist=', this.typeForm.goods_attribute)
    },
    filterAttrList (list) {
      let newList = list.slice()
      let arr = []
      newList.forEach(item => {
        item.goods_attribute_id = this.selectedTypeId
        arr.push(item)
      })
      return arr
    },
    pullGoodsTypeInfo () {
      this.hasTypeInfo = false
      if (this.goodsId === 0) return
      !this.selectedTypeId && this.getTypeList()
      getGoodsTypeInfo(this.goodsId)
        .then(res => {
          console.log('返回之前上传的属性列表', res.data.data.GoodsAttribute.GoodsAttribute)
          if (res.data.data.GoodsAttribute.GoodsAttribute.length === 0) {
            this.$emit('firstCommit', true)
          } else {
            this.$emit('firstCommit', false)
            this.selectedTypeId = res.data.data.GoodsAttribute.Attribute_id
            this.typeIdBefore = res.data.data.GoodsAttribute.Attribute_id
            this.hasTypeInfo = true
            // this.setSelectedObj(res.data.data.GoodsAttribute.GoodsAttribute) // 这句代码和下一句代码顺序不能换 ?
            this.typeForm.goods_attribute = this.filterAttrList(res.data.data.GoodsAttribute.GoodsAttribute)
            this.attrListBefore = this.filterAttrList(res.data.data.GoodsAttribute.GoodsAttribute)
            console.log('现在的属性值列表', this.typeForm.goods_attribute)
          }
        })
        .catch(err => console.log(err))
    },
    ...mapActions({
      setPublishStep: 'app/setPublishStep'
    })
  },
  created () {
    // console.log('收到商品ID', this.goodsId)
    this.setPublishStep(2)
  },
  mounted () {
    this.pullGoodsTypeInfo()
    // console.log(this.checkObj)
    console.log('mounted', this.typeForm.goods_attribute)
  }
}
</script>

<style scoped lang="stylus">
.goods-set
  width 100%
  margin 60px 0 140px 0

  .title
    font-size 14px
    color #666
    margin-left 40px
    margin-bottom 20px

  .foot-buttons
    margin-left 80px
    margin-top 40px
</style>
