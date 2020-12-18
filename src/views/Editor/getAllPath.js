/**
 * 1. 先将nodes 以及 edges 转换成 一条链表(树)
 * 2. 将这个树组装完毕后，开始拼接字符串
 * 3. 最后输出所有的字符串
 * 4. 注意小心那种循环引用的关系，所以你可能需要记录所有的关系，防止循环引用导致出现问题
 * 5. 链表的每一个节点的数据结构
 * {
 *    current: 当前节点的属性
 *    下一个层级所有的节点
 *    之前已经遍历过的所有节点的id
 * 
 * }
 */

const linkNode = {
    current: null,
    next: [],
    loopPath: []
}


import abChangedData from '../../demo/531海外银行-变更.json'

const nodes = abChangedData.nodes
const edges = abChangedData.edges
const mainNode = nodes.filter(node => node.id === "47cdf872efe74551a115375beff1ff37")


function getAllPath() {


}


export function createAllPath() {
    console.log(nodes, '===', edges)
    const mainLinkNode = JSON.parse(JSON.stringify(linkNode))
    mainLinkNode.current = JSON.parse(JSON.stringify(mainNode[0]))
    createPath(mainLinkNode, edges)
    console.log(mainLinkNode)
}

// function createPath(currentLinkNode, allEdge) {
    
//     allEdge.forEach(edge => {
//         console.log(currentLinkNode.current.id, edge.source)
//         if (currentLinkNode.current.id === edge.source) {
//             const allRelationNode = nodes.filter(node => edge.target === node.id)
//             currentLinkNode.next = allRelationNode.map(relNode => {
//                 return {
//                     current: relNode,
//                     next: [...currentLinkNode.next],
//                     loopPath: [currentLinkNode.current.id, ...currentLinkNode.loopPath]
//                 }
//             })
//             console.log('currentLinkNode', currentLinkNode)
//             currentLinkNode.next.forEach(cLinkNode => {
//                 createPath(cLinkNode, edges)
//             })
            
//         }
//     })
    
// }


function createPath(currentLinkNode, allEdge) {
    const targetEdges = allEdge.filter(edge => edge.source === currentLinkNode.current.id)
    debugger
    targetEdges.forEach(edge => {
        const curNode = nodes.find(node => node.id === edge.target)
        if (!curNode) {
            return;
        }
        const isExists = currentLinkNode.loopPath.find(id => id === curNode.id)
        if (isExists) {
            return;
        }

        currentLinkNode.next.push({
            current: curNode,
            next: [],
            loopPath: [currentLinkNode.current.id, ...currentLinkNode.loopPath]
        })
    })

    currentLinkNode.next.forEach(cLinkNode => {
        createPath(cLinkNode, edges)
    })

}
