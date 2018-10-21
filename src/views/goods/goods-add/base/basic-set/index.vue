<template>
  <div class="basic-set">
    <el-form class="goods-commit-form" ref="form" :model="goodsForm" label-width="90px" size="mini">
      <div class="title-container">
        <h3>基础信息</h3>
      </div>
      <el-form-item label="商品名称" required>
        <el-input v-model="goodsForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" required>
        <el-cascader :options="categoryList" v-model="selectedCategory" expand-trigger="hover" @focus="getCategoryList"></el-cascader>
      </el-form-item>
      <el-form-item label="商品品牌">
        <el-select v-model="goodsForm.brand_id" placeholder="请选择商品品牌" @visible-change="selectBrand">
          <el-option v-for="(item,index) in brandList" :key="index" :label="item.brand_name" :value="item.brand_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品标签">
        <el-select v-model="goodsForm.label_id" placeholder="请选择商品标签" @visible-change="selectLabel">
          <el-option v-for="(item,index) in labelList" :key="index" :label="item.label_name" :value="item.label_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="基础销量">
        <el-input v-model="goodsForm.sales" style="max-width:173px" type="number"></el-input>
        <span>件</span>
      </el-form-item>
      <el-form-item label="基础点击数">
        <el-input v-model="goodsForm.clicks" style="max-width:173px" type="number"></el-input>
        <span>次</span>
      </el-form-item>
      <el-form-item label="基础分享数">
        <el-input v-model="goodsForm.shares" style="max-width:173px" type="number"></el-input>
        <span>次</span>
      </el-form-item>
      <el-form-item label="商品编码" required>
        <el-input v-model="goodsForm.code" style="max-width:173px"></el-input>
      </el-form-item>
      <el-form-item label="生产日期">
        <!-- <el-input v-model=" goodsForm.production_date " style="max-width:173px "></el-input> -->
        <el-date-picker v-model="goodsForm.production_date" type="date" value-format="timestamp" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="保质期">
        <el-input-number v-model="goodsForm.shelf_life" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="库存" required>
        <el-input-number v-model="goodsForm.stock" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="库存预警">
        <el-input-number v-model="goodsForm.min_stock_alarm" controls-position="right" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="显示库存" required>
        <el-radio-group v-model="goodsForm.display_stock" size="medium">
          <el-radio border :label="1">是</el-radio>
          <el-radio border :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="物流信息" required>
        <el-radio-group v-model="goodsForm.shipping_fee" size="medium">
          <el-radio border :label="0">包邮</el-radio>
          <el-radio border :label="1">需要运费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计价方式" required v-if="isExpressFeeRequired">
        <el-radio-group v-model="goodsForm.valuation" size="medium">
          <el-radio border :label="0">计件</el-radio>
          <el-radio border :label="1">体积</el-radio>
          <el-radio border :label="2">重量</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品重量" required v-if="isExpressFeeRequired">
        <el-input-number v-model="goodsForm.weight" style="max-width:173px" controls-position="right"></el-input-number>
        <span class="unit">千克</span>
      </el-form-item>
      <el-form-item label="商品体积" required v-if="isExpressFeeRequired">
        <el-input-number v-model="goodsForm.volume" style="max-width:173px" controls-position="right"></el-input-number>
        <span class="unit">立方米</span>
      </el-form-item>
      <el-form-item label="物流公司" v-if="isExpressFeeRequired">
        <el-select v-model="goodsForm.logistics" placeholder="请选择物流公司">
          <el-option v-for="(item,index) in logisticsCompanyList" :key="index" :label="item.company_name" :value="item.logistics_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="几件起卖">
        <el-input-number v-model="goodsForm.least" style="max-width:173px" :min="1" controls-position="right"></el-input-number>
        <span class="unit">件</span>
      </el-form-item>
      <el-form-item label="是否上架" required>
        <el-radio-group v-model="goodsForm.state" size="medium">
          <el-radio border :label="1">立即上架</el-radio>
          <el-radio border :label="0">放入仓库</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产地">
        <el-select v-model="goodsForm.province_id" placeholder="请选择省份" @visible-change="selectProvince" @change="setProvinceId">
          <el-option v-for="(item,index) in provinceList" :key="index" :label="item.province_name" :value="item.province_id"></el-option>
        </el-select>
        <el-select v-model="goodsForm.city_id" placeholder="请选择商品城市" @visible-change="selectCity">
          <el-option v-for="(item,index) in cityList" :key="index" :label="item.city_name" :value="item.city_id"></el-option>
        </el-select>
      </el-form-item>
      <div class="title-container">
        <h3>价格信息</h3>
      </div>
      <el-form-item label="市场价格">
        <el-input v-model="goodsForm.market_price" style="max-width:173px" type="number"></el-input>
        <span>元</span>
      </el-form-item>
      <el-form-item label="售价">
        <el-input v-model="goodsForm.price" style="max-width:173px" type="number"></el-input>
        <span>元</span>
      </el-form-item>
      <el-form-item label="成本">
        <el-input v-model="goodsForm.cost_price" style="max-width:173px" type="number"></el-input>
        <span>元</span>
      </el-form-item>
      <div class="title-container">
        <h3>积分设置</h3>
      </div>
      <el-form-item label="赠送积分">
        <el-input v-model="goodsForm.give_point" style="max-width:173px" type="number"></el-input>
      </el-form-item>
    </el-form>
    <div class="foot-buttons">
      <el-button type="primary" @click="saveSettings">保存</el-button>
      <el-button>清空</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getBrandList, getGoodsLabelList, getGoodsCategoryList, getGoodsBasicInfo} from '@/api/goods'
import {getProvinceList, getCityList} from '@/api/common'
import {cascaderFormatSort, deepClone} from '@/utils'
import { mapActions } from 'vuex'
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    goodsId: 0
  },
  data () {
    return {
      goodsForm: {
        least: 1
      },
      brandList: [],
      labelList: [],
      categoryList: [],
      selectedCategory: [],
      dialogImageUrl: '',
      dialogVisible: false,
      goodsType: '',
      provinceList: [],
      cityList: [],
      provinceId: -1,
      cateHttpFlag: false,
      logisticsCompanyList: [{
        logistics_id: 1,
        company_name: '德邦物流'
      }, {
        logistics_id: 2,
        company_name: '顺丰快递'
      }, {
        logistics_id: 3,
        company_name: '日日顺物流'
      }, {
        logistics_id: 4,
        company_name: '圆通快递'
      }, {
        logistics_id: 5,
        company_name: '中通物流'
      }, {
        logistics_id: 6,
        company_name: '汇通快递'
      }],
      isExpressFeeRequired: false,
      least: 1
    }
  },
  watch: {
    provinceId () {
      this.setCityList()
      this.$set(this.goodsForm, 'city_id', '请重新选择')
    },
    selectedCategory (newList) {
      for (let i = 0; i < newList.length; i++) {
        let key = 'category_id_' + (i + 1)
        let value = newList[i]
        this.$set(this.goodsForm, key, value)
      }
    },
    goodsForm () {
      this.autoSave()
    },
    // 设置为 undefined ,可以避免后端传回   0 的时候 下拉框那边显示0
    'goodsForm.brand_id' (newId, oldId) {
      if (newId === 0) {
        this.$set(this.goodsForm, 'brand_id', undefined)
      }
    },
    'goodsForm.label_id' (newId, oldId) {
      if (newId === 0) {
        this.$set(this.goodsForm, 'label_id', undefined)
      }
    },
    'goodsForm.province_id' (newId, oldId) {
      if (newId === 0) {
        this.$set(this.goodsForm, 'province_id', undefined)
      }
    },
    'goodsForm.city_id' (newId, oldId) {
      if (newId === 0) {
        this.$set(this.goodsForm, 'city_id', undefined)
      }
    },
    'goodsForm.shipping_fee' (newValue, oldValue) {
      if (newValue === 1) {
        this.isExpressFeeRequired = true
      } else {
        this.isExpressFeeRequired = false
      }
    }
  },
  methods: {
    autoSave () {
      this.$emit('saveSettings', this.goodsForm)
    },
    saveSettings () {
      this.$emit('saveSettings', this.goodsForm)
      this.$message({
        type: 'success',
        message: '信息已保存'
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleTabClick () {
      console.log('tabClick')
    },
    initProduceDate () {
      if (!this.goodsForm.production_date) {
        this.goodsForm.production_date = new Date().getTime()
      }
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
    selectBrand (isOpen) {
      if (isOpen && !this.brandList.length) {
        getBrandList()
          .then(res => {
            this.brandList = res.data.data.GoodsBrand
          })
          .catch(err => console.log(err))
      }
    },
    selectLabel (isOpen) {
      if (isOpen && !this.labelList.length) {
        getGoodsLabelList()
          .then(res => {
            this.labelList = res.data.data.labelList
          })
          .catch(err => console.log(err))
      }
    },
    setProvinceId (id) {
      this.provinceId = id
    },
    selectProvince (isOpen) {
      if (!isOpen || this.provinceList.length !== 0) {
        return
      }
      getProvinceList()
        .then(res => {
          this.provinceList = res.data.data.provinceList
          console.log(res)
        })
        .catch(err => console.log(err))
    },
    selectCity (isOpen) {
      if (!isOpen || this.cityList.length !== 0) {
        return
      }
      this.setCityList()
    },
    setCityList () {
      getCityList(this.provinceId)
        .then(res => {
          this.cityList = res.data.data.cityList
          console.log(res)
        })
        .catch(err => console.log(err))
    },
    pullAllDropDownList (provinceId) {
      // 获取省份列表
      getProvinceList()
        .then(res => {
          this.provinceList = res.data.data.provinceList
          // console.log(res)
        })
        .catch(err => console.log(err))
      // 获取城市列表
      getCityList(provinceId)
        .then(res => {
          this.cityList = res.data.data.cityList
          // console.log(res)
        })
        .catch(err => console.log(err))
      // 获取品牌列表
      getBrandList()
        .then(res => {
          this.brandList = res.data.data.GoodsBrand
        })
        .catch(err => console.log(err))
      // 获取标签列表
      getGoodsLabelList()
        .then(res => {
          this.labelList = res.data.data.labelList
        })
        .catch(err => console.log(err))
      // 获取分类列表
      getGoodsCategoryList()
        .then(res => {
          let arr = []
          cascaderFormatSort(res.data.data.goodsCateList.cate, arr)
          this.categoryList = arr
          //  请求节流
          this.cateHttpFlag = true
          // console.log('分类', this.categoryList)
        })
        .catch(err => console.log(err))
    },
    pullBasicInfo () {
      console.log('进入了 pull-basic-info', this.goodsId)
      if (this.goodsId === 0) return
      getGoodsBasicInfo(this.goodsId)
        .then(res => {
          // console.log(res)
          if (res.data.status === 1) {
            console.log('返回基本信息成功', res)
            this.$emit('firstCommit', false)
          } else {
            this.$emit('firstCommit', true) // 这个逻辑可能有问题
          }
          this.goodsForm = deepClone(res.data.data.GoodsInfo)
          this.pullAllDropDownList(res.data.data.GoodsInfo.province_id)
          let cateIdArr = []
          cateIdArr.push(res.data.data.GoodsInfo.category_id_1)
          cateIdArr.push(res.data.data.GoodsInfo.category_id_2)
          cateIdArr.push(res.data.data.GoodsInfo.category_id_3)
          this.selectedCategory = cateIdArr
        })
        .catch(err => console.log(err))
    },
    ...mapActions({
      setPublishStep: 'app/setPublishStep'
    })
  },
  created () {
    this.goodsForm = this.data
    this.initProduceDate()
    this.setPublishStep(1)
  },
  mounted () {
    this.pullBasicInfo()
  }
}
</script>

<style scoped lang="stylus">
.basic-set
  margin 80px 0 100px 0

  .foot-buttons
    margin 34px

  .unit
    display inline-block
    height 28px
    color #686868
</style>
