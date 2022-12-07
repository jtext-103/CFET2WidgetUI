import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { decode } from '@msgpack/msgpack'

// 响应时间
axios.defaults.timeout = 5000
// 配置cookie
// axios.defaults.withCredentials = true
// 配置请求头
axios.defaults.headers.Pragma = 'no-cache'
axios.defaults.headers['Cache-Control'] = 'no-cache'
//axios.defaults.headers = "{'Pragma': 'no-cache','Cache-Control': 'no-cache'}";//这部分请求头与跨域有关，需要保留
// axios.defaults.headers['Content-Type'] = 'multipart/form-data'; //本来尝试使用此来解决后端获取req body为空的问题，但是使用此则不能正常跨域了
//axios.defaults.headers['X-Requested-with'] = 'XMLHttpRequest'// `headers`是自定义的要被发送的头信息
//axios.defaults.headers['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8" // 这部分请求头与跨域有关，需要保留
// axios.defaults.baseURL = 'http://192.168.2.57:8001';

//axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers['Origin'] ='http://192.168.0.187:8080';
//axios.defaults.headers['Access-Control-Request-Headers'] ='Content-Type';
//axios.defaults.headers['Access-Control-Request-Methods'] ='PUT,POST,GET,DELETE,OPTIONS';
//axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
//axios.defaults.withCredentials = true// 表示跨域请求时是否需要使用凭证

//axios.defaults.withCredentials = false

axios.interceptors.request.use(
  config => {
    /* if (token) {
            config.headers.Authorization = `token123`;
        } */
    config.headers.common['Access-Control-Allow-Origin'] = '*'
    // if (config.method === 'post') {
    //   config.data = qs.stringify(config.data)
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器 等messagepack
axios.interceptors.response.use(
  response => {
    // 拦截响应，做统一处理
    if (response.headers['Content-Encoding'] === 'MessagePack') {
      console.log('zhelizhelizheli')
      console.log(response.data)
      response.data = decode(response.data)
    }
    return response
  },
  // 接口错误状态处理，也就是说无响应时的处理
  error => {
    return Promise.reject(error) // 返回接口返回的错误信息
  })

// export default axios;
// 静态资源
Vue.prototype.$static = ''
// axios.defaults.baseURL = '';

window.$axios = axios
