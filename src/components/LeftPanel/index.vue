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
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import nodeModels from "../../data";
export default {
  name: "",
  props: {},
  data() {
    return {
      activeItems: ["1"],
      nodeModels: []
    };
  },
  computed: {},
  watch: {},
  created() {},
  beforeCreate() {},
  mounted() {
    this.nodeModels = nodeModels;
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
    }
  }
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
}
</style>
