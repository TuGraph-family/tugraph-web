<i18n src="./cypher-add-lang.json"></i18n>
<template>
    <div class="cypher-add-edge">
        <div class="add-edge-body">
            <div class="select-src-dst" v-if="!srcAndDst.length">
                <img src="@/assets/cypher/draw.png" alt="" />
                在画布中选择起点和终点，并画出一条边
            </div>
            <div class="select-src-dst" v-if="srcAndDst.length && !edgeLabels.length">
                所选节点无匹配的关系类型
            </div>
            <template v-if="srcAndDst.length && edgeLabels.length">
                <div>
                    <div class="prop-item">起点：{{ srcAndDst[0].value }}</div>
                    <div class="prop-item">终点：{{ srcAndDst[1].value }}</div>
                </div>
                <div>选择标签</div>
                <div>
                    <el-select v-model="targetEdgeLabel" filterable size="mini" @change="onChangeTargetNodelabel">
                        <el-option v-for="item in edgeLabels" :key="item.name" :label="item.name" :value="item.name"> </el-option>
                    </el-select>
                </div>
                <div v-for="(item, index) in labelProps" :key="item.name" class="prop-item">
                    <div class="prop-name">
                        {{ item.name }}
                        <span class="prop-optional">({{ item.optional ? '选填' : '必填' }})</span>
                    </div>
                    <div class="prop-val">
                        <Inputformat :data.sync="labelProps[index]" :disabled="false"></Inputformat>
                    </div>
                </div>
            </template>
        </div>
        <div class="cypher-add-edge-btns">
            <el-button size="mini" @click="closeAddEdge">取 消</el-button>
            <el-button size="mini" type="primary" @click="doAddEdge">确 定</el-button>
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
import Inputformat from '@/components/inputformat/inputformat.vue'
interface InputData {
    name: string
    optional: boolean
    type: string
    value: any
}
@Component({
    components: { Inputformat }
})
export default class WorkbenchCypherAddNode extends Vue {
    cypherStore: CypherStore = getModule(CypherStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    @Prop(String) tabValue!: string
    @Prop(String) graphName!: string
    targetEdgeLabel: string = ''
    labelProps: Array<InputData> = []
    srcNode: any = null
    dstNode: any = null
    get nodeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
        return target.allLabel.filter((item) => item.type === 'node')
    }
    get edgeLabels() {
        let data = []
        if (this.srcAndDst.length) {
            let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
            data = target.allLabel.filter((item) => {
                if (item.type === 'edge') {
                    let constraints = item.constraints || []
                    let has = false
                    constraints.forEach((c) => {
                        c[0] === this.srcAndDst[0].label && c[1] === this.srcAndDst[1].label && (has = true)
                    })
                    if (constraints.length === 0) {
                        return item
                    } else if (has) {
                        return item
                    }
                }
            })
        }

        return data
    }
    get graphData() {
        let data, cypherReasultData, graphData
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        data && (cypherReasultData = data.cypherReasultData)
        cypherReasultData && (graphData = cypherReasultData.graphData)
        return graphData
    }
    get srcAndDst() {
        let list = []
        let data = this.graphData.addEdgeSrcAndDst || []
        if (data.length > 0) {
            let srckey = this.nodeLabels.find((item) => item.name === data[0].sysPropties.label).primary
            let dstkey = this.nodeLabels.find((item) => item.name === data[1].sysPropties.label).primary
            let src = {
                label: data[0].sysPropties.label,
                value: data[0].properties[srckey],
                vid: data[0].sysPropties.vid
            }
            let dst = {
                label: data[1].sysPropties.label,
                value: data[1].properties[dstkey],
                vid: data[1].sysPropties.vid
            }

            if (src && dst) {
                list = [src, dst]
            }
        }
        return list
    }

    onChangeSrcAndDst() {
        this.srcNode = {}
    }
    checkOptional(data: any): boolean {
        let status = true
        let len = Object.keys(data).length
        for (let i = 0; i < len; i++) {
            let item = data[Object.keys(data)[i]]
            if (!item.optional && !item.value && item.value !== 0) {
                status = false
                break
            }
        }
        return status
    }
    async doAddEdge() {
        if (this.srcAndDst.length === 0) {
            this.$message({
                type: 'warning',
                message: `${this.$tc('message.text4')}`
            })
            return
        }
        let data = this.labelProps
        let result = await this.cypherStore.addNodeOrEdge({
            graph: this.graphName,
            tabValue: this.tabValue,
            elementType: 'edge',
            data: data,
            label: this.targetEdgeLabel,
            src: this.srcAndDst[0].vid.toString(),
            destination: Number(this.srcAndDst[1].vid)
        })
        if (result) {
            this.$message({
                type: 'success',
                message: `${this.$tc('message.text5', 1)}`
            })
            this.cypherStore.upDateBtns({ tabValue: this.tabValue, active: false, index: 'add-edge' })
            this.$cyEvents[this.tabValue].focusSourceOrEndNode(false)
        } else {
            this.$message({
                type: 'error',
                message: `${this.$tc('message.text5', 2)}`
            })
        }
    }
    onChangeTargetNodelabel() {
        let labelProps: Array<InputData> = []
        let target = this.edgeLabels.find((label) => label.name === this.targetEdgeLabel)
        if (target) {
            Object.keys(target.props).forEach((item) => {
                let data: InputData = {
                    name: item,
                    type: target.props[item].type,
                    optional: target.props[item].optional,
                    value: ''
                }
                labelProps.push(data)
            })
        }
        this.labelProps = labelProps
    }
    closeAddEdge() {
        this.cypherStore.upDateBtns({ tabValue: this.tabValue, active: false, index: 'add-edge' })
        this.$cyEvents[this.tabValue].focusSourceOrEndNode(false)
    }
}
</script>
<style lang="less" scoped>
.cypher-add-edge {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 14px;
    color: #666;
    padding: 10px;

    .add-edge-body {
        > div {
            width: 100%;
            margin: 8px 0px;
        }
        .select-src-dst {
            width: 100%;
            padding: 20px;
            margin-top: 80px;
            display: flex;
            justify-items: center;
            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
            }
        }
        .el-select {
            width: 100%;
        }
    }
    .prop-val {
        height: 26px;
        margin-top: 5px;
    }
    .cypher-add-edge-btns {
        position: absolute;
        bottom: 0;
        height: 40px;
        width: calc(100% - 20px);
        display: flex;
        align-items: center;
        > .el-button {
            flex-grow: 1;
        }
    }
}
</style>
