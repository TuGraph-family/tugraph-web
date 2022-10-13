<template>
    <div class="cypher-result-graph-cxttapend">
        <div v-for="item in menuList" :key="item.name" @click="query(item)">
            {{ item.name }}
        </div>
        <el-dialog title="自定义扩展" :visible.sync="dialogVisible" :append-to-body="true" :before-close="clearData" custom-class="graph-cxttapend-dialog">
            <div class="cxttapend-base-config">
                <span>
                    扩散度数：
                    <el-input-number size="mini" v-model="n" :min="1" :max="6"></el-input-number>
                </span>
                <span>
                    返回节点数：
                    <el-input-number size="mini" v-model="limitNumber"></el-input-number>
                </span>
                <span>
                    起始节点ID：
                    <el-input class="target-vertex" size="mini" disabled v-model="targetVertexID"></el-input>
                </span>
            </div>
            <div class="cxttapend-graph">
                <div class="vertex">
                    {{ targetVertexID }}
                </div>
                <div :class="[item.type, item.towards]" v-for="item in cxttapendGraph" :key="item.id">
                    <template v-if="item.towards !== 'both' && item.type === 'edge'">
                        <img :src="item.img" alt="" />
                    </template>
                    <i class="el-icon-setting"></i>
                </div>
            </div>
            <div class="cxttapend-element-filter" v-if="targetElement"></div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="dialogVisible = false">确 定</el-button>
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
import towardsLeft from '@/assets/cypher/left.png'
import towardsRight from '@/assets/cypher/left.png'
@Component
export default class GraphCxttapend extends Vue {
    @Prop(Number) targetVertexID!: number
    @Prop(String) tabValue!: string
    dialogVisible: boolean = false
    // 拓展度数
    n: number = 1
    // 返回节点数
    limitNumber: number = 100
    cypherStore: CypherStore = getModule(CypherStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    cxttapendGraph = []
    targetElement: any = null
    cypher: string = ''
    get menuList() {
        let menuList: any[] = [
            { name: '一度扩展', script: `match(n)-[*..1]-(m) WHERE id(n)=${this.targetVertexID} return n, m` },
            { name: '二度扩展', script: `match(n)-[*..2]-(m) WHERE id(n)=${this.targetVertexID} return n, m` },
            { name: '三度扩展', script: `match(n)-[*..3]-(m) WHERE id(n)=${this.targetVertexID} return n, m` }
            // { name: '自定扩散', script: 'extendOhter' }
        ]
        return menuList
    }
    get nodeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph === this.subGraphManageStore.selectedSubGraph)
        return target.filter((item) => item.type === 'node')
    }
    get edgeLabels() {
        let target = this.createLabelStore.allLabel.find((item) => item.graph === this.subGraphManageStore.selectedSubGraph)
        return target.filter((item) => item.type === 'edge')
    }
    created() {
        let cypher = '()'
        for (let i = 0; i < this.n * 2; i++) {
            let type = i % 2 === 0 ? 'edge' : 'vertex'
            let data: any = {
                id: new Date().getTime() + '_' + type,
                label: '',
                type,
                props: []
            }
            if (type === 'edge') {
                data.towards = 'both'
            }

            this.cxttapendGraph.push(data)
        }
        this.cypher = cypher
    }
    query(item: { name: string; script: string }) {
        this.$emit('closeCxttapend')
        if (item.script === 'extendOhter') {
            this.dialogVisible = true
            return
        }
        this.cypherStore.queryNeighborByCypher({ graph: this.subGraphManageStore.selectedSubGraph, script: item.script, tabValue: this.tabValue })
    }
    @Watch('n')
    onChangeN(newVal, oldVal) {
        let j = newVal - oldVal
        if (j > 0 && this.cypher) {
            for (let i = 0; i < j * 2; i++) {
                let type = i % 2 === 0 ? 'edge' : 'vertex'
                let data: any = {
                    id: new Date().getTime() + '_' + type,
                    label: '',
                    type,
                    props: []
                }
                if (type === 'edge') {
                    data.towards = 'both'
                    this.cypher += ' -[]- '
                }
                this.cxttapendGraph.push(data)
            }
        } else {
            this.cxttapendGraph.splice(this.cxttapendGraph.length - Math.abs(j) * 2)
        }
    }
    editElement(data) {
        console.log(data.type)
        this.targetElement = data
    }
    clearData(done) {
        this.cypher = ''
        this.n = 0
        this.limitNumber = 100
        done()
        return true
    }
}
</script>
<style lang="less" scoped>
.cypher-result-graph-cxttapend {
    margin-top: 140px;
    margin-left: -15px;
    width: 100px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    font-size: 14px;
    background-color: #fff;
    color: #666;
    border-radius: 5px;
    padding-left: 10px;
    > div {
        line-height: 2em;
        cursor: pointer;
    }
}
/deep/.graph-cxttapend-dialog {
    width: 750px;
    border-radius: 5px;
    .cxttapend-base-config {
        margin-bottom: 20px;
        > span {
            margin-right: 30px;
            .target-vertex {
                width: 130px;
            }
        }
    }
    .el-dialog__body {
        padding-top: 10px;
        width: 65%;
        min-width: 800px;
    }
    .cxttapend-graph {
        display: flex;
        align-items: center;
    }
    .cxttapend-element-filter {
        margin-top: 20px;
        height: 400px;
        padding-top: 40px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        position: relative;
        .filter-header {
            width: 100%;
            height: 40px;
            position: absolute;
            top: 0;
            display: flex;
            align-items: center;
            padding: 0 10px;
            .el-select {
                flex-grow: 1;
            }
            .select-label {
                width: 400px;
            }
        }
    }
    .vertex {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2);
        text-align: center;
        line-height: 48px;
        font-size: 12px;
        background-color: #66adff;
        color: #fff;
        i {
            cursor: pointer;
        }
    }
    .edge {
        width: 60px;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.2);
        position: relative;
        text-align: center;
        font-size: 12px;
        i {
            cursor: pointer;
            font-size: 16px;
        }
        &.left {
            img {
                position: absolute;
                top: -9px;
                left: 0;
                width: 18px;
                z-index: 2;
            }
        }
        &.right {
            img {
                position: absolute;
                top: -9px;
                right: 0;
                width: 18px;
                z-index: 2;
            }
        }
    }
}
</style>
