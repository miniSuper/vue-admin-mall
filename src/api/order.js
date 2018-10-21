import request from '@/utils/request'
// 获取订单列表
export function getOrderList (params) {
  return request({
    url: '/admin/order/lst',
    method: 'get',
    params
  })
}
// 添加订单备注
export function addOrderComments (data) {
  return request({
    url: 'admin/order/memo',
    method: 'post',
    data
  })
}
// 删除订单
export function deleteOrder (id) {
  return request({
    url: 'admin/order/del',
    method: 'post',
    data: {
      order_id: id
    }
  })
}
// 获取单条订单信息
export function getSingleOrderInfo (id) {
  return request({
    url: 'admin/order/orderOne',
    method: 'get',
    params: {
      order_id: id
    }
  })
}
// 更新收货地址
export function updateOrderAddress (data) {
  return request({
    url: 'admin/order/editAddress',
    method: 'post',
    data
  })
}
