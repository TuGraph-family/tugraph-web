<template>
    <div class="filter-box">
        <template v-if="filterList.length">
            <div class="filter-box-header">
                过滤列表
            </div>
            <div class="filter-box-list">
                <div v-for="(item, index) in filterList" :key="item.type + item.label + index" @click.self="editFilterParamsObj(item)" class="filter-item">
                    <el-tooltip class="item" :content="item.label" placement="top">
                        <span>{{ item.type === 'node' ? '点' : '边' }}：{{ item.label }}</span>
                    </el-tooltip>
                    <span>
                        <span>启用：</span>
                        <el-switch v-model="item.on" @change="changeSwitch"> </el-switch>
                        <i class="el-icon-error" @click="deleteFilter(item, index)"></i>
                    </span>
                </div>
            </div>
            <div class="filter-box-btns">
                <div>
                    <el-button size="mini" @click="showDialog">创建条件</el-button>
                    <el-button size="mini" @click="deleteAllConfig">全部删除</el-button>
                </div>
                <div>
                    <el-button size="mini" @click="turnOnAllConfig">全部启用</el-button>
                    <el-button size="mini" @click="turnOffAllConfig">全部停用</el-button>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="filter-box-no-data">
                <div>当前无过滤条件</div>
                <el-button size="mini" type="primary" @click="showDialog">
                    创建过滤条件
                </el-button>
            </div>
        </template>
        <el-dialog :modal="false" title="创建过滤条件" :visible.sync="dialogVisible">
            <div class="dialog-container">
                <div class="dialog-container-base">
                    <div class="filter-params-name">
                        <span>选择类型</span>
                        <el-select v-model="filterParamsObj.type" size="mini" @change="changefilterParamsObjType" placeholder="请选择">
                            <el-option label="节点" value="node"></el-option>
                            <el-option label="关系" value="edge"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <span>选择标签</span>
                        <el-select v-model="filterParamsObj.label" size="mini" placeholder="请选择" @change="changeParams">
                            <el-option v-for="item in targetlabels" :key="item.name" :label="item.name" :value="item.name"> </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="dialog-container-config">
                    <div>
                        <span>配置条件</span>
                    </div>
                    <div class="dialog-container-config-list">
                        <div v-for="item in filterParamsObj.paramsList" :key="item.prop">
                            <span>{{ item.prop }}</span>
                            <el-select v-model="item.connect" size="mini" placeholder="请选择">
                                <el-option v-for="c in item.connects" :key="c.text" :label="c.text" :value="c.sign"> </el-option>
                            </el-select>
                            <el-input size="mini" v-model="item.value"></el-input>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="saveFilterParams">确 定</el-button>
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
import Inputformat from '@/components/inputformat/inputformat.vue'
interface InputData {
    name: string
    optional: boolean
    type: string
    value: any
}
@Component
export default class FilterBox extends Vue {
    cypherStore: CypherStore = getModule(CypherStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    @Prop(String) tabValue!: string
    dialogVisible: boolean = false
    isEdite: boolean = false
    filterParamsObj: { label: string; type: string; on: boolean; paramsList: any[] } = { label: '', type: '', on: true, paramsList: [] }
    connects: any = [
        { text: '等于', sign: '==' },
        { text: '不等于', sign: '!=' },
        { text: '大于', sign: '>' },
        { text: '小于', sign: '<' },
        { text: '大于等于', sign: '>=' },
        { text: '小于等于', sign: '<=' }
    ]
    @Prop(String) graphName!: string
    get filterList() {
        let data: any = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        return data.cypherReasultData.graphData.filterList
    }
    get targetlabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
        let data = target.allLabel.filter((item) => item.type === this.filterParamsObj.type)
        return data
    }

    changefilterParamsObjType() {
        this.filterParamsObj.label = ''
        this.filterParamsObj.paramsList = []
    }
    changeParams() {
        let target = this.targetlabels.find((item) => item.name === this.filterParamsObj.label) || {}
        let data = []

        Object.keys(target.props || {}).forEach((key) => {
            let type
            if (target.props[key].type === 'STRING' || target.props[key].type === 'DATE' || target.props[key].type === 'DATETIME' || target.props[key].type === 'BOOL') {
                type = 'string'
            } else {
                type = 'number'
            }
            let obj = {
                labelType: type,
                prop: key,
                connect: '',
                value: null,
                connects: this.connects
            }
            data.push(obj)
        })
        this.filterParamsObj.paramsList = data
    }
    showDialog() {
        this.filterParamsObj = { type: '', label: '', on: true, paramsList: [] }
        this.dialogVisible = true
    }
    saveFilterParams() {
        let data: any = []
        if (!this.isEdite) {
            if (!this.filterParamsObj.type || !this.filterParamsObj.label) {
                this.$message({
                    message: '类型和标签不能为空',
                    type: 'warning'
                })
                return
            }
            let target = this.filterList.find((item) => item.label == this.filterParamsObj.label && item.type == this.filterParamsObj.type)
            if (target) {
                this.$message({
                    message: this.filterParamsObj.type + ':' + this.filterParamsObj.label + '不能重复配置',
                    type: 'warning'
                })
                return
            }
            data = [...this.filterList, this.filterParamsObj]
        } else {
            data = [...this.filterList]
        }
        this.cypherStore.updateGraphDataFilterList({ tabValue: this.tabValue, filterList: data })
        this.dialogVisible = false
        this.isEdite = false
    }
    deleteFilter(item, index) {
        let data = JSON.parse(JSON.stringify(this.filterList))
        data.splice(index, 1)
        this.cypherStore.updateGraphDataFilterList({ tabValue: this.tabValue, filterList: data })
    }
    deleteAllConfig() {
        let data = []
        this.cypherStore.updateGraphDataFilterList({ tabValue: this.tabValue, filterList: data })
    }
    turnOnAllConfig() {
        this.filterList.forEach((item) => {
            item.on = true
        })
        let data = [...this.filterList]
        this.cypherStore.updateGraphDataFilterList({ tabValue: this.tabValue, filterList: data })
    }
    turnOffAllConfig() {
        this.filterList.forEach((item) => {
            item.on = false
        })
        let data = [...this.filterList]
        this.cypherStore.updateGraphDataFilterList({ tabValue: this.tabValue, filterList: data })
    }
    changeSwitch() {
        let data = [...this.filterList]
        this.cypherStore.updateGraphDataFilterList({ tabValue: this.tabValue, filterList: data })
    }
    editFilterParamsObj(item) {
        this.filterParamsObj = item
        this.isEdite = true
        this.dialogVisible = true
    }
}
</script>
<style lang="less" scoped>
.filter-box {
    padding: 0 10px 10px 10px;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: #666;
    .filter-box-header {
        height: 34px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        font-weight: 700;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .filter-box-list {
        width: 100%;
        height: calc(100% - 108px);
        overflow: auto;
    }
    .filter-box-btns {
        > div {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > .el-button {
                flex-grow: 1;
            }
            &:first-child {
                margin-bottom: 5px;
            }
        }
    }
    .filter-item {
        height: 34px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 0 8px 0px 8px;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        margin-bottom: 10px;
        cursor: pointer;
        > span:first-child {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        > span:last-child {
            white-space: nowrap;
            display: flex;
            align-items: center;
            .el-icon-error {
                font-size: 20px;
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
    .filter-box-no-data {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        > div {
            margin-bottom: 20px;
        }
    }
    /deep/.el-dialog {
        width: 800px;
        border-radius: 5px;
        .el-dialog__body {
            padding: 0;
            width: 100%;
        }
        .dialog-container {
            width: 100%;
            padding: 0 20px;
            height: 300px;
            overflow: auto;
            .dialog-container-base {
                display: flex;
                align-items: center;
                > div {
                    display: flex;
                    align-items: center;
                    flex-grow: 1;
                    .el-input {
                        margin-right: 10px;
                    }
                    > span {
                        white-space: nowrap;
                        margin-right: 10px;
                    }
                    .el-select {
                        flex-grow: 1;
                    }
                    &:last-child {
                        > span {
                            margin-left: 10px;
                        }
                    }
                }
            }
            .dialog-container-config {
                margin-top: 20px;
            }
        }
    }
    .dialog-container-config-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        > div {
            display: flex;
            margin-right: 20px;
            margin-bottom: 10px;
            align-items: center;
            > span {
                white-space: nowrap;
                margin-right: 10px;
            }
            > .el-select {
                margin-right: 10px;
                width: 100px;
            }
            > .el-input {
                width: 120px;
            }
        }
    }
}
</style>
