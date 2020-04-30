<template>
  <div id="app">
    <manage-layout :layoutConfig="layoutConfig" :components="components"></manage-layout>
  </div>
</template>

<script>
import layoutConfig from './mock/layout'
import components from './mock/components'
import ManageLayout from './views/manage-layout.vue'
export default {
  name: 'App',
  components: {
    ManageLayout
  },
  data () {
    return {
      layoutConfig: layoutConfig,
      components: components
    }
  }
}
</script>

<style lang="scss">
body, html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.vue-grid-item {
  background: #40b9d1;
}
</style>
