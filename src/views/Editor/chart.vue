<template>
  <div class="aiyou-editor">
    <!-- 使用aiyou-g6-editor -->
    <editor v-if="Object.keys(data).length" :data="data"></editor>
  </div>
</template>

<script>
// @ is an alias to /src
import ab_origin from "@/demo/AB两点之间路径展示.json";
import ab_changed from '@/demo/AB两点之间路径展示-变更.json'
import zhi_origin from '@/demo/智能采购.json'
import zhi_changed from '@/demo/智能采购-变更.json'
import wang_origin from '@/demo/网上支付.json'
import wang_changed from '@/demo/网上支付-变更.json'
import hai_origin from '@/demo/531海外银行.json'
import hai_changed from '@/demo/531海外银行-变更.json'

import Editor from "@/components/Editor";

/* 引入正常数据 */
import goodData from "@/demo/data3";

/* 引入节点 */
import node3 from "@/demo/node-第三层.js";
import node4 from "@/demo/node.js";

/* 引入边 */
import edge from "@/demo/edge.js";

import { filterLayer3DirtyData, filterLayer4DirtyData } from "./handle";

const dataMaps = {
  'AB两点之间路径展示': 'ab',
  '智能采购': 'zhi',
  '网上支付': 'wang',
  '531海外银行': 'hai',
}

export default {
  name: "Chart",
  components: {
    Editor,
  },
  data() {
    return {
      data: {},
    };
  },
  created() {
    const { id, title, status, nodeLevel } = this.$route.query;
    this.data={
      id,
      title,
      status,
      nodeLevel,
    };
    console.log("this.$route.query", this.$route.query, this.$route);
    document.title = title;
    this.initDataSet();
    this.initChartData();
  },

  methods: {
    initDataSet() {
      window.chartDataSet = {
        ab_origin,
        ab_changed,
        zhi_origin,
        zhi_changed,
        wang_origin,
        wang_changed,
        hai_origin,
        hai_changed,
      };
    },

    initChartData() {

      debugger
      /* 确定数据状态 */
      const status = this.data.status;

      /* 确定数据源 */
      const dataName = this.data.title;
      const key = dataMaps[dataName]
      const data = window.chartDataSet[key + "_" + status];

      /* 指定相关的策略 */
      if (this.data.nodeLevel+"" === '3') {
        if (this.data.status === "changed") {
          window.graphData = data;
          return;
        }

        const model = filterLayer3DirtyData(data, goodData, node3, edge);
        window.graphData = model.graphData;
      }

      if (this.data.nodeLevel+"" === '4') {
        if (this.data.status === "changed") {
          window.graphData = data;
          return;
        }

        const model = filterLayer4DirtyData(data, goodData, node4, edge);
        window.graphData = model.graphData;
      }

      console.log('data', data)
      console.log('window.graphData', window.graphData)
    },
  },
};
</script>
