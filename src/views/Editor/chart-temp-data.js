/**
 * 1. 临时的图表数据，之后应该由前端录入到数据库，然后切换到关系图列表页面时，直接录入的图表数据
 */


export default {
    /**
     * 1. chartList：关系图列表
     * 2. - id：每一个关系图的主键
     * 3. - title: 每一个关系图的标题
     * 4. - img: 每一张图表的缩略图(原图)
     * 5. - nodeLevel: 当前图表的标识，即表示什么类型的图表
     * 6. - status: 当前图表的状态，是原图还是变更后的图表。变更后的图数据不需要进行过滤，直接可以塞给G6渲染。
     */


    chartList: [
        {
            id: 'xxxx1',
            title: 'AB两点之间路径展示',
            img: require('@/assets/system-png/AB两点之间路径展示png.png'),
            nodeLevel: 3,
            // status: 'origin'
            status: 'changed'
        },
        {
            id: 'xxxx2',
            title: '531海外银行',
            img: require('@/assets/system-png/531海外银行png.png'),
            nodeLevel: 4,
            // status: 'origin'
            status: 'changed'
        },
        {
            id: 'xxxx3',
            title: '网上支付',
            img: require('@/assets/system-png/网上支付png.png'),
            nodeLevel: 4,
            // status: 'origin'
            status: 'changed'
        },
        {
            id: 'xxxx4',
            title: '智能采购',
            img: require('@/assets/system-png/智能采购png.png'),
            nodeLevel: 4,
            // status: 'origin'
            status: 'changed'
        },
    ]
}