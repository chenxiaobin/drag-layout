<template>
  <div class="test">
    <div class="name">测试组件{{uid}}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      uid: null
    }
  },
  mounted () {
    this.uid = this._uid
  }
}
</script>
<style>
.test {
  width: 100%;
  height: 100%;
  background: #40b9d1;
  color: #ffffff;
  font-size: 20px;
  text-align: center;
  position: relative;
}
.name {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
}
</style>
