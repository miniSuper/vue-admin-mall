<template>
  <div class="user-list">
    <div class="conditions">
      <el-button type="primary" size="mini" @click="beforeAddUser">添加用户</el-button>
      <div class="right">
        <el-input placeholder="用户名" v-model="keyWord" style="max-width:173px"></el-input>
        <el-button class="search-btn" type="primary" @click.native="searchList">搜索</el-button>
      </div>
    </div>
    <el-table class="user-table" :data="userList">
      <!-- <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" style="width: 50px;height:50px;">
        </template>
      </el-table-column> -->
      <el-table-column prop="user_name" label="用户名">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号">
      </el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <span>{{ scope.row.role_id === 1 ? "超级管理员":scope.row.role_id === 2 ? "普通管理员":"测试账户" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? "正常":"锁定" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="140">
        <template slot-scope="scope">
          <div v-if="scope.row.admin_id !== 1">
            <el-button size="mini" type="text" @click="beforeEditUser(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="text" v-if="scope.row.status === 1" @click="lockUser(scope.$index, scope.row)">锁定</el-button>
            <el-button size="mini" type="text" v-else @click="unLockUser(scope.$index, scope.row)">解锁</el-button>
            <el-button size="mini" type="text" @click="deleteOneUser(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="text" @click="beforeResetPassword(scope.$index, scope.row)">重置密码</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" :visible.sync="dialogShow" :append-to-body="true" :center="true">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="用户名" required>
          <el-input v-model="form.user_name"></el-input>
        </el-form-item>
        <el-form-item v-if="!isUpdating" label="密码" required>
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="正常" :value="1">
            </el-option>
            <el-option label="锁定" :value="0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限组">
          <el-select v-model="form.group_id" placeholder="请选择">
            <el-option v-for="item in groupList" :key="item.group_id" :label="item.group_name" :value="item.group_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.desc" type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button v-if="!isUpdating" type="primary" @click="handleAddUser">确 定</el-button>
        <el-button v-else type="primary" @click="handleEditUser">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="passwordDialogShow" :append-to-body="true" :center="true">
      <el-form :model="passwordForm" label-width="70px">
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="resetUserPassword">确 定</el-button>
      </div>
    </el-dialog>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {getUserList, deleteUser, addUser, editUser, getUserInfo, getGroupList, resetPassword, setUserStatus} from '@/api/setting'
import {deepClone} from '@/utils'
import {pageMixin} from '@/utils/mixins'
import {isValidateMobile} from '@/utils/validate'
import { mapActions } from 'vuex'
import {MessageBox} from 'element-ui'
export default {
  mixins: [pageMixin],
  data () {
    return {
      userList: [{
        avatar: '/static/avatar.jpg',
        account: 'hello@qq.com',
        mobile: '13066663232',
        email: 'jackie@email.com',
        group: '管理员组',
        status: 1
      }, {
        avatar: '/static/avatar.jpg',
        account: 'hello@qq.com',
        mobile: '13066663232',
        email: 'jackie@email.com',
        group: '管理员组',
        status: 1
      }, {
        avatar: '/static/avatar.jpg',
        account: 'hello@qq.com',
        mobile: '13066663232',
        email: 'jackie@email.com',
        group: '管理员组',
        status: 1
      }],
      dialogShow: false,
      dialogTitle: '添加用户',
      form: {},
      groupList: [],
      isUpdating: false,
      currentId: 0,
      passwordDialogShow: false,
      passwordForm: {},
      keyWord: ''
    }
  },
  methods: {
    ...mapActions({
      setAdminStep: 'app/setAdminStep'
    }),
    refresh () {
      let params = {
        page_size: this.pageSize,
        page_index: this.pageIndex,
        user_name: this.keyWord
      }
      getUserList(params)
        .then(res => {
          console.log(res)
          this.userList = res.data.data.AdminList.orderInfo
          this.totalCount = res.data.data.AdminList.total_count
        })
        .catch(err => console.log(err))
    },
    lockUser (index, row) {
      let data = {
        admin_id: row.admin_id,
        status: 0
      }
      setUserStatus(data)
        .then(res => {
          // console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '锁定成功'
            })
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: res.status.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    unLockUser (index, row) {
      let data = {
        admin_id: row.admin_id,
        status: 1
      }
      setUserStatus(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '解锁成功'
            })
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: res.status.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    deleteOneUser (index, row) {
      // console.log(index, row.admin_id)

      MessageBox.confirm('删除后将无法恢复，您确认删除吗', '删除警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({admin_id: row.admin_id})
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
    beforeResetPassword (index, row) {
      this.passwordDialogShow = true
      this.currentId = row.admin_id
      this.passwordForm = {}
    },
    resetUserPassword () {
      if (!this.passwordForm.password || this.passwordForm.password.length < 6) {
        this.$message({
          type: 'warning',
          message: '密码的长度至少6位'
        })
        return
      }
      let data = {
        admin_id: this.currentId,
        password: this.passwordForm.password
      }
      resetPassword(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '密码重置成功'
            })
          } else {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    getPermissionGroupList () {
      getGroupList()
        .then(res => {
          // console.log(res)
          if (res.data.status === 1) {
            this.groupList = res.data.data
          }
        })
        .catch(err => console.log(err))
    },
    beforeAddUser () {
      this.dialogShow = true
      this.dialogTitle = '添加用户'
      this.isUpdating = false
      this.form = {}
      this.getPermissionGroupList()
    },
    beforeEditUser (index, row) {
      this.dialogShow = true
      this.dialogTitle = '修改用户'
      this.isUpdating = true
      this.currentId = row.admin_id
      this.getPermissionGroupList()
      getUserInfo(row.admin_id)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.form = deepClone(res.data.data)
            this.$delete(this.form, 'password')
            // this.form.password = ''
          }
        })
        .catch(err => console.log(err))
    },
    handleAddUser () {
      if (!isValidateMobile(this.form.mobile)) {
        this.$message({
          type: 'warning',
          message: '请输入正确的手机号'
        })
        return
      }
      addUser(this.form)
        .then(res => {
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.refresh()
            this.dialogShow = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    handleEditUser () {
      let data = deepClone(this.form)
      data.admin_id = this.currentId
      editUser(data)
        .then(res => {
          console.log(res)
        })
        .catch(err => console.log(err))
    },
    searchList () {
      console.log(this.keyWord)
      this.refresh()
    }
  },
  created () {
    this.refresh()
    this.setAdminStep(1)
  }
}
</script>

<style scoped lang="stylus">
.user-list
  .conditions
    margin 10px 0
    display flex
    flex-flow row nowrap
    justify-content space-between

  .user-table
    margin-top 20px

  .pagination
    margin 0 auto
    padding 70px 0
    text-align center
    background-color #fff

>>>.el-dialog
  .el-dialog__body
    padding-bottom 0
    color red
</style>
