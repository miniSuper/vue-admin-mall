<template>
  <div class="goods-model-set">
    <div class="buttons">
      <el-button size="mini" @click="editModel">编辑规格</el-button>
      <el-button size="mini" @click="clearModel">清空规格</el-button>
    </div>
    <el-dialog title="选择规格" :visible.sync="dialogShow" :append-to-body="true" :center="true">
      <div class="left">
        <p style="text-align:center;padding:6px 0;font-size:14px;color:#888;font-weight:200;">选择规格(可多选)</p>
        <div class="list">
          <div class="list-inner">
            <div class="list-item" :class="{active: model.selected}" v-for="model in modelList" :key="model.spec_id" @click="selectModel(model)">
              {{model.spec_name}}
            </div>
          </div>
        </div>
        <p style="text-align:center;padding:6px 0;font-size:14px;color:#888;font-weight:200;">已选规格</p>
        <div class="selected-list">
          <div class="list-inner">
            <div class="list-item" v-for="model in selectedModelList" :key="model.spec_id" @click="selectModel(model)">
              {{model.spec_name}}
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="value-list clearfix">
          <span class="value-list-item" :class="{active: item.selected}" v-for="item in currentValueList" :key="item.spec_value_id" @click="selectValue(item)">
            {{item.spec_value_name}}
          </span>
        </div>
        <div class="display-list">
          <el-table :data="selectedValueList">
            <el-table-column prop="spec_value_name" label="属性名称">
              <template slot-scope="scope">
                <span>{{scope.row.spec_value_name}}</span>
                <!-- <span class="edit-name">编辑</span> -->
              </template>
            </el-table-column>
            <el-table-column label="颜色">
              <template slot-scope="scope">
                <el-color-picker v-model="colorsObj[scope.row.spec_value_id]" show-alpha></el-color-picker>
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="scope">
                <el-upload class="avatar-uploader" :action="imgUploadUrl" :on-success="handleAvatarSuccess" :show-file-list="false" @click.native="setImageId(scope.row.spec_value_id)">
                  <img v-if="imagesObj[scope.row.spec_value_id]" :src="imagesObj[scope.row.spec_value_id]" class="avatar" style="width:30px;height:30px">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" size="mini" @click="setMixList">生成</el-button>
        <el-button size="mini" @click="dialogShow = false">取消</el-button>
      </div>
    </el-dialog>
    <el-table :data="mixList" v-if="mixList.length !== 0">
      <el-table-column prop="sku_name" label="规格名字" fixed width="200">
      </el-table-column>
      <el-table-column label="销售价格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="推广价格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.promote_price"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="市场价格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.market_price"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="成本价格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.cost_price"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存">
        <template slot-scope="scope">
          <el-input v-model="scope.row.stock"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="商家编码" fixed="right">
        <template slot-scope="scope">
          <el-input v-model="scope.row.code"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="foot-buttons" v-if="mixList.length">
      <el-button type="primary" @click="saveSettings">保存</el-button>
      <!-- <el-button>清空</el-button> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {MessageBox} from 'element-ui'
import {getModelList, getGoodsSkuInfo} from '@/api/goods'
import {deepClone} from '@/utils'
import {baseUrl, uploadUrl} from '@/config'
export default {
  props: {
    data: {},
    goodsId: 0
  },
  data () {
    return {
      modelList: [], // 全部规格的列表
      selectedModelList: [], // 选中的规格的列表
      currentValueList: [], // 当前规格值的列表，临时变量，注意是 当前 这个词
      selectedValueList: [], // 选中的 规格值 的列表
      selectedModelIds: [], // 选中的 规格 的 ID 集合
      dialogShow: false,
      currentModel: {},
      mixList: [],
      imagesObj: {},
      colorsObj: {},
      activeImageId: 0,
      skuModelInfoList: [], // 用来保存 sku 中除了价格之外的信息
      sku_media: [] // 用来保存单个规格值 的图片 和 颜色信息
    }
  },
  computed: {
    imgUploadUrl () {
      return baseUrl + uploadUrl
    }
  },
  watch: {
    selectedValueList () {
      // console.log(this.selectedValueList)
      this.selectedModelList.forEach((model, index) => {
        let modelHasValue = false
        this.selectedValueList.forEach(value => {
          if (model.spec_id === value.spec_id) {
            modelHasValue = true
          }
        })
        !modelHasValue && this.removeModelFromSelectedModelList(model)
      })
    },
    selectedModelList () {
      this.modelList.forEach((model, index) => {
        let isSelected = false
        this.selectedModelList.forEach(item => {
          if (model.spec_id === item.spec_id) {
            this.$set(model, 'selected', true)
            isSelected = true
          }
        })
        !isSelected && this.$set(model, 'selected', false)
      })
    },
    mixList: {
      handler: function (newValue, oldValue) {
        // this.saveSettings()
      },
      deep: true
    },
    currentModel (newModel, oldModel) {
      console.log('newCurrentModel', newModel)
      this.currentValueList = newModel.spec_value_list.slice()
      this.currentValueList.forEach(value => {
        this.selectedValueList.forEach(item => {
          if (item.spec_value_id === value.spec_value_id) {
            this.$set(value, 'selected', true)
          }
        })
      })
    }
  },
  methods: {
    saveSettings () {
      // let modelForm = {goods_sku: this.mixList, goods_spec: this.skuModelInfoList, sku_media: this.sku_media}
      // this.$emit('saveSettings', JSON.stringify(modelForm))
      let modelForm = {goods_sku: JSON.stringify(this.mixList), goods_spec: JSON.stringify(this.skuModelInfoList), sku_media: JSON.stringify(this.sku_media)}
      this.$emit('saveSettings', modelForm)
      this.$message({
        type: 'success',
        message: '信息已保存'
      })
    },
    getModelList () {
      getModelList()
        .then(res => {
          // console.log(res)
          this.modelList = res.data.data.GoodsSpeList.slice()
        })
        .catch(err => console.log(err))
    },
    editModel () {
      this.dialogShow = true
    },
    clearModel () {
      MessageBox.confirm('确定清空规格列表吗', '清空提示', {
        confirmButtonText: '清空',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.mixList = []
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '清空操作已终止'
        })
      })
    },
    selectModel (model) {
      // this.currentValueList = model.spec_value_list.slice()
      this.currentModel = model
    },
    selectValue (value) {
      // console.log(value)
      // this.selectedValueList.push(value)
      this.$set(value, 'selected', !value.selected)
      if (value.selected) {
        this.$set(value, 'selected', true)
      }
      this.addModelToSelectedList(this.currentModel)
      !value.selected && this.removeValueFromValueList(value)
      value.selected && this.addValueToValueList(value)
    },
    setSkuMedia () {
      this.selectedValueList.forEach(item => {
        let skuMediaItem = {}
        skuMediaItem.spec_id = item.spec_id
        skuMediaItem.spec_value_id = item.spec_value_id
        skuMediaItem.goods_id = this.goodsId
        skuMediaItem.sku_img = this.imagesObj[item.spec_value_id] || ''
        skuMediaItem.sku_color = this.colorsObj[item.spec_value_id] || ''
        this.sku_media.push(skuMediaItem)
      })
      console.log('sku图片-颜色-列表', this.sku_media)
    },
    setMixList () {
      // console.log('选中的规格', this.selectedModelList)
      console.log('选中的规格值', this.selectedValueList)
      this.setSkuMedia()
      this.dialogShow = false
      let mixList = []
      let sortValueArray = [] // 将值根据不同的规格ID分成不同数组 [[1,2,3],[a,b,c],[红，黄，蓝]]
      // let mixValueArray = [] // 将规格值 两两混合  如  [1,a,红] [1,a,黄] [2,b,红] [2,b,黄]
      this.selectedModelList.forEach((model, index) => {
        sortValueArray[index] = []
        this.selectedValueList.forEach(value => {
          if (model.spec_id === value.spec_id) {
            sortValueArray[index].push(value)
          }
        })
      })
      // console.log(sortValueArray)
      let matrix = [] // 矩阵数组
      // [[{S},{M},{L},{XL}]]  ->  [[{s}],[{M}],[{L}],[{Xl}]]
      if (sortValueArray.length === 1) {
        sortValueArray[0].forEach(item => {
          let arr = []
          arr.push(item)
          // mixValueArray = arr
          matrix.push(arr)
        })
        // return mixValueArray
      } else if (sortValueArray.length >= 2) {
        matrix = this.matrixTwo(sortValueArray[0], sortValueArray[1])
        for (let i = 2; i < sortValueArray.length; i++) {
          matrix = this.matrixTwo(matrix, sortValueArray[i])
        }
      }
      // console.log('matrix', matrix)
      matrix.forEach(array => {
        let nameStr = ''
        /* eslint-disable camelcase */
        // let spec_value_id_array = []
        // 后台要的字段名
        let attr_value_items = ''
        array.forEach(value => {
          let skuModelInfoItem = {}
          nameStr += this.getModelName(value.spec_id) + ':' + value.spec_value_name + ','
          // spec_value_id_array.push(value.spec_value_id)
          attr_value_items += value.spec_id + ':' + value.spec_value_id + ';'

          skuModelInfoItem.goods_id = this.goodsId
          skuModelInfoItem.spec_id = value.spec_id
          skuModelInfoItem.spec_value_id = value.spec_value_id
          skuModelInfoItem.spec_value_name = value.spec_value_name
          skuModelInfoItem.spec_name = this.getModelName(value.spec_id)
          this.skuModelInfoList.push(skuModelInfoItem)
        })
        mixList.push({
          goods_id: this.goodsId,
          sku_name: nameStr,
          // spec_value_id_array: spec_value_id_array,
          attr_value_items: attr_value_items,
          attr_value_items_format: attr_value_items,
          price: this.data.price,
          cost_price: this.data.cost_price,
          market_price: this.data.market_price,
          promote_price: this.promote_price,
          stock: this.data.stock,
          code: this.data.code
        })
      })
      console.log('mixList', mixList)
      this.mixList = mixList
    },
    setImageId (id) {
      this.activeImageId = id
    },
    matrixTwo (arr1, arr2) {
      if (arr2.length === 0) {
        return arr1
      }
      let result = []
      let max = arr1.length >= arr2.length ? arr1 : arr2
      let min = arr1.length < arr2.length ? arr1 : arr2
      max.forEach((item, i) => {
        min.forEach((element, j) => {
          let arr = []
          if (item.length && item.length >= 2) {
            arr = item.slice()
            arr.push(element)
          } else {
            arr = [item, element]
          }
          result.push(arr)
        })
      })
      // console.log('result', result)
      return result
    },
    addModelToSelectedList (model) {
      let hasModel = false
      this.selectedModelList.forEach(item => {
        if (item.spec_id === model.spec_id) {
          hasModel = true
        }
      })
      !hasModel && this.selectedModelList.push(model)
    },
    addValueToValueList (value) {
      let hasValue = false
      this.selectedValueList.forEach(item => {
        if (item.spec_value_id === value.spec_value_id) {
          hasValue = true
        }
      })
      !hasValue && this.selectedValueList.push(value)
    },
    removeValueFromValueList (value) {
      this.selectedValueList.forEach((item, index) => {
        if (item.spec_value_id === value.spec_value_id) {
          this.selectedValueList.splice(index, 1)
        }
      })
    },
    removeModelFromSelectedModelList (model) {
      this.selectedModelList.forEach((item, index) => {
        if (item.spec_id === model.spec_id) {
          this.selectedModelList.splice(index, 1)
        }
      })
    },
    getModelName (id) {
      let name = ''
      this.modelList.forEach(model => {
        if (model.spec_id === id) {
          name = model.spec_name
        }
      })
      return name
    },
    transStrArrToNumArr (arr) {
      let newArr = []
      arr.forEach(item => {
        newArr.push(parseInt(item))
      })
      return newArr
    },
    setSelectedValueList (list) {
      this.selectedValueList = list
      list.forEach(item => {
        this.imagesObj[item.spec_value_id] = item.pic_path
        this.colorsObj[item.spec_value_id] = item.sku_color
      })
    },
    setSelectedModelList (idArr) {
      let currentModel
      idArr.forEach(id => {
        this.modelList.forEach(model => {
          if (model.spec_id === id) {
            // this.addModelToSelectedList(model)
            this.$nextTick(() => {
              this.selectedModelList.push(model)
            })
            currentModel = model
          }
        })
      })
      this.currentModel = currentModel
      console.log('选中的规格ids', this.selectedModelIds)
      // this.selectedModelList = this.selectedModelList.slice()
    },
    pullGoodsSku () {
      if (this.goodsId === 0) return
      getGoodsSkuInfo(this.goodsId)
        .then(res => {
          console.log(res)
          if (res.data.data.GoodsSku.length) {
            this.$emit('firstCommit', false)
            this.mixList = res.data.data.GoodsSku
            this.selectedModelIds = this.transStrArrToNumArr(res.data.data.SpecId)
            this.setSelectedModelList(this.selectedModelIds)
            this.setSelectedValueList(res.data.data.SpecValueList)
          } else {
            this.$emit('firstCommit', true)
          }
        })
        .catch(err => console.log(err))
    },
    handleAvatarSuccess (res, file) {
      this.imagesObj[this.activeImageId] = URL.createObjectURL(file.raw)
      // 为了让页面刷新
      this.imagesObj = deepClone(this.imagesObj)
    }
  },
  created () {
    this.getModelList()
    this.mixList = this.data.mixList || []
  },
  activated () {
    this.getModelList()
    this.mixList = this.data.mixList || []
  },
  mounted () {
    this.pullGoodsSku()
  }
}
</script>

<style scoped lang="stylus">
@import '~@/styles/mixins'

.goods-model-set
  margin 40px 0 140px 0

  .buttons
    margin 60px 0 0 20px

  .foot-buttons
    margin 30px 0

  >>>.el-table
    margin-top 40px

>>>.el-dialog
  width 800px

  .el-dialog__body
    flex-row(space-between)
    align-items flex-start
    height 350px

    .left
      width 30%

      .list, .selected-list
        height 140px
        overflow scroll
        padding 10px
        border 1px solid #ccc

      .selected-list
        .list-item
          color #409eff
          border-color #409eff

      .list-item
        position relative
        height 24px
        line-height 24px
        font-size 14px
        padding-left 14px
        border 1px solid #ccc
        margin 4px 0

        &:hover
          color #409eff
          border 1px solid #409eff

        &.active
          color #409eff
          border-color #409eff

          &::before
            position absolute
            content ''
            display block
            width 14px
            height 14px
            right 0
            bottom 0
            background-image url('/static/checked.png')
            background-size cover

    .right
      width 70%

      .value-list
        overflow hidden
        margin 20px 0 0 20px
        height 170px
        border 1px solid #ccc

        .value-list-item
          position relative
          padding 6px 10px
          border 1px solid #ccc
          margin 8px
          float left

          &:hover
            color #409eff
            border 1px solid #409eff

          &.active
            color #409eff
            border-color #409eff

            &::before
              position absolute
              content ''
              display block
              width 14px
              height 14px
              right 0
              bottom 0
              background-image url('/static/checked.png')
              background-size cover

      .display-list
        overflow scroll
        border 1px solid #cccccc
        margin 20px 0 0 20px
        height 162px
        padding 0 20px

        .el-table
          .edit-name
            float right
            margin-right 14px
            font-size 12px
            color #409eff
</style>
