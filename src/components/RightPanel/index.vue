<template>
  <div class="rightpel-wrapper">
    <!-- 属性详情面板 -->
    <div class="detail-panel">
      <div ref="detailpanel">
        <div data-status="node-selected" class="panel" style="display: none;">
          <div class="panel-title">节点</div>
          <div class="block-container">
            <div class="p name">
              名称：
              <el-input size="mini" v-model="nodeName"></el-input>
            </div>
            <div class="p size">
              尺寸：
              <el-input size="mini" v-model="nodeWidth"></el-input>
              <el-input size="mini" v-model="nodeHeight"></el-input>
            </div>
            <div class="p color">
              颜色：
              <el-color-picker
                v-model="nodeColor"
                size="mini"
              ></el-color-picker>
            </div>
          </div>
        </div>
        <div
          data-status="edge-selected"
          class="panel"
          id="edge_detailpanel"
          style="display: none;"
        >
          <div class="panel-title">边</div>
          <div class="block-container">
            <div class="p name">
              名称：
              <el-input size="mini" v-model="edgeName"></el-input>
            </div>
          </div>
        </div>
        <div
          data-status="group-selected"
          class="panel"
          id="group_detailpanel"
          style="display: none;"
        >
          <div class="panel-title">组</div>
          <div class="block-container">
            <div class="p name">
              名称：
              <el-input size="mini" v-model="groupName"></el-input>
            </div>
            <div class="p color">
              颜色：
              <el-color-picker
                v-model="groupColor"
                size="mini"
              ></el-color-picker>
            </div>
          </div>
        </div>
        <div
          data-status="canvas-selected"
          class="panel"
          id="canvas_detailpanel"
          style="display: none;"
        >
          <div class="panel-title">画布</div>
          <div class="block-container">
            <el-checkbox v-model="gridCheck">网格对齐</el-checkbox>
          </div>
        </div>
        <div
          data-status="multi-selected"
          class="panel"
          id="multi_detailpanel"
          style="display: block;"
        >
          <div class="panel-title">多选</div>
          <div class="block-container">
            <div class="p color">
              颜色：
              <el-color-picker
                v-model="multiColor"
                size="mini"
              ></el-color-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 导航器 -->
    <div class="navigator">
      <span class="panel-title">导航器</span>
      <div class="mini-map" id="mini-map" ref="minimap"></div>
    </div>
    <!-- 缩放条 -->
    <div class="zoom-slider">
      <el-slider
        v-model="zoomRatio"
        show-input
        input-size="mini"
        :max="200"
        :format-tooltip="formatTooltip"
      ></el-slider>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
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
      zoomRatio: 100
    };
  },
  computed: {},
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
    zoomRatio() {}
  },
  created() {},
  beforeCreate() {},
  mounted() {},
  components: {},
  methods: {
    /**
     * @description: 格式化
     */
    formatTooltip(val) {
      return `${val}%`;
    }
  }
};
</script>

<style lang="scss" scoped>
.rightpel-wrapper {
  width: 15%;
  min-width: 300px;
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  transition: all 1s cubic-bezier(0.18, 0.89, 0.32, 1.28);

  .detail-panel {
    width: 100%;
    height: 65%;
    background: #f7f9fb;
    border-left: 1px solid #e6e9ed;
    font-size: 13px;
    .panel-title {
      height: 32px;
      border-top: 1px solid #dce3e8;
      border-bottom: 1px solid #dce3e8;
      background: #ebeef2;
      color: #000;
      line-height: 28px;
      padding-left: 12px;
    }
    .block-container {
      padding: 16px 8px;
      .p {
        margin-bottom: 12px;
      }
      .p.name {
        .el-input {
          width: 60%;
          padding: 0 10px;
        }
      }
      .p.size {
        .el-input {
          width: 30%;
          padding: 0 10px;
        }
      }
      .p.color {
        .el-color-picker {
          vertical-align: middle;
        }
      }
    }
  }
  .navigator {
    width: 100%;
    height: 25%;
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
  .zoom-slider {
    width: 100%;
    height: 5%;
    padding: 5px 10px;
    background: #ffffff;
  }
}
</style>
