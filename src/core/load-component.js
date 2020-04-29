/* eslint-disable */
import Vue from 'vue'
import loadModule from './load-module'
import loadConfig from './load-config'
const componentLoading = {
  render: () => {
    return (
      <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <svg viewBox="25 25 50 50" style="height: 42px; width: 42px; animation: loading-rotate 2s linear infinite;">
          <circle
            cx="50"
            cy="50"
            r="20"
            fill="none"
            style="animation: loading-dash 1.5s ease-in-out infinite; stroke-dasharray: 90,150; stroke-dashoffset: 0; stroke-width: 2; stroke: #409EFF; stroke-linecap: round;"
          />
        </svg>
      </div>
    )
  }
}
const componentError = {
  render: () => <div style="width: 100%; height: 100%; text-align: center; display: flex; flex-direction: column; justify-content: center; color: #e6a23c;background: #fff; font-size: 20px"><el-icon class="core-icon icon-ep-undefined" style="margin: 12px;font-size: 130px"></el-icon>模块开发中</div>
}
// from https://github.com/darkskyapp/string-hash/blob/master/index.js
const hash = str => {
  let hash = 5381
  let i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0
}
const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
var cache = new Map()
/**
 * 组件加载器
 * @param  {String}   moduleKey 模块路径
 * @param  {String}   configKey 配置路径
 * @param  {String}   styleKey  样式路径
 * @param  {Object}   options   配置项
 * @author lefreet
 * @date   2019-03-27
 */
export default function loadComponent (
  moduleKey,
  configKey,
  styleKey,
  {
    attach, // props挂载节点，不传默认扁平注入
    loading, // 载入中的替代
    error // 组件异常的替代
  } = {}
) {
  // *** 鉴于组件的生成和外部参数相关，暂时不打算做缓存（可能外部出现component:is不断重新渲染的情况）
  if (!moduleKey) return

  if (loading === true) loading = componentLoading
  if (error === true) error = componentError

  // 暂时不知道性能损耗多大
  const key = hash(JSON.stringify(arguments))

  if (cache.has(key)) return cache.get(key)

  const factory = () => {
    const [key, sign] = moduleKey.split('#')

    const component = new Promise(async resolve => {
      // 通过.all，实现组件和配置的并行加载
      // 好像一口气加载了，有空再看看
      let module, config
      try {
        [module, config] = await Promise.all([loadModule(key), loadConfig(configKey)])
      } catch (e) {
        // eslint-disable-next-line
        debugger
        window.console.log(e)
        throw new Error(e)
      }

      // 根据模块类型和sign标示，取出具体组件，并且拷贝
      const component = module.__esModule === true ? module[sign || 'default'] : module
      // 扩展组件，让组件将所有mixins的props都计算成标准结构
      const Sub = Vue.extend(component)
      const values = attach === undefined ? config : { [attach]: config }
      const props = {}
      // 复制prop，并注入default值
      Object
        .entries(Sub.options.props || {})
        .forEach(([key, prop]) => {
          const value = values[key]
          props[key] = Object.assign({}, prop)
          if (value === undefined) return
          // 如果是数组或者对象就构造成工厂
          props[key].default = Array.isArray(value) || isObject(value) ? () => value : value
          // 已经是注入的情况，就不需要必填了
          props[key].required = false
          // 数据备份
          props[key].__injected = value
        })
      // 再次构造一个新组件
      resolve(Sub.extend({ props }))
    })

    return {
      component,
      loading,
      error
    }
  }
  // 缓存
  cache.set(key, factory)

  return factory
}
