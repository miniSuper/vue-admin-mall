import request from '@/utils/request'
// 获取模块列表
export function getModuleList (params) {
  return request({
    url: '/admin/system/ModuleList',
    method: 'get',
    params
  })
}
// 获取模块列表
export function getSingleModuleInfo (id) {
  return request({
    url: '/admin/system/GetModule',
    method: 'get',
    params: {
      module_id: id
    }
  })
}
// 更新模块信息
export function updateModule (data) {
  return request({
    url: '/admin/system/addmodule',
    method: 'post',
    data
  })
}
