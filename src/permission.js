import router from './router'
import store from './store'
// import { Message } from 'element-ui'
let initFlag = false
// function setInitFlag (flag) {
//   store.dispatch('permission/setRouterFlag', flag)
// }
router.beforeEach((to, from, next) => {
  let token = store.state.token
  if (to.path !== '/login') {
    if (token) {
      if (store.state.permission.moduleList.length) {
        console.log('aaaa')
        if (initFlag) {
          next()
        } else {
          let moduleList = store.state.permission.moduleList
          store.dispatch('permission/generateRoutes', moduleList).then(() => {
            router.addRoutes(store.state.permission.addRoutes) // 动态添加可访问路由表
            initFlag = true
            next()
          })
        }
      } else {
        console.log('bbbb')
        store.dispatch('GetUserInfo').then(res => {
          console.log('GetUserInfo')
          let arr = []
          res.data.data.module.forEach(module => {
            let obj = {}
            obj.name = module.controller
            obj.title = module.module_name
            arr.push(obj)
          })
          store.dispatch('permission/setModuleList', arr)
          store.dispatch('permission/generateRoutes', arr).then(() => {
            router.addRoutes(store.state.permission.addRoutes) // 动态添加可访问路由表
            next() // ????放这里不起作用吗
            // initFlag = true
            console.log('generateRoutes -> next')
          })
          next()
        })
      }
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  } else {
    next()
  }
})
