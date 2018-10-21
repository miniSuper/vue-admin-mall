import * as types from './mutation-types'
import { saveToken, deleteToken } from '@/utils/cache.js'
import { loginByUsername, getUserInfo } from '@/api/login'
export const setToken = ({ commit }, token) => {
  commit(types.SET_TOKEN, saveToken(token))
}
export const logOut = ({ commit }, token) => {
  commit(types.SET_TOKEN, deleteToken())
}
export const LoginByUsername = ({ commit }, userInfo) => {
  const username = userInfo.username.trim()
  const password = userInfo.password.trim()
  return new Promise((resolve, reject) => {
    loginByUsername(username, password)
      .then(response => {
        const res = response.data.data
        // console.log(response)
        commit('SET_TOKEN', saveToken(res.token))
        resolve(res)
      })
      .catch(error => {
        console.log(error)
        reject(error)
      })
  })
}

// 获取用户信息
export const GetUserInfo = ({ commit, state }) => {
  return new Promise((resolve, reject) => {
    getUserInfo(state.token)
      .then(res => {
        // if (!response.data) {
        //   // 由于mockjs 不支持自定义状态码只能这样hack
        //   reject(new Error('no data'))
        // }
        // const data = response.data

        // if (data.roles && data.roles.length > 0) {
        //   // 验证返回的roles是否是一个非空数组
        //   commit('SET_ROLES', data.roles)
        // } else {
        //   reject(new Error('getInfo: roles must be a non-null array !'))
        // }

        // commit('SET_NAME', data.name)
        // commit('SET_AVATAR', data.avatar)
        // commit('SET_INTRODUCTION', data.introduction)
        // console.log(res)
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
