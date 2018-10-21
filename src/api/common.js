import request from '@/utils/request'
// 获取省份列表
export function getProvinceList (params) {
  return request({
    url: '/admin/goods/getProvince',
    method: 'get',
    params
  })
}
// 获取城市列表
export function getCityList (id) {
  return request({
    url: '/admin/goods/getCity',
    method: 'get',
    params: {
      province_id: id
    }
  })
}
// 获取 区域/县 列表
export function getCountyList (id) {
  return request({
    url: '/admin/goods/getDistrict',
    method: 'get',
    params: {
      city_id: id
    }
  })
}
