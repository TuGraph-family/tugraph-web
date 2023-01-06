import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { queryByCypher, getSubGraph, getRelationshipAll, addNode, addEdge, editNode, editEdge, deleteEdge, deleteNode } from '@/service/cypher/cypher'
const NODECOLORS = [
    ['#66adff', '#5B9EEA'],
    ['#37d4be', '#38BDAB'],
    ['#fdb45d', '#E2A050'],
    ['#ff8aba', '#F377AA'],
    ['#c397e3', '#AE82CE'],
    ['#92cf51', '#79B43B'],
    ['#DD9B84', '#D28266'],
    ['#F57E7E', '#DC6060'],
    ['#98ACC3', '#7A97BB'],
    ['#B4E3FF', '#B0D5FF'],
    ['#FFEA66', '#ECD750'],
    ['#F1D3FF', '#E9BAFF'],
    ['#D4F5AA', '#B1DE76']
]
const NODESIZE = [40, 60, 80]
const EDGECOLORS = ['#98ACC3', '#66adff', '#37d4be', '#fdb45d', '#ff8aba', '#c397e3', '#92cf51', '#DD9B84', '#F57E7E', '#B4E3FF', '#FFEA66', '#E9BAFF', '#D4F5AA']
const EDGESIZE = [1, 3, 5, 7, 9]

interface TableData {
    [index: number]: { [propName: string]: any }
    length: number
}
interface CodeData {
    [propName: string]: any
}
interface tabData {
    id: string
    cypher: string
    cypherForTab: string
    graphName: string
    btns: {
        [propName: string]: {
            active: boolean
        }
    }
    cypherReasultData: CypherReasultData | null
}
interface labelData {
    name: string
    num: number
    activeProp: string
    activePropSource: string
    type: string
    size: number
    color: string
    props: any[]
    colors: Array<any>
    sizes: any[]
    show: boolean
    sysProps: any[]
    borderColor?: string
}
interface GraphData {
    activeLabel: string // 当前选中的label
    activeLabelType: string
    addEdgeSrcAndDst: any[]
    visualMethod: {
        aStar?: { selectNode: 'start' | 'end' | ''; srcAndDst: { start: any; end: any } }
        allPath?: {}
    }
    methodResult: any
    actionLog: {
        actionName: string
        options?: {
            [propName: string]: any
        }
    }
    filterList: any[] // 用来存储过滤条件
    labels: Array<labelData>
    activeElement: Array<any>
    graph: { nodes: Array<{ [propName: string]: any }>; edges: Array<{ [propName: string]: any }> }
}

interface CypherReasultData {
    showType: string // code,table,graph展示类型
    tableData: TableData
    codeData: CodeData
    graphData?: GraphData
    tabValue?: string
}
function createTableData(params: any): TableData {
    let tableData: Array<{ [propName: string]: any }> = []
    let header = params.data.header
    let body = params.data.result
    body.forEach((item: any) => {
        let obj: {
            [propName: string]: any
        } = {}
        item.forEach((cell: any, i: number) => {
            let key: string = header[i].name
            key = key.replace(/\./g, '·')
            if (cell === true) {
                cell = 'true'
            } else if (cell === false) {
                cell = 'false'
            }
            obj[key] = cell
        })
        tableData.push(obj)
    })
    return tableData
}
function createCodeData(params: any): CodeData {
    return params
}
function createLabel(data: any[], type: string, currenLabels: Array<any> = []): Array<any> {
    let label: Array<any> = [...currenLabels]
    data.forEach((item: any, index: number) => {
        let properties = item.properties || {}
        let acticeProp = Reflect.has(properties, 'name') ? 'name' : 'label'
        var obj: labelData = {
            type: type === 'node' ? 'node' : 'edge',
            name: item.label,
            num: data.filter((node: any) => {
                return node.label === item.label
            }).length,
            props: Object.keys(properties),
            show: true,
            activeProp: acticeProp,
            activePropSource: acticeProp === 'name' ? 'props' : 'sysProps',
            color: type === 'node' ? NODECOLORS[label.length % NODECOLORS.length][0] : EDGECOLORS[label.length % EDGECOLORS.length],
            size: type === 'node' ? 60 : 1,
            colors: type === 'node' ? [...NODECOLORS] : [...EDGECOLORS],
            sizes: type === 'node' ? [...NODESIZE] : [...EDGESIZE],
            sysProps: type === 'node' ? ['vid', 'label'] : ['uid', 'label']
        }
        type === 'node' && (obj.borderColor = NODECOLORS[label.length % NODECOLORS.length][1] || '#ccc')
        let exist = label.find((o) => {
            return o.name === item.label
        })

        if (!exist) {
            label.push(obj)
        }
    })
    return label
}
function craeteGraphData(params: any, actionName: string, actionOption?: any, currenNodeLabels: Array<any> = [], currenEdgeLabels: Array<any> = []): GraphData {
    let nodes = params.data.nodes
    let edges = params.data.relationships
    let activeLabel = ''
    let nodeLabel = createLabel(nodes, 'node', currenNodeLabels)
    let edgeLabel = createLabel(edges, 'edges', currenEdgeLabels)
    let labels = [{ name: '*NODES', type: 'node', color: '#98acc3', num: nodes.length }, { name: '*EDGES', type: 'edge', color: '#98acc3', num: edges.length }, ...nodeLabel, ...edgeLabel]

    return {
        activeLabel: activeLabel,
        activeLabelType: '',
        labels: labels,
        addEdgeSrcAndDst: [],
        filterList: [],
        methodResult: {},
        visualMethod: {
            aStar: {
                selectNode: '',
                srcAndDst: {
                    start: {},
                    end: {}
                }
            }
        },
        actionLog: {
            actionName: actionName,
            options: actionOption
        },
        graph: {
            nodes: nodes,
            edges: edges
        },
        activeElement: []
    }
}
function getNodeIds(params: any): Array<number> {
    let vidIndex: Array<number> = []
    let nodeIds: Array<number> = []
    let headers = params.data.header
    let result = params.data.result
    headers.forEach((item: any, index: number) => {
        if (item.type === 1) {
            vidIndex.push(index)
        }
    })
    result.forEach((item: any) => {
        vidIndex.forEach((c) => {
            if (item && item[c]) {
                // let vid = item[c].replace(/(V\[)([0-9]*)(])/g, ($1: string, $2: string, $3: string) => {
                //     return $3
                // })
                let vid = JSON.parse(item[c]).identity
                if (typeof vid === 'number') {
                    nodeIds.push(vid)
                }
            }
        })
    })
    // 可以不用去重
    // nodeIds = [...new Set(nodeIds)]
    return nodeIds
}

function getNodeIdsByEids(params: any): { nodeIds: Array<number>; edgeIds: Array<string> } {
    let nodeIds: Array<number> = []
    let edgeIds: Array<string> = []
    let result = params.data.result
    let headers = params.data.header
    let edgeIndexList: Array<number> = []
    let pathIndexList: Array<number> = []
    headers.forEach((item: any, index: number) => {
        if (item.type === 4) {
            pathIndexList.push(index)
        } else if (item.type === 2) {
            edgeIndexList.push(index)
        }
    })
    result.forEach((item) => {
        pathIndexList.forEach((c) => {
            if (item && item[c]) {
                let data = JSON.parse(item[c])
                data.forEach((el: any, index: number) => {
                    if (index % 2 === 1) {
                        let eid = `${el.src}_${el.dst}_${el.label_id}_${el.temporal_id}_${el.identity}`
                        edgeIds.push(eid)
                        nodeIds.push(parseInt(el.src), parseInt(el.dst))
                    }
                })
            }
        })
        edgeIndexList.forEach((c) => {
            if (item && item[c]) {
                let data = JSON.parse(item[c])
                let eid = `${data.src}_${data.dst}_${data.label_id}_${data.temporal_id}_${data.identity}`
                edgeIds.push(eid)
                nodeIds.push(parseInt(data.src), parseInt(data.dst))
            }
        })
    })

    return {
        nodeIds: [...new Set(nodeIds)],
        edgeIds: [...new Set(edgeIds)]
    }
}

async function querySubGraph(graph: string, nodeIds: Array<number>) {
    let res = await getSubGraph({ graph: graph, nodeIds: nodeIds })
    if (res.status === 200) {
        let graphData = JSON.parse(res.data.result[0])
        graphData.nodes.forEach((item) => {
            item.vid = item.identity
        })

        graphData.relationships.forEach((item) => {
            item.source = item.src
            item.destination = item.dst
            item.uid = `${item.src}_${item.dst}_${item.label_id}_${item.temporal_id}_${item.identity}`
        })
        return {
            status: res.status,
            data: graphData
        }
    } else {
        return {
            status: res.status,
            data: res.data
        }
    }
}

@Module({ name: 'Cypher' })
export default class Cypher extends VuexModule {
    currentCypher: string = ' MATCH (n) RETURN n LIMIT 100'
    tabValue: string = ''

    cypherReasultDatas: Array<tabData> = []
    @Mutation
    upDateCypherReasultDatas(data: Array<tabData>) {
        this.cypherReasultDatas = data
    }
    @Mutation
    updateGraphDataMethodResult(params: { tabValue: string; res: any[] }) {
        let tabValue = params.tabValue
        let target = this.cypherReasultDatas.find((item) => item.id === tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphData: GraphData = cypherReasultData && cypherReasultData.graphData
        graphData && (graphData.methodResult = params.res)
    }
    @Mutation
    updateGraphDataAddEdgeSrcAndDst(params: { tabValue: string; addEdgeSrcAndDst: any[] }) {
        let tabValue = params.tabValue
        let target = this.cypherReasultDatas.find((item) => item.id === tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphData: GraphData = cypherReasultData && cypherReasultData.graphData
        graphData && (graphData.addEdgeSrcAndDst = params.addEdgeSrcAndDst)
    }
    @Mutation
    updateGraphDataAStar(params: {
        tabValue: string
        aStar: {
            selectNode: '' | 'start' | 'end'
            srcAndDst: { start: any; end: any }
        }
    }) {
        let tabValue = params.tabValue
        let target = this.cypherReasultDatas.find((item) => item.id === tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphData: GraphData = cypherReasultData && cypherReasultData.graphData
        graphData && (graphData.visualMethod.aStar = params.aStar)
    }
    @Mutation
    updateGraphDataFilterList(params: { tabValue: string; filterList: any[] }) {
        let tabValue = params.tabValue
        let target = this.cypherReasultDatas.find((item) => item.id === tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphData: GraphData = cypherReasultData && cypherReasultData.graphData
        graphData &&
            (graphData.actionLog = {
                actionName: 'upDateShowByFilter'
            })
        graphData && (graphData.filterList = params.filterList)
    }
    @Mutation
    upDateCurrentCypher(cypher: string) {
        this.currentCypher = cypher
    }
    @Mutation
    upDateBtns(params: { tabValue: string; active: boolean; index: string }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        target && target.btns && (target.btns[params.index].active = params.active)
    }
    @Mutation
    upDateActionLogByEnd(params: { tabValue: string; actionName: string }) {
        let tabValue = params.tabValue
        let target = this.cypherReasultDatas.find((item) => item.id === tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphData = cypherReasultData && cypherReasultData.graphData
        graphData &&
            (graphData.actionLog = {
                actionName: params.actionName + '_end'
            })
    }
    @Mutation
    updateCypherReasultDatas(data: any) {
        let target = this.cypherReasultDatas.find((item) => {
            return item.id === data.tabValue
        })
        if (target) {
            Object.keys(target.btns).forEach((item: any) => {
                target && (target.btns[item].active = false)
            })
            target.cypherReasultData = data
        } else {
            this.cypherReasultDatas = []
        }
    }
    // 双击更新图 或 查询n度邻居
    @Mutation
    updateCypherReasultDatasByDbClick(data: any) {
        let tabValue = data.tabValue
        let target = this.cypherReasultDatas.find((item) => item.id === tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let oldGraphData = cypherReasultData && cypherReasultData.graphData
        let newGraphData = data.graphData
        if (newGraphData) {
            let labels = newGraphData.labels
            let nodes = newGraphData.graph.nodes
            let edges = newGraphData.graph.edges
            let newLabels: Array<any> = [],
                newNodes: Array<any> = [],
                newEdges: Array<any> = []
            labels.forEach((l: any) => {
                let target =
                    oldGraphData &&
                    oldGraphData.labels.find((item) => {
                        return item.name === l.name
                    })
                if (!target) {
                    newLabels.push(l)
                }
            })
            nodes.forEach((n: any) => {
                let target =
                    oldGraphData &&
                    oldGraphData.graph.nodes.find((item) => {
                        return item.vid === n.vid
                    })
                if (!target) {
                    newNodes.push(n)
                }
            })
            edges.forEach((e: any) => {
                let target =
                    oldGraphData &&
                    oldGraphData.graph.edges.find((item) => {
                        return item.uid === e.uid
                    })
                if (!target) {
                    newEdges.push(e)
                }
            })
            oldGraphData && (oldGraphData.actionLog = newGraphData.actionLog)
            oldGraphData && oldGraphData.graph && (oldGraphData.graph.nodes = oldGraphData.graph.nodes.concat(newNodes))
            oldGraphData && oldGraphData.graph && (oldGraphData.graph.edges = oldGraphData.graph.edges.concat(newEdges))
            oldGraphData &&
                (oldGraphData.labels = oldGraphData.labels.concat(newLabels).sort((a: any, b: any) => {
                    return a.type > b.type ? -1 : 1
                }))
            oldGraphData &&
                oldGraphData.labels.forEach((item) => {
                    if (item.name === '*NODES') {
                        item.num = (oldGraphData && oldGraphData.graph.nodes.length) || 0
                    } else if (item.name === '*EDGES') {
                        item.num = (oldGraphData && oldGraphData.graph.edges.length) || 0
                    } else if (item.type === 'node') {
                        item.num = (oldGraphData && oldGraphData.graph.nodes.filter((n) => n.label === item.name).length) || 0
                    } else if (item.type === 'edge') {
                        item.num = (oldGraphData && oldGraphData.graph.edges.filter((e) => e.label === item.name).length) || 0
                    }
                })
        }
        // setTimeout(() => {
        //     // 异步重置actionLog
        //     oldGraphData && (oldGraphData.actionLog.actionName = 'endDbClick')
        // })
    }
    @Mutation
    upDateTabValue(tabValue: string) {
        this.tabValue = tabValue
    }
    @Mutation
    tabAdd(params: { id: string; graph: string }) {
        let id = params.id
        let cypherForTab: string = this.currentCypher
        if (cypherForTab.length > 30) {
            cypherForTab = cypherForTab.substring(0, 30) + '...'
        }
        let obj: tabData = {
            id: id,
            graphName: params.graph,
            cypher: this.currentCypher,
            cypherForTab: cypherForTab,
            btns: {
                'add-node': { active: false },
                'add-edge': { active: false },
                filter: { active: false },
                method: { active: false },
                layout: { active: false },
                mergeEdge: { active: false },
                mergeVertex: { active: false },
                fixed: { active: false },
                hover: { active: false },
                export: { active: false },
                refresh: { active: false },
                fullscreen: { active: false }
            },
            cypherReasultData: null
        }
        this.tabValue = id
        this.cypherReasultDatas.push(obj)
    }
    @Mutation
    tabRemove(tabValue: string) {
        let tabs = this.cypherReasultDatas
        let activeTabValue = this.tabValue
        if (activeTabValue === tabValue) {
            tabs.forEach((tab: any, index: any) => {
                if (tab.id === tabValue) {
                    let nextTab: any = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        activeTabValue = nextTab.id
                    }
                }
            })
        }
        this.tabValue = activeTabValue
        this.cypherReasultDatas = tabs.filter((tab) => tab.id !== tabValue)
    }
    @Mutation
    upDatShowType(params: { tabValue: string; showType: string }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        let cypherReasultData = target && target.cypherReasultData
        cypherReasultData && (cypherReasultData.showType = params.showType)
    }
    @Mutation
    upDateActiveLabel(params: { tabValue: string; labelName: string; labelType: string }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphDataData = cypherReasultData && cypherReasultData.graphData
        graphDataData &&
            (graphDataData.actionLog = {
                actionName: 'upDateActiveLabel'
            })
        graphDataData && (graphDataData.activeLabel = params.labelName)
        graphDataData && (graphDataData.activeLabelType = params.labelType)
    }
    @Mutation
    upDateActiveProp(params: { tabValue: string; propName: string; labelName: string; propNameSource: string; labelType: string }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphDataData = cypherReasultData && cypherReasultData.graphData
        let labelData = graphDataData && graphDataData.labels
        let targetLabel = labelData && labelData.find((item) => item.name === params.labelName && item.type === params.labelType)
        graphDataData &&
            (graphDataData.actionLog = {
                actionName: 'upDateActiveProp',
                options: {
                    labelName: params.labelName,
                    propName: params.propName,
                    propNameSource: params.propNameSource,
                    type: targetLabel && targetLabel.type
                }
            })
        targetLabel && (targetLabel.activeProp = params.propName)
        targetLabel && (targetLabel.activePropSource = params.propNameSource)
    }
    @Mutation
    upDateShow(params: { tabValue: string; labelName: string; status: boolean; type: string }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphDataData = cypherReasultData && cypherReasultData.graphData
        graphDataData &&
            graphDataData.labels.forEach((item) => {
                item.name === params.labelName && (item.show = params.status)
            })
        graphDataData &&
            (graphDataData.actionLog = {
                actionName: 'upDateShow',
                options: {
                    labelName: params.labelName,
                    status: params.status,
                    type: params.type
                }
            })
    }
    // @Mutation
    // upDateShowByFilter(params: { tabValue: string; labelName: string; targetProp: string; sign: string; type: string; targetValue: string }) {
    //     let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
    //     let cypherReasultData = target && target.cypherReasultData
    //     let graphDataData = cypherReasultData && cypherReasultData.graphData
    //     graphDataData &&
    //         graphDataData.labels.forEach((item) => {
    //             item.name === params.labelName
    //         })
    //     graphDataData &&
    //         (graphDataData.actionLog = {
    //             actionName: 'upDateShowByFilter',
    //             options: {
    //                 labelName: params.labelName,
    //                 sign: params.sign,
    //                 targetProp: params.targetProp,
    //                 targetValue: params.targetValue,
    //                 type: params.type
    //             }
    //         })
    // }
    @Mutation
    upDateColor(params: { tabValue: string; color: string; borderColor: string; labelName: string; labelType: string }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphDataData = cypherReasultData && cypherReasultData.graphData
        let labelData = graphDataData && graphDataData.labels
        let targetLabel = labelData && labelData.find((item) => item.name === params.labelName && item.type === params.labelType)
        graphDataData &&
            (graphDataData.actionLog = {
                actionName: 'upDateColor',
                options: {
                    labelName: params.labelName,
                    color: params.color,
                    borderColor: params.borderColor,
                    type: targetLabel && targetLabel.type
                }
            })
        targetLabel && (targetLabel.color = params.color)
        targetLabel && (targetLabel.borderColor = params.borderColor)
    }
    @Mutation
    upDateSize(params: { tabValue: string; size: number; labelName: string; labelType: string }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphDataData = cypherReasultData && cypherReasultData.graphData
        let labelData = graphDataData && graphDataData.labels
        let targetLabel = labelData && labelData.find((item) => item.name === params.labelName && item.type === params.labelType)
        graphDataData &&
            (graphDataData.actionLog = {
                actionName: 'upDateSize',
                options: {
                    labelName: params.labelName,
                    size: params.size,
                    type: targetLabel && targetLabel.type
                }
            })
        targetLabel && (targetLabel.size = params.size)
    }
    @Mutation
    upDateActiveElement(params: { tabValue: string; data: any[] }) {
        let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
        let cypherReasultData = target && target.cypherReasultData
        let graphDataData = cypherReasultData && cypherReasultData.graphData
        graphDataData && (graphDataData.activeElement = params.data)
    }
    @Mutation
    updateWriteData(params: any) {
        if (params) {
            let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
            let cypherReasultData = target && target.cypherReasultData
            let graphData = cypherReasultData && cypherReasultData.graphData
            let labels = graphData && graphData.labels
            let graph = graphData && graphData.graph
            if (params.actionType === 'add') {
                let target = labels && labels.find((item) => item.type === params.elementType && item.name === params.label)
                let properties: { [propName: string]: any } = {}
                params.data.forEach((item: any) => {
                    properties[item.name] = item.value
                })
                if (target) {
                    target.num += 1
                } else {
                    let newLabels = createLabel([{ label: params.label, properties: properties }], params.elementType, labels)
                    graphData && (graphData.labels = newLabels)
                }
                if (params.elementType === 'node') {
                    let totalLabel = labels && labels.find((item) => item.name === '*NODES')
                    totalLabel && (totalLabel.num += 1)
                    let node = {
                        label: params.label,
                        properties: properties,
                        vid: params.backID
                    }
                    graphData && graphData.graph.nodes.push(node)
                    graphData &&
                        (graphData.actionLog = {
                            actionName: 'addNodes',
                            options: node
                        })
                } else {
                    let totalLabel = labels && labels.find((item) => item.name === '*EDGES')
                    totalLabel && (totalLabel.num += 1)
                    let edge = {
                        label: params.label,
                        properties: properties,
                        uid: params.backID,
                        source: Number(params.src),
                        destination: Number(params.destination)
                    }
                    graphData && graphData.graph.edges.push(edge)
                    graphData &&
                        (graphData.actionLog = {
                            actionName: 'addEdges',
                            options: edge
                        })
                }
            } else if (params.actionType === 'edit') {
                if (params.elementType === 'node') {
                    let targetNode: any
                    graphData && (targetNode = graphData.graph.nodes.find((item) => item.vid.toString() == params.backID))
                    targetNode && Object.keys(targetNode.properties).forEach((item) => (targetNode.properties[item] = params.data[item]))
                    // console.log(targetNode)

                    graphData &&
                        (graphData.actionLog = {
                            actionName: 'editNodes',
                            options: targetNode
                        })
                } else if (params.elementType === 'edge') {
                    let targetEdge: any
                    graphData && (targetEdge = graphData.graph.edges.find((item) => item.uid.toString() == params.backID))

                    targetEdge && Object.keys(targetEdge.properties || {}).forEach((item) => (targetEdge.properties[item] = params.data[item]))
                    // console.log(targetEdge)
                    graphData &&
                        (graphData.actionLog = {
                            actionName: 'editEdges',
                            options: targetEdge
                        })
                }
            } else if (params.actionType === 'delete') {
                let targetLabel = graphData && graphData.labels.find((item) => item.name === params.label && item.type === params.elementType)
                let name: string = params.elementType === 'node' ? '*NODES' : '*EDGES'
                let totalLabel = graphData && graphData.labels.find((item) => item.name === name && item.type === params.elementType)
                let delIds = [params.backID]
                totalLabel && (totalLabel.num -= 1)
                if (targetLabel) {
                    targetLabel.num -= 1
                }
                let delIndex: any
                if (params.elementType === 'node') {
                    let delNode: any
                    graph && (delNode = graph.nodes.find((item) => item.vid.toString() === params.backID))
                    delIndex = graph && graph.nodes.indexOf(delNode)
                    graph && graph.nodes.splice(delIndex, 1)
                    let connectEdges = graph && graph.edges.filter((item) => item.destination.toString() === params.backID || item.source.toString() === params.backID)
                    // console.log(connectEdges)
                    connectEdges &&
                        connectEdges.forEach((item) => {
                            let label = labels && labels.find((label) => label.name === item.label)
                            if (label) {
                                label.num -= 1
                            }
                            let connectEdgeDelete: any = graph && graph.edges.find((edge) => edge.uid === item.uid)
                            delIds.push(connectEdgeDelete.uid)
                            let connectIndexDelete: any = graph && graph.edges.indexOf(connectEdgeDelete)
                            graph && graph.edges.splice(connectIndexDelete, 1)
                        })
                    let edgeTotalLabel = labels && labels.find((item) => item.name === '*EDGES')
                    edgeTotalLabel && (edgeTotalLabel.num -= (connectEdges && connectEdges.length) || 0)
                    graphData &&
                        (graphData.actionLog = {
                            actionName: 'deleteNodes',
                            options: delIds
                        })
                } else {
                    let delEdge: any
                    graph && (delEdge = graph.edges.find((item) => item.uid.toString() === params.backID))
                    delIndex = (graph && graph.edges.indexOf(delEdge)) || -1
                    graph && graph.edges.splice(delIndex, 1)
                    graphData &&
                        (graphData.actionLog = {
                            actionName: 'deleteEdges',
                            options: delIds
                        })
                }
            }
        }
    }

    @Action({ commit: 'updateWriteData' })
    async addNodeOrEdge(params: { graph: string; tabValue: string; elementType: string; data: any; label: string; src?: string; destination?: number }) {
        let data: { [prooName: string]: string } = {}
        params.data.forEach((item: any) => {
            let key = item.name
            data[key] = item.value
        })
        let result = null
        if (params.elementType === 'node') {
            result = await addNode({ graph: params.graph, data: { label: params.label, property: data } })
        } else {
            result = await addEdge({ graph: params.graph, src: params.src || '', data: { label: params.label, destination: params.destination || 0, property: data } })
        }

        if (result && result.status === 200) {
            let obj: { [p: string]: any } = {
                tabValue: params.tabValue,
                elementType: params.elementType,
                actionType: 'add',
                data: params.data,
                backID: result.data,
                label: params.label
            }
            if (params.elementType === 'edge') {
                obj.src = params.src
                obj.destination = params.destination
            }
            return Promise.resolve(obj)
        } else {
            return Promise.resolve(null)
        }
    }
    @Action({ commit: 'updateWriteData' })
    async editNodeOrEdge(params: { graph: string; tabValue: string; id: string; data: any; elementType: string }) {
        let data: { [prooName: string]: string } = {}
        params.data.forEach((item: any) => {
            let key = item.name
            data[key] = item.value
        })
        let result = null
        if (params.elementType === 'node') {
            result = await editNode({ graph: params.graph, vertex_id: params.id, data: { property: data } })
        } else {
            result = await editEdge({ graph: params.graph, euid: params.id, data: { property: data } })
        }
        if (result && result.status === 200) {
            let obj: { [p: string]: any } = {
                tabValue: params.tabValue,
                elementType: params.elementType,
                actionType: 'edit',
                data: data,
                backID: params.id
            }
            return Promise.resolve(obj)
        } else {
            return Promise.resolve(null)
        }
    }
    @Action({ commit: 'updateWriteData' })
    async deleteNodeOrEdge(params: { graph: string; tabValue: string; id: string; elementType: string; label: string }) {
        let result = null
        if (params.elementType === 'node') {
            result = await deleteNode({ graph: params.graph, vertex_id: params.id })
        } else {
            result = await deleteEdge({ graph: params.graph, euid: params.id })
        }
        if (result && result.status === 200) {
            let obj: { [p: string]: any } = {
                tabValue: params.tabValue,
                elementType: params.elementType,
                actionType: 'delete',
                backID: params.id,
                label: params.label
            }
            return Promise.resolve(obj)
        } else {
            return Promise.resolve(null)
        }
    }
    @Action({ commit: 'updateCypherReasultDatas' })
    async queryByCypher(params: { graph: string; script: string; tabValue: string; type?: string }) {
        let result = await queryByCypher(params)
        let tableData,
            codeData,
            showType,
            graphData = craeteGraphData({ data: { nodes: [], relationships: [] } }, params.type || 'queryByCypher')
        if (result.status === 200) {
            tableData = createTableData(result)
            codeData = createCodeData(result)
            // 如果返回有Eid,就使用Eid组装nodeIds
            let nodeIds = [...new Set([...getNodeIdsByEids(result).nodeIds, ...getNodeIds(result)])]
            if (nodeIds.length) {
                let subGraphReasult = await querySubGraph(params.graph, nodeIds)
                if (subGraphReasult.status === 200) {
                    if (getNodeIdsByEids(result).edgeIds.length) {
                        let relationships: any[] = []
                        getNodeIdsByEids(result).edgeIds.find((eid) => {
                            let target = subGraphReasult.data.relationships.find((item) => item.uid === eid)
                            target && relationships.push(target)
                        })
                        subGraphReasult.data.relationships = relationships
                    }
                    graphData = craeteGraphData(subGraphReasult, params.type, 'queryByCypher')
                    console.log(graphData)
                } else {
                    codeData = createCodeData(result)
                }
            }
        } else {
            codeData = createCodeData(result)
        }
        if (graphData && graphData.graph.nodes.length) {
            showType = 'graph'
        } else if (tableData && tableData.length) {
            showType = 'table'
        } else {
            showType = 'code'
        }
        let obj: CypherReasultData = {
            showType: showType,
            tableData: tableData || [],
            codeData: codeData || {},
            graphData: graphData,
            tabValue: params.tabValue
        }
        return obj
    }
    @Action({ commit: 'updateCypherReasultDatasByDbClick' })
    async queryByDbClick(params: { graph: string; src: string; tabValue: string }) {
        let result = await getRelationshipAll(params)
        let nodeIds = [parseInt(params.src)]
        let graphData = null
        if (result.status === 200) {
            let data = result.data
            data.in.forEach((item: any) => {
                let vid = item.split('_')[0]
                vid = parseInt(vid)
                nodeIds.push(vid)
            })
            data.out.forEach((item: any) => {
                let vid = item.split('_')[1]
                vid = parseInt(vid)
                nodeIds.push(vid)
            })
            nodeIds = [...new Set(nodeIds)]
        }
        if (nodeIds.length > 1) {
            let subGraphReasult = await querySubGraph(params.graph, nodeIds)
            if (subGraphReasult.status === 200) {
                let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
                let cypherReasultData = target && target.cypherReasultData
                let graphDataData = cypherReasultData && cypherReasultData.graphData
                let labelData = graphDataData && graphDataData.labels
                let nodeLabels = (labelData && labelData.filter((item) => item.type === 'node')) || []
                let edgeLabels = (labelData && labelData.filter((item) => item.type === 'edge')) || []
                graphData = craeteGraphData(subGraphReasult, 'dbClickNode', null, nodeLabels, edgeLabels)
            }
        }
        return {
            tabValue: params.tabValue,
            graphData: graphData
        }
    }
    @Action({ commit: 'updateCypherReasultDatasByDbClick' })
    async queryNeighborByCypher(params: { graph: string; script: string; tabValue: string }) {
        let result = await queryByCypher(params)
        let graphData: any = null
        if (result.status === 200) {
            let nodeIds = getNodeIds(result)
            if (nodeIds.length) {
                let subGraphReasult = await querySubGraph(params.graph, nodeIds)
                if (subGraphReasult.status === 200) {
                    let target = this.cypherReasultDatas.find((item) => item.id === params.tabValue)
                    let cypherReasultData = target && target.cypherReasultData
                    let graphDataData = cypherReasultData && cypherReasultData.graphData
                    let labelData = graphDataData && graphDataData.labels
                    let nodeLabels = (labelData && labelData.filter((item) => item.type === 'node')) || []
                    let edgeLabels = (labelData && labelData.filter((item) => item.type === 'edge')) || []
                    graphData = craeteGraphData(subGraphReasult, 'queryNeighborByCypher', null, nodeLabels, edgeLabels)
                }
            }
            return {
                tabValue: params.tabValue,
                graphData: graphData
            }
        }
    }
}
