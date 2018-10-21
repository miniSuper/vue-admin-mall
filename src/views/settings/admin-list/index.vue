<template>
  <div class="settings">
    <el-tabs v-model="currentTab" @tab-click="handleTabClick">
      <el-tab-pane label="用户列表" name="UserList"></el-tab-pane>
      <el-tab-pane label="权限组" name="PermissionGroup"></el-tab-pane>
      <el-tab-pane label="操作日志" name="OperationLog"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
  </div>
</template>

<script type="text/ecmascript-6">
import {UserList, PermissionGroup, OperationLog} from './base'
import {mapState, mapActions} from 'vuex'
// import storage from 'good-storage'
export default {
  data () {
    return {
      currentTab: '' // 这个必须为空
    }
  },
  computed: {
    ...mapState({
      'adminStep': state => state.app.adminStep
    })
  },
  components: {
    UserList,
    PermissionGroup,
    OperationLog
  },
  methods: {
    handleTabClick (tab, event) {
      // console.log(tab, event)
      // 通过判断 goods_id 得知 是否提交了 基础设置
      this.currentTab = tab.name
      console.log('tab.name=' + tab.name)
      console.log('this.currentTab=' + this.currentTab)
      // storage.session.set('ADMIN_STEP', parseInt(tab.index) + 1)
    },
    toggleTab (step) {
      switch (step) {
        case 1:
          this.currentTab = 'UserList'
          break
        case 2:
          this.currentTab = 'PermissionGroup'
          break
        case 3:
          this.currentTab = 'OperationLog'
          break
        default:
          this.currentTab = 'UserList'
          break
      }
      console.log('toggleTab', this.adminStep)
    },
    ...mapActions({
      setAdminStep: 'app/setAdminStep'
    })
  },
  mounted () {
    this.toggleTab(this.adminStep)
  }
}
</script>

<style scoped lang="stylus">
</style>
