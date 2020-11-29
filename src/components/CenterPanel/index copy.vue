<template>
  <div class="centerpel-wrapper">
    <div class="canvas" ref="canvas" v-if="Object.keys(data).length">
      <v-graph
        ref="graph"
        :data="data"
        :width="graph.width"
        :height="graph.height"
        :layout="graph.layout"
        :modes="graph.modes"
        :defaultNode="graph.defaultNode"
        :defaultEdge="graph.defaultEdge"
      >
        <v-node :events="node.events"></v-node>
      </v-graph>
    </div>
    <div
      class="contextmenu"
      ref="contextmenu"
      style="position: absolute; z-index: 2;"
    >
      <div data-status="node-selected" class="menu" style="display: none;">
        <div data-command="copy" class="command disable">
          <span>复制</span>
          <!-- <span>copy</span> -->
        </div>
        <div data-command="delete" class="command disable">
          <span>删除</span>
          <!-- <span>delete</span> -->
        </div>
      </div>
      <div data-status="edge-selected" class="menu" style="display: none;">
        <div data-command="delete" class="command disable">
          <span>删除</span>
          <!-- <span>delete</span> -->
        </div>
      </div>
      <div data-status="group-selected" class="menu" style="display: none;">
        <div data-command="copy" class="command disable">
          <span>复制</span>
          <!-- <span>copy</span> -->
        </div>
        <div data-command="delete" class="command disable">
          <span>删除</span>
          <!-- <span>delete</span> -->
        </div>
        <div data-command="unGroup" class="command disable">
          <span>解组</span>
          <!-- <span>unGroup</span> -->
        </div>
      </div>
      <div data-status="canvas-selected" class="menu" style="display: block;">
        <div data-command="undo" class="command disable">
          <span>撤销</span>
          <!-- <span>undo</span> -->
        </div>
        <div data-command="redo" class="command disable">
          <span>重做</span>
          <!-- <span>redo</span> -->
        </div>
        <div data-command="pasteHere" class="command disable">
          <span>粘贴</span>
          <!-- <span>pasteHere</span> -->
        </div>
      </div>
      <div data-status="multi-selected" class="menu" style="display: none;">
        <div data-command="copy" class="command disable">
          <span>复制</span>
          <!-- <span>copy</span> -->
        </div>
        <div data-command="paste" class="command disable">
          <span>粘贴</span>
          <!-- <span>paste</span> -->
        </div>
        <div data-command="addGroup" class="command disable">
          <span>归组</span>
          <!-- <span>addGroup</span> -->
        </div>
        <div data-command="delete" class="command disable">
          <span>删除</span>
          <!-- <span>delete</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import originData from "@/assets/data/FeHelper-20201112134758.json";
import { listenCanvasResize } from "@/utils/graph.js";

const graph = {
  container: "mount",
  type: "graph",
  width: 600,
  height: 500,
  pixelRatio: 2,
  renderer: "canvas",
  fitView: true,
  defaultNode: {
    size: 15,
    color: "#5B8FF9",
    style: {
      lineWidth: 1,
      fill: "#C6E5FF"
    }
  },
  defaultEdge: {
    size: 1,
    color: "#e2e2e2"
  },
  layout: {
    type: "force"
  }
};
const node = {
  events: {
    onDragstart: (e, graph) => {
      graph.layout();
      refreshDragedNodePosition(e);
    },
    onDrag: e => {
      refreshDragedNodePosition(e);
    },
    onDragend: e => {
      e.item.get("model").fx = null;
      e.item.get("model").fy = null;
    }
  }
};

const edge = {
  formatter: () => {
    return {
      shape: "cubic-horizontal",
      color: "#e2e2e2"
    };
  }
};

const refreshDragedNodePosition = e => {
  const model = e.item.get("model");
  model.fx = e.x;
  model.fy = e.y;
};

export default {
  name: "",
  props: {},
  data() {
    return {
      data: {},
      graph,
      node,
      edge
    };
  },
  computed: {},
  watch: {},
  created() {},
  beforeCreate() {},
  mounted() {
    // fetch("https://viserjs.gitee.io/assets/data/forceDirectedLayout.json")
    //   .then(result => result.json())
    //   .then(oriData => {
    console.log("originData:", originData);
    const oriData = originData;
    const data = {
      nodes: oriData.nodes,
      edges: oriData.edges.map(function(edge, i) {
        return { ...edge, id: "edge" + i };
      })
    };
    this.data = data;
    console.log(this.data);
    listenCanvasResize(window, "graph", ".centerpel-wrapper");
    // });
  },
  components: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.centerpel-wrapper {
  height: 100%;
  width: 100%;
  .canvas {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .contextmenu {
    margin: 0px;
    width: 200px;
    background: white;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    color: #000;
    font-size: 12px;
    display: none;
    .command {
      height: 12px;
      padding: 8px;
      box-sizing: content-box;
    }
    .command:hover {
      cursor: pointer;
      background: #e6f7ff;
    }
    .disable {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
