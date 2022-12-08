<i18n src="./cypher-lang.json"></i18n>
<template>
    <div class="workbench-cypher" :class="layoutType" ref="workbenchCypher">
        <div class="workbench-cypher-input">
            <CypherIDE :layoutType="layoutType" :isShowLocalCypher.sync="isShowLocalCypher" v-if="queryType === 'query1'"></CypherIDE>
            <QuickQueryNode :layoutType="layoutType" v-if="queryType === 'query2'"></QuickQueryNode>
            <QuickQueryPath :layoutType="layoutType" v-if="queryType === 'query3'"></QuickQueryPath>
        </div>
        <div class="workbench-cypher-output" :class="{ max: isMax }">
            <el-tabs type="card" :value="tabValue" closable :stretch="true" v-if="cypherResultDatas.length" @tab-remove="tabRemove" @tab-click="tabClick">
                <el-tab-pane :label="item.cypher" :name="item.id" v-for="item in cypherResultDatas" :key="item.id">
                    <span slot="label" style="user-select:none;" role="tab" :id="`tab-${item.id}`">
                        <i class="graph-name" :title="item.graphName">{{ item.graphName }}</i>
                        {{ item.cypherForTab }}
                    </span>
                    <div class="tab-panel-bar">
                        <div class="tab-cypher" @click="clickCypher(item.cypher)">
                            <el-tooltip class="item" effect="light" content="复制" placement="right">
                                <i class="el-icon-document-copy" @click.stop="copy(item.cypher)"></i>
                            </el-tooltip>
                            {{ item.cypher }}
                        </div>
                        <div class="tab-btns" :class="showType">
                            <div
                                class="tab-btn-item"
                                :title="index"
                                :class="[index, icon.active && 'active']"
                                v-for="(icon, index) in item.btns"
                                :key="index"
                                @click="upDateBtn(icon, item.id, index, item.btns)"
                            >
                                <div v-if="index === 'export'" class="export-btn-group">
                                    <div @click.self.stop="exportPNG">{{ $t('text1') }}</div>
                                    <div @click.self.stop="exportJSON">{{ $t('text2') }}</div>
                                    <div @click.self.stop="exportCSV">{{ $t('text4') }}</div>
                                </div>
                                <div v-if="index === 'mergeVertex'" class="merge-btn-group">
                                    <div @click.self.stop="mergeNodes(true)">{{ $t('merge.t1') }}</div>
                                    <div @click.self.stop="mergeNodes(false)">{{ $t('merge.t2') }}</div>
                                </div>
                                <div v-if="index === 'layout'" class="layout-btn-group">
                                    <div @click.self.stop="changeLayout('force')">{{ $t('text8') }}</div>
                                    <div @click.self.stop="changeLayout('grid')">{{ $t('text5') }}</div>
                                    <div @click.self.stop="changeLayout('circle')">{{ $t('text6') }}</div>
                                    <div @click.self.stop="changeLayout('tree')">{{ $t('text7') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-result">
                        <CypherResult v-if="item.cypherReasultData" :graphName="item.graphName" :tabValue="item.id"></CypherResult>
                        <div v-else class="cypher-loading">
                            <Loading></Loading>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div v-else class="workbench-cypher-no-query">
                <div>{{ $t('text3') }}</div>
            </div>
        </div>
        <div class="workbench-cypher-set">
            <el-popover popper-class="set-panel" placement="bottom" width="300" trigger="click">
                <div>
                    查询方式：
                </div>
                <el-select size="mini" v-model="queryType" placeholder="请选择">
                    <el-option v-for="(item, index) in queryTypes" :key="index" :label="item" :value="index"> </el-option>
                </el-select>
                <!-- <div>
                    节点限制：
                </div>
                <el-input size="mini" placeholder="返回最多节点个数" v-model="maxNodeNumber">
                    <template slot="append">个</template>
                </el-input> -->
                <div>布局方式：</div>
                <div class="layout-types">
                    <div class="t_b" :class="{ active: layoutType === 'layout1' }" @click="layoutType = 'layout1'"></div>
                    <div class="l_r" :class="{ active: layoutType === 'layout2' }" @click="layoutType = 'layout2'"></div>
                    <div class="b_t" :class="{ active: layoutType === 'layout3' }" @click="layoutType = 'layout3'"></div>
                    <div class="r_l" :class="{ active: layoutType === 'layout4' }" @click="layoutType = 'layout4'"></div>
                </div>

                <i class="el-icon-setting" slot="reference"></i>
            </el-popover>
        </div>
        <div v-if="isShowLocalCypher" class="workbench-local-cypher">
            <LocalCypher :isShowLocalCypher.sync="isShowLocalCypher" />
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import CypherIDE from './cypher-ide/cypher-ide.vue'
import QuickQueryNode from './quick-query-node/quick-query-node.vue'
import QuickQueryPath from './quick-query-path/quick-query-path.vue'
import LocalCypher from '@/components/local-cypher/local-cypher.vue'
import CypherResult from './cypher-result/cypher-result.vue'
import CypherStore from '@/store/cypher/cypher'
import Loading from '@/components/loading/loading.vue'
import CreateLabelStore from '@/store/create-label/create-label'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import { copyToClipboardAsync } from '@/core/uitls'

@Component({
    components: {
        CypherIDE,
        CypherResult,
        Loading,
        QuickQueryNode,
        QuickQueryPath,
        LocalCypher
    }
})
export default class WorkbenchCypher extends Vue {
    public $refs!: {
        workbenchCypher: HTMLElement
    }
    cypherStore: CypherStore = getModule(CypherStore, store)
    createLabelStore: CreateLabelStore = getModule(CreateLabelStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    isMax: boolean = false
    isShowLocalCypher: boolean = false
    layoutType: string = 'layout1'
    showSetPanel: boolean = false
    queryType: string = 'query1'
    queryTypes: { [prop: string]: string } = { query1: '语句查询', query2: '节点查询', query3: '路径查询' }
    maxNodeNumber: number = 5000

    get tabValue() {
        return this.cypherStore.tabValue
    }
    get cypherResultDatas() {
        return this.cypherStore.cypherReasultDatas
    }
    get showType() {
        let type = 'graph'
        let data: any = this.cypherResultDatas && this.cypherResultDatas.find((item) => item.id === this.tabValue)
        if (data && data.cypherReasultData) {
            console.log(data.cypherReasultData)
            type = data.cypherReasultData.showType
        }
        return type
    }
    tabRemove(data: any) {
        this.cypherStore.tabRemove(data)
    }
    tabClick(data: any) {
        this.cypherStore.upDateTabValue(data.name)
    }
    clickCypher(data: string) {
        this.cypherStore.upDateCurrentCypher(data)
    }
    upDateBtn(icon: any, tabValue: string, index: string, btns: any) {
        let radios: Array<string> = ['method', 'filter', 'add-edge', 'add-node']
        let active = !icon.active
        if (index === 'fixed') {
            this.$cyEvents[this.tabValue].fixed(active)
        }
        if (index === 'fullscreen') {
            this.isMax = active
        }

        if (index === 'refresh') {
            this.refreshDate()
        }
        if (index === 'add-node') {
            this.cypherStore.upDateActiveElement({
                tabValue: this.tabValue,
                data: []
            })
            this.$cyEvents[this.tabValue].focusSourceOrEndNode(false)
        }
        if (index === 'add-edge') {
            this.cypherStore.upDateActiveElement({
                tabValue: this.tabValue,
                data: []
            })
            this.$cyEvents[this.tabValue].focusSourceOrEndNode(true)
            !active && this.$cyEvents[this.tabValue].focusSourceOrEndNode(false)
        }
        if (index === 'filter') {
            this.cypherStore.upDateActiveElement({
                tabValue: this.tabValue,
                data: []
            })
            this.$cyEvents[this.tabValue].focusSourceOrEndNode(false)
        }
        if (index === 'method') {
            this.cypherStore.updateGraphDataAStar({
                tabValue: this.tabValue,
                aStar: { selectNode: '', srcAndDst: { start: null, end: null } }
            })
            this.cypherStore.upDateActiveElement({
                tabValue: this.tabValue,
                data: []
            })
            this.$cyEvents[this.tabValue].focusSourceOrEndNode(false)
        }
        radios.forEach((item) => {
            if (item !== index) {
                this.cypherStore.upDateBtns({ tabValue: tabValue, active: false, index: item })
            }
        })
        if (index !== 'export' && index !== 'refresh' && index !== 'layout' && index !== 'mergeVertex') {
            this.cypherStore.upDateBtns({ tabValue: tabValue, active: active, index: index })
        }
    }
    mounted() {
        this.$refs['workbenchCypher'].addEventListener('contextmenu', this.onContextmenu)
    }
    refreshDate() {
        let cypherResultData = this.cypherResultDatas && this.cypherResultDatas.find((item) => item.id === this.tabValue)
        this.cypherStore.queryByCypher({
            graph: (cypherResultData && cypherResultData.graphName) || '',
            script: (cypherResultData && cypherResultData.cypher) || '',
            tabValue: this.tabValue,
            type: 'refresh'
        })
    }
    exportPNG() {
        this.showType === 'graph' && this.$cyEvents[this.tabValue].exportPNG()
    }
    exportJSON() {
        this.showType === 'graph' && this.$cyEvents[this.tabValue].exportJSON()
    }
    exportCSV() {
        this.showType === 'graph' && this.$cyEvents[this.tabValue].exportCSV()
    }
    changeLayout(data) {
        this.showType === 'graph' && this.$cyEvents[this.tabValue].changeLayout(data)
    }
    mergeNodes(status) {
        this.showType === 'graph' && this.$cyEvents[this.tabValue].mergeNodes(status)
    }
    onContextmenu() {
        let target: any = event.target
        if (target.getAttribute('role') === 'tab') {
            event.preventDefault()
            let id = target.getAttribute('id').replace('tab-', '')
            this.$contextmenu({
                items: [
                    {
                        label: `${this.$t('contextmenu.text1')}`,
                        onClick: () => {
                            this.tabRemove(id)
                        }
                    },
                    {
                        label: `${this.$t('contextmenu.text2')}`,
                        onClick: () => {
                            let idList = this.cypherResultDatas.map((item) => item.id)
                            idList.forEach((item: any) => {
                                if (item !== id) {
                                    this.tabRemove(item)
                                }
                            })
                        }
                    },
                    {
                        label: `${this.$t('contextmenu.text3')}`,
                        onClick: () => {
                            this.cypherStore.updateCypherReasultDatas({ tabValue: 'none' })
                        }
                    }
                ],
                event,
                customClass: 'class-a',
                zIndex: 3,
                minWidth: 120
            })
        }
        return false
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
    async doAddEdge() {}
}
</script>
<style lang="less" scoped>
.set-panel {
    .layout-types {
        width: 100%;
        height: 60px;
        display: flex;
        > div {
            flex-grow: 1;
            background-size: 50px;
            background-position: center;
            background-repeat: no-repeat;
            cursor: pointer;
        }
        > .active {
            background-color: #eee;
            border-radius: 8px;
        }
    }
    .el-select,
    .el-input {
        width: 100%;
        margin-bottom: 8px;
    }
    .t_b {
        background-image: url('../../../assets/cypher/layout-01.png');
    }
    .l_r {
        background-image: url('../../../assets/cypher/layout-02.png');
    }
    .b_t {
        transform: rotate(180deg);
        background-image: url('../../../assets/cypher/layout-01.png');
    }
    .r_l {
        transform: rotate(180deg);
        background-image: url('../../../assets/cypher/layout-02.png');
    }
}
.workbench-cypher {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .workbench-cypher-set {
        position: absolute;
        width: 40px;
        height: 40px;
        font-size: 25px;
        right: 35px;
        top: -40px;
        z-index: 3;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        color: #ccc;
        &:hover {
            color: #4b4d74;
        }
    }
    .workbench-local-cypher {
        position: absolute;
        right: 0;
        width: 500px;
        height: 100%;
        z-index: 3;
        background-color: #fff;
        border-left: 1px solid #ccc;
    }
    &.layout1 {
        flex-direction: column;
    }
    &.layout3 {
        flex-direction: column-reverse;
    }
    &.layout2 {
        flex-direction: row;
    }
    &.layout4 {
        flex-direction: row-reverse;
    }
    .graph-name {
        position: absolute;
        height: 20px;
        line-height: 20px;
        text-align: left;
        background: #323457;
        color: #ffffff;
        top: 0;
        left: 0;
        width: 80px;
        padding-left: 10px;
        border-radius: 3px 0 8px 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    &.layout1,
    &.layout3 {
        .workbench-cypher-input {
            height: 320px;
        }
        .workbench-cypher-output {
            height: calc(100% - 320px);
        }
    }
    &.layout2,
    &.layout4 {
        .workbench-cypher-input {
            width: 450px;
        }
        .workbench-cypher-output {
            width: calc(100% - 450px);
        }
    }
    .workbench-cypher-input {
        position: relative;
        width: 100%;
    }
    .workbench-cypher-output {
        background: #e6eaf2;
        overflow: hidden;
        padding: 12px;
        flex-shrink: 1;
        flex-grow: 1;
        &.max {
            /deep/.el-tabs__content {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9;
                width: 100%;
                height: 100%;
            }
        }
        /deep/.el-tabs {
            border: 1px solid #ccc;
            height: 100%;
            border-radius: 4px;
        }
        /deep/.tabIcon {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }
        /deep/.el-tabs__content {
            width: auto;
            height: calc(100% - 31px);
            background: rgba(246, 246, 246, 1);
        }
        /deep/.el-tab-pane {
            height: 100%;
        }
        /deep/.el-tabs__header {
            border: 0;
            margin-bottom: 0;
        }
        /deep/.el-tabs__nav-prev,
        /deep/.el-tabs__nav-next {
            height: 32px;
            line-height: 32px;
        }
        /deep/.el-tabs__nav-prev {
            left: 3px;
        }
        /deep/.el-tabs__nav-next {
            right: 3px;
        }

        /deep/.el-tabs__nav {
            border: 0;
            background: #f2f2f2;
            border-bottom: 1px solid #e5e5e5;
        }
        /deep/.el-tabs__item {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            min-width: 400px;
            color: #808080;
            position: relative;
            user-select: none;
            &:focus.is-active.is-focus:not(:active) {
                box-shadow: 0 0 2px 2px transparent inset;
            }
        }
        /deep/.el-tabs__item.is-active {
            background: #fff;
            border-radius: 4px 4px 0 0;
            border: 0;
            color: #b2b2b2;
        }
        /deep/.el-tabs__item.is-closable {
            padding-left: 13px;
            padding-right: 13px;
        }
        /deep/.el-tabs__item.is-closable .el-icon-close {
            width: 16px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            font-size: 16px;
        }
    }
    .tab-panel-bar {
        height: 40px;
        line-height: 40px;
        background: #fff;
        font-size: 12px;
        color: #666;
        padding-left: 20px;
        border-bottom: 1px solid #e5e5e5;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        width: 100%;
        justify-content: space-between;
        .tab-cypher {
            cursor: pointer;
            &:hover {
                color: #3681f5;
            }
        }
        .tab-btns {
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            margin-right: 10px;
            -webkit-box-flex: 0;
            -ms-flex-positive: 0;
            flex-grow: 0;
            .tab-btn-item {
                width: 24px;
                height: 24px;
                background-position: center center;
                border-right: 1px solid #f0f0f0;
                position: relative;
                padding-right: 6px;
                -webkit-box-sizing: content-box;
                box-sizing: content-box;
                background-repeat: no-repeat;
                background-size: 22px;
            }
            &.graph {
                .tab-btn-item {
                    cursor: pointer;
                }
            }
            .mergeEdge {
                background-image: url('../../../assets/cypher/fold.svg');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/fold-h.svg');
                }
            }
            .mergeVertex {
                background-image: url('../../../assets/cypher/merge-vertex-n.png');
                .merge-btn-group {
                    position: absolute;
                    width: 100px;
                    -webkit-box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
                    background-color: #fff;
                    display: none;
                    z-index: 99;
                    top: 25px;
                    right: 0;
                    overflow: hidden;
                    border-radius: 5px;
                    > div {
                        text-align: center;
                        line-height: 30px;
                        color: #666;
                    }
                    > div:hover {
                        color: #4481e6;
                    }
                }
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/merge-vertex-h.png');
                    .merge-btn-group {
                        display: block;
                    }
                }
            }
            .filter {
                background-image: url('../../../assets/cypher/filter-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/filter-h.png');
                }
            }
            .method {
                background-image: url('../../../assets/cypher/method-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/method-h.png');
                }
            }
            .layout {
                background-image: url('../../../assets/cypher/layout-n.png');
                background-size: 20px;
                .layout-btn-group {
                    position: absolute;
                    width: 100px;
                    -webkit-box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
                    background-color: #fff;
                    display: none;
                    z-index: 99;
                    top: 25px;
                    right: 0;
                    overflow: hidden;
                    border-radius: 5px;
                    > div {
                        text-align: center;
                        line-height: 30px;
                        color: #666;
                    }
                    > div:hover {
                        color: #4481e6;
                    }
                }
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/layout-h.png');
                    .layout-btn-group {
                        display: block;
                    }
                }
            }
            .add-node {
                background-image: url('../../../assets/cypher/add-node-n.png');
                background-size: 18px;
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/add-node-h.png');
                    .add-btn-group {
                        display: block;
                    }
                }
            }
            .add-edge {
                background-image: url('../../../assets/cypher/add-edge-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/add-edge-h.png');
                    .add-btn-group {
                        display: block;
                    }
                }
            }
            .edit {
                background-image: url('../../../assets/cypher/edit-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/edit-h.png');
                }
            }
            .fixed {
                background-image: url('../../../assets/cypher/fixed-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/fixed-h.png');
                }
            }
            .hover {
                background-image: url('../../../assets/cypher/hover-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/hover-h.png');
                }
            }
            .export {
                background-image: url('../../../assets/cypher/export-n.png');
                .export-btn-group {
                    position: absolute;
                    width: 100px;
                    -webkit-box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
                    background-color: #fff;
                    display: none;
                    z-index: 99;
                    top: 25px;
                    right: 0;
                    overflow: hidden;
                    border-radius: 5px;
                    > div {
                        text-align: center;
                        line-height: 30px;
                        color: #666;
                    }
                    > div:hover {
                        color: #4481e6;
                    }
                }
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/export-h.png');
                    .export-btn-group {
                        display: block;
                    }
                }
            }
            .refresh {
                background-image: url('../../../assets/cypher/refresh-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/refresh-h.png');
                }
            }
            .fullscreen {
                background-image: url('../../../assets/cypher/full-n.png');
                &.active,
                &:hover {
                    background-image: url('../../../assets/cypher/full-h.png');
                }
            }
        }
    }
    .tab-result {
        width: 100%;
        height: calc(100% - 40px);
        .cypher-loading {
            width: 100%;
            height: 100%;
            position: relative;
        }
    }
    .workbench-cypher-no-query {
        background-image: url('../../../assets/cypher-result/no-query.png');
        background-position: center center;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        opacity: 0.47;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #44527c;
        margin-bottom: 22px;
        position: relative;
        > div {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 200px;
            margin-left: -100px;
            margin-top: 80px;
            text-align: center;
        }
    }
}
</style>
