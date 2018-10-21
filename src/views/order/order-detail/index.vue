<template>
  <div class="order-detail">
    <el-button class="back" size="medium" type="text" icon="el-icon-arrow-left" @click.native="back">返回上一级</el-button>

    <div class="order-info">
      <div class="left">
        <el-form ref="form" :model="info" label-width="90px" size="mini">
          <el-form-item label="商品编号">
            {{info.order_no}}
          </el-form-item>
          <el-form-item label="商品交易号">
            {{info.out_trade_no}}
          </el-form-item>
          <el-form-item label="付款方式">
            {{info.pay_type === 1 ? '在线付款':'线下交易'}}
          </el-form-item>
          <el-form-item label="买家">
            {{info.receiver_name}}
          </el-form-item>
          <el-form-item label="买家IP">
            {{info.user_id}}
          </el-form-item>
          <el-form-item label="收货信息">
            {{info.receiver_address}}
          </el-form-item>
          <el-form-item label="买家留言">
            {{info.message}}
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <div class="order-state">
          订单状态：
          <span v-html="getOrderState(info.order_status)"></span>
        </div>
        <div>
          <el-button type="primary" size="mini" @click="addComments">备注</el-button>
          <el-button type="primary" size="mini" @click="deleteOneOrder">删除订单</el-button>
        </div>
        <div class="warning">
          <p class="warning-title">单商户B2C提醒：</p>
          <p class="warning-text">
            如果无法发货，请及时与买家联系并说明情况后进行退款； 买家申请退款后，须征得买家同意后再发货，否则买家有权拒收货物； 买家付款后超过7天仍未发货，将有权申请客服介入发起退款维权；
          </p>
        </div>
      </div>
    </div>
    <el-table :data="info.goodsList">
      <el-table-column label="id" prop="order_goods_id">
      </el-table-column>
      <el-table-column prop="picture" label="图片">
        <template slot-scope="scope">
          <div class="img-wrapper">
            <img :src="getPicUrl(scope.row.goods_picture)" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称">
      </el-table-column>
      <el-table-column label="价格" prop="goods_price">
      </el-table-column>
      <el-table-column label="数量" prop="num">
      </el-table-column>
      <el-table-column label="配送状态" prop="order_status">
        <template slot-scope="scope">
          <span v-text="translateStatus(scope.row.order_status)"></span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-log">
      <h4>订单日志</h4>
      <el-form>
        <el-form-item label="创建时间">
          {{info.addtime}}
        </el-form-item>
        <el-form-item label="完成时间">
          {{info.finish_time}}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {addOrderComments, deleteOrder, getSingleOrderInfo} from '@/api/order'

// import {getSingleOrderInfo} from '@/api/order'
import { MessageBox } from 'element-ui'

export default {
  data () {
    return {
      info: {}
    }
  },
  methods: {
    back () {
      this.$router.back()
      console.log('back')
    },
    getOrderState (value) {
      let state = ''
      switch (value) {
        case 0:
          state = '待付款'
          break
        case 1:
          state = '待发货'
          break
        case 2:
          state = '已发货'
          break
        case 3:
          state = '已收货'
          break
        case 4:
          state = '已完成'
          break
        case 5:
          state = '已关闭'
          break
        case 6:
          state = '退款中'
          break
        default:
          break
      }
      return state
    },
    getPicUrl (url) {
      return 'http://shop.qzshmy.cn/public' + url
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
    addComments () {
      let orderId = this.info.order_id
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
          order_id: orderId,
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
    deleteOneOrder () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(this.info.order_id)
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
    }
  },
  created () {
    console.log(this.$route.query.id)
    getSingleOrderInfo(this.$route.query.id)
      .then(res => {
        console.log(res)
        this.info = res.data.data[0]
      })
      .catch(err => console.log(err))
  }
}
</script>

<style scoped lang="stylus">
@import '~@/styles/mixins'

.order-detail
  background-color #fff

  .back
    margin 30px 20px

  .order-info
    flex-row(space-around)
    align-items flex-start

    .left
      width 50%
      flex-row(center)

      >>>.el-form
        width 80%
        color #888

    .right
      width 50%

      .order-state
        color #777777
        margin 20px 0

      .warning
        margin 30px 0
        margin-top 50px

        .warning-title
          margin 20px 0
          color #f56c6c

        .warning-text
          width 90%
          color #777777
          font-size 14px
          line-height 20px

  >>>.el-table
    .img-wrapper
      width 50px
      height 50px
      overflow hidden

      img
        width 100%

  .order-log
    margin 40px 20px

    .el-form
      margin 20px 40px
      padding-bottom 40px
</style>
