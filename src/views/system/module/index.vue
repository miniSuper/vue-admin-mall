<template>
  <div class="module">
    <el-table :data="moduleList">
      <el-table-column label="" width="80">
        <template slot-scope="scope">
          <svg-icon icon-class="triangle" :class="getLevel(scope.row.level)" @click.native="showChildren(scope.$index, scope.row)"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="module_id" label="id" width="100">
        <template slot-scope="scope">
          <span :class="getLevel(scope.row.level)">{{scope.row.module_id}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="controller" label="名称"> </el-table-column>
      <el-table-column prop="module_name" label="标题"> </el-table-column>
      <!-- <el-table-column prop="url" label="路径"> </el-table-column> -->
      <el-table-column label="操作" fixed="right" :fit="false" width="140">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="beforeEditModule(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改模块" :visible.sync="dialogShow" :append-to-body="true" :center="true">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="模块名称">
          <el-input v-model="form.controller"></el-input>
        </el-form-item>
        <el-form-item label="模块标题">
          <el-input v-model="form.module_name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="模块路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="editModule">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {getModuleList, getSingleModuleInfo, updateModule} from '@/api/system'
import {deepClone} from '@/utils'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      moduleList: [{
        id: 1,
        name: 'goods',
        path: '/goods',
        title: '商品',
        level: 1,
        children: [{
          id: 2,
          name: 'goodsAdd',
          path: 'goods/goods-add',
          title: '添加商品',
          level: 2
        }, {
          id: 3,
          name: 'goodsLabel',
          path: 'goods/goods-label',
          title: '商品标签',
          level: 2
        }]
      }, {
        id: 10,
        name: 'order',
        path: '/order',
        title: '订单',
        level: 1,
        children: [{
          id: 11,
          name: 'orderList',
          path: 'order/orderList',
          title: '订单列表',
          level: 2
        }, {
          id: 12,
          name: 'orderAdd',
          path: 'goods/goods-label',
          title: '添加订单',
          level: 2
        }]
      }],
      dialogShow: false,
      form: {}
    }
  },
  computed: {
    ...mapState({
      'routerMap': state => state.permission.routes
    })
  },
  methods: {
    refresh () {
      getModuleList()
        .then(res => {
          console.log(res)
          if (res.data.status === 1) {
            this.moduleList = res.data.data.CategoryModule
            console.log(this.moduleList)
          }
        })
        .catch(err => console.log(err))
    },
    showChildren (index, row) {
      // 设置展示子元素的标志
      if (this.moduleList[index].showChildren) {
        this.$set(this.moduleList[index], 'showChildren', false)
      } else {
        this.$set(this.moduleList[index], 'showChildren', true)
      }
      // 展示或者隐藏
      if (this.moduleList[index].showChildren) {
        this.moduleList[index].Submodule.forEach(subModule => {
          // this.moduleList.push(subModule)
          this.moduleList.splice(index + 1, 0, subModule)
        })
      } else {
        this.moduleList[index].Submodule.forEach(child => {
          this.moduleList.splice(index + 1, 1)
        })
      }
      console.log(this.moduleList)
    },
    cancel () {
      this.dialogShow = false
    },
    getLevel (level) {
      // class 是系统保留词  不能在这里使用
      let className = ''
      if (level === 1) {
      } else if (level === 2) {
        className = 'second-level'
      }
      return className
    },
    beforeEditModule (index, row) {
      this.dialogShow = true
      console.log(index, row)
      getSingleModuleInfo(row.module_id)
        .then(res => {
          console.log(res)
          this.form = deepClone(res.data.data.module)
        })
        .catch(err => console.log(err))
    },
    editModule () {
      console.log(this.form)
      // let data = JSON.stringify(this.form)
      updateModule(this.form)
        .then(res => {
          // console.log(res)
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
    }
  },
  created () {
    this.refresh()
  }
}
</script>

<style scoped lang="stylus">
.module
  .second-level
    margin-left 20px
    color #59aaf7
</style>
