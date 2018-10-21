<template>
  <div class="member-list" ref="memberList">
    <div class="buttons">
      <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteSomeMembers">批量删除</el-button>
      <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addMember">添加会员</el-button>
    </div>
    <div class="conditions clearfix">
      <div class="conditions-inner clearfix">
        <span class="join-time"> 注册时间 </span>
        <el-date-picker value-format="timestamp" v-model="conditions.timeRange" type="daterange" unlink-panels :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center">
        </el-date-picker>
        <el-input placeholder="手机号 会员名 可不填" v-model="conditions.keyWord" style="max-width:173px"></el-input>
        <el-button class="search-btn" type="primary" @click.native="onSearch">搜索</el-button>
      </div>
    </div>
    <el-table :data="memberList" :default-sort="{prop: 'goodsId', order: 'descending'}" :max-height="listHeight" @selection-change="selectMember">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="会员名">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ props.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.sex === 3 ? '保密' : props.row.sex === 1 ? '男': props.row.sex === 2 ? '女' : '未填写' }}</span>
            </el-form-item>
            <!-- <el-form-item label="会员等级">
              <span>{{ props.row.level }}</span>
            </el-form-item> -->
            <el-form-item label="余额">
              <span>{{ props.row.balance }}</span>
            </el-form-item>
            <el-form-item label="积分">
              <span>{{ props.row.point }}</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{ props.row.addtime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="会员id">
      </el-table-column>
      <el-table-column prop="username" label="会员名" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="point" label="积分" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="balance" label="余额" sortable show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="140">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleIntegral(scope.$index, scope.row)">积分调整</el-button>
          <el-button size="mini" type="text" @click="handleBalance(scope.$index, scope.row)">余额调整</el-button>
          <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="deleteOneMember(scope.$index, scope.row)" style="color:#f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-footer">
      <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
      </el-pagination>
    </div>

    <el-dialog title="积分调整" :visible.sync="integralFormShow" :append-to-body="true" :center="true">
      <el-form :model="integralForm">
        <el-form-item label="当前积分" label-width="100px">
          <el-input v-model="integralForm.point" controls-position="right" auto-complete="off" style="max-width:200px;background-color: #fff" disabled></el-input>
        </el-form-item>
        <el-form-item label="调整积分" label-width="100px">
          <el-input-number v-model="integralForm.pointDiff" controls-position="right" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="添加备注" label-width="100px">
          <el-input v-model="integralForm.comments" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="integralFormShow = false">取 消</el-button>
        <el-button type="primary" @click="setIntegral">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="余额调整" :visible.sync="balanceFormShow" :append-to-body="true" :center="true">
      <el-form :model="balanceForm">
        <el-form-item label="当前余额" label-width="100px">
          <el-input v-model="balanceForm.balance" controls-position="right" auto-complete="off" style="max-width:200px;background-color: #fff" disabled></el-input>
        </el-form-item>
        <el-form-item label="调整余额" label-width="100px">
          <el-input-number v-model="balanceForm.balanceDiff" controls-position="right" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="添加备注" label-width="100px">
          <el-input v-model="balanceForm.comments" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="balanceFormShow = false">取 消</el-button>
        <el-button type="primary" @click="setBalance">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog title="会员信息修改" :visible.sync="balanceFormShow" :modal-append-to-body="false" :center="true">
      <el-form :model="memberForm">
        <el-form-item label="会员名" label-width="100px">
          <el-input v-model="memberForm.username" controls-position="right" auto-complete="off" style="max-width:200px;background-color: #fff" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px">
          <el-input-number v-model="memberForm.mobile" controls-position="right" auto-complete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="添加备注" label-width="100px">
          <el-input v-model="balanceForm.comments" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="balanceFormShow = false">取 消</el-button>
        <el-button type="primary" @click="balanceFormShow = false">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script type="text/ecmascript-6">
import {getMemberList, deleteMember, deleteMemberList, getMemberInfo, setMemberPoint, setMemberBalance} from '@/api/member'
import {MessageBox} from 'element-ui'
// import {throttle} from '@/utils'
export default {
  data () {
    return {
      memberList: [],
      currentId: -1,
      integralFormShow: false,
      integralForm: {
        point: 90,
        pointDiff: 0,
        comments: ''
      },
      balanceFormShow: false,
      balanceForm: {
        balance: 0,
        balanceDiff: 0,
        comments: ''
      },
      memberFormShow: false,
      memberForm: {},
      selectedMemberIds: [],
      listHeight: 600,
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
      pageSize: 10,
      pageIndex: 1,
      currentPage: 1,
      totalPageNum: 1,
      totalCount: 30
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
        search_text: this.conditions.keyWord || ''
      }
      getMemberList(params).then(res => {
        console.log(res)
        if (res.data.status) {
          this.memberList = res.data.data.UserList
          this.totalPageNum = res.data.data.page_count
          this.totalCount = res.data.data.user_count
        }
      }).catch(err => console.log(err))
    },

    isNumberStr (str) {
      const reg = /^[1-9][0-9]*$/
      return reg.test(str)
    },
    handleEdit (index, row) {
      // console.log(row.id)
      this.$router.push({
        path: '/member/member-edit',
        query: {
          memberId: row.id
        }
      })
    },
    deleteOneMember (index, row) {
      console.log(row.id)
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMember(row.id).then(res => {
          if (res.data && res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.refresh()
          }
        })
        this.refresh()
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSomeMembers () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMemberList(this.selectedMemberIds)
          .then(res => {
            console.log(res)
            if (res.data && res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.refresh()
            }
          }).catch(err => {
            console.log(err)
          })
      }).catch(res => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleIntegral (index, row) {
      // console.log(row.id)
      this.currentId = row.id
      getMemberInfo(row.id)
        .then(res => {
          if (res.data && res.data.status) {
            // console.log(res.data)
            let {point} = res.data.data
            let newPoint = point
            let comments = ''
            this.integralForm = {point, newPoint, comments}
            this.integralFormShow = true
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleBalance (index, row) {
      this.balanceFormShow = true
      this.$set(this.balanceForm, 'balance', row.balance)
      this.currentId = row.id
      console.log(row)
    },
    setBalance () {
      let data = {}
      data.money = this.balanceForm.balanceDiff
      data.id = this.currentId
      data.desc = this.balanceForm.comments
      setMemberBalance(data)
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.balanceFormShow = false
            this.balanceForm = {}
          }
        })
        .catch(err => console.log(err))
    },
    setIntegral () {
      this.integralFormShow = false
      let data = {id: this.currentId}
      data.point = this.integralForm.pointDiff
      data.desc = this.integralForm.comments
      setMemberPoint(data)
        .then(res => {
          console.log(res)
          if (res.data && res.data.status) {
            this.refresh()
            this.$message({
              type: 'success',
              message: '积分修改成功'
            })
          } else {
            this.$message({
              type: 'warning',
              message: '积分修改失败'
            })
          }
        })
        .catch(err => console.log(err))
      console.log(data)
    },
    addMember () {
      this.$router.push({
        path: '/member/member-add'
      })
    },
    selectMember (members) {
      let arr = []
      members.forEach(member => {
        arr.push(member.id)
      })
      this.selectedMemberIds = arr
    },
    setListHeight () {
      let height = this.$refs.memberList.getBoundingClientRect().height
      this.listHeight = height - 200
    },
    onSearch () {
      console.log('onSubmit')
      console.log(this.conditions)
      this.refresh()
    },
    setCurrentpage (page) {
      this.pageIndex = page
      this.refresh()
    },
    setPageSize (pageSize) {
      this.pageSize = pageSize
    }
  },
  created () {
    this.refresh()
  },
  mounted () {
    this.setListHeight()
  },
  activated () {
    this.refresh()
  }
}
</script>

<style scoped lang="stylus">
.member-list
  width 100%
  height 100%
  background-color #fff

  .buttons
    padding 30px 10px
    padding-bottom 0
    background-color #fff

  .conditions
    margin 10px 0
    padding-bottom 60px
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

  .page-footer
    width 710px
    margin 100px auto
    text-align center
    display flex
    flex-flow row space-between
    justify-content center
    align-items center
    font-size 14px
    line-height 28px
    color #7d7f82

    .pagi-left
      height 28px
      margin-right 20px

    .pagi-right
      height 28px
      margin-left 20px

    >>>.el-input
      input
        height 28px
        padding 0 10px
        text-align center

  >>> .el-table__expanded-cell
    .table-expand
      font-size 0
      padding 0 50px

      .el-form-item
        margin-right 0
        margin-bottom 0
        width 50%

        label
          width 90px
          color #99a9bf

  >>>.el-dialog__wrapper
    left 180px

    .el-dialog
      z-index 9000

      .el-input
        &.is-disabled
          input
            background-color #fff
            color #555
</style>
