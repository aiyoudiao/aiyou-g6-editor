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
            :data="data"
          ></LeftPanel>
        </transition>
        <i class="gb-toggle-btn left" @click="handleBtnClick('left')"></i>
      </div>
      <div class="center-panel" :style="{ width: centerWidth }">
        <CenterPanel :data="data"></CenterPanel>
      </div>
      <!-- <div class="right-panel">
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
      </div> -->
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
import G6 from "@antv/g6";
import insertCss from "insert-css";
import originData from "@/assets/data/FeHelper-20201112134758.json";

/* 注册所有插件：自定义节点、边、行为 */
import "../../g6-common/plugins";

/* 引入demo数据 */
// import getData from "../../demo/getData7";
import getData from "../../demo/getData8";
const model = getData();

export default {
  name: "Editor",
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
        top: false,
        left: true,
        bottom: false,
        right: false,
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
      // const data = {
      //   nodes: originData.nodes,
      //   edges: originData.edges.map(function(edge, i) {
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
      //     fetch('https://gw.alipayobjects.com/os/bmw-prod/f1565312-d537-4231-adf5-81cb1cd3a0e8.json')
      // .then((res) => res.json())
      // .then((data) => {
      const data = model.graphData;

      const tooltip = new G6.Tooltip({
        // offsetX and offsetY include the padding of the parent container
        // offsetX 与 offsetY 需要加上父容器的 padding
        offsetX: 10,
        offsetY: 10,
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ["node", "edge"],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          const outDiv = document.createElement("div");
          outDiv.style.width = "fit-content";
          outDiv.style.height = "fit-content";
          const model = e.item.getModel();
          if (e.item.getType() === "node") {
            outDiv.innerHTML = `${model.label}`;
          } else {
            const source = e.item.getSource();
            const target = e.item.getTarget();
            outDiv.innerHTML = `来源：${source.getModel().label}<br/>去向：${
              target.getModel().label
            }`;
          }
          return outDiv;
        },
      });

      const toolbar = new G6.ToolBar({
        // container: tc,
        className: "g6-toolbar-ul",
        getContent: () => {
          return `
          <ul>
            <li code='add'>增加节点</li>
            <li code='undo'>撤销</li>
            <li code='redo'>回退</li>
          </ul>
        `;
        },
        handleClick: (code, graph) => {
          if (code === "add") {
            graph.addItem("node", {
              id: "node2",
              label: "node2",
              x: 300,
              y: 150,
            });
          } else if (code === "undo") {
            toolbar.undo();
          } else if (code === "redo") {
            toolbar.redo();
          }
        },
      });

      const grid = new G6.Grid();
      const minimap = new G6.Minimap({
        container: "mini-map",
        size: [
          document.querySelector("#mini-map").clientWidth,
          document.querySelector("#mini-map").clientHeight,
        ],
      });
      const edgeBundling = new G6.Bundling({
        bundleThreshold: 0.1,
      });

      const graph = new G6.Graph({
        container: "canvas",
        plugins: [grid, minimap, tooltip, edgeBundling],
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
            fill: "#698b8f",
            lineWidth: 0,
          },
        },
        defaultEdge: {
          size: 1,
          color: "#e2e2e2",
        },
        layout: {
          // type: "force",
          type: "gForce",
          center: [800, 800],
          //nodeSize: 100,
          //nodeSpacing: 100,
          //gatherDiscreteCenter: [500, 100],
          preventOverlap: true,
          // maxIteration: 1000,
          // linkDistance: 50,         // 可选，边长
          // nodeStrength: 30,         // 可选
          // edgeStrength: 0.1,        // 可选
          // center: [200, 200], // 可选，默认为图的中心
          // linkDistance: 200, // 可选，边长
          // nodeStrength: 200, // 可选
          // edgeStrength: 10, // 可选
          preventOverlap: true, // 可选，必须配合 nodeSize
          preventOverlapPdding: 200, // 可选
          onTick: () => {
            // 可选
            // console.log("ticking");
          },
          onLayoutEnd: () => {
            // 可选
            // console.log("combo force layout done");
          },
        },

        groupByTypes: false, // 若希望在带有 combo 的图上，节点、边、combo 的层级符合常规逻辑，需要将 groupByTypes 设置为 false

        // animate: true,

        modes: {
          default: [
            "zoom-canvas",
            "drag-canvas",
            // "drag-combo",
            "drag-node",
            "lasso-select",
            // 'click-select',
            // "activate-relations",
          ],
          dragLasso: [
            {
              type: "lasso-select",
              delegateStyle: {
                fill: "#f00",
                fillOpacity: 0.05,
                stroke: "#f00",
                lineWidth: 1,
              },
              onSelect: (nodes, edges) => {
                console.log("onSelect", nodes, edges);
              },
              trigger: "drag",
            },
            "drag-node",
          ],
        },
      });

      window.data = data;
      window.graph = graph;

      const { nodes } = data;
      nodes.forEach(function(node) {
        node.oriSize = node.size;
        node.oriLabel = node.label;
        node.oriLabelCfg = {
          position: "bottom",
        };
      });

      graph.read(data);
      graph.render();
      listenCanvasResize(window, ".centerpel-wrapper");
      this.initEvents();
      this.initModes();
      // })
    },

    /**
     * @description: 初始化事件
     */
    initEvents() {
      const graph = window.graph;
      const forceLayout = graph.get("layoutController").layoutMethod;
      const refreshDragedNodePosition = (e) => {
        const model = e.item.get("model");
        model.fx = e.x;
        model.fy = e.y;
      };

      graph.on("node:dragstart", (e) => {
        // graph.layout()
        refreshDragedNodePosition(e);
      });
      graph.on("node:drag", (e) => {
        // graph.layout()
        // forceLayout.execute()
        refreshDragedNodePosition(e);
      });
      graph.on("node:dragend", (e) => {
        e.item.get("model").fx = null;
        e.item.get("model").fy = null;
      });

      // /* 节点点击后显示详细属性 */
      // graph.on("node:click", function(e) {
      //   const node = e.item;
      //   const states = node.getStates();
      //   let clicked = false;
      //   const model = node.getModel();
      //   let size = 200;

      //   const { interfaceIp, interfaceName, deviceName, deviceType } = model;

      //   console.log(model);

      //   let labelText =
      //     `interfaceIp:${interfaceIp},\n` +
      //     `interfaceName:${interfaceName},\n` +
      //     `deviceName:${deviceName},\n` +
      //     `deviceType:${deviceType},\n`;

      //   let labelCfg = {
      //     position: "center",
      //   };
      //   // let labelText = 'NODE: ' + model.id + '\n' + model.description;
      //   states.forEach(function(state) {
      //     if (state === "click") {
      //       clicked = true;
      //       size = model.oriSize;
      //       labelText = model.oriLabel;
      //       labelCfg = model.oriLabelCfg;
      //     }
      //   });
      //   graph.setItemState(node, "click", !clicked);
      //   graph.updateItem(node, {
      //     size,
      //     label: labelText,
      //     labelCfg: labelCfg,
      //   });
      //   // graph.layout();
      // });
    },

    initTools() {
      insertCss(`
        .g6-component-tooltip {
          border: 1px solid #e2e2e2;
          border-radius: 4px;
          font-size: 12px;
          color: #000;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 10px 8px;
          box-shadow: rgb(174, 174, 174) 0px 0px 10px;
        }
      `);

      insertCss(`
        .g6-toolbar-ul {
          position: absolute;
          top: 70px;
          border: 1px solid #e2e2e2;
          border-radius: 4px;
          font-size: 12px;
          color: #545454;
          background-color: rgba(255, 255, 255, 0.9);
          padding: 10px 8px;
          box-shadow: rgb(174, 174, 174) 0px 0px 10px;
          width: 100px;
          cursor: pointer;
        }
      `);
    },

    /**
     * @Description  初始化模式
     * @date 2020-12-16
     * @returns {any}
     */

    initModes() {
      const switchDiv = document.createElement("div");
      const container = document.getElementById("centerpel-wrapper");
      container.appendChild(switchDiv);

      const graph = window.graph;
      switchDiv.addEventListener("click", (e) => {
        graph.setMode("dragLasso");
      });

      // graph.on("node:mouseenter", (e) => {
      //   graph.setItemState(e.item, "active", true);
      // });

      // graph.on("node:mouseleave", (e) => {
      //   graph.setItemState(e.item, "active", false);
      // });

      graph.on("nodeselectchange", (e) => {
        // console.log(e.selectedItems, e.select);
        
      });
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
