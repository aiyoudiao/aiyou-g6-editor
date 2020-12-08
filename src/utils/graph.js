/* eslint-disable */

let timer = -1;
let __this = null;
let __selector = null;

/**
 * @description 监听画布 父容器的大小，来改变画布的大小
 * @param target 当前组件vue实例
 * @param selector 当前画布组件的父容器选择器
 */
export function listenCanvasResize(target, selector) {
  __this = target;
  __selector = selector;
  timer = null;

  __this.graph.width = document.querySelector(__selector).clientWidth;
  __this.graph.height = document.querySelector(__selector).clientHeight;

  resizeCanvas()
  window.onresize = resizeCanvas 

}


export function resizeCanvas() {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    const __graph = window.graph
    /* .centerpel-wrapper的元素是画布的父容器，宽高皆为100% */
    const width = document.querySelector(__selector).clientWidth * 2;
    const height = document.querySelector(__selector).clientHeight * 2;
    console.log(
      __this.graph,
      `
            width: ${document.querySelector(__selector).clientWidth}
            height: ${document.querySelector(__selector).clientHeight}
          `
    );
    __graph.changeSize(width, height);
    __graph.render()
  }, 200);
};