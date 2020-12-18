/**
 * 生成uuid算法,碰撞率低于1/2^^122
 * @returns {string}
 */
export const generateUUID = function() {
  let d = new Date().getTime();
  //  x 是 0-9 或 a-f 范围内的一个32位十六进制数
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
    c
  ) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};


// export function download(filename, text) {
//   var pom = document.createElement("a");
//   pom.setAttribute(
//     "href",
//     "data:text/plain;charset=utf-8," + encodeURIComponent(text)
//   );
//   pom.setAttribute("download", filename);
//   if (document.createEvent) {
//     var event = document.createEvent("MouseEvents");
//     event.initEvent("click", true, true);
//     pom.dispatchEvent(event);
//   } else {
//     pom.click();
//   }
// }
export function download(filename, text) {
  //创建元素
  var ele = document.createElement('a');
  //设置下载文件名
  ele.download = filename;
  //隐藏元素
  ele.style.display = "none";
  //字符内容转变成blob地址
  var blob = new Blob([text]);
  //如果是链接，这里也可以直接设置链接地址
  ele.href = URL.createObjectURL(blob);
  document.body.appendChild(ele);
  //模拟点击
  ele.click();
  //移除元素
  document.body.removeChild(ele);
}