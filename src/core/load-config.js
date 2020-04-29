/* eslint-disable */
import axios from 'axios'
import string2function from './string2function'
// 配置
// 1. '/lib/home/config.js' - js地址
// 2. '/lib/home/config.json' - json地址
// 3. '/api/v1/config/home' - 接口配置
// 4. '{}' - json字符串
// 5. {} - 对象
// 6. fn - 函数
// 7. js对象字符串
// * 关键字
const require = window.require
// 缓存，目前只有json/api两种需要缓存
var cache = {}
export default function loadConfig (key) {
  return new Promise(async resolve => {
    const REG_JS = /(\.js)$/
    const REG_JSON = /(\.json)$/
    const REG_API = /^(api|\/api)/ // 不太好

    if (cache[key]) {
      resolve(cache[key])
    } else if (typeof key === 'function') {
      resolve(await key())
    } else if (REG_JSON.test(key)) {
      axios.get(key, {
        baseURL: ''
      }).then(res => {
        const config = res.data
        resolve(cache[key] = config)
      })
    } else if (REG_API.test(key)) {
      axios.get(key).then(res => {
        const config = res.data.data
        resolve(cache[key] = config)
      })
    } else if (REG_JS.test(key)) {
      // require自带缓存
      require(
        [key],
        config => {
          resolve(config)
        }
      )
    } else if (Object.prototype.toString.call(key) === '[object Object]') {
      resolve(key)
    } else {
      resolve(string2function(key)())
      // try {
      //   resolve(JSON.parse(key || '{}'))
      // } catch (e) {
      //   console.error('【ep日志】解析配置失败：', key)
      //   console.error(e)
      //   resolve({})
      // }
    }
  })
}
