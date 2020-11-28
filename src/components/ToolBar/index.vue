<template>
  <div class="toolbar-wrapper">
    <div class="toolbar" ref="toolbar">
      <i
        data-command="undo"
        class="command iconfont icon-undo"
        title="撤销"
      ></i>
      <i
        data-command="redo"
        class="command iconfont icon-redo disable"
        title="重做"
      ></i>
      <span class="separator"></span>
      <i
        data-command="copy"
        class="command iconfont icon-copy-o"
        title="复制"
      ></i>
      <i
        data-command="paste"
        class="command iconfont icon-paster-o disable"
        title="粘贴"
      ></i>
      <i
        data-command="delete"
        class="command iconfont icon-delete-o"
        title="删除"
      ></i>
      <span class="separator"></span>
      <i
        data-command="zoomIn"
        class="command iconfont icon-zoom-in-o"
        title="放大"
      ></i>
      <i
        data-command="zoomOut"
        class="command iconfont icon-zoom-out-o"
        title="缩小"
      ></i>
      <i
        data-command="autoZoom"
        class="command iconfont icon-fit"
        title="适应画布"
      ></i>
      <i
        data-command="resetZoom"
        class="command iconfont icon-actual-size-o"
        title="实际尺寸"
      ></i>
      <span class="separator"></span>
      <i
        data-command="toBack"
        class="command iconfont icon-to-back"
        title="层级后置"
      ></i>
      <i
        data-command="toFront"
        class="command iconfont icon-to-front"
        title="层级前置"
      ></i>
      <span class="separator"></span>
      <i
        data-command="multiSelect"
        class="command iconfont icon-select"
        title="多选"
      ></i>
      <i
        data-command="addGroup"
        class="command iconfont icon-group disable"
        title="成组"
      ></i>
      <i
        data-command="unGroup"
        class="command iconfont icon-ungroup disable"
        title="解组"
      ></i>
    </div>
    <div class="operation">
      <el-button size="mini" type="primary">保存</el-button>
      <el-button size="mini" type="primary">下载</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  props: {},
  data() {
    return {
      show: true
    };
  },
  computed: {},
  watch: {},
  created() {},
  beforeCreate() {},
  mounted() {},
  components: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
/* 工具条的包裹层 */
.toolbar-wrapper {
  width: 100%;
  height: 54px;
  background-color: #fff;
  // border-top: 3px solid #e9e9e9;
  // border-bottom: 3px solid #e9e9e9;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);

  /* 新增的部分样式 */
  position: relative;
  z-index: 11;
  -webkit-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
  transition: all 1s cubic-bezier(0.18, 0.89, 0.32, 1.28);

  /* 工具条 */
  .toolbar {
    margin-left: 20px;
    /* 每一个小图标 */
    .command {
      padding: 10px;
      cursor: pointer;
      /* 被禁用的状态 */
      &.disable {
        color: rgba(0, 0, 0, 0.25);
      }
    }
    /* 分割符 */
    .separator {
      display: inline-block;
      background-color: #999;
      height: 20px;
      margin: 0 10px;
      width: 1px;
      vertical-align: middle;
    }
  }

  /* 操作按钮区域 */
  .operation {
    margin-right: 20px;
    /* 按钮 */
    ::v-deep .el-button {
      margin: 0 5px;
    }
  }
}
</style>
