/*!
 * (c) 2019 by @lefreet
 * Released under the MIT License.
 */
// import _views from '../views'
export var views = {}

export default function loadModule (key) {
  return new Promise((resolve, reject) => {
    if (/(\.js)$/.test(key)) {
      // window.System
      //   .import(key)
      //   .then(module => resolve(module.default))
      //   .catch(error => reject(error))
      window.require(
        [key],
        module => resolve(module),
        error => reject(error)
      )
    } else {
      const module = views[key]
      if (module === undefined) {
        /* eslint-disable */
        reject(`未在/views/index.js中输出该模块：${key}`)
        /* eslint-enable */
      } else {
        // 使用代码分割语法时，本身是() => Promise()的工厂，所以要执行一遍
        resolve(typeof module === 'function' ? module() : module)
      }
    }
  })
}
