<template>
  <div class="member-rank">
    <div class="buttons">
      <!-- <el-button type="danger" icon="el-icon-delete" @click="deleteSomeRanks">批量删除</el-button> -->
      <el-button type="primary" icon="el-icon-circle-plus-outline" @click="rankFormShow = true; updateFlag = false">添加等级</el-button>
    </div>
    <el-table :data="rankList" @selection-change="selectRank">
      <!-- <el-table-column type="selection" width="55">
      </el-table-column> -->
      <el-table-column prop="level_name" label="等级名称" fixed>
        <template slot-scope="scope">
          <span>{{scope.row.level_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="升级条件" fixed>
        <template slot-scope="scope">
          <span>{{scope.row.desc}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goods_discount" label="折扣率%" fixed>
        <template slot-scope="scope">
          <span>{{scope.row.goods_discount*100}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="editRank(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="text" style="color:#f56c6c" @click="deleteOneRank(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination> -->
    <el-dialog title="添加会员等级" :visible.sync="rankFormShow" :append-to-body="true" :center="true">
      <el-form :model="rankForm" label-width="100px">
        <el-form-item label="标签名字">
          <el-input v-model="rankForm.level_name"></el-input>
        </el-form-item>
        <el-form-item label="等级描述" prop="desc">
          <el-input type="textarea" rows="3" cols="10" v-model="rankForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="升级条件">
          <template slot-scope="scope">
            <div class="update-item">
              <el-checkbox v-model="upgradeList" :label="1">累计积分满</el-checkbox>
              <el-input-number style="max-width: 200px" controls-position="right" v-model="rankForm.min_integral"></el-input-number>
              <span>分</span>
            </div>
            <div class="update-item">
              <el-checkbox v-model="upgradeList" :label="2">消费额度满</el-checkbox>
              <el-input-number style="max-width: 200px" controls-position="right" v-model="rankForm.quota"></el-input-number>
              <span>元</span>
            </div>
            <div class="update-item">
              <el-radio v-model="rankForm.relation" :label="1">或</el-radio>
              <el-radio v-model="rankForm.relation" :label="2">且</el-radio>
              <span class="relation-tips" style="margin-left:40px;color:#999">设置会员升级条件</span>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="折扣率%" prop="goods_discount">
          <el-input v-model="rankForm.goods_discount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rankFormShow = false">取 消</el-button>
        <el-button v-if="updateFlag" type="primary" @click="updateRank">修改</el-button>
        <el-button v-else type="primary" @click="addRank">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {MessageBox} from 'element-ui'
import {getMemberRankList, deleteMemberRank, addMemberRank, getMemberRank, updateMemberRank} from '@/api/member'
import {getSelectionStr} from '@/utils'
export default {
  data () {
    return {
      rankList: [],
      selectedLabelIds: [],
      rankFormShow: false,
      rankForm: {},
      upgradeList: [],
      selectedRankIds: '',
      updateFlag: false
    }
  },
  watch: {
    upgradeList () {
      console.log(this.upgradeList)
      if (this.upgradeList.length === 1) {
        this.$set(this.rankForm, 'upgrade', this.upgradeList[0])
      } else if (this.upgradeList.length === 2) {
        this.$set(this.rankForm, 'upgrade', 3)
      }
    }
  },
  methods: {
    refresh () {
      getMemberRankList()
        .then(res => {
          console.log(res)
          if (res.data.status) {
            this.rankList = res.data.data
          }
        })
        .catch(err => console.log(err))
    },
    deleteRank (id) {
      deleteMemberRank(id)
        .then(res => {
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
    },
    deleteOneRank (index, row) {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRank(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteSomeRanks () {
      MessageBox.confirm('删除后将无法恢复，您确认删除吗？', '修改提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.deleteRank(row.id)
        this.deleteRank(this.selectedRankIds)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addRank () {
      console.log(this.rankForm)
      addMemberRank(this.rankForm)
        .then(res => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.rankForm = {}
            this.rankFormShow = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    selectRank (ranks) {
      this.selectedRankIds = getSelectionStr(ranks, 'id')
      console.log(this.selectedRankIds)
    },
    editRank (index, row) {
      console.log(row.id)
      this.updateFlag = true
      getMemberRank(row.id)
        .then(res => {
          if (res.data.status) {
            this.rankForm = res.data.data
            switch (res.data.data.upgrade) {
              case 1:
                this.upgradeList = [1]
                break
              case 2:
                this.upgradeList = [2]
                break
              case 3:
                this.upgradeList = [1, 2]
                break
              default:
                break
            }
            this.rankFormShow = true
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    updateRank () {
      updateMemberRank(this.rankForm)
        .then(res => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.rankFormShow = false
            this.rankForm = {}
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
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
.member-rank
  width 100%
  height 1000px
  background-color #fff

  .buttons
    padding 30px 20px
    border-bottom 1px solid #eee
    margin-bottom 4px
    background-color #fff

  .pagination
    width 380px
    margin 100px auto

>>>.el-dialog
  .update-item
    margin-top 20px
</style>
