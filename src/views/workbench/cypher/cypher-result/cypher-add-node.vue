<i18n src="./cypher-add-lang.json"></i18n>
<template>
    <div class="cypher-add-node">
        <div class="add-vertex-body">
            <div>选择标签</div>
            <div>
                <el-select v-model="targetNodeLabel" filterable size="mini" @change="onChangeTargetNodelabel">
                    <el-option v-for="item in nodeLabels" :key="item.name" :label="item.name" :value="item.name"> </el-option>
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
        </div>
        <div class="cypher-add-node-btns">
            <el-button size="mini" @click="closeAddNode">取 消</el-button>
            <el-button size="mini" type="primary" @click="doAddVertex">确 定</el-button>
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
    targetNodeLabel: string = ''
    labelProps: Array<InputData> = []
    @Prop(String) graphName!: string
    get nodeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph == this.graphName)
        return target.allLabel.filter((item) => item.type === 'node')
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
    async doAddVertex() {
        if (!this.targetNodeLabel) {
            this.$message({
                message: `${this.$t('message.text1')}`,
                type: 'warning'
            })
            return
        }
        let checkResult = this.checkOptional(this.labelProps)
        if (!checkResult) {
            this.$message({
                message: `${this.$t('message.text2')}`,
                type: 'warning'
            })
            return
        }
        let data = this.labelProps
        let result = await this.cypherStore.addNodeOrEdge({
            graph: this.graphName,
            tabValue: this.tabValue,
            elementType: 'node',
            data: data,
            label: this.targetNodeLabel
        })

        if (result) {
            this.$message({
                type: 'success',
                message: `${this.$tc('add.t3')}`
            })
            this.cypherStore.upDateBtns({ tabValue: this.tabValue, active: false, index: 'add-node' })
        } else {
            this.$message({
                type: 'error',
                message: `${this.$tc('add.t4')}`
            })
        }
    }
    onChangeTargetNodelabel() {
        let labelProps: Array<InputData> = []
        let target = this.nodeLabels.find((label) => label.name === this.targetNodeLabel)
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
    closeAddNode() {
        this.cypherStore.upDateBtns({ tabValue: this.tabValue, active: false, index: 'add-node' })
    }
}
</script>
<style lang="less" scoped>
.cypher-add-node {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 14px;
    color: #666;
    padding: 10px;
    .add-vertex-body {
        > div {
            width: 100%;
            margin: 8px 0px;
        }
        .el-select {
            width: 100%;
        }
    }
    .prop-val {
        height: 26px;
        margin-top: 5px;
    }
    .cypher-add-node-btns {
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
