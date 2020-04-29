export default {
  methods: {
    getStorageItem (key) {
      return window.localStorage.getItem(key)
    },
    /**
    * [setItem 设置item]
    */
    setStorageItem (name, value) {
      window.localStorage.setItem(name, value)
    },
    /**
     * [removeItem 删除指定的item]
     */
    removeStorageItem (state, name) {
      window.localStorage.removeItem(name)
    },
    /**
     * [clearStorage 清除storage]
     */
    clearStorage (state) {
      window.localStorage.clear()
    }
  }
}
