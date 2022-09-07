<template>
    <div class="workbench-label-graph">
        <div class="label-graph" ref="labelGraph"></div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CreateLabelStore from '@/store/create-label/create-label'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import CyConfig from './cy-config'
import dblclick from 'cytoscape-dblclick'
import cytoscape from 'cytoscape'
import euler from 'cytoscape-euler'
import cola from 'cytoscape-cola'
cytoscape.use(euler)
@Component
export default class WorkbenchLabelGraph extends Vue {
    public $refs!: {
        labelGraph: HTMLElement
    }
    @Prop(Object) activeLabel!: { type: string; value: string }
    nodesColor = [
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
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    _cy: any = null
    _layout: any = null
    _cyNodes: any = null
    _cyEdges: any = null
    _cyDom: any = null
    zoomLevel: number = 0.8
    graphData: any[] = []
    currentLabel: { nodes: any[]; edges: any[] } = { nodes: [], edges: [] }
    forceOption: any = {
        name: 'euler',
        springLength: 340,
        fit: false,
        springCoeff: 0.0008,
        mass: 20,
        dragCoeff: 1,
        gravity: -20,
        pull: 0.009,
        randomize: false,
        padding: 0,
        maxIterations: 1000,
        maxSimulationTime: 4000,
        stop: function(ele: any) {}
    }
    @Prop(String) tabValue!: string
    get currentSelectedGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    get allLabels() {
        let allLabels = this.createLabelStore.allLabel
        return allLabels
    }
    @Watch('activeLabel')
    onChangeActiveLabel() {
        this.setActive()
    }
    @Watch('allLabels', { immediate: true, deep: true })
    onChangeAllLabels(o, n) {
        let target = this.allLabels.find((item) => item.graph == this.currentSelectedGraph)
        let nodes = target ? target.allLabel.filter((item) => item.type === 'node') : []
        let edges = target ? target.allLabel.filter((item) => item.type === 'edge') : []
        this.currentLabel.nodes = nodes
        this.currentLabel.edges = edges
        if (nodes.length) {
            this.updateCanvas()
        } else if (this._cy) {
            this._cy.destroy()
        }
    }
    created() {}
    mounted() {
        this.drawGraph()
    }
    beforeDestroy() {
        if (this._layout) {
            this._layout.stop()
            this._layout = null
        }
        if (this._cy) {
            setTimeout(() => {
                this._cy.destroy()
                this._cy = null
            }, 1000)
        }
    }
    drawGraph() {
        console.time('draw-label-graph')
        if (this._cy) {
            this._cy.destroy()
        }
        let dom = this.$refs['labelGraph']
        let option = { ...CyConfig, ...{ container: dom } }
        this._cy = cytoscape(option)
        this._cyDom = dom
        this.addEventToCy([
            {
                eventType: 'dblclick:timeout',
                eventTarget: 'cy',
                eventCallback: this.cyClick
            },
            {
                eventType: 'dblclick:timeout',
                eventTarget: 'node',
                eventCallback: this.nodeClick
            },
            {
                eventType: 'dblclick:timeout',
                eventTarget: 'edge',
                eventCallback: this.edgeClick
            },
            {
                eventType: 'dblclick',
                eventTarget: 'node',
                eventCallback: this.nodeDblClick
            },
            {
                eventType: 'mouseover',
                eventTarget: 'node',
                eventCallback: this.nodeMouseOver
            },
            {
                eventType: 'mouseout',
                eventTarget: 'node',
                eventCallback: this.nodeMouseOut
            },
            {
                eventType: 'mouseup',
                eventTarget: 'node',
                eventCallback: this.nodeMouseUp
            },
            {
                eventType: 'tapstart',
                eventTarget: 'node',
                eventCallback: this.nodeMouseDown
            },
            {
                eventType: 'cxttapend',
                eventTarget: 'node',
                eventCallback: this.cyCxttapend
            }
        ])
        this._layout = this._cy.layout(option.layout)
        this._layout.run()
        this._cy.fit()
        this._cy.zoom({
            level: this.zoomLevel
        })
        this._cy.pan({
            x: dom.clientWidth / 2,
            y: dom.clientHeight / 2
        })
        console.timeEnd('draw-label-graph')
    }
    updateCanvas() {
        let data: {
            nodes: any[]
            edges: any[]
        } = this.createCyDatas()
        if (data.nodes.length > 0 && this._cy) {
            this.drawGraph()
            this._cy.add(data)
        }
        if (this._layout) {
            this._cy
                .layout({ name: 'grid' })
                .run()
                .stop()
            this._layout.stop()
            this._layout = this._cy.layout(this.forceOption)
            this._layout.run()
            this.panSource()
            this._cy.zoom({
                level: this.zoomLevel
            })
        }
    }
    addEventToCy(
        events: Array<{
            eventType: string
            eventTarget: string
            eventCallback: Function
        }>
    ) {
        this._cy.dblclick(300)
        events.forEach((item: any) => {
            if (item.eventTarget === 'cy') {
                this._cy.on(item.eventType, item.eventCallback)
            } else {
                this._cy.on(item.eventType, item.eventTarget, item.eventCallback)
            }
        })
    }
    setActive() {
        this._cy.$().removeClass('active')
        if (this.activeLabel.type === 'node') {
            this.activeLabel && this._cy.nodes('#' + this.activeLabel.value).addClass('active')
        } else {
            this.activeLabel &&
                this._cy.edges().forEach((edge) => {
                    if (edge.data('displayName') === this.activeLabel.value) {
                        edge.addClass('active')
                    }
                })
        }
    }
    createCyDatas() {
        let nodeLabelNames = []
        let nodes: any[] = []
        let edges: any[] = []
        this.currentLabel.nodes.forEach((label, index) => {
            let data: { [name: string]: any } = {}
            data.id = label.name
            data.color = this.nodesColor[index % this.nodesColor.length][0]
            data.borderColor = this.nodesColor[index % this.nodesColor.length][1]
            data.size = 60
            data.displayName = label.name
            nodes.push({ data })
        })
        nodeLabelNames = nodes.map((item) => {
            return item && item.data.id
        })
        let noConstraints = []
        for (let n = 0; n < nodeLabelNames.length; n++) {
            for (let m = 0; m < nodes.length; m++) {
                noConstraints.push([nodeLabelNames[n], nodeLabelNames[m], 'noConstraint'])
            }
        }
        this.currentLabel.edges.forEach((label, index) => {
            let constraints = []
            if (label.constraints.length > 0) {
                constraints = label.constraints
            } else {
                constraints = noConstraints
            }

            constraints.forEach((item) => {
                let data: { [name: string]: any } = {}
                data.id = item[0] + '_' + item[1] + '_' + label.name
                data.source = item[0]
                data.target = item[1]
                data.displayName = label.name
                data.size = 1
                data.color = '#98ACC3'
                if (nodeLabelNames.includes(item[0]) && nodeLabelNames.includes(item[1])) edges.push({ data, classes: [item[2]] })
            })
        })
        return {
            nodes,
            edges
        }
    }
    panSource() {
        this._cy.pan({
            x: this._cyDom.clientWidth / 2,
            y: this._cyDom.clientHeight / 2
        })
    }
    //  ----- 鼠标交互事件Start -----
    // 单击[点]
    nodeClick(e: any) {
        let node = e.target
        this.$emit('update:activeLabel', { type: 'node', value: node.data('id') })
    }
    // 双击[点]
    nodeDblClick(e: any) {
        let id = e.target.data('id')
    }
    // 鼠标悬停[点]
    nodeMouseOver(e: any) {
        // let node = e.target
        // node.addClass('hover')
    }
    // 鼠标移出[点]
    nodeMouseOut(e: any) {
        // this._cy.$('.hover').removeClass('hover')
    }
    // 鼠标抬起[点]
    nodeMouseUp(e: any) {
        let n = e.target.scratch()
        let id = e.target.data('id')
    }
    // 鼠标右键[点]，出现菜单
    cyCxttapend(e: any) {}
    // 鼠标按下[点]
    nodeMouseDown(e: any) {}
    // 点击边
    edgeClick(e: any) {
        let edge = e.target
        this.$emit('update:activeLabel', { type: 'edge', value: edge.data('displayName') })
    }
    // 点击cy画布
    cyClick(e: any) {
        this.$emit('update:activeLabel', { type: '', value: '' })
    }
    //  ----- 鼠标交互事件End -----
}
</script>
<style lang="less" scoped>
.workbench-label-graph {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #ffffff;
    z-index: 2;
    overflow: hidden;
    .label-graph {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
}
</style>
