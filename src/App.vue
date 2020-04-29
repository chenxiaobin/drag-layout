<template>
  <div id="app">
    <manage-layout></manage-layout>
  </div>
</template>

<script>
import ManageLayout from './views/manage-layout.vue'

export default {
  name: 'App',
  components: {
    ManageLayout
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
</style>
