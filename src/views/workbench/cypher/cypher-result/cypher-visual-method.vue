<template>
    <div class="visual-method-box">
        <div class="visual-method-header">可视化分析</div>
        <div class="visual-method-select">
            <el-select v-model="targetMethod" size="mini">
                <el-option v-for="item in methodList" :key="item.name" :label="item.label" :value="item.name"></el-option>
            </el-select>
        </div>
        <div class="visual-method-body">
            <template v-if="targetMethod === 'aStar'">
                <div class="aStar-panel">
                    <div class="node-box">
                        <span>起点</span>
                        <div v-if="aStar.srcAndDst.start">
                            vid：{{ aStar.srcAndDst.start.id }}
                            <el-popover placement="right" trigger="click">
                                <div v-for="(item, index) in aStar.srcAndDst.start.properties" :key="index">
                                    <span class="node-field">{{ index }}:</span> {{ item }}
                                </div>
                                <span slot="reference" class="node-info el-icon-info"></span>
                            </el-popover>
                        </div>

                        <div v-else>（在画布中选择起点）</div>

                        <el-button size="mini" @click="doAStar('start')">选择起点</el-button>
                    </div>
                    <div class="node-box">
                        <span>终点</span>
                        <div v-if="aStar.srcAndDst.end">
                            vid：{{ aStar.srcAndDst.end.id }}
                            <el-popover placement="right" trigger="click">
                                <div v-for="(item, index) in aStar.srcAndDst.end.properties" :key="index">
                                    <span class="node-field">{{ index }}:</span> {{ item }}
                                </div>
                                <span slot="reference" class="node-info el-icon-info"></span>
                            </el-popover>
                        </div>
                        <div v-else>（在画布中选择终点）</div>
                        <el-button size="mini" @click="doAStar('end')">选择终点</el-button>
                    </div>
                </div>
            </template>
            <template v-if="targetMethod === 'allPath'">
                <div class="all-path-panel">
                    <el-table :data="tableData" height="calc(100% - 50px)" border style="width:100%;" @row-click="rowClick">
                        <!-- <el-table-column prop="number" label="序号"> </el-table-column> -->
                        <el-table-column prop="src" label="起点"> </el-table-column>
                        <el-table-column prop="dst" label="终点"> </el-table-column>
                        <el-table-column prop="length" label="长度"> </el-table-column>
                    </el-table>
                </div>
            </template>
        </div>
        <div class="visual-method-footer">
            <el-button size="mini" @click="closePanel">取消</el-button>
            <el-button size="mini" type="primary" @click="execMethod">执行</el-button>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CypherStore from '@/store/cypher/cypher'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import CreateLabelStore from '@/store/create-label/create-label'

@Component
export default class VisaulMethodBox extends Vue {
    @Prop(String) tabValue!: string
    @Prop(String) graphName!: string
    cypherStore: CypherStore = getModule(CypherStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    targetMethod: string = ''
    filterAllPath: {
        allPathSrcNode: any
        allPathDstNode: any
    } = { allPathSrcNode: null, allPathDstNode: null }
    allPathDstNode: any = null
    methodList: Array<{ name: string; label: string }> = [
        { name: 'aStar', label: '最短路' }
        // { name: 'allPath', label: '全路径' }
    ]
    tableData: any[] = []
    get graphData() {
        let data, cypherReasultData, graphData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        data && (cypherReasultData = data.cypherReasultData)
        cypherReasultData && (graphData = cypherReasultData.graphData)
        return graphData
    }
    get srcFilter() {
        let data = []
        this.tableData.forEach((item) => {
            data.push({
                text: item.src,
                value: item.src
            })
        })
        return data
    }
    get dstFilter() {
        let data = []
        this.tableData.forEach((item) => {
            data.push({
                text: item.dst,
                value: item.dst
            })
        })
        return data
    }
    get lenFilter() {
        let data = []
        this.tableData.forEach((item) => {
            data.push(item.length)
        })
        data = [...new Set(data)]
        data = data.map((item) => {
            return {
                text: item,
                value: item
            }
        })
        return data
    }
    get nodeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
        return target.allLabel.filter((item) => item.type === 'node')
    }
    get edgeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
        return target.allLabel.filter((item) => item.type === 'edge')
    }
    get aStar() {
        return this.graphData.visualMethod.aStar
    }
    get methodResult() {
        let data: any[]
        data = this.graphData.methodResult
        return data
    }

    @Watch('methodResult')
    onChangeMethodResult() {
        console.log(this.methodResult)
        let data = []
        if (this.targetMethod === 'allPath') {
            this.methodResult.forEach((p, index) => {
                let srclabel = p[0].sysPropties.label
                srclabel = this.nodeLabels.find((item) => item.name === srclabel)
                let srcPk = srclabel.primary
                let dstlabel = p[p.length - 1].sysPropties.label
                dstlabel = this.nodeLabels.find((item) => item.name === dstlabel)
                // if (!srclabel || !dstlabel) {
                //     console.log(p, index)
                // }
                let dstPk = dstlabel ? dstlabel.primary : 'id'

                data.push({
                    number: index + 1,
                    src: p[0].properties[srcPk],
                    dst: p[p.length - 1].properties[dstPk],
                    length: (p.length - 1) / 2,
                    path: p
                })
            })
            this.tableData = data
        }
    }
    doAStar(data: '' | 'start' | 'end') {
        if (data) {
            this.cypherStore.updateGraphDataAStar({ tabValue: this.tabValue, aStar: { selectNode: data, srcAndDst: { start: this.aStar.srcAndDst.start, end: this.aStar.srcAndDst.end } } })
        }
    }
    execMethod() {
        if (this.targetMethod === 'aStar') {
            this.$cyEvents[this.tabValue].shortestPath({ root: '#' + this.aStar.srcAndDst.start.id, goal: '#' + this.aStar.srcAndDst.end.id })
        }
        if (this.targetMethod === 'allPath') {
            this.$cyEvents[this.tabValue].allPath()
        }
    }
    closePanel() {
        this.cypherStore.upDateBtns({ tabValue: this.tabValue, active: false, index: 'method' })
    }
    rowClick(row) {
        this.$cyEvents[this.tabValue].activePath(row.path)
    }
    filterTag(value, row, column) {
        const property = column['property']
        return row[property] === value
    }
}
</script>
<style lang="less" scoped>
.visual-method-box {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 5px 10px;
    color: #666;
    font-size: 14px;
    .visual-method-header {
        font-weight: 700;
    }
    .visual-method-select {
        margin-top: 10px;
        .el-select {
            width: 100%;
        }
    }
    .visual-method-body {
        width: 100%;
        height: calc(100% - 100px);
        margin-bottom: 10px;
        overflow: hidden;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .visual-method-footer {
        display: flex;
        justify-content: space-between;
        .el-button {
            flex-grow: 1;
        }
    }
    .aStar-panel {
        .node-box {
            margin-top: 5px;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            > div {
                flex-grow: 1;
                margin-left: 10px;
                display: flex;
                align-items: center;
                .node-info {
                    font-size: 18px;
                    margin-left: 10px;
                    color: #999;
                    cursor: pointer;
                }
                /deep/.node-field {
                    font-weight: 600;
                    margin-right: 5px;
                }
            }
            .el-button {
                // flex-grow: 1;
            }
        }
    }
    .all-path-panel {
        padding-top: 10px;
        width: 100%;
        height: calc(100% - 100px);
    }
}
</style>
