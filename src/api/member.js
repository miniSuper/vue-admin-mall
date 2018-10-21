import request from '@/utils/request'
// 获取会员列表
export function getMemberList (data) {
  return request({
    url: '/admin/user/lst',
    method: 'get',
    params: data
  })
}
// 删除一个会员
export function deleteMember (id) {
  return request({
    url: '/admin/user/del',
    method: 'post',
    data: {
      id
    }
  })
}
// 删除多个会员
export function deleteMemberList (ids) {
  return request({
    url: '/admin/user/delMemberList',
    method: 'post',
    data: {
      id: ids
    }
  })
}
// 添加会员
/* eslint-disable camelcase */
export function addMember (memberInfo) {
  let {
    username,
    mobile,
    password,
    password1,
    sex,
    level,
    status,
    user_type
  } = memberInfo
  return request({
    url: '/admin/user/addUser',
    method: 'post',
    data: {
      username,
      mobile,
      password,
      password1,
      sex,
      level,
      status,
      user_type
    }
  })
}
// 获取会员信息
export function getMemberInfo (id) {
  return request({
    url: '/admin/user/getMemberInfo',
    method: 'post',
    data: {
      id
    }
  })
}
// 修改会员积分 积分调整
export function setMemberPoint (info) {
  return request({
    url: '/admin/user/editPoint',
    method: 'post',
    data: {
      id: info.id,
      point: info.point,
      desc: info.desc
    }
  })
}
// 会员 余额调整 修改余额
export function setMemberBalance (info) {
  return request({
    url: '/admin/user/balance',
    method: 'post',
    data: {
      id: info.id,
      money: info.money,
      desc: info.desc
    }
  })
}
// 筛选会员  搜索会员
export function filterMemberList (data) {
  return request({
    url: '/admin/user/UserList',
    method: 'post',
    data
  })
}
// 修改会员信息
export function setMemberInfo (data) {
  return request({
    url: '/admin/user/edit',
    method: 'post',
    data
  })
}
// 获取会员等级列表
export function getMemberRankList (params) {
  return request({
    url: 'admin/user/memberLevelLst',
    method: 'get',
    params
  })
}
// 查询 获取 单个会员等级
export function getMemberRank (id) {
  return request({
    url: 'admin/user/memberLevelOne',
    method: 'get',
    params: {
      id: id
    }
  })
}
// 修改会员等级
export function setMemberRank (data) {
  return request({
    url: 'admin/user/memberLevelEdit',
    method: 'post',
    data
  })
}
// 修改会员等级
export function deleteMemberRank (ids) {
  return request({
    url: 'admin/user/memberLevelDel',
    method: 'post',
    data: {
      id: ids
    }
  })
}
// 添加会员等级
export function addMemberRank (data) {
  return request({
    url: 'admin/user/memberLevelAdd',
    method: 'post',
    data
  })
}
// 更新 修改 会员等级
export function updateMemberRank (data) {
  return request({
    url: 'admin/user/memberLevelEdit',
    method: 'post',
    data
  })
}
// 会员积分列表  积分管理列表
export function getMemberPointList (params) {
  return request({
    url: 'admin/user/pointlst',
    method: 'get',
    params
  })
}
// 会员余额列表  余额管理列表
export function getMemberBalanceList (params) {
  return request({
    url: 'admin/user/balanceList',
    method: 'get',
    params
  })
}
