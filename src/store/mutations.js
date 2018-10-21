import * as types from './mutation-types'
const mutations = {
  [types.SET_TOKEN] (state, token) {
    state.token = token
  },
  [types.SET_ROLES] (state, roles) {
    state.roles = roles
  },
  [types.SET_NAME] (state, name) {
    state.name = name
  },
  [types.SET_NICKNAME] (state, nickname) {
    state.nickname = nickname
  },
  [types.SET_INTRODUCTION] (state, introduction) {
    state.introduction = introduction
  },
  [types.SET_AVATAR] (state, avatar) {
    state.avatar = avatar
  },
  [types.SET_USERINFO] (state, userInfo) {
    state.userInfo = userInfo
  }
}
export default mutations
