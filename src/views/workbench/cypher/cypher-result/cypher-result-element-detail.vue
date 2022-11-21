<i18n src="./cypher-result-element-detail-lang.json">
</i18n>
<template>
    <div class="workbench-cypher-result-element-detail">
        <div class="element-detail-title" :style="{ backgroundColor: activeElementList[0].color }">
            {{ activeElementList[0].type === 'node' ? '节点详情' : '关系详情' }}
        </div>
        <el-collapse v-model="activeNames">
            <el-collapse-item :name="index" v-for="(item, index) in activeElementList" :key="item.id">
                <template slot="title">
                    <div class="sys-prop">
                        <div>
                            <span>{{ item.type === 'node' ? '点ID' : '边ID' }}：</span>
                            {{ item.id }}
                        </div>
                    </div>
                </template>
                <div>
                    <span>标签：</span>
                    {{ item.labelName }}
                </div>
                <div class="prop-list">
                    <div v-for="(item_c, index) in item.propsList" :key="item_c.name" class="prop-item">
                        <div class="prop-name">
                            {{ item_c.name }}
                            <span class="prop-optional">({{ item_c.optional ? '选填' : '必填' }})</span>
                            <el-tooltip class="item" effect="light" content="复制" placement="right">
                                <i class="el-icon-document-copy" @click="copy(item_c.value)"></i>
                            </el-tooltip>
                        </div>
                        <div class="prop-val">
                            <Inputformat :data.sync="item.propsList[index]" :disabled="!edit"></Inputformat>
                        </div>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="prop-btns" v-if="activeElementList.length <= 1">
            <template v-if="!edit">
                <el-button icon="el-icon-edit-outline" size="mini" @click="edit = true" type="primary" plain>修改</el-button>
                <el-button icon="el-icon-delete" size="mini" type="danger" @click="deleteElement" plain>删除</el-button>
            </template>
            <template v-else>
                <el-button icon="el-icon-check" size="mini" type="primary" plain @click="saveEdit">确认</el-button>
                <el-button icon="el-icon-close" size="mini" @click="edit = false" type="info" plain>取消</el-button>
            </template>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CypherStore from '@/store/cypher/cypher'
import CreateLabelStore from '@/store/create-label/create-label'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import Inputformat from '@/components/inputformat/inputformat.vue'
import { copyToClipboardAsync } from '@/core/uitls'

@Component({
    components: { Inputformat }
})
export default class WorkbenchCypherResultElementDetail extends Vue {
    cypherStore: CypherStore = getModule(CypherStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    selectedlabelName: string = ''
    edit: boolean = false
    @Prop(String) tabValue!: string
    @Prop(String) graphName!: string
    propsList: any[] = []
    activeNames: any[] = [0]
    activeElementList: any[] = []

    get activeElement() {
        let data
        data = this.cypherStore.cypherReasultDatas.find((item) => item.id === this.tabValue)
        return data.cypherReasultData.graphData.activeElement || []
    }
    get nodeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
        return target.allLabel.filter((item) => item.type === 'node')
    }
    get edgeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
        return target.allLabel.filter((item) => item.type === 'edge')
    }
    @Watch('activeElement', { immediate: true, deep: true })
    onChangeActiveElement() {
        this.activeElementList = []
        this.activeElement.forEach((item) => {
            let propsList = []
            let data: {
                name: string
                type: string
                value: string
                optional: boolean
            }
            let type = item.type
            let labelName = item.sysPropties.label
            let properties = item.properties || {}
            let label: any
            if (type === 'node') {
                label = this.nodeLabels.find((item) => item.name === labelName)
            } else if (type === 'edge') {
                label = this.edgeLabels.find((item) => item.name === labelName)
            }
            Object.keys(properties).forEach((item) => {
                data = {
                    name: item,
                    type: label.props[item].type,
                    value: properties[item],
                    optional: label.props[item].optional
                }
                propsList.push(data)
            })
            let obj = {
                type,
                labelName,
                properties,
                label,
                color: item.color,
                id: type === 'node' ? item.sysPropties.vid : item.sysPropties.uid,
                propsList
            }
            this.activeElementList.push(obj)
        })
    }
    deleteElement() {
        let type = this.activeElement[0].type
        let element = this.activeElement[0]
        this.$confirm(`${type === 'node' ? '节点' : '关系'}将被永久删除，是否继续？`, `提示`, {
            confirmButtonText: `确认`,
            cancelButtonText: `取消`,
            type: 'warning'
        })
            .then(async () => {
                let result: any
                if (type === 'node') {
                    result = await this.cypherStore.deleteNodeOrEdge({
                        graph: this.subGraphManageStore.selectedSubGraph,
                        tabValue: this.tabValue,
                        id: element.sysPropties.vid,
                        elementType: 'node',
                        label: element.sysPropties.label
                    })
                } else {
                    result = await this.cypherStore.deleteNodeOrEdge({
                        graph: this.subGraphManageStore.selectedSubGraph,
                        tabValue: this.tabValue,
                        id: element.sysPropties.uid,
                        elementType: 'edge',
                        label: element.sysPropties.label
                    })
                }
                if (result) {
                    this.$message({
                        type: 'success',
                        message: `删除成功`
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: `删除失败`
                    })
                }
                this.cypherStore.upDateActiveElement({
                    tabValue: this.tabValue,
                    data: []
                })
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: `${this.$t('取消删除')}`
                })
            })
    }
    async saveEdit() {
        let type = this.activeElementList[0].type
        let data = this.activeElementList[0].propsList
        let element = this.activeElement[0]
        let result: any
        if (type === 'node') {
            result = await this.cypherStore.editNodeOrEdge({ tabValue: this.tabValue, id: element.sysPropties.vid, elementType: 'node', graph: this.subGraphManageStore.selectedSubGraph, data: data })
        } else if (type === 'edge') {
            result = await this.cypherStore.editNodeOrEdge({ tabValue: this.tabValue, id: element.sysPropties.uid, elementType: 'edge', graph: this.subGraphManageStore.selectedSubGraph, data: data })
        }
        if (result) {
            this.$message({
                type: 'success',
                message: `修改成功`
            })
            this.cypherStore.upDateActiveElement({
                tabValue: this.tabValue,
                data: []
            })
        } else {
            this.$message({
                type: 'error',
                message: `修改失败`
            })
        }
    }
    async copy(val) {
        let res = await copyToClipboardAsync(val)
        if (res.text === 'ok') {
            this.$message({
                message: '复制成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.text,
                type: 'warning'
            })
        }
    }
}
</script>
<style lang="less" scoped>
.workbench-cypher-result-element-detail {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 4;
    background: #ffffff;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    overflow: absolute;
    color: #666;
    /deep/.el-collapse {
        margin: 0 10px;
        overflow: auto;
        height: calc(100% - 28px);
    }
    .element-detail-title {
        font-size: 16px;
        font-weight: 700px;
        line-height: 28px;
        background-color: #98acc3;
        color: #ffffff;
        margin: 5px 10px;
        padding-left: 5px;
        border-radius: 5px;
    }
    .prop-item {
        margin-bottom: 10px;
    }
    .prop-val {
        height: 26px;
        margin-top: 5px;
    }
    .sys-prop {
        font-size: 14px;
        margin-bottom: 10px;
        margin: 0px 0px;
        > div {
            line-height: 28px;
        }
        span {
            font-weight: 700;
        }
    }
    .prop-list {
        height: calc(100% - 140px);
        margin: 5px 0px;
        overflow: auto;
    }
    .prop-btns {
        margin: 5px 10px;
        display: flex;
        align-items: center;
        height: 34px;
        border-top: 1px dashed #eee;
        position: absolute;
        bottom: 0;
        width: calc(100% - 20px);
        .el-button {
            flex-grow: 1;
        }
    }
    .prop-name {
        font-size: 14px;
        display: flex;
        align-items: center;
        width: 100%;
        .prop-optional {
            font-size: 12px;
            color: #aaa;
            flex-grow: 1;
            margin-left: 5px;
        }
        i {
            margin-right: 5px;
            cursor: pointer;
        }
    }
}
</style>
