<template>
  <div class="editor">
    <div class="top-container">
      <!-- <ToolBar></ToolBar> -->
      <tool-bar></tool-bar>
    </div>
    <div class="middle-container">
      <div class="left-panel">
        <LeftPanel></LeftPanel>
      </div>
      <div class="center-panel">
        <CenterPanel></CenterPanel>
      </div>
      <div class="right-panel">
        <RightPanel></RightPanel>
      </div>
    </div>
    <div class="bottom-container">
      <foot-bar></foot-bar>
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
      zoomRatio: 100
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
    saveFlow() {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .top-container {
    flex: 1;
  }
  .middle-container {
    flex: 20;
  }
  .bottom-container {
    flex: 1;
    background: mediumpurple;
  }

  // .top-container {
  //   position: absolute;
  //   padding: 5px 20px;
  //   width: 100%;
  //   border: 1px solid #e9e9e9;
  //   height: 42px;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   background: #ffffff;
  //   box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  //   .toolbar {
  //     // height: 100%;
  //     line-height: 42px;
  //     width: 80%;
  //     .command {
  //       width: 27px;
  //       height: 27px;
  //       margin: 0px 6px;
  //       border-radius: 2px;
  //       padding-left: 4px;
  //       display: inline-block;
  //       border: 1px solid rgba(2, 2, 2, 0);
  //     }
  //     .disable {
  //       color: rgba(0, 0, 0, 0.25);
  //     }
  //   }
  //   .data-opt {
  //     width: 20%;
  //     height: 100%;
  //     text-align: right;
  //   }
  // }
  .middle-container {
    // padding-top: 54px;
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
    // .left-panel {
    //   width: 15%;
    //   min-width: 300px;
    //   height: 100%;
    //   padding: 20px;
    //   display: inline-flex;
    //   flex-direction: column;
    //   align-items: center;
    //   .itempanel-container {
    //     width: 199px;
    //     height: 192px;
    //     img {
    //       width: 92px;
    //       height: 96px;
    //       padding: 4px;
    //       margin-left: 4px;
    //       border-radius: 2px;
    //       border: 1px solid rgba(0, 0, 0, 0);
    //       vertical-align: middle;
    //       cursor: pointer;
    //     }
    //   }
    // }
    .center-panel {
      background: #ffffff;
      display: inline-block;
      width: 100%;
      height: 100%;
      border: 1px solid #dedbe2;
    }
    // .center-panel {
    //   background: #ffffff;
    //   display: inline-block;
    //   width: 70%;
    //   height: 100%;
    //   border: 1px solid #dedbe2;
    //   .flow {
    //     width: 100%;
    //     height: 100%;
    //     overflow: hidden;
    //   }
    //   .contextmenu {
    //     margin: 0px;
    //     width: 200px;
    //     background: white;
    //     box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    //     color: #000;
    //     font-size: 12px;
    //     display: none;
    //     .command {
    //       height: 12px;
    //       padding: 8px;
    //       box-sizing: content-box;
    //     }
    //     .command:hover {
    //       cursor: pointer;
    //       background: #e6f7ff;
    //     }
    //     .disable {
    //       color: rgba(0, 0, 0, 0.25);
    //     }
    //   }
    // }
    .right-panel {
      width: 15%;
      min-width: 300px;
      height: 100%;
    }
  }
}
</style>
