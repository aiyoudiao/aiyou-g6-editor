<template>
  <div class="leftpel-wrapper">
    <el-collapse v-model="activeItems">
      <!-- 各种节点面板 -->
      <el-collapse-item
        v-for="item in nodeModels"
        :title="item.name"
        :name="item.id"
        :key="item.name + item.id"
      >
        <div class="panel-item">
          <div v-for="node in item.data" :key="node.dataId" class="node-box">
            <img
              :draggable="node.draggable"
              :src="node.src"
              :data-type="node.dataType"
              :data-shape="node.dataShape"
              :data-size="node.dataSize"
              :width="node.width"
              :height="node.height"
              :data-color="node.dataColor"
              :data-label="node.dataLabel"
              :alt="node.alert"
              :title="node.title"
              class="getItem"
              @dragstart="handleDragstart($event, node)"
              @dragend="handleDragend"
            />
            <p>{{ node.dataLabel }}</p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 导航器 -->
    <div class="navigator">
      <span class="panel-title">导航器</span>
      <div class="mini-map" id="mini-map" ref="minimap"></div>
    </div>
  </div>
</template>

<script>
import nodeModels from "../../data";
export default {
  name: "",
  props: {
  },
  data() {
    return {
      activeItems: ["3"],
      nodeModels: [],
    };
  },
  computed: {},
  watch: {
  },
  created() {},
  beforeCreate() {},
  mounted() {
    this.nodeModels = nodeModels;

    const { nodeLevel } = this.$route.query;
    this.activeItems = ["" + nodeLevel]

  },
  components: {},
  methods: {
    handleDragstart(event, node) {
      event.dataTransfer.setData("content", JSON.stringify(node));
    },
    handleDragend(event) {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.leftpel-wrapper {
  width: 340px;
  transition: all 1s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  background-color: #fff;
  border: 2px solid #e9e9e9;
  // padding: 20px;

  ::v-deep .el-collapse {
    padding-left: 15px;
    padding-right: 15px;
  }

  .panel-item {
    widht: 100%;

    .node-box {
      text-align: center;
    }

    div {
      width: 33.333%;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .navigator {
    width: 100%;
    // height: 25%;
    height: 400px;
    flex-grow: 1;
    .panel-title {
      display: block;
      height: 32px;
      border-top: 1px solid #dce3e8;
      border-bottom: 1px solid #dce3e8;
      background: #ebeef2;
      color: #000;
      line-height: 28px;
      padding-left: 12px;
    }
    .mini-map {
      width: 100%;
      height: calc(100% - 34px);
    }
  }
}
</style>
