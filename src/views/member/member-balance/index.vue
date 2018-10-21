<template>
  <div class="member-balance-manage">
    <div class="conditions clearfix">
      <div class="conditions-inner clearfix">
        <span class="join-time"> 发生时间 </span>
        <el-date-picker value-format="timestamp" v-model="conditions.timeRange" type="daterange" unlink-panels :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center">
        </el-date-picker>
        <el-input placeholder="会员昵称" v-model="conditions.keyWord" style="max-width:173px"></el-input>
        <el-button class="search-btn" type="primary" @click.native="onSearch">搜索</el-button>
      </div>
    </div>
    <el-table :data="balanceLogList">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="username" label="会员昵称">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类别">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="数量" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.time}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {MessageBox} from 'element-ui'
import { getMemberBalanceList } from '@/api/member'
import {getSelectionStr} from '@/utils'
import {pageMixin} from '@/utils/mixins'
export default {
  mixins: [pageMixin],
  data () {
    return {
      balanceLogList: [],
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
      }
    }
  },
  methods: {
    refresh () {
      let timeStart = this.conditions.timeRange[0] / 1000 || 0
      let timeEnd = this.conditions.timeRange[1] / 1000 || 0
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex,
        start_date: timeStart,
        end_date: timeEnd,
        username: this.conditions.keyWord || ''
      }
      getMemberBalanceList(params)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.balanceLogList = res.data.data.BalaceList
            this.totalCount = res.data.data.user_count
          } else {
            this.$message({
              type: 'warning',
              message: '没有更多数据'
            })
          }
        })
        .catch(err => console.log(err))
    },
    onSearch () {
      this.refresh()
    },
    addLabel () {
      this.$router.push('/goods/goods-label/add-label')
    },
    handleEdit (index, row) {
      console.log(index, row)
      this.labelFormShow = true
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    deleteOneLabel (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLabel(row.label_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSomeLabels () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteLabel(this.selectedLabelIds)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteLabel (id) {
      // deleteGoodsLabel(id)
      //   .then(res => {
      //     console.log(res)
      //     if (res.data.status) {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功'
      //       })
      //       this.refresh()
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: res.data.msg
      //       })
      //     }
      //   })
      //   .catch(err => console.log(err))
    },
    selectLabel (labels) {
      // console.log(labels)
      this.selectedLabelIds = getSelectionStr(labels, 'label_id')
      console.log(this.selectedLabelIds)
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style scoped lang="stylus">
.member-balance-manage
  width 100%
  height 1000px
  background-color #fff

  .conditions
    color red
    padding 20px 0
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

  .pagination
    width 380px
    margin 100px auto
</style>
