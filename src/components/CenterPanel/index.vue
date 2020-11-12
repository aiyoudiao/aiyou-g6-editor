<template>
  <div class="centerpel-wrapper">
    <div class="flow" ref="flow"></div>
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
export default {
  name: "",
  props: {},
  data() {
    return {};
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
.centerpel-wrapper {
  .flow {
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
