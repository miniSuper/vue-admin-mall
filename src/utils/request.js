import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { loadToken } from '@/utils/cache'
const service = axios.create({
  // baseURL: 'http://mall.test.ybfg9.cn/public/index.php/',
  baseURL: 'http://shop.glxqw.cn/public/index.php',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.common['X-token'] = loadToken()
    }
    // console.log(config)
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    // console.log(response.data)
    if (response.data.status === 5) {
      Message({
        message: '身份验证已经过期，请重新登录',
        type: 'error'
      })
    }
    return response
  },
  error => {
    // console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
  }
)
export default service
