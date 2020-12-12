<template>
  <div class="editor">
    <div class="top-container">
      <!-- <ToolBar></ToolBar> -->
      <transition
        name="animated"
        enter-active-class="animate__animated animate__shakeY"
        leave-active-class="animate__animated animate__zoomOut"
        :duration="{ enter: 150, leave: 1000 }"
      >
        <!-- <transition
        name="animated"
        enter-active-class="animate__animated animate__fadeInDown"
        leave-active-class="animate__animated animate__fadeOutUp"
        leave-active-class="animate__animated animate__zoomOutDown"
        :duration="{ enter: 1000, leave: 800 }"
      > -->
        <ToolBar
          :style="{
            height: show.top ? '54px' : '0px',
            opacity: show.top ? 1 : 0,
          }"
          v-show="show.top"
        >
        </ToolBar>
      </transition>
      <i class="gb-toggle-btn top" @click="handleBtnClick('top')"></i>
    </div>
    <div class="middle-container">
      <div class="left-panel">
        <transition
          name="animated"
          enter-active-class="animate__animated animate__zoomIn"
          leave-active-class="animate__animated animate__zoomOut"
          :duration="{ enter: 1000, leave: 150 }"
        >
          <LeftPanel
            :style="{
              width: show.left ? '342px' : '0px',
              opacity: show.left ? 1 : 0,
            }"
            v-show="show.left"
          ></LeftPanel>
        </transition>
        <i class="gb-toggle-btn left" @click="handleBtnClick('left')"></i>
      </div>
      <div class="center-panel" :style="{ width: centerWidth }">
        <CenterPanel></CenterPanel>
      </div>
      <div class="right-panel">
        <transition
          name="animated"
          enter-active-class="animate__animated animate__zoomIn"
          leave-active-class="animate__animated animate__zoomOut"
          :duration="{ enter: 1000, leave: 150 }"
        >
          <RightPanel
            :style="{
              width: show.right ? '300px' : '0px',
              opacity: show.right ? 1 : 0,
            }"
            v-show="show.right"
          ></RightPanel>
        </transition>
        <i class="gb-toggle-btn right" @click="handleBtnClick('right')"></i>
      </div>
    </div>
    <div class="bottom-container">
      <transition
        name="animated"
        enter-active-class="animate__animated animate__bounceIn"
        leave-active-class="animate__animated animate__fadeOutDownBig"
        :duration="{ enter: 1000, leave: 150 }"
      >
        <FootBar
          :style="{
            height: show.bottom ? '50px' : '0px',
            opacity: show.bottom ? 1 : 0,
          }"
          v-show="show.bottom"
        ></FootBar>
      </transition>
      <i class="gb-toggle-btn bottom" @click="handleBtnClick('bottom')"></i>
    </div>
  </div>
</template>

<script>
import "../../assets/icon/font.css";

import ToolBar from "../ToolBar";
import LeftPanel from "../LeftPanel";
import CenterPanel from "../CenterPanel";
import RightPanel from "../RightPanel";
import FootBar from "../FootBar";
import { resizeCanvas, listenCanvasResize } from "@/utils/graph.js";
import originData from "@/assets/data/FeHelper-20201112134758.json";
import G6 from "@antv/g6";

/* 注册所有插件：自定义节点、边、行为 */
import "../../g6-common/plugins";

/* 引入demo数据 */
import getData from "../../demo/getData3"
// import getData from "../../demo/getData4"
const model = getData()

// console.log('global：', model)

export default {
  name: "BaseFlow",
  props: {
    data: Object, // 传入数据
    getData: Function, // 获取数据
  },
  components: {
    ToolBar,
    LeftPanel,
    CenterPanel,
    RightPanel,
    FootBar,
  },
  computed: {
    /* 动态计算中心画布的宽度 */
    centerWidth() {
      let str = "100vw";

      if (this.show.left && this.show.right) {
        str = `calc(100vw - 340px - 300px)`;
      } else if (this.show.left) {
        str = "calc(100vw - 340px)";
      } else if (this.show.right) {
        str = "calc(100vw - 300px)";
      } else {
        str = "calc(100vw)";
      }

      return str;
    },
  },
  data() {
    return {
      page: null,
      flow: null,
      graph: null,
      nodeId: null,
      nodeName: null,
      nodeWidth: null,
      nodeHeight: null,
      nodeColor: null,
      groupId: null,
      groupName: null,
      groupColor: null,
      edgeId: null,
      edgeName: null,
      multiId: [], // 多选模式选中的node节点id
      multiColor: null, // 多选模式下的color，仅以最后一个为代表颜色
      isMultiSelect: false, // 是否是多选模式
      gridCheck: false,
      zoomRatio: 100,

      show: {
        top: true,
        left: true,
        bottom: true,
        right: true,
      },
    };
  },
  mounted() {
    this.initEditor();
  },
  watch: {
    nodeName() {},
    nodeWidth() {},
    nodeHeight() {},
    multiColor() {},
    nodeColor() {},
    edgeName() {},
    groupName() {},
    groupColor() {},
    gridCheck() {},
    zoomRatio() {},
  },
  methods: {
    /**
     * @description: 初始化编辑器
     */
    initEditor() {
      console.log("originData:", originData);
      const oriData = originData;
      // const data = {
      //   nodes: oriData.nodes,
      //   edges: oriData.edges.map(function(edge, i) {
      //     return { ...edge, id: "edge" + i };
      //   }),
      // };

      /**
      fetch('https://gw.alipayobjects.com/os/bmw-prod/f1565312-d537-4231-adf5-81cb1cd3a0e8.json')
  .then((res) => res.json())
  .then((data) => {

fetch('https://gw.alipayobjects.com/os/basement_prod/0b9730ff-0850-46ff-84d0-1d4afecd43e6.json')
  .then((res) => res.json())
  .then((data) => {


       */

      const data = model.graphData

      const grid = new G6.Grid();
      const minimap = new G6.Minimap({
        container: "mini-map",
        size: [
          document.querySelector("#mini-map").clientWidth,
          document.querySelector("#mini-map").clientHeight,
        ],
      });
      const graph = new G6.Graph({
        container: "canvas",
        plugins: [grid, minimap],
        type: "graph",
        width: 600 * 2,
        height: 500 * 2,
        pixelRatio: 2,
        renderer: "canvas",
        fitView: true,
        defaultNode: {
          size: 15,
          color: "#5B8FF9",
          style: {
            lineWidth: 1,
            fill: "#C6E5FF",
          },
        },
        defaultEdge: {
          size: 1,
          color: "#e2e2e2",
        },
        layout: {
          // type: "force",
          // type: 'comboForce',
          // nodeSpacing: (d) => 8,
          type: 'gForce',
          center: [ 200, 200 ], 
          workerEnabled: true, 
          gpuEnabled: true,
          maxIteration: 1000,
          linkDistance: 50,         // 可选，边长
          nodeStrength: 30,         // 可选
          edgeStrength: 0.1,        // 可选
          onTick: () => {           // 可选
            console.log('ticking');
          },
          onLayoutEnd: () => {      // 可选
            console.log('combo force layout done');
          }
        },

        groupByTypes: false, // 若希望在带有 combo 的图上，节点、边、combo 的层级符合常规逻辑，需要将 groupByTypes 设置为 false
        // layout: {
        //   type: 'comboForce',
        //   workerEnabled: true, 
        //   gpuEnabled: true,
        //   center: [ 200, 200 ],     // 可选，默认为图的中心
        //   linkDistance: 50,         // 可选，边长
        //   nodeStrength: 30,         // 可选
        //   edgeStrength: 0.1,        // 可选
        //   onTick: () => {           // 可选
        //     console.log('ticking');
        //   },
        //   onLayoutEnd: () => {      // 可选
        //     console.log('combo force layout done');
        //   }
        // },

        // layout: {
        //   type: 'fruchterman',
        //    gravity: 10,
        //   clustering: true,
        //   clustering: true,
        //   workerEnabled: true,
        //   gpuEnabled: true,
        // },
        // animate: true,

        modes: {
          default: ["zoom-canvas", "drag-canvas",'drag-combo', 'drag-node'],
        },
      });

      window.data = data;
      window.graph = graph;

      graph.read(data);
      graph.render();
      listenCanvasResize(window, ".centerpel-wrapper");
      this.initEvents();
    },

    /**
     * @description: 初始化事件
     */
    initEvents () {
      const graph = window.graph
      const forceLayout = graph.get('layoutController').layoutMethod;
      const refreshDragedNodePosition = e => {
        const model = e.item.get("model");
        model.fx = e.x;
        model.fy = e.y;
      };

      graph.on('node:dragstart', e => {
        // graph.layout()
        refreshDragedNodePosition(e)
      })
      graph.on('node:drag', e => {
        // raph.layout()
        // forceLayout.execute()
        refreshDragedNodePosition(e)
      })
      graph.on('node:dragend', e => {
        e.item.get('model').fx = null
        e.item.get('model').fy = null
      })
    },

    /**
     * @description: 保存流图数据
     */
    saveFlow() {},

    /**
     * @description: 处理收缩按钮的点击事件
     */
    handleBtnClick(position) {
      this.show[position] = !this.show[position];
      resizeCanvas();
    },
  },
};
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 收缩的按钮 */
  .gb-toggle-btn {
    position: absolute;
    background: #fff;
    cursor: pointer;
    z-index: 1;

    /* 向下的半圆 */
    &.top {
      width: 20px;
      height: 10px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
      transform: translate(-50%, 0);
      top: 100%;
      left: 50%;
    }

    /* 向右的半圆 */
    &.left {
      width: 10px;
      height: 20px;
      border-radius: 0 10px 10px 0;
      box-shadow: 2px 0px 2px 0 rgba(0, 0, 0, 0.1);
      transform: translate(0, -50%);
      top: 50%;
      left: 100%;
    }
    /* 向左的半圆 */
    &.right {
      width: 10px;
      height: 20px;
      border-radius: 10px 0 0 10px;
      box-shadow: -2px 0px 2px 0 rgba(0, 0, 0, 0.1);
      transform: translate(0, -50%);
      top: 50%;
      left: -10px;
    }

    /* 向上的半圆 */
    &.bottom {
      width: 20px;
      height: 10px;
      border-radius: 10px 10px 0 0;
      box-shadow: 0 -2px 2px 0 rgba(0, 0, 0, 0.1);
      transform: translate(-50%, 0);
      top: -10px;
      left: 50%;
    }
  }

  .top-container {
    flex: 0;
    position: relative;
  }

  .left-panel {
    position: relative;
  }

  .right-panel {
    position: relative;
  }

  .center-panel {
    position: relative;
    z-index: 0;
  }
  .middle-container {
    flex: 20;
  }
  .bottom-container {
    background: mediumpurple;

    position: relative;
  }

  .middle-container {
    width: 100%;
    height: calc(100vh - 120px);
    display: flex;
    background: #f7f9fb;
    // justify-content: space-around;
    justify-content: space-between;
    .title {
      display: flex;
      width: 100%;
      align-items: center;
      height: 34px;
      font-weight: 600;
      font-size: 16px;
      padding: 0 20px;
      background: #cfd4d9;
    }
    .center-panel {
      background: #ffffff;
      display: inline-block;
      width: 100%;
      height: 100%;
      border: 1px solid #dedbe2;
    }
  }
}
</style>
