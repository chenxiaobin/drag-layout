<template>
  <div class="test">
    <div class="name">测试组件</div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style>
.test {
  width: 100%;
  height: 100%;
  background: grey;
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
