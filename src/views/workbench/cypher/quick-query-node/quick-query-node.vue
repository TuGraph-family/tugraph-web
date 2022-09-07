<template>
    <div class="quick-query" :class="layoutType">
        <div class="node-box">
            <div class="select-label">
                <div>
                    <span>返回节点数目：</span>
                    <el-input-number size="mini" :min="0" v-model="nodeNumber"></el-input-number>
                </div>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">节点</el-checkbox>
                <el-checkbox-group v-model="selectNodeLabels" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="item in nodeLabels" :label="item.name" :key="item.na">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
            </div>
            <div class="select-label-config">
                <template v-if="selectNodeLabels.length">
                    <el-tabs>
                        <el-tab-pane v-for="item in nodeLabelsConfig" :key="item.name" :label="item.name">
                            <div class="select-label-params">
                                <div v-for="(prop, index) in item.props" :key="prop.field" class="prop-item">
                                    <span>{{ index }}</span>
                                    <el-select v-model="prop.connect" placeholder="选择关系" size="mini">
                                        <el-option v-for="c in prop.connects" :key="c.text" :label="c.text" :value="c.sign"></el-option>
                                    </el-select>
                                    <el-input clearable v-model="prop.value" size="mini"></el-input>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </template>
                <template v-else>
                    <div class="no-select">请先选择类型，再进行配置相关条件</div>
                </template>
            </div>
        </div>
        <div class="workbench-cypher-btns">
            <div class="btn-run" @click="getCypher"></div>
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
export default class QuickQueryNode extends Vue {
    @Prop(String) layoutType!: ''
    cypherStore: CypherStore = getModule(CypherStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    selectNodeLabels: any[] = []
    checkAll: boolean = false
    isIndeterminate: boolean = false
    nodeLabelsConfig: any[] = []
    activeName: string = 'vertex'
    nodeNumber: number = 300
    connect: any = {
        string: [
            { text: '等于', sign: '=' },
            { text: '不等于', sign: '<>' }
        ],
        number: [
            { text: '等于', sign: '=' },
            { text: '不等于', sign: '<>' },
            { text: '大于', sign: '>' },
            { text: '小于', sign: '<' },
            { text: '大于等于', sign: '>=' },
            { text: '小于等于', sign: '<=' }
        ]
    }
    get currentSelectedGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    @Watch('currentSelectedGraph')
    updateCurrentSelectedGraph() {
        this.nodeLabelsConfig = []
        this.selectNodeLabels = []
    }
    get currentCypher() {
        return this.cypherStore.currentCypher
    }
    get nodeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.currentSelectedGraph)
        return target.allLabel.filter((item) => item.type === 'node')
    }
    get edgeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.currentSelectedGraph)
        return target.allLabel.filter((item) => item.type === 'edge')
    }
    @Watch('selectNodeLabels')
    changeSelectNodeLabels() {
        let data = []
        this.selectNodeLabels.forEach((item) => {
            let obj = {
                name: item,
                props: {}
            }
            let target = this.nodeLabels.find((l) => l.name === item)
            Object.keys(target.props).forEach((key) => {
                if (target.props[key].type !== 'BLOB') {
                    let type
                    if (target.props[key].type === 'STRING' || target.props[key].type === 'DATE' || target.props[key].type === 'DATETIME') {
                        type = 'string'
                    } else {
                        type = 'number'
                    }
                    obj.props[key] = {
                        connect: '',
                        connects: this.connect[type],
                        value: ''
                    }
                }
            })
            data.push(obj)
        })

        this.nodeLabelsConfig = data
    }
    @Watch('currentCypher')
    onChangeCurrentCypher(newVal: string, oldVal: string) {}
    created() {}
    mounted() {}
    handleCheckAllChange(val) {
        let allNodeLabels = this.nodeLabels.map((item) => item.name)
        this.selectNodeLabels = val ? allNodeLabels : []
        this.isIndeterminate = false
    }
    handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.nodeLabels.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.nodeLabels.length
    }
    async getCypher() {
        let cypher = `MATCH `
        if (this.activeName === 'vertex') {
            let nodeList = []
            let option = []
            this.nodeLabelsConfig.forEach((item, index) => {
                nodeList.push(`n${index}`)
                Object.keys(item.props).forEach((key, i) => {
                    if (item.props[key].value !== '') {
                        option.push(`n${index}.${key}${item.props[key].connect}${item.props[key].value}`)
                    }
                })
                cypher += `(n${index}:${item.name})`
                if (index < this.nodeLabelsConfig.length - 1) {
                    cypher += ','
                }
            })

            if (this.nodeLabelsConfig.length > 0) {
                if (option.length) {
                    let optionString = option.join(' AND ')
                    cypher += ` WHERE ${optionString} RETURN ${nodeList.toString()} LIMIT ${this.nodeNumber} `
                } else {
                    cypher += ` RETURN ${nodeList.toString()} LIMIT ${this.nodeNumber}`
                }
            } else {
                cypher = `MATCH (n) RETURN n LIMIT ${this.nodeNumber}`
            }
        }
        this.cypherStore.upDateCurrentCypher(cypher)
        let id = new Date().getTime() + ''
        this.cypherStore.tabAdd({ id: id, graph: this.currentSelectedGraph })
        await this.cypherStore.queryByCypher({ graph: this.currentSelectedGraph, script: cypher, tabValue: id })
    }
}
</script>
<style lang="less" scoped>
.quick-query {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    position: relative;
    padding: 16px 14px;
    color: #666666;
    .no-select {
        font-size: 14px;
        margin-top: 47px;
        text-align: center;
    }
    .select-label-params {
        display: flex;
        flex-wrap: wrap;
        > .prop-item {
            margin-right: 10px;
            margin-bottom: 10px;
            display: flex;
            font-size: 14px;
            align-items: center;
            > span {
                margin-right: 10px;
            }
            .el-select {
                width: 100px;
                margin-right: 10px;
            }
            .el-input {
                width: 130px;
            }
        }
    }
    &.layout1,
    &.layout3 {
        flex-direction: row;
        > .node-box {
            width: calc(100% - 40px);
            height: 100%;
            border-radius: 5px;
            display: flex;
            background-color: #f5f6fa;
            padding: 10px 10px;
        }
        .select-label {
            width: 590px;
            border-right: 1px dashed #aaa;
            font-size: 14px;
            overflow: auto;
            flex-shrink: 0;
            font-size: 14px;
            .el-select {
                width: 100%;
                height: 100%;
                margin: 10px 0;
            }
        }
        .select-label-config {
            margin-left: 10px;
            height: 100%;
            flex-grow: 1;
            overflow: auto;
        }
        .workbench-cypher-btns {
            margin-left: 15px;
        }
    }
    &.layout2,
    &.layout4 {
        flex-direction: column;
        .workbench-cypher-btns {
            margin-top: 15px;
        }
        .node-box {
            width: 100%;
            height: calc(100% - 50px);
            padding: 10px;
            background-color: #f5f6fa;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
        }
        .select-label {
            width: 100%;
            border-bottom: 1px dashed #aaa;
            margin-bottom: 10px;
            padding-bottom: 10px;
            overflow: auto;
            flex-shrink: 0;
            min-height: 180px;
            .el-select {
                width: 100%;
                height: 100%;
                margin: 10px 0;
            }
        }
        .el-tabs {
            /deep/.el-tabs__content {
                height: calc(100% - 40px);
                .el-tab-pane {
                    height: 100%;
                }
            }
        }
        .select-label-config {
            width: 100%;
            flex-grow: 1;
            /deep/.el-tabs__item {
                height: 30px;
                line-height: 30px;
            }
        }
    }
    .workbench-cypher-btns {
        .btn-run {
            cursor: pointer;
            width: 36px;
            height: 36px;
            background: url('../../../../assets/cypher-ide/run-normal.png') no-repeat center;
            &:hover {
                background: url('../../../../assets/cypher-ide/run-hover.png') no-repeat center;
            }
        }
    }
}
</style>
