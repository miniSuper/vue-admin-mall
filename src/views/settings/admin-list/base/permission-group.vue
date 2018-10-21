<template>
  <div class="permission-group">
    <div>
      <el-button type="primary" @click="beforeAddGroup">添加用户组</el-button>
    </div>
    <el-table class="permission-table" :data="permissionList">
      <el-table-column prop="group_id" label="id" width="100" align="center">
      </el-table-column>
      <el-table-column prop="group_name" label="权限组名称" align="center">
      </el-table-column>
      <el-table-column label="是否属于管理员" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.group_id === 1 ? "是":"否" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :fit="false" width="140" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.group_id !== 1">
            <el-button size="mini" type="text" @click="beforeEditGroup(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteGroup(scope.$index, scope.row)" style="color:#f56c6c">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="isUpdating? '用户组修改': '用户组添加'" :visible.sync="dialogShow" :append-to-body="true" :center="true">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="group_name"></el-input>
        </el-form-item>
        <el-form-item style="border-bottom:1px solid #ddd;" label="权限" required>
          <el-checkbox-group v-model="allSelect">
            <el-checkbox label="全选" name="type" @change="allSelectChange"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="border-bottom:1px solid #ddd;" class="flex-box" v-for="menu in menuList" :key="menu.module_id">
          <div class="col left">
            <el-checkbox-group v-model="form[menu.module_id]" @change="allSelectLevelOne(menu.module_id)">
              <el-checkbox :label="menu.module_id">{{menu.module_name}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="col right">
            <el-checkbox-group v-for="subMenu in menu.Submodule" :key="subMenu.module_id" v-model="form[subMenu.module_id]" @change="selectSubMenu(subMenu.module_id)">
              <el-checkbox :label="menu.module_id" name="type">{{subMenu.module_name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="!isUpdating" type="primary" @click="addGroup">确 定</el-button>
        <el-button v-if="isUpdating" type="primary" @click="editGroup">修改</el-button>
      </div>
    </el-dialog>
    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount" :current-page="pageIndex" :page-size="pageSize" :page-sizes="[5,10, 15, 20, 30]" @current-change="setCurrentpage" @size-change="setPageSize">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import {getGroupListWithPagi, deletePermissionGroup, getMenuList, addPermissionGroup, getPermissionGroupInfo, updatePermissionGroup} from '@/api/setting'
import {pageMixin} from '@/utils/mixins'
import { mapActions } from 'vuex'
export default {
  mixins: [pageMixin],
  data () {
    return {
      permissionList: [],
      menuList: [],
      dialogShow: false,
      group_name: '',
      form: {
      },
      selectedIds: [],
      isUpdating: false,
      currentGroupId: false,
      allSelect: false
    }
  },
  watch: {
    form: {
      // 监听对象
      handler () {
        let flag = true
        Object.keys(this.form).forEach(key => {
          if (!this.form[key]) {
            flag = false
          }
        })
        if (flag) {
          this.menuList.forEach(menu => {
            menu.Submodule.forEach(subMenu => {
              if (!this.form[subMenu.module_id]) {
                flag = false
              }
            })
          })
        }
        if (flag) {
          this.allSelect = true
        } else {
          this.allSelect = false
        }
      },
      deep: true
    }
  },
  methods: {
    refresh () {
      let params = {
        page_index: this.pageIndex,
        page_size: this.page_size
      }
      getGroupListWithPagi(params)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.permissionList = res.data.data.AdminList.orderInfo
            this.totalCount = res.data.data.AdminList.total_count
          }
        })
        .catch(err => console.log(err))
    },
    allSelectChange (value) {
      console.log(value)
      if (value === true) {
        this.selectAll()
      } else {
        this.unSelectAll()
      }
    },
    selectAll () {
      this.menuList.forEach(menu => {
        this.$set(this.form, menu.module_id, true)
        this.allSelectLevelOne(menu.module_id)
      })
    },
    unSelectAll () {
      this.menuList.forEach(menu => {
        this.$set(this.form, menu.module_id, false)
        this.allSelectLevelOne(menu.module_id)
      })
    },
    selectSubMenu (id) {
      let parentId = -1
      if (this.form[id]) {
        this.menuList.forEach(menu => {
          menu.Submodule.forEach(subMenu => {
            if (subMenu.module_id === id) {
              parentId = subMenu.pid
            }
          })
        })
        parentId !== -1 && this.$set(this.form, parentId, true)
      } else {
        let flag = false
        this.menuList.forEach(menu => {
          menu.Submodule.forEach(subMenu => {
            if (subMenu.module_id === id) {
              parentId = subMenu.pid
            }
            if (this.form[subMenu.module_id]) {
              flag = true
            }
          })
        })
        !flag && this.$set(this.form, parentId, false)
      }
      // console.log('parentId', parentId)
      // console.log('now form is ', this.form)
    },
    allSelectLevelOne (id) {
      let flag = true
      // console.log('this.form.id = ' + this.form[id])
      if (this.form[id] === false) {
        flag = false
      }
      this.menuList.forEach(menu => {
        if (menu.module_id === id) {
          menu.Submodule.forEach(submenu => {
            let key = submenu.module_id
            this.$set(this.form, key, flag)
          })
        }
      })
    },
    cancel () {
      this.dialogShow = false
      this.form = {}
    },
    deleteGroup (index, row) {
      // console.log(row)
      deletePermissionGroup(row.group_id)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
        .catch(err => console.log(err))
    },
    beforeAddGroup () {
      this.isUpdating = false
      this.dialogShow = true
      getMenuList()
        .then(res => {
          console.log(res)
          this.menuList = res.data.data.CategoryModule
        })
        .catch(err => console.log(err))
    },
    addGroup () {
      console.log(this.form)
      this.selectedIds = []
      Object.keys(this.form).forEach(key => {
        console.log(key)
        if (this.form[key]) {
          this.selectedIds.push(key)
        }
      })
      // console.log(this.selectedIds)
      let data = {
        group_name: this.group_name,
        act_list: JSON.stringify(this.selectedIds)
      }
      console.log(data)
      addPermissionGroup(data)
        .then(res => {
          // console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.refresh()
            this.dialogShow = false
          } else {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }
        })
        .catch(err => console.log(err))
    },
    beforeEditGroup (index, row) {
      console.log(row)
      this.form = {}
      this.currentGroupId = row.group_id
      this.isUpdating = true
      getPermissionGroupInfo(row.group_id)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.dialogShow = true
            this.group_name = res.data.data.group_name
            this.selectedIds = JSON.parse(res.data.data.act_list)
            this.selectedIds.forEach(id => {
              this.$set(this.form, id, true)
            })
            console.log(this.selectedIds)
            getMenuList()
              .then(res => {
                this.menuList = res.data.data.CategoryModule
              })
              .catch(err => console.log(err))
          } else {
            this.$message({
              type: 'error',
              message: '获取权限组信息失败'
            })
          }
        })
        .catch(err => console.log(err))
    },
    editGroup () {
      this.selectedIds = []
      Object.keys(this.form).forEach(key => {
        console.log(key)
        if (this.form[key]) {
          this.selectedIds.push(key)
        }
      })
      let data = {
        group_name: this.group_name,
        act_list: JSON.stringify(this.selectedIds),
        group_id: this.currentGroupId
      }
      updatePermissionGroup(data)
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '修改成功'
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
    ...mapActions({
      setAdminStep: 'app/setAdminStep'
    })
  },
  created () {
    this.refresh()
    this.setAdminStep(2)
  }
}
</script>

<style scoped lang="stylus">
.permission-group
  .permission-table
    margin-top 20px

  .pagination
    margin 0 auto
    padding 70px 0
    text-align center
    background-color #fff

>>>.el-dialog
  .el-dialog__header
    background-color #f3f3f3

  .el-dialog__footer
    background-color #f3f3f3

  .el-dialog__body
    height 400px
    overflow-y scroll
    overflow-x hidden

  .flex-box
    >.el-form-item__content
      display flex
      flex-flow row nowrap
      justify-content flex-start

      .left
        width 80px

      .right
        width 240px

        .el-checkbox
          margin-left 20px
</style>
