<template>
  <div class="chart-list">
    <el-row :gutter="36">
      <!-- 一排 4 列 的卡片墙 -->
      <el-col :span="6" v-for="item in chartList" :key="item.id">
        <el-card
          :body-style="{ padding: '0px' }"
          shadow="hover"
          @click.native="editChart(item)"
          ><img class="image" :src="item.img" />
          <div style="padding: 14px">
            <span>{{ item.title }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import chartConfig from "./chart-temp-data";

import { createAllPath } from "./getAllPath";

/* eslint-disable */
export default {
  props: ["user"],
  data() {
    return {
      chartList: [],
      analyseData: [],
      analyseVisible: false,
    };
  },
  mounted() {
    // createAllPath()
    this.getData();
  },
  methods: {
    /**
     * @Description 获取数据
     * @date 2020-12-17
     * @returns {any}
     */

    getData() {
      /**
       * 1、NOTE：发送请求（目前数据是写死的，之后会发送请求）
       * 2、初始化数据
       */

      this.chartList = chartConfig.chartList;
    },

    /**
     * @Description 编辑图表
     * @date 2020-12-17
     * @param {any} item
     * @returns {any}
     */

    editChart(item) {
      /**
       * 1. 创建一个url
       * 2. 新建一个tab，跳转到url对应的页面
       */

      const queryUrl = this.createQueryUrl({ name: "editor-chart", ...item });
      this.redirectPage(queryUrl);
    },

    /**
     * @Description 查看图表
     * @date 2020-12-17
     * @param {any} id
     * @returns {any}
     */

    viewChart(id) {},

    /**
     * @Description 创建一个带query参数的router url
     * @date 2020-12-17
     * @param {any} routeConfig
     * @returns {any}
     */

    createQueryUrl(routeConfig) {
      const name = routeConfig.name;
      delete routeConfig.name;
      const router = this.$router.resolve({
        name: name,
        query: routeConfig,
      });

      return router.href;
    },

    /**
     * @Description 跳转页面
     * @date 2020-12-17
     * @param {any} href
     * @returns {any}
     */

    redirectPage(href) {
      /**
       * 1. 创建a标签，添加href、target属性
       * 2. 添加到页面中，点击这个a标签，页面跳转后，删除这个a标签
       */

      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.parentNode.removeChild(a);
    },

    /**
     * 请求获取图表清单
     */


    async requsetDataList() {
      const response = await fetch("{url}", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field1: "value1",
          field2: "value2",
        }),
      });
      const data = await response.json();
      console.log("data:", data);
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-list {
  padding: 20px;
}

.page-header-slot {
  position: fixed;
  top: 56px;
  left: 240px;
  right: 0;
  padding: 0 40px 20px;
  z-index: 8;
  background-color: rgba(255, 255, 255, 0.94);

  .search {
    width: 240px;
    float: right;
  }
}

.el-card {
  margin-bottom: 36px;

  .image {
    width: 100%;
    height: 150px;
    display: block;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  &:hover {
    cursor: pointer;
    .image {
      opacity: 0.8;
    }
  }
}

.el-card .add-card {
  height: 200px;
  line-height: 200px;
  text-align: center;
  font-size: 82px;
  color: rgba(0, 0, 0, 0.08);
}
</style>
