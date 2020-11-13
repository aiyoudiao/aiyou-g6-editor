/**
 * @description 监听v-graph 父容器的大小，来改变v-graph的大小
 * @param target 当前组件vue实例
 * @param refName 当前v-graph组件ref实例名称
 * @param selector 当前v-graph组件的父容器选择器
 */
export function listenCanvasResize(target, refName, selector) {
  const __this = target;
  const __selector = selector;
  let timer = null;

  __this.graph.width = document.querySelector(__selector).clientWidth;
  __this.graph.height = document.querySelector(__selector).clientHeight;

  window.onresize = function() {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      const __graph = target.$refs[refName];
      __graph.$el.getElementsByTagName("canvas")[0].remove();
      /* .centerpel-wrapper的元素是v-graph的父容器，宽高皆为100% */
      __this.graph.width = document.querySelector(__selector).clientWidth;
      __this.graph.height = document.querySelector(__selector).clientHeight;
      console.log(
        __this.graph,
        `
            width: ${document.querySelector(__selector).clientWidth}
            height: ${document.querySelector(__selector).clientHeight}
          `
      );

      __this.$nextTick(() => {
        console.log("__this.$refs.graph.$el", __graph.$el);
        __graph.freshChart(false);
      });
    }, 500);
  };
}
