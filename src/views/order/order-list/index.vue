<template>
  <div class="order-list">
    <el-tabs v-model="activeName" @tab-click="setOrderStatus">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="待付款" name="notPaid"></el-tab-pane>
      <el-tab-pane label="待发货" name="notDelivered"></el-tab-pane>
      <el-tab-pane label="已发货" name="delivering"></el-tab-pane>
      <el-tab-pane label="已收货" name="received"></el-tab-pane>
      <el-tab-pane label="已完成" name="finished"></el-tab-pane>
      <el-tab-pane label="已关闭" name="closed"></el-tab-pane>
      <el-tab-pane label="退款中" name="refunding"></el-tab-pane>
    </el-tabs>
    <div class="conditions clearfix">
      <div class="conditions-inner clearfix">
        <span class="join-time"> 下单时间 </span>
        <el-date-picker value-format="timestamp" v-model="conditions.timeRange" type="daterange" unlink-panels :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center">
        </el-date-picker>
        <el-input placeholder="订单编号 姓名 或 手机号" v-model="conditions.keyWord" style="max-width:173px"></el-input>
        <el-button class="search-btn" type="primary" @click.native="onSearch">搜索</el-button>
      </div>
    </div>
    <el-table :data="orderList" :default-sort="{prop: 'goodsId', order: 'descending'}">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="order_id" label="订单ID" fixed>
      </el-table-column>

      <el-table-column label="商品信息" min-width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="goods-info" v-for="goods in scope.row.goodsList" :key="goods.order_goods_id">
            <div class="left">
              <img :src="getPicUrl(goods.goods_picture)" width="60" height="60" />
            </div>
            <div class="right">
              <p>{{goods.goods_name}}</p>
              <p>单价：¥{{goods.goods_price}}</p>
              <p>数量：{{goods.num}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="pay_money" min-width="100" label="总金额" sortable>
      </el-table-column>
      <el-table-column min-width="300" label="收货信息">
        <template slot-scope="scope">
          <p>{{scope.row.receiver_name}}</p>
          <p>{{scope.row.receiver_mobile}}</p>
          <p v-html="scope.row.receiver_address"></p>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="订单留言">
        <template slot-scope="scope">
          <p style="color:  ">{{scope.row.message}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template slot-scope="scope">
          <span v-text="translateStatus(scope.row.order_status)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="memo" label="备注" width="140" fixed="right">
        <template slot-scope="scope">
          <p>
            <span v-if="scope.row.message">
              留言
            </span>
            <span style="color: #68c23a">{{scope.row.message}}</span>
          </p>
          <p>
            <span v-if="scope.row.memo">
              备注
            </span>
            <span style="color: #f59c6c">{{scope.row.memo}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="128">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="checkOrderDetail(scope.$index, scope.row)">订单详情</el-button>
          <el-button size="mini" type="text" @click="addComments(scope.$index, scope.row)">备注</el-button>

          <div v-if="scope.row.order_status === 0">
            <!-- <el-button size="mini" type="text" @click="editPrice(scope.$index, scope.row)">修改价格</el-button> -->
            <el-button size="mini" type="text" @click="editAddress(scope.$index, scope.row)">修改地址</el-button>
          </div>
          <div v-if="scope.row.order_status === 1">
            <el-button size="mini" type="text" @click="editAddress(scope.$index, scope.row)">修改地址</el-button>
            <el-button size="mini" type="text" @click="deliverGoods(scope.$index, scope.row)" style="color:#67c23a">发货</el-button>
          </div>
          <div v-if="scope.row.order_status === 2">
            <el-button size="mini" type="text" @click="checkExpress(scope.$index, scope.row)">查看物流</el-button>
          </div>
          <div v-if="scope.row.order_status === 3">
            <el-button size="mini" type="text" @click="checkExpress(scope.$index, scope.row)">查看物流</el-button>
          </div>
          <div v-if="scope.row.order_status === 4">
            <el-button size="mini" type="text" @click="checkExpress(scope.$index, scope.row)">查看物流</el-button>
          </div>
          <div v-if="scope.row.order_status === 5">
            <el-button size="mini" type="text" @click="deleteOneOrder(scope.$index, scope.row)" style="color:#f56c6c">删除订单</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
    <el-dialog title="地址修改" :visible.sync="addressFormShow" :append-to-body="true" :center="true">
      <el-form :model="addressForm" label-width="100px">
        <el-form-item label="收货人" required>
          <el-input v-model="addressForm.receiver_name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="addressForm.receiver_mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮编">
          <el-input v-model="addressForm.receiver_zip"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-select v-model="addressForm.receiver_province" placeholder="请选择省份" @visible-change="selectProvince" @change="setProvinceId">
            <el-option v-for="(item,index) in provinceList" :key="index" :label="item.province_name" :value="item.province_id.toString()"></el-option>
          </el-select>
          <el-select v-model="addressForm.receiver_city" placeholder="请选择城市" @visible-change="selectCity" @change="setCityId">
            <el-option v-for="(item,index) in cityList" :key="index" :label="item.city_name" :value="item.city_id.toString()"></el-option>
          </el-select>
          <el-select v-model="addressForm.receiver_district" placeholder="请选择 区/县" @visible-change="selectCounty">
            <el-option v-for="(item,index) in countyList" :key="index" :label="item.district_name" :value="item.district_id.toString()"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细住址" required>
          <el-input type="textarea" rows="4" v-model="addressForm.receiver_address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressFormShow = false">取 消</el-button>
        <el-button type="primary" @click="updateAddress">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getOrderList, addOrderComments, deleteOrder, getSingleOrderInfo, updateOrderAddress} from '@/api/order'
import {pageMixin} from '@/utils/mixins'
import {getProvinceList, getCityList, getCountyList} from '@/api/common'
import { MessageBox } from 'element-ui'

export default {
  mixins: [pageMixin],
  data () {
    return {
      activeName: 'all',
      orderList: [],
      order_status: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      conditions: {
        timeRange: '',
        keyWord: ''
      },
      addressFormShow: false,
      addressForm: {},
      provinceList: [],
      cityList: [],
      countyList: [],
      cityId: -1,
      provinceId: -1
    }
  },
  watch: {
    provinceId () {
      this.setCityList()
      // this.$set(this.addressForm, 'receiver_city', '请重新选择')
      // this.$set(this.addressForm, 'receiver_district', '请重新选择')
    },
    cityId () {
      this.setCountyList()
      // this.$set(this.addressForm, 'receiver_district', '请重新选择')
    }
  },
  methods: {
    refresh () {
      let params = {
        order_status: this.order_status,
        page_size: this.pageSize,
        page_index: this.pageIndex
      }
      getOrderList(params)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.orderList = res.data.data.orderList.orderInfo
            this.totalCount = res.data.data.orderList.total_count
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
            this.orderList = []
          }
        })
        .catch(err => console.log(err))
    },
    getPicUrl (url) {
      return 'http://mall.test.ybfg9.cn/public' + url
    },
    onSearch () {
      console.log(this.conditions)
    },
    translateStatus (status) {
      let name = ''
      switch (status) {
        case 0:
          name = '待付款'
          break
        case 1:
          name = '待发货'
          break
        case 2:
          name = '已发货'
          break
        case 3:
          name = '已收货'
          break
        case 4:
          name = '已完成'
          break
        case 5:
          name = '已关闭'
          break
        case 6:
          name = '退款中'
          break
        default:
          break
      }
      return name
    },
    setOrderStatus (tab, event) {
      console.log(tab.index)
      if (tab.index === '0') {
        this.order_status = ''
      } else {
        this.order_status = tab.index - 1
      }
      this.refresh()
    },
    selectProvince (isOpen) {
      if (!isOpen || this.provinceList.length !== 0) {
        this.setProvinceList()
      }
    },
    setProvinceList () {
      getProvinceList()
        .then(res => {
          this.provinceList = res.data.data.provinceList
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
          // console.log(res)
        })
        .catch(err => console.log(err))
    },
    setProvinceId (id) {
      // console.log(id)
      this.provinceId = id
    },
    setCityId (id) {
      this.cityId = id
      console.log(id)
    },
    selectCounty (isOpen) {
      if (!isOpen || this.countyList.length !== 0) {
        return
      }
      this.setCountyList()
    },
    setCountyList () {
      getCountyList(this.cityId)
        .then(res => {
          this.countyList = res.data.data.DistrictList
          // console.log(res)
        })
        .catch(err => console.log(err))
    },
    setAllAreaList (data) {
      this.setProvinceList()
      this.provinceId = this.addressForm.receiver_province
      this.setCityList()
      this.cityId = this.addressForm.receiver_city
      this.setCountyList()
      this.$nextTick(() => {
        this.$set(this.addressForm, 'receiver_city', data.receiver_city)
        this.$set(this.addressForm, 'receiver_district', data.receiver_district)
      })
    },
    addComments (index, row) {
      console.log(row.order_id)
      MessageBox.prompt('请输入备注信息', '添加备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '已添加备注信息: ' + value
        })
        let data = {
          order_id: row.order_id,
          memo: value
        }
        addOrderComments(data)
          .then(res => {
            // console.log(res)
            if (res.data.status) {
              this.refresh()
            }
          })
          .catch(err => console.log(err))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    deleteOneOrder (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(row.order_id)
          .then(res => {
            console.log(res)
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.refresh()
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
    deliverGoods () {

    },
    checkExpress () {

    },
    checkOrderDetail (index, row) {
      this.$router.push({
        path: '/order/order-detail',
        query: {
          id: row.order_id
        }
      })
    },
    editAddress (index, row) {
      this.addressFormShow = true
      console.log(row)
      getSingleOrderInfo(row.order_id)
        .then(res => {
          console.log(res)
          this.addressForm = res.data.data[0]
          this.setAllAreaList(res.data.data[0])
        })
        .catch(err => console.log(err))
    },
    updateAddress () {
      updateOrderAddress(this.addressForm)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.addressFormShow = false
            this.refresh()
          }
        })
        .catch(err => console.log(err))
    },
    editPrice () {

    }
  },
  created () {
    this.refresh()
  },
  activated () {
    this.refresh()
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
@import '~@/styles/mixins.styl'

.order-list
  background #fff
  padding-bottom 50px

  .pagination
    margin 100px auto
    text-align center
    background-color #fff

  .conditions
    margin 10px 0
    padding-bottom 50px
    border-bottom 1px solid #eee

    .conditions-inner
      width 700px
      float right

      .join-time
        color #6f6f6f
        font-weight 200
        margin-right 6px

      .search-btn
        margin-left 4px

  >>>.el-tabs
    padding 0 20px

    .el-tabs__content
      display none

    .el-tabs__active-bar
      transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)

    .el-tabs__item
      color #58687b

      &.is-active
        color #409EFF

  >>>.el-table
    th
      .cell
        display flex
        flex-flow row nowrap
        align-items center
        justify-content center

    .el-table__row
      .cell
        display flex
        flex-flow column nowrap
        align-items center
        justify-content center

        .goods-info
          width 100%
          margin-top 10px
          display flex

          .left
            flex 0 0 60px
            margin-right 10px

          .right
            flex 1
            overflow hidden
            text-overflow ellipsis
            white-space nowrap

        .el-button
          margin 0

>>>.el-dialog
  .el-select
    float left
    width 122px
    margin 0 4px

    .el-input
      .el-input__inner
        padding 0 10px
</style>
