import request from '@/utils/request'
// 获取用户列表
export function getUserList (params) {
  return request({
    url: '/admin/Admin/lst',
    method: 'get',
    params
  })
}

// 删除用户
export function deleteUser (data) {
  return request({
    url: 'admin/Admin/del',
    method: 'post',
    data
  })
}

// 添加用户
export function addUser (data) {
  return request({
    url: 'admin/Admin/add',
    method: 'post',
    data
  })
}

// 修改 编辑用户信息
export function editUser (data) {
  return request({
    url: 'admin/Admin/edit',
    method: 'post',
    data
  })
}

// 获取单个用户信息
export function getUserInfo (id) {
  return request({
    url: 'admin/Admin/getone',
    method: 'get',
    params: {
      admin_id: id
    }
  })
}

// 获取权限组列表 用于下拉框 我也不知道为什么要有2个接口 问后端吧
export function getGroupList (params) {
  return request({
    url: 'admin/Admin/group',
    method: 'get',
    params
  })
}
// 获取权限组列表 带有分页信息 pagesize totalCount
export function getGroupListWithPagi (params) {
  return request({
    url: 'admin/Admin/lstgroup',
    method: 'get',
    params
  })
}

// 重置用户密码
export function resetPassword (data) {
  return request({
    url: 'admin/Admin/reset',
    method: 'post',
    data
  })
}
// 删除用户权限组
export function deletePermissionGroup (id) {
  return request({
    url: 'admin/Admin/delgroup',
    method: 'post',
    data: {
      group_id: id
    }
  })
}
// 权限设置 操作日志
export function getLogList (params) {
  return request({
    url: 'admin/Admin/logList',
    method: 'get',
    params
  })
}

// 删除用户
export function deleteLog (id) {
  return request({
    url: 'admin/Admin/logdel',
    method: 'post',
    data: {
      id: id
    }
  })
}

// 锁定 解锁 用户
export function setUserStatus (data) {
  return request({
    url: 'admin/Admin/locking',
    method: 'post',
    data
  })
}
// 添加权限组  获取所有的菜单列表
export function getMenuList (params) {
  return request({
    url: 'admin/system/ModuleList',
    method: 'get',
    params
  })
}
// 添加用户权限组
export function addPermissionGroup (data) {
  return request({
    url: 'admin/Admin/addgroup',
    method: 'post',
    data
  })
}

// 修改用户权限组
export function updatePermissionGroup (data) {
  return request({
    url: 'admin/Admin/editgroup',
    method: 'post',
    data
  })
}

// 获取单个 权限组信息
export function getPermissionGroupInfo (id) {
  return request({
    url: 'admin/Admin/getGroup',
    method: 'get',
    params: {
      group_id: id
    }
  })
}
