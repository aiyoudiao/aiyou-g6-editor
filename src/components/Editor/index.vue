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
            opacity: show.top ? 1 : 0
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
              opacity: show.left ? 1 : 0
            }"
            v-show="show.left"
          ></LeftPanel>
        </transition>
        <i class="gb-toggle-btn left" @click="handleBtnClick('left')"></i>
      </div>
      <div class="center-panel">
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
              opacity: show.right ? 1 : 0
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
            opacity: show.bottom ? 1 : 0
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

export default {
  name: "BaseFlow",
  props: {
    data: Object, // 传入数据
    getData: Function // 获取数据
  },
  components: {
    ToolBar,
    LeftPanel,
    CenterPanel,
    RightPanel,
    FootBar
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
        right: true
      }
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
    zoomRatio() {}
  },
  methods: {
    /**
     * @description: 初始化编辑器
     */
    initEditor() {},

    /**
     * @description: 保存流图数据
     */
    saveFlow() {},
    handleBtnClick(position) {
      this.show[position] = !this.show[position];
    }
  }
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
    justify-content: space-around;
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
