import { constantRoutes, asyncRoutes } from '@/router'
// import Router from 'vue-router'
function hasPermission (list, route) {
  // return list.some(item => {
  //   return route.name.indexOf(item.name) >= 0
  // })
  return list.some(item => route.name === item.name)
  // try {
  //   return list.some(item => route.name === item.name)
  // } catch (error) {
  //   console.log(error)
  //   console.log(list)
  // }
}
function filterAsyncRoutes (asyncRoutes, moduleList) {
  const accessRoutes = asyncRoutes.filter(route => {
    if (hasPermission(moduleList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRoutes(route.children, moduleList)
      }
      return true
    }
    return false
  })
  return accessRoutes
}
const permission = {
  namespaced: true,
  state: {
    routes: constantRoutes,
    addRoutes: [],
    moduleList: [],
    initRouterFlag: false // 用来判断是否已经生成动态路由
  },
  mutations: {
    SET_ROUTERS: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_MODULE_LIST: (state, list) => {
      state.moduleList = list
    },
    SET_ROUTER_FLAG: (state, flag) => {
      state.initRouterFlag = flag
    }
  },
  actions: {
    generateRoutes ({ commit }, list) {
      return new Promise(resolve => {
        let accessRoutes = filterAsyncRoutes(asyncRoutes, list)
        commit('SET_ROUTERS', accessRoutes)
        resolve()
      })
    },
    setModuleList ({ commit }, list) {
      commit('SET_MODULE_LIST', list)
    },
    setRouterFlag ({ commit }, flag) {
      commit('SET_ROUTER_FLAG', flag)
    }
  }
}
export default permission
