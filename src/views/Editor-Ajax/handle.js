/**
 * @description 过滤三层节点的脏数据，返回有效的数据集
 * @param {*} dirtyData 脏数据
 * @param {*} goodData 空的有效数据
 * @param {*} node 有效的节点 -> 不同类别的节点模型
 * @param {*} edge 有效的边 -> 不同类别的边模型
 */


export function filterLayer3DirtyData(dirtyData, goodData, node, edge) {
    /**
     * 1. 克隆出一份 有效的节点模型数据
     * 2. 克隆出一份 有效的边模型数据
     * 3. 克隆出一份 空有效数据
     * 4. 取出脏数据中所有的节点
     * 5. 取出脏数据中所有的边
     */


    const goodNode = JSON.parse(JSON.stringify(node))
    const goodEdge = JSON.parse(JSON.stringify(edge))
    const goodDataPrototype = JSON.parse(JSON.stringify(goodData))
    const dirtyNodes = dirtyData.cis
    const dirtyEdges = dirtyData.relationships

    /**
     * 1. 声明节点类型的容器：不同类型的节点对应的字符串
     * 2. 声明节点展示数据的容器，不同类型的节点展示不同的文本
     * 3. 声明有效的节点容器，用于存放已知类型的节点Id
     * 4. 声明无效的节点容器，用于存放未知类型的节点Id
     */


    const nodeContainer = [
        "FirewallDevice",
        "FirewallThreeLayerLogInt",
        "LsThreeLayerLogInt",
        "SwitchThreeLayerLogInt",
        "ThreeLayerSwitch"
    ]
    const labels = {
        /**
         * ['interfaceName', 'deviceName', 'interfaceIp', 'deviceType'],
         */
        "FirewallDevice": ['deviceName'],
        "FirewallThreeLayerLogInt": ['deviceName'],
        "LsThreeLayerLogInt": ['deviceName', 'interfaceIp'],
        "SwitchThreeLayerLogInt": ['interfaceIp'],
        "ThreeLayerSwitch": ['deviceName'],
    }

    /**
     * 先输出节点类型列表
     * 整理出已包含的列表和未包含的列表
     * 分别输出这两个列表信息
     * 如果有未包含的列表，输出消息后，终止后续操作
     */


    let newTypes = {}
    let originTypes = {}
    dirtyNodes.forEach(item => {
        const { classId } = item.properties
        const type = classId.split('DC:')[1]

        if(!nodeContainer.includes(type)) {
            newTypes[type] === undefined && (newTypes[type] = 0)
            newTypes[type] ++
        } else {
            originTypes[type] === undefined && (originTypes[type] = 0)
            originTypes[type] ++
        }
    })

    let msgList = '已包含的节点有：'
    Object.keys(originTypes).forEach(keyName => {
        msgList += '\r\n'
        msgList += keyName + '：' + originTypes[keyName] + '个'
    })

    if (Object.keys(originTypes).length) {
        console.log(msgList)
    }

    msgList = '新增了节点有：'
    Object.keys(newTypes).forEach(keyName => {
        msgList += '\r\n'
        msgList += keyName + '：' + newTypes[keyName] + '个'
    })

    if (Object.keys(newTypes).length) {
        console.log(msgList)
        return goodDataPrototype
    }

    /**
     * 开始正常的操作
     */


    let existsNodeIds = []
    let noExistsNodeIds = []


    /* 1. 遍历所有脏数据中的节点，意为将所有脏数据中的节点转换成G6可绘制的友好节点 */
    dirtyNodes.forEach(item => {
        /**
         * 1. 取出节点的classId，截取DC:，取出后面的部分作为节点类型。
         * 2. 取出节点的instanceId，作为node的id。
         * 3. 从节点模型goodNode中取出该类型的节点，并克隆一份新的该类型的节点。
         * 4. 给该节点添加上id属性和neo4j属性，`neo4j`表示这个脏数据中的原节点，也就是当前遍历的这个脏节点。
         */


        const { classId, instanceId } = item
        const type = classId.split('DC:')[1]

        const node = JSON.parse(JSON.stringify(goodNode[type]))

        if (!node) throw new Error('不好意思，这个节点并不在所定义的节点模型中。')
        node.id = instanceId
        node.neo4j = item


        /**
         * 1. 判断该节点的类型是否在当前版本支持的所有节点类型中
         * 2. 如果在就正常净化数据，并且把这个Id记录到existsNodeIds中
         * 3. 如果不存在就在noExistsNodeIds中记录一下
         */

        
        if (nodeContainer.includes(type)) {
            existsNodeIds.push(node.id)

            /**
             * 1. 取出该类型节点要展示的文本集，过滤出有效的文本，使用回车符+换行符进行拼接。
             * 2. 对要展示的文本label进行过滤，把要展示的文本中过滤成 `应用系统名称\r\n文本`
             * 3. 把过滤后的label赋值给node
             * 4. 将过滤好的节点添加到有效的空数据集合中去
             */


            const showLabels = labels[type]
            let label = showLabels.filter(showLabel => Boolean(item[showLabel])).map(showLabel => {
                return item[showLabel]
            }).join('\r\n')

            if (label.indexOf(item.applicationName) !== -1 && label.indexOf(item.applicationName) === 0) {
                label = label.replace(item.applicationName, '')
                label = item.applicationName + '\r\n' + label
            }

            node.label = label || node.label
            goodDataPrototype.graphData.nodes.push(node)
        } else {
            noExistsNodeIds.push(node.id)
            // goodDataPrototype.graphData.nodes.push(node)
        }
    })

    /* 第二步 */
    /**
     * 1. 取出每条边的destinationInstanceId和sourceInstanceId，作为edge中的target和source
     * 2. 从goodEdge中获取节点，添加到goodDataPrototype中的graphData的edges中去
     */

    /* 1. 遍历所有脏数据中的边，意为将所有脏数据中的边转换成G6可绘制的友好的边 */
    dirtyEdges.forEach(item => {
        /**
         * 1. 取出边中的 `destinationInstanceId`，作为之后的target(目标节点的id)
         * 2. 取出边中的 `sourceInstanceId`，作为之后的source(当前节点的id)
         * 3. 从边模型goodEdge中取出该类型的边，并克隆一份新的该类型的边
         * 4. 当边的类型为`BelongTo时`不展示指向目标节点时边的箭头
         */

        
        const { destinationInstanceId, sourceInstanceId, id, classId } = item
        const type = classId.split('DC:')[1]
        const edge = JSON.parse(JSON.stringify(goodEdge))
        if (type === 'BelongTo') {
            edge.style.endArrow = false
        }


        /**
         * 1. 给该边添加上id属性、neo4j属性、target属性、source属性，`neo4j`表示这个脏数据中的原边，也就是当前遍历的这个脏边。
         */


        edge.neo4j = item
        edge.target = destinationInstanceId
        edge.source = sourceInstanceId
        edge.id = id

        goodDataPrototype.graphData.edges.push(edge)
    })

    // console.log('goodDataPrototype.graphData.edges', goodDataPrototype.graphData.edges.length)
    // console.log('goodDataPrototype.graphData.nodes', goodDataPrototype.graphData.nodes.length)

    // console.log(goodDataPrototype)
    return goodDataPrototype
}

/**
 * @description 过滤四层节点的脏数据，返回有效的数据集
 * @param {*} dirtyData 脏数据
 * @param {*} goodData 空的有效数据
 * @param {*} node 有效的节点 -> 不同类别的节点模型
 * @param {*} edge 有效的边 -> 不同类别的边模型
 */

 
export function filterLayer4DirtyData(dirtyData, goodData, node, edge) {
    const goodNode = JSON.parse(JSON.stringify(node))
    const goodEdge = JSON.parse(JSON.stringify(edge))
    const goodDataPrototype = JSON.parse(JSON.stringify(goodData))


    const dirtyNodes = dirtyData.cis || dirtyData.nodes
    const dirtyEdges = dirtyData.relationships

    /* 第一步 */
    /**
     * 1. 取出每个节点的classId，截取DC:，取出后面的部分作为节点类型。
     * 2. 取出每个节点的instanceId，作为node的id
     * 3. 从goodNode中获取节点，添加到goodDataPrototype中的graphData的nodes中去
     */
    const nodeContainer = [
        'SslVsTcpService',
        'SslDevice',
        'WafVsTcpService',
        'WafDevice',
        'FirewallNatTcpService',
        'FirewallDevice',
        'LbVsTcpService',
        'LbDevice',
        'LogicalServerTcpService',
        'LogicalServer',
        'ApplicationSystem',
        'DomainName'
    ]

    const labels = {
        'SslVsTcpService': ['deviceName','ip'],
        'SslDevice': ['deviceName', 'deviceId'],
        'WafVsTcpService': ['ip'],
        'WafDevice': '',
        'FirewallNatTcpService': ['deviceName', 'ip'],
        'FirewallDevice': ['deviceName', 'deviceId'],
        'LbVsTcpService': ['deviceName', 'ip'],
        'LbDevice': ['deviceName', 'deviceId'],
        'LogicalServerTcpService': [
            'item',
            'ip'
        ],
        'LogicalServer': '',
        'ApplicationSystem': ['chineseFullName'],
        'DomainName': ['domainName'],
    }

    /**
     * 先输出节点类型列表
     * 整理出已包含的列表和未包含的列表
     * 分别输出这两个列表信息
     * 如果有未包含的列表，输出消息后，终止后续操作
     */


    let newTypes = {}
    let originTypes = {}
    dirtyNodes.forEach(item => {
        const { classId } = item.properties
        const type = classId.split('DC:')[1]

        if(!nodeContainer.includes(type)) {
            newTypes[type] === undefined && (newTypes[type] = 0)
            newTypes[type] ++
        } else {
            originTypes[type] === undefined && (originTypes[type] = 0)
            originTypes[type] ++
        }
    })

    let msgList = '已包含的节点有：'
    Object.keys(originTypes).forEach(keyName => {
        msgList += '\r\n'
        msgList += keyName + '：' + originTypes[keyName] + '个'
    })

    if (Object.keys(originTypes).length) {
        console.log(msgList)
    }

    msgList = '新增了节点有：'
    Object.keys(newTypes).forEach(keyName => {
        msgList += '\r\n'
        msgList += keyName + '：' + newTypes[keyName] + '个'
    })

    if (Object.keys(newTypes).length) {
        console.log(msgList)
        return goodDataPrototype
    }

    /**
     * 开始正常的操作
     */


    let existsNodeIds = []
    dirtyNodes.forEach(item => {
        const { classId, instanceId } = item.properties
        const type = classId.split('DC:')[1]
        const node = JSON.parse(JSON.stringify(goodNode[type]))
        node.id = instanceId
        node.neo4j = item

        if (nodeContainer.includes(type)) {
            existsNodeIds.push(node.id)

            const showLabels = labels[type]
            let label = showLabels.filter(showLabel => Boolean(item.properties[showLabel]) ).map(showLabel => {
                return item.properties[showLabel]
            }).join('\r\n')

            if (label.indexOf(item.properties.applicationName) !== -1 && label.indexOf(item.properties.applicationName) === 0) {
                label = label.replace(item.properties.applicationName, '')
                label = item.properties.applicationName + '\r\n'+label
            }
            node.label = label || node.label
            goodDataPrototype.graphData.nodes.push(node)
        } else {
            existsNodeIds.push(node.id)
            goodDataPrototype.graphData.nodes.push(node)
        }
    })


    /* 第二步 */
    /**
     * 1. 取出每条边的destinationInstanceId和sourceInstanceId，作为edge中的target和source
     * 2. 从goodEdge中获取节点，添加到goodDataPrototype中的graphData的edges中去
     */
    dirtyEdges.forEach(item => {
        const { destinationInstanceId, sourceInstanceId, id, classId } = item.properties
        const type = classId.split('DC:')[1]
        const edge = JSON.parse(JSON.stringify(goodEdge))
        if (type === 'BelongTo') {
            edge.style.endArrow = false
        }
        

        console.log('edge', edge.style)
        edge.neo4j = item
        edge.target = destinationInstanceId
        edge.source = sourceInstanceId
        edge.id = id

        goodDataPrototype.graphData.edges.push(edge)
    })

    console.log('goodDataPrototype.graphData.edges', goodDataPrototype.graphData.edges.length)
    console.log('goodDataPrototype.graphData.nodes', goodDataPrototype.graphData.nodes.length)

    console.log(goodDataPrototype)
    return goodDataPrototype
}