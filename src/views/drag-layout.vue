<template>
  <div class="emergency-grid-layout" ref="RefGridLayout">
    <div class='e-layout' :class="draggable ? 'e-layout-draggable' : ''">
      <grid-layout :layout.sync="renderGridLayout"
          :col-num="colNum"
          :row-height="rowHeight"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :is-mirrored="false"
          :vertical-compact="true"
          :prevent-collision="false"
          :use-css-transforms="true"
          :margin="[2, 2]"
          v-bind:style="{ height: '100%', width: '100%'}"

          @layout-updated="layoutUpdatedEvent"
          >
          <grid-item v-for="item in renderGridLayout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            :class="{ 'drop-active': item.isActive}">
          <template v-if="item.moduleConfig">
            <transition enter-active-class="animated flipInX"
                        leave-active-class="animated fadeOut"
                        mode="out-in"
                        :duration="{leave:300}">
              <component :config="item.moduleConfig.config"
                        :ref="item.moduleConfig.component_name"
                        :is="loadComponent(item.moduleConfig)" />
            </transition>
          </template>
          </grid-item>
      </grid-layout>
    </div>
  </div>
</template>
<script>
import load from '../core'
import storage from '../mixins/storage'
import { GridLayout, GridItem } from 'vue-grid-layout'
import components from '../mock/components'
export default {
  mixins: [storage],
  props: {
    layout: Object,
    tempLayout: Object,
    colNum: {
      type: Number,
      default: 200
    },
    rowHeight: {
      type: Number,
      default: 5
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      gridWidth: null,
      gridHeight: null,
      resizable: true,
      gridLayout: [],
      tempGridLayout: null,
      tempComponents: null
    }
  },
  components: {
    GridLayout, GridItem
  },
  computed: {
    renderGridLayout () {
      return this.tempGridLayout || this.gridLayout
    }
  },
  watch: {
    tempLayout: {
      deep: true,
      handler () {
        const layoutJson = this.getLayoutRef(this.tempLayout)
        this.tempGridLayout = this.resetLayoutY(layoutJson)
      }
    },
    gridLayout: {
      deep: true,
      handler () {
        console.log(11111)
      }
    }
  },
  mounted () {
    const layoutJson = this.getLayoutRef()
    this.$nextTick(() => {
      const dom = this.$refs.RefGridLayout
      this.gridWidth = dom && dom.offsetWidth
      this.gridHeight = dom && dom.offsetHeight
      this.gridLayout = this.resetLayoutY(layoutJson)
    })
    if (!this.getStorageItem('LayoutConfig')) {
      this.setStorageItem('LayoutConfig', JSON.stringify(this.layout))
    }
  },
  methods: {
    // 组件关联
    getLayoutRef (layout) {
      const layoutJson = layout || JSON.parse(this.getStorageItem('LayoutConfig')) || this.layout
      layoutJson && layoutJson.layout.map((v) => {
        // 处理关联组件1
        v.moduleConfig = components.find((d) => {
          return d.id === v.relativeModule
        })
      })
      return layoutJson
    },
    // 重置布局y值让高度自适应
    resetLayoutY (ldata) {
      const { height, layout } = ldata
      const _newlayout = []
      layout.map(v => {
        const _o = Object.assign({}, v)
        const _h = this.gridHeight * Math.round(5 * v.h + Math.max(0, v.h - 1) * 2) / height // rowHeight = 5,
        _o.h = Math.round((_h + 2) / 7)
        _newlayout.push(_o)
      })

      _newlayout.map(v => {
        if (v.y) {
          const _h = this.gridHeight * Math.round(5 * v.y + Math.max(0, v.y - 1) * 2) / height // rowHeight = 5,
          v.y = Math.round((_h + 2) / 7)
        }
      })
      return _newlayout
    },
    // 布局变更后存储临时布局中
    layoutUpdatedEvent (data) {
      if (this.tempComponents) {
        // 这个时候的高度就不是this.layout中的高度了，因为layout的y数据已经是修改后的
        this.resetGridComponents(this.tempComponents, data, this.gridHeight)
      } else {
        this.tempGridLayout = data
      }
    },
    loadComponent (item) {
      if (typeof item.path === 'string') {
        return load(item.path, item.config, null, { attach: 'config' })
      } else {
        return item.path
      }
    },
    // 外部调用，当组件发生变化的时候
    resetGridComponents (components, nLayout, nHeight) {
      this.tempComponents = components || this.tempComponents
      const temp = this.tempComponents.filter((v) => {
        return v.checked
      })
      // 遍历tempComponents， 对layout进行增删改
      const height = nHeight || this.layout.height
      const layout = nLayout || this.layout.layout
      const newLayout = []
      let count = 0
      temp.map((v) => {
        // 原来就存在的
        const existData = layout.find((d) => {
          return d.relativeModule === v.id
        })

        if (existData) {
          newLayout.push(Object.assign(existData, { moduleConfig: v }))
        } else {
          newLayout.push({
            x: count,
            y: 0,
            w: 100,
            h: 50,
            static: false,
            moved: false,
            relativeModule: v.id,
            moduleConfig: v
          })
          count += 110
        }
      })
      this.tempGridLayout = this.resetLayoutY({ height, layout: newLayout })
    },
    // 外部调用，当布局取消还原的时候
    resetTempLayout () {
      this.tempGridLayout = null
      this.tempComponents = null
      const layoutJson = this.getLayoutRef()
      this.gridLayout = this.resetLayoutY(layoutJson)
    }
  }
}
</script>
<style>
.e-layout,
.vue-grid-layout,
.emergency-grid-layout{
  width: 100%;
  height: 100%;
  position: relative;
}
.drop-active {
  border: solid 2px greenyellow !important;
}

.e-layout-draggable .vue-grid-item>.vue-resizable-handle{
  background-image: url('/resource/images/coner.png');
  background-position: 100% 100%;
  background-repeat: no-repeat;
  background-origin: content-box;
  -webkit-box-sizing: border-box;
}
.e-layout-draggable .vue-grid-item.vue-resizable:hover{
  background: #aaaaaa50;
  /* border: 1px dashed rgba(0, 82, 204, 0.8); */
}
.e-layout-draggable{
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
