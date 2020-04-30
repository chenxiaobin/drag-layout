<template>
  <div class="manage-layout">
    <div class="manage-layout__custom">
      <template v-if="!isCustomEdit">
        <span class="custom__peizhi" @click="isCustomEdit=true">自定义配置</span>
      </template>
      <template v-if="isCustomEdit">
        <span class="custom__manage" @click="isCustomShow=true">管理</span>
        <span class="custom__save" @click="handleSave">保存</span>
        <span class="custom__cancel" @click="handleCancel">取消</span>
      </template>
    </div>
    <div class="manage-layout__box" ref="RefBox">
      <template v-if="layout">
        <drag-layout ref="RefGridBox"
                          :layout="layout"
                          :components="components"
                          :draggable="draggable"></drag-layout>
      </template>
    </div>

    <template v-if="isCustomShow">
      <el-dialog class="special-dialog" title="模块管理" width="60%" :visible.sync="isCustomShow">
        <div class="modules-preview" v-for="(item, key) in tempComponents" :key="`comp_${key}`">
          <div class="modules-preview-thumbnail">
            <img :src="item.img" alt="">
          </div>
          <div class="modules-preview-bottom">
            <span>{{item.name}}</span>
            <button v-if="item.checked" type="error" class="business-btn" @click="item.checked = !item.checked">禁用</button>
            <button v-if="!item.checked" type="primary" class="business-btn" @click="item.checked = !item.checked">启用</button>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleManageCancel">取 消</el-button>
          <el-button type="primary" @click="handleManageSave">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import DragLayout from './drag-layout'
import storage from '../mixins/storage'
import Utils from '../utils/utils2'
export default {
  mixins: [storage],
  props: {
    layoutConfig: {
      type: Object,
      required: true
    },
    components: Array
  },
  data () {
    return {
      layout: null,
      tempLayout: null,
      isCustomEdit: false,
      isCustomShow: false,
      draggable: false,
      tempComponents: null
    }
  },
  components: {
    DragLayout
  },
  watch: {
    isCustomEdit () {
      this.draggable = this.isCustomEdit
    },
    isCustomShow () {
      if (this.isCustomShow) {
        const comps = Utils.objDeepCopy(this.components)
        this.tempComponents = this.tempComponents || comps
      }
    }
  },
  mounted () {
    this.layout = JSON.parse(this.getStorageItem('LayoutConfig')) || this.layoutConfig
    const ckeys = (this.layout.layout && this.layout.layout.map((v) => { return v.relativeModule })) || []

    this.components.map(v => {
      v.checked = !!(ckeys.indexOf(v.id) > -1)
    })
  },
  methods: {
    handleCancel () {
      this.$confirm('将放弃所有操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isCustomEdit = false
        this.$refs.RefGridBox.resetTempLayout()
      })
    },
    handleSave () {
      this.$confirm('此操作将重新保存布局, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const layout = this.$refs.RefGridBox.tempGridLayout
        const width = this.$refs.RefGridBox.gridWidth
        const height = this.$refs.RefGridBox.gridHeight
        if (layout) {
          this.setStorageItem('LayoutConfig', JSON.stringify({ width, height, layout }))
        }
        this.isCustomEdit = false
      })
    },
    handleManageCancel () {
      this.isCustomShow = false
      this.tempComponents = null
    },
    handleManageSave () {
      this.isCustomShow = false
      this.$refs.RefGridBox.resetGridComponents(this.tempComponents)
    }
  }
}
</script>
<style>
.manage-layout {
  width: 100%;
  height: 100%;
  position: relative;
}
.manage-layout__custom {
  width: 100%;
  height: 40px;
}
.manage-layout__custom span {
  display: block;
  float: left;
  margin-right: 10px;
  border-radius: 15px;
  border: 1px solid #000000;
  color: #000000;
  padding: 2px 8px;
  cursor: pointer;
}
.manage-layout__custom span.custom__cancel{
  border: 1px solid #ff0000;
  color: #ff0000;
}
.manage-layout__custom span:hover{
  color: #0000ff;
  border: 1px solid #0000ff;
}
/* .manage-layout__custom span::before{
  content: '';
  width: 17px;
  height: 17px;
  display: block;
  margin-right: 2px;
  margin-top: 2px;
  float: left;
}
.manage-layout__custom span.custom__peizhi::before {
  background-image: url('/resource/images/setting.png');
}
.manage-layout__custom span.custom__save::before {
  background-image: url('/resource/images/icon-save.png');
  background-size: 100% 100%;
}
.manage-layout__custom span.custom__cancel::before {
  background-image: url('/resource/images/icon-cancel.png');
  background-size: 100% 100%;
}
.manage-layout__custom span.custom__manage::before {
  background-image: url('/resource/images/icon-manage.png');
  background-size: 100% 100%;
} */
.manage-layout__box{
  width: 100%;
  height: calc(100% - 40px);
}
.special-dialog .el-dialog {
  height: 70%;
}
.special-dialog .el-dialog__body{
  height: calc(100% - 55px - 70px - 61px);
  overflow: auto;
}
.modules-preview {
  width: calc(calc(100% - 120px)/4);
  height: 150px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  background: #f1f1f1;
  display: inline-block;
  margin-left: 20px;
  margin-bottom: 20px;
}
.modules-preview-thumbnail{
  height: 100px;
}
.modules-preview-thumbnail img{
  width: 100%;
  height: 100px;
  border-radius: 4px 4px 0 0;
}
.modules-preview-bottom {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  display: -webkit-flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding: 5px;
  height: 50px;
}
.business-btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 6px 15px;
  border-radius: 4px;
  -webkit-transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
  transition: color .2s linear,background-color .2s linear,border .2s linear,-webkit-box-shadow .2s linear;
  transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
  transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear,-webkit-box-shadow .2s linear;
  text-transform: none;
  outline: 0;
}
.business-btn[type=error] {
  color: #fff;
  background-color: #f16543;
  border-color: #f16543;
}
.business-btn[type=primary] {
  color: #fff;
  background-color: #2d8cf0;
  border-color: #2d8cf0;
}

</style>
