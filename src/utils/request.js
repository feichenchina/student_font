import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
})
// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      if (res.code == 403) {
        Message({
          message: '没有权限访问',
          type: 'error',
          duration: 5 * 1000,
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000,
        })
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    if (error.response.status == 403) {
      Message({
        message: '没有权限访问',
        type: 'error',
        duration: 5 * 1000,
      })
    } else {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })
    }
    console.log('err' + error) // for debug
    // Message({
    //   message: '服务器出错，请重试',
    //   type: 'error',
    //   duration: 5 * 1000,
    // })
    return Promise.reject(error)
  }
)

export default service
