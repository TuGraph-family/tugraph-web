<template>
    <div class="quick-query-path" :class="layoutType">
        <div class="path-box">
            <div class="config-header">
                <span>返回路径数目：</span>
                <el-input-number size="mini" :min="0" v-model="nodeNumber"></el-input-number>
                <el-button :disabled="targetPath.length === 0" size="mini" @click="setPathConfig">配置路径参数</el-button>
            </div>
            <div class="select-path">
                <span>路径:</span>
                <div class="target-path">
                    <template v-if="targetPath.length > 0">
                        <div v-for="(el, i) in targetPath" :key="'ele_' + i" :class="i % 2 === 0 ? 'vertex' : 'edge'">
                            <template v-if="i % 2 === 0">
                                <span>{{ 'n' + i / 2 }} | {{ el }}</span>
                            </template>
                            <template v-else>
                                <i class="el-icon-minus"></i>
                                <span>{{ 'r' + (i - 1) / 2 }} | {{ el }}</span>
                                <i class="el-icon-right"></i>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        请选择下列路径
                    </template>
                </div>
                <i class="el-icon-circle-close" @click="clearTargetPath"></i>
            </div>
            <div class="select-path-list" v-if="pathList.length > 0">
                <div v-for="(item, index) in pathList" :key="JSON.stringify(item)" @click="selectPath(item)" class="path-item">
                    <div v-for="(el, i) in pathList[index]" :key="'ele_' + i" :class="i % 2 === 0 ? 'vertex' : 'edge'">
                        <template v-if="i % 2 === 0">
                            <span>{{ 'n' + i / 2 }} | {{ el }}</span>
                        </template>
                        <template v-else>
                            <i class="el-icon-minus"></i>
                            <span>{{ 'r' + (i - 1) / 2 }} | {{ el }}</span>
                            <i class="el-icon-right"></i>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="workbench-cypher-btns">
            <div class="btn-run" @click="getCypher"></div>
        </div>
        <el-dialog title="配置路径" :visible.sync="dialogVisible" :before-close="handleClose">
            <div>
                <template v-if="selecLabels.length">
                    <el-tabs>
                        <el-tab-pane v-for="item in pathLabelsConfig" :key="item.label" :label="item.label">
                            <div class="select-label-params" v-if="Object.keys(item.props).length">
                                <div v-for="(prop, index) in item.props" :key="prop.field" class="prop-item">
                                    <span>{{ index }}</span>
                                    <el-select v-model="prop.connect" placeholder="选择关系" size="mini">
                                        <el-option v-for="c in prop.connects" :key="c.text" :label="c.text" :value="c.sign"></el-option>
                                    </el-select>
                                    <el-input clearable v-model="prop.value" size="mini"></el-input>
                                </div>
                            </div>
                            <div class="select-label-params" v-else>
                                <div>无可配置属性</div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="cancePathConfig">取 消</el-button>
                <el-button size="mini" type="primary" @click="savePathConfig">确 定</el-button>
            </span>
        </el-dialog>
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
export default class QuickQueryPath extends Vue {
    @Prop(String) layoutType!: ''
    cypherStore: CypherStore = getModule(CypherStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    selecLabels: any[] = []
    pathLabelsConfig: any[] = []
    pathList: any[] = []
    nodeNumber: number = 100
    dialogVisible: boolean = false
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
    targetPath: any[] = []
    get currentSelectedGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    @Watch('edgeLabels')
    updateCurrentSelectedGraph() {
        this.targetPath = []
        this.getPathList()
    }
    get nodeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.currentSelectedGraph)
        return target.allLabel.filter((item) => item.type === 'node')
    }
    get edgeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.currentSelectedGraph)
        return target.allLabel.filter((item) => item.type === 'edge')
    }
    getPathList() {
        if (this.targetPath.length === 0) {
            let data = []
            this.edgeLabels.forEach((edge) => {
                edge.constraints.forEach((constraint) => {
                    data.push([constraint[0], edge.name, constraint[1]])
                })
            })
            this.pathList = data
        } else {
            let data = []
            let lastLabel = this.targetPath[this.targetPath.length - 1]
            let edgeLabels = []
            this.edgeLabels.filter((e) => {
                e.constraints.forEach((i) => {
                    if (i[0] === lastLabel) {
                        edgeLabels.push(e)
                    }
                })
            })
            edgeLabels.forEach((edge) => {
                let path = []
                edge.constraints.forEach((constraint) => {
                    path = [...this.targetPath, ...[edge.name, constraint[1]]]
                    data.push(path)
                })
            })
            this.pathList = data
        }
    }
    @Watch('selecLabels')
    changeSelectLabels() {
        let data = [...this.pathLabelsConfig]
        this.selecLabels.forEach((item, index) => {
            let obj = {
                name: item,
                label: '',
                as: '',
                props: {}
            }
            let labels: any = null
            if (index % 2 === 0) {
                labels = this.nodeLabels
                obj.label = `n${index / 2} | ${item}`
                obj.as = `n${index / 2}`
            } else {
                labels = this.edgeLabels
                obj.label = `r${(index - 1) / 2} | ${item}`
                obj.as = `r${(index - 1) / 2}`
            }
            let target = labels.find((l) => l.name === item)
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
            let has = data.find((ele) => {
                if (ele.label === obj.label) {
                    return ele
                }
            })
                ? true
                : false
            !has && data.push(obj)
        })
        this.pathLabelsConfig = data
    }
    created() {
        let intervalTaskId
        if (this.nodeLabels.length > 0 && this.edgeLabels.length) {
            this.getPathList()
        } else {
            intervalTaskId = this.$interval.registTask({
                time: 2,
                fun: () => {
                    this.getPathList()
                    if (this.nodeLabels.length > 0 && this.edgeLabels.length) {
                        this.$interval.deleteTask(intervalTaskId)
                    }
                }
            })
        }
    }
    mounted() {}
    async getCypher() {
        let cypher = ``
        let option = []
        this.pathLabelsConfig.forEach((item, index) => {
            if (index % 2 === 0) {
                cypher += `(${item.as}:${item.name})`
            } else {
                cypher += `-[${item.as}:${item.name}]->`
            }
            Object.keys(item.props).forEach((key, i) => {
                if (item.props[key].value !== '') {
                    option.push(`${item.as}.${key}${item.props[key].connect}${item.props[key].value}`)
                }
            })
        })
        if (option.length) {
            let optionString = option.join(' AND ')
            cypher = `MATCH p=${cypher} WHERE ${optionString} RETURN p LIMIT ${this.nodeNumber} `
        } else {
            cypher = `MATCH p=${cypher} RETURN p LIMIT ${this.nodeNumber}`
        }
        this.cypherStore.upDateCurrentCypher(cypher)
        let id = new Date().getTime() + ''
        this.cypherStore.tabAdd({ id: id, graph: this.subGraphManageStore.selectedSubGraph })
        await this.cypherStore.queryByCypher({ graph: this.subGraphManageStore.selectedSubGraph, script: cypher, tabValue: id })
    }
    selectPath(item) {
        this.targetPath = item
        this.selecLabels = JSON.parse(JSON.stringify(this.targetPath))
        this.getPathList()
    }
    clearTargetPath() {
        this.targetPath = []
        this.pathLabelsConfig = []
        this.getPathList()
    }
    setPathConfig() {
        this.dialogVisible = true
        this.selecLabels = JSON.parse(JSON.stringify(this.targetPath))
    }
    handleClose(done) {
        return done()
    }
    cancePathConfig() {
        this.dialogVisible = false
        this.pathLabelsConfig = []
    }
    savePathConfig() {
        this.dialogVisible = false
    }
}
</script>
<style lang="less" scoped>
.quick-query-path {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    padding: 16px 14px;
    color: #666666;
    font-size: 14px;
    z-index: 4;
    .no-select {
        margin-top: 47px;
        text-align: center;
    }
    .config-header {
        .el-button {
            float: right;
        }
    }
    .select-path {
        display: flex;
        height: 50px;
        align-items: center;
        position: relative;
        width: 100%;
        span {
            flex-shrink: 0;
        }
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
    /deep/.elDialog {
        width: 760px;
        // height: 520px;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        padding-bottom: 20px;
    }
    &.layout1,
    &.layout3 {
        flex-direction: row;
        .target-path,
        .path-item {
            display: flex;
            margin-bottom: 10px;
            cursor: pointer;
            font-size: 12px;
            align-items: center;
            height: 30px;
            padding-left: 8px;
            &:hover {
                background-color: #eee;
                border-radius: 5px;
            }
            .vertex {
                height: 20px;
                border: 1px solid #5b9eea;
                line-height: 20px;
                border-radius: 15px;
                padding: 0 10px;
                text-align: center;
                flex-shrink: 0;
                background: #fff;
            }
            .edge {
                height: 18px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                > span {
                    background: #fff;
                    color: #666;
                    border: 1px solid #666;
                    padding: 0 10px;
                }
            }
        }
        .target-path {
            margin-bottom: 0;
            width: 100%;
            height: 70%;
            overflow: auto;
            margin-left: 10px;
            flex-grow: 0;
            background-color: #fff;
        }
        .el-icon-circle-close {
            position: absolute;
            right: 10px;
            font-size: 18px;
            cursor: pointer;
        }
        .select-path-list {
            width: calc(100% - 40px);
            max-height: 500px;
            background-color: #fff;
            border-radius: 5px;
            padding: 10px 10px 0 10px;
            overflow-x: auto;
            overflow-y: auto;
            position: relative;
            left: 40px;
            z-index: 3;
            box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
        }
        .path-box {
            width: calc(100% - 50px);
            border-radius: 5px;
            background-color: #f5f6fa;
            padding: 10px;
        }
        .workbench-cypher-btns {
            flex-shrink: 0;
            margin-left: 15px;
        }
    }
    &.layout2,
    &.layout4 {
        flex-direction: column;
        .path-box {
            height: calc(100% - 50px);
            min-width: calc(100% - 30px);
            border-radius: 5px;
            background-color: #f5f6fa;
            padding: 10px;
            overflow: auto;
        }
        .select-path-list {
            border-radius: 5px;
            padding: 10px 10px 0 10px;
            background-color: #fff;
            overflow-x: auto;
            overflow-y: auto;
            z-index: 3;
            box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
        }
        .target-path,
        .path-item {
            display: flex;
            margin-bottom: 10px;
            cursor: pointer;
            font-size: 12px;
            align-items: center;
            height: 50px;
            padding-left: 8px;
            overflow: auto;
            &:hover {
                background-color: #eee;
                border-radius: 5px;
            }
            .vertex {
                height: 20px;
                border: 1px solid #5b9eea;
                line-height: 20px;
                border-radius: 15px;
                padding: 0 10px;
                text-align: center;
                flex-shrink: 0;
                background: #fff;
            }
            .edge {
                height: 18px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                > span {
                    background: #fff;
                    color: #666;
                    border: 1px solid #666;
                    padding: 0 10px;
                }
            }
        }
        .target-path {
            margin-bottom: 0;
            width: 100%;
            height: 80%;
            overflow: auto;
            margin-left: 10px;
            flex-grow: 0;
            background-color: #fff;
        }
        .el-icon-circle-close {
            right: 10px;
            font-size: 18px;
            cursor: pointer;
            margin-left: 10px;
        }

        .workbench-cypher-btns {
            bottom: 10px;
            margin-top: 15px;
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
