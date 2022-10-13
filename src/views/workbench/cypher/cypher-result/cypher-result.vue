<i18n>
{
    "en":{
        "message":{
            "text1":"Current cypher query, no graph generation",
            "text2":"Current cypher query, no table generation"
        }
        
    },
    "zh":{
        "message":{
            "text1":"当前cypher查询，无图形生成",
            "text2":"当前cypher查询，无表格生成"
        }
    }
}
</i18n>

<template>
    <div class="workbench-cypher-result">
        <div class="workbench-element-detail" v-if="showElementDetail && cypherResultData.showType === 'graph'">
            <CypherResultElementDetail :tabValue="tabValue" :graphName="graphName"></CypherResultElementDetail>
        </div>
        <div class="workbench-element-detail" v-if="showAddNode">
            <CypherAddNode :tabValue="tabValue" :graphName="graphName"></CypherAddNode>
        </div>
        <div class="workbench-element-detail" v-if="showEdgeNode">
            <CypherAddEdge :tabValue="tabValue" :graphName="graphName"></CypherAddEdge>
        </div>
        <div class="workbench-element-detail" v-if="showFilterBox">
            <FilterBox :tabValue="tabValue" :graphName="graphName"></FilterBox>
        </div>
        <div class="workbench-element-detail" v-if="showMethod">
            <VisaulMethodBox :tabValue="tabValue" :graphName="graphName"></VisaulMethodBox>
        </div>
        <div class="workbench-cypher-result-main">
            <div v-show="cypherResultData.showType === 'graph'">
                <CypherResultLabel :tabValue="tabValue" :graphName="graphName"></CypherResultLabel>
                <CypherResultGraph :tabValue="tabValue" :graphName="graphName"></CypherResultGraph>
            </div>
            <div v-show="cypherResultData.showType === 'table'">
                <CypherResultTable :tabValue="tabValue" :graphName="graphName"></CypherResultTable>
            </div>
            <div v-show="cypherResultData.showType === 'code'">
                <CypherResultCode :tabValue="tabValue" :graphName="graphName"></CypherResultCode>
            </div>
            <!-- <div v-show="cypherResultData.showType === '3d'">
                <CypherResultGraph3D></CypherResultGraph3D>
            </div> -->
        </div>
        <div class="workbench-result-prop" v-if="showResultProp && cypherResultData.showType === 'graph'">
            <CypherResultProp :tabValue="tabValue" :graphName="graphName"></CypherResultProp>
        </div>
        <div class="workbench-cypher-result-right">
            <div class="workbench-cypher-result-graph btn" :class="cypherResultData.showType === 'graph' && 'active'" @click="changeShowType('graph')"><span>graph</span></div>
            <div class="workbench-cypher-result-table btn" :class="cypherResultData.showType === 'table' && 'active'" @click="changeShowType('table')"><span>table</span></div>
            <div class="workbench-cypher-result-code btn" :class="cypherResultData.showType === 'code' && 'active'" @click="changeShowType('code')"><span>code</span></div>
            <!-- <div class="workbench-cypher-result-3d btn" :class="cypherResultData.showType === '3d' && 'active'" @click="changeShowType('3d')"><span>3D</span></div> -->
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CypherResultGraph from './cypher-result-graph.vue'
import CypherResultCode from './cypher-result-code.vue'
import CypherResultProp from './cypher-result-prop.vue'
import CypherResultLabel from './cypher-result-label.vue'
import CypherResultTable from './cypher-result-table.vue'
import CypherResultElementDetail from './cypher-result-element-detail.vue'
import CypherStore from '@/store/cypher/cypher'
import CypherResultGraph3D from './cypher-result-3d.vue'
import CypherAddNode from './cypher-add-node.vue'
import CypherAddEdge from './cypher-add-edge.vue'
import FilterBox from './cypher-filter-box.vue'
import VisaulMethodBox from './cypher-visual-method.vue'
@Component({
    components: {
        CypherResultGraph,
        CypherResultCode,
        CypherResultProp,
        CypherResultLabel,
        CypherResultTable,
        CypherResultGraph3D,
        CypherResultElementDetail,
        CypherAddNode,
        CypherAddEdge,
        FilterBox,
        VisaulMethodBox
    }
})
export default class WorkbenchCypherResult extends Vue {
    cypherStore: CypherStore = getModule(CypherStore, store)
    @Prop(String) tabValue!: string
    @Prop(String) graphName!: string
    get cypherResultData() {
        let result = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        return result && result.cypherReasultData
    }
    get btnsData() {
        let result = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        return result && result.btns
    }

    get showElementDetail() {
        let status: boolean = false
        let target: any = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        if (target) {
            status = target.cypherReasultData.graphData.activeElement.length > 0
        }
        return status
    }
    get showEdgeNode() {
        let status: boolean = false
        let target: any = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        if (target) {
            status = target.btns['add-edge'].active
        }
        return status
    }
    get showFilterBox() {
        let status: boolean = false
        let target: any = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        if (target) {
            status = target.btns['filter'].active
        }
        return status
    }
    get showMethod() {
        let status: boolean = false
        let target: any = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        if (target) {
            status = target.btns['method'].active
        }
        return status
    }
    get showAddNode() {
        let status: boolean = false
        let target: any = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        if (target) {
            status = target.btns['add-node'].active
        }
        return status
    }
    get showResultProp() {
        let status: boolean = false
        let target: any = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        if (target.cypherReasultData.graphData.activeLabel && target.cypherReasultData.graphData.activeLabel !== '*NODES' && target.cypherReasultData.graphData.activeLabel !== '*EDGES') {
            status = true
        }
        return status
    }
    created() {}
    mounted() {}
    changeShowType(data: string) {
        if (data === 'graph') {
            if (this.cypherResultData && !this.cypherResultData.graphData.graph.nodes.length) {
                this.$message({
                    type: 'warning',
                    message: `${this.$t('message.text1')}`
                })
                return
            }
        }
        if (data === 'table') {
            if (this.cypherResultData && this.cypherResultData.tableData && !this.cypherResultData.tableData.length) {
                this.$message({
                    type: 'warning',
                    message: `${this.$t('message.text2')}`
                })
                return
            }
        }
        Object.keys(this.btnsData).forEach((item) => {
            this.cypherStore.upDateBtns({ tabValue: this.tabValue, active: false, index: item })
        })
        this.cypherStore.upDatShowType({ tabValue: this.tabValue, showType: data })
    }
}
</script>
<style lang="less" scoped>
.workbench-cypher-result {
    width: 100%;
    height: 100%;
    position: relative;
    background: #ffffff;
    display: flex;
    .workbench-element-detail {
        width: 350px;
        height: 100%;
        position: relative;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    .workbench-cypher-result-main {
        flex-grow: 1;
        height: 100%;
        max-width: calc(100% - 44px);
        position: relative;
        > div {
            width: 100%;
            height: 100%;
        }
    }
    .workbench-result-prop {
        width: 300px;
        height: 100%;
        position: relative;
        border-left: 1px solid rgba(0, 0, 0, 0.1);
    }
    .workbench-cypher-result-right {
        width: 44px;
        // border-left: 1px solid rgba(0, 0, 0, 0.1);
        height: 100%;
        position: relative;
        background: #ffffff;
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        .btn {
            width: 36px;
            height: 50px;
            text-align: center;
            color: rgba(0, 0, 0, 0.3);
            cursor: pointer;
            margin: 10px auto;
            font-size: 10px;
            background-repeat: no-repeat;
            background-size: 32px;
            position: relative;
            background-position: top center;
            overflow: hidden;
            padding-top: 33px;
            &.active,
            &:hover {
                color: #4481e6;
            }
        }

        .workbench-cypher-result-graph {
            background-image: url('../../../../assets/cypher-result/graph-normal.png');
            &.active,
            &:hover {
                background-image: url('../../../../assets/cypher-result/graph-active.png');
            }
        }
        .workbench-cypher-result-table {
            background-image: url('../../../../assets/cypher-result/table-normal.png');
            &.active,
            &:hover {
                background-image: url('../../../../assets/cypher-result/table-active.png');
            }
        }
        .workbench-cypher-result-code {
            background-image: url('../../../../assets/cypher-result/code-normal.png');
            &.active,
            &:hover {
                background-image: url('../../../../assets/cypher-result/code-active.png');
            }
        }
        .workbench-cypher-result-3d {
            background-image: url('../../../../assets/cypher-result/3D-normal.png');
            &.active,
            &:hover {
                background-image: url('../../../../assets/cypher-result/3D-active.png');
            }
        }
    }
}
</style>
