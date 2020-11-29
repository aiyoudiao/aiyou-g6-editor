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
