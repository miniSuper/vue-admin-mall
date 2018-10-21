import { loadToken } from '@/utils/cache.js'

const state = {
  token: loadToken(),
  roles: [],
  name: '',
  nickname: '',
  avatar: '/static/avatar.jpg',
  introduction: '',
  userInfo: {}
}
export default state
