import request from '@/utils/request'
export function loginByUsername (username, password) {
  let data = new URLSearchParams()
  data.append('username', username)
  data.append('password', password)
  return request({
    url: '/admin/index/login',
    method: 'post',
    data
  })
}
export function getUserInfo () {
  return request({
    url: '/admin/user/getuserinfo',
    method: 'get'
  })
}
