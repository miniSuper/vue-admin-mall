import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Layout from '@/views/layout'
Vue.use(Router)
export const asyncRoutes = [
  {
    path: '/goods',
    component: Layout,
    name: 'goods',
    meta: {
      icon: 'component',
      title: '商品'
    },
    children: [
      {
        path: '/goods/goods-add',
        component: () => import('@/views/goods/goods-add'),
        name: 'goodsAdd',
        meta: {
          title: '商品发布',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-list',
        component: () => import('@/views/goods/goods-list'),
        name: 'goodsList',
        meta: {
          title: '商品列表',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-sort',
        component: () => import('@/views/goods/goods-sort'),
        name: 'goodsSort',
        meta: {
          title: '商品分类',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-label',
        component: () => import('@/views/goods/goods-label'),
        name: 'goodsLabel',
        meta: {
          title: '商品标签',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-model',
        component: () => import('@/views/goods/goods-model'),
        name: 'goodsModel',
        meta: {
          title: '商品规格',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/add-model',
        component: () => import('@/views/goods/goods-model/add-model'),
        name: 'addModel',
        hidden: true,
        meta: {
          title: '添加规格',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-type',
        component: () => import('@/views/goods/goods-type'),
        name: 'goodsType',
        meta: {
          title: '商品类型',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-type/add-type',
        component: () => import('@/views/goods/goods-type/add-type'),
        name: 'addType',
        hidden: true,
        meta: {
          title: '添加商品类型',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-type/edit-type',
        component: () => import('@/views/goods/goods-type/edit-type'),
        name: 'editType',
        hidden: true,
        meta: {
          title: '编辑商品类型',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-brand',
        component: () => import('@/views/goods/goods-brand'),
        name: 'goodsBrand',
        meta: {
          title: '商品品牌',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-brand/add-brand',
        component: () => import('@/views/goods/goods-brand/add-brand'),
        name: 'addGoodsBrand',
        hidden: true,
        meta: {
          title: '添加商品品牌',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-label/add-label',
        component: () => import('@/views/goods/goods-label/add-label'),
        name: 'addGoodsLabel',
        hidden: true,
        meta: {
          title: '添加商品标签',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: 'member',
    meta: {
      icon: 'people',
      title: '会员'
    },
    children: [
      {
        path: '/member/member-list',
        component: () => import('@/views/member/member-list'),
        name: 'memberList',
        meta: {
          title: '会员列表',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-edit',
        component: () => import('@/views/member/member-edit'),
        name: 'memberEdit',
        hidden: true,
        meta: {
          title: '修改会员信息',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-add',
        component: () => import('@/views/member/member-add'),
        name: 'memberAdd',
        hidden: true,
        meta: {
          title: '添加会员',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-points',
        component: () => import('@/views/member/member-points'),
        name: 'memberPoints',
        meta: {
          title: '会员积分',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-rank',
        component: () => import('@/views/member/member-rank'),
        name: 'memberRank',
        meta: {
          title: '会员等级',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-balance',
        component: () => import('@/views/member/member-balance'),
        name: 'memberBalance',
        meta: {
          title: '余额管理',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: {
      icon: 'order',
      title: '订单'
    },
    alwaysShow: true,
    children: [
      {
        path: '/order/order-list',
        component: () => import('@/views/order/order-list'),
        name: 'orderList',
        meta: {
          title: '订单列表',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/order/order-detail',
        component: () => import('@/views/order/order-detail'),
        name: 'orderDetail',
        hidden: true,
        meta: {
          title: '订单详情',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    name: 'settings',
    meta: {
      icon: 'settings',
      title: '设置'
    },
    alwaysShow: true,
    children: [
      {
        path: '/settings/admin-list',
        component: () => import('@/views/settings/admin-list/index'),
        name: 'settingsAdminList',
        meta: {
          title: '管理员列表',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: {
      icon: 'system',
      title: '系统'
    },
    alwaysShow: true,
    children: [
      {
        path: '/system/module',
        component: () => import('@/views/system/module/index'),
        name: 'systemModule',
        meta: {
          title: '模块设置',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  { path: '*', name: '404', redirect: '/404', hidden: true }
]
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404/index'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401/index'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      icon: 'home'
    },
    // alwaysShow: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: '首页',
          noCache: true,
          requireAuth: true,
          icon: 'home'
        }
      }
    ]
  }
]
/* eslint-disable no-unused-vars */
export const allRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404/index'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401/index'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      icon: 'dashboard'
    },
    // alwaysShow: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: {
          title: '首页',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: '/goods/goods-add',
        component: () => import('@/views/goods/goods-add'),
        name: 'goodsAdd',
        meta: {
          title: '商品发布',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-list',
        component: () => import('@/views/goods/goods-list'),
        name: 'goodsList',
        meta: {
          title: '商品列表',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-sort',
        component: () => import('@/views/goods/goods-sort'),
        name: 'goodsSort',
        meta: {
          title: '商品分类',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-label',
        component: () => import('@/views/goods/goods-label'),
        name: 'goodsLabel',
        meta: {
          title: '商品标签',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-model',
        component: () => import('@/views/goods/goods-model'),
        name: 'goodsModel',
        meta: {
          title: '商品规格',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/add-model',
        component: () => import('@/views/goods/goods-model/add-model'),
        name: 'addModel',
        meta: {
          title: '添加规格',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-type',
        component: () => import('@/views/goods/goods-type'),
        name: 'goodsType',
        meta: {
          title: '商品类型',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-type/add-type',
        component: () => import('@/views/goods/goods-type/add-type'),
        name: 'addType',
        meta: {
          title: '添加商品类型',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-type/edit-type',
        component: () => import('@/views/goods/goods-type/edit-type'),
        name: 'editType',
        meta: {
          title: '编辑商品类型',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-brand',
        component: () => import('@/views/goods/goods-brand'),
        name: 'goodsBrand',
        meta: {
          title: '商品品牌',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-brand/add-brand',
        component: () => import('@/views/goods/goods-brand/add-brand'),
        name: 'addGoodsBrand',
        meta: {
          title: '添加商品品牌',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/goods/goods-label/add-label',
        component: () => import('@/views/goods/goods-label/add-label'),
        name: 'addGoodsLabel',
        meta: {
          title: '添加商品标签',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    meta: {
      icon: 'people'
    },
    children: [
      {
        path: '/member/member-list',
        component: () => import('@/views/member/member-list'),
        name: 'memberList',
        meta: {
          title: '会员列表',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-edit',
        component: () => import('@/views/member/member-edit'),
        name: 'memberEdit',
        meta: {
          title: '修改会员信息',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-add',
        component: () => import('@/views/member/member-add'),
        name: 'memberAdd',
        meta: {
          title: '添加会员',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-points',
        component: () => import('@/views/member/member-points'),
        name: 'memberPoints',
        meta: {
          title: '会员积分',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-rank',
        component: () => import('@/views/member/member-rank'),
        name: 'memberRank',
        meta: {
          title: '会员等级',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/member/member-balance',
        component: () => import('@/views/member/member-balance'),
        name: 'memberBalance',
        meta: {
          title: '余额管理',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: {
      icon: 'order'
    },
    children: [
      {
        path: '/order/order-list',
        component: () => import('@/views/order/order-list'),
        name: 'orderList',
        meta: {
          title: '订单列表',
          noCache: true,
          requireAuth: true
        }
      },
      {
        path: '/order/order-detail',
        component: () => import('@/views/order/order-detail'),
        name: 'orderDetail',
        meta: {
          title: '订单详情',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    children: [
      {
        path: '/settings/admin-list',
        component: () => import('@/views/settings/admin-list/index'),
        name: 'settingsAdminList',
        meta: {
          title: '管理员列表',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    children: [
      {
        path: '/system/module',
        component: () => import('@/views/system/module/index'),
        name: 'systemModule',
        meta: {
          title: '模块设置',
          noCache: true,
          requireAuth: true
        }
      }
    ]
  }
]
const router = new Router({ routes: constantRoutes })

router.beforeEach((to, from, next) => {
  let token = store.state.token
  if (to.meta.requireAuth) {
    if (token) {
      next()
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
export default router
