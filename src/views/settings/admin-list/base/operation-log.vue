<template>
  <div class="operation-log">
    <div class="conditions">
      <el-button type="danger" size="mini" @click="deleteSomeLogs">批量删除</el-button>
      <div class="right">
        <span class="join-time"> 操作时间 </span>
        <el-date-picker value-format="timestamp" v-model="conditions.timeRange" type="daterange" unlink-panels :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center">
        </el-date-picker>
        <el-input placeholder="用户名" v-model="conditions.keyWord" style="max-width:173px"></el-input>
        <el-button class="search-btn" type="primary" @click.native="searchList">搜索</el-button>
      </div>
    </div>
    <el-table class="log-table" :data="logList" @selection-change="selectLog">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="user_name" label="用户" fixed>
      </el-table-column>
      <el-table-column prop="method" label="操作">
      </el-table-column>
      <el-table-column prop="ip" label="IP">
        <template slot-scope="scope">
          <span style="user-select:text;">
            {{scope.row.ip}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="操作时间" width="170">
        <template slot-scope="scope">
          <span>{{formatTime(scope.row.create_time)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作详情" width="260">
        <template slot-scope="scope">
          <p>
            <span>访问地址</span>
            <span style="color:#f56c6c;cursor: text;user-select:text;">{{scope.row.url}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="deleteLogItem(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {getLogList, deleteLog} from '@/api/setting'
import {pageMixin} from '@/utils/mixins'
import {timestampToTime} from '@/utils'
import {MessageBox} from 'element-ui'
import { mapActions } from 'vuex'
export default {
  mixins: [pageMixin],
  data () {
    return {
      logList: [],
      selectedLogIds: [],
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
        user_name: this.conditions.keyWord || ''
      }
      getLogList(params)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.logList = res.data.data.LogList.LogInfo
            this.totalCount = res.data.data.LogList.total_count
          }
        })
        .catch(err => console.log(err))
    },
    selectLog (logArr) {
      // console.log(logArr)
      let ids = []
      logArr.forEach(log => {
        ids.push(log.id)
      })
      this.selectedLogIds = ids
      console.log(this.selectedLogIds)
    },
    deleteLogItem (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLog(row.id)
          .then(res => {
          // console.log(res)
            if (res.data.status === 1) {
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
    deleteSomeLogs () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLog(this.selectedLogIds)
          .then(res => {
          // console.log(res)
            if (res.data.status === 1) {
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
    searchList () {
      this.refresh()
    },
    formatTime (time) {
      return timestampToTime(time)
    },
    ...mapActions({
      setAdminStep: 'app/setAdminStep'
    })
  },
  created () {
    this.refresh()
    this.setAdminStep(3)
  }
}
</script>

<style scoped lang="stylus">
.operation-log
  .conditions
    margin 10px 0
    display flex
    flex-flow row nowrap
    justify-content space-between

  .pagination
    margin 0 auto
    padding 70px 0
    text-align center
    background-color #fff

  .log-table
    margin-top 20px
</style>
