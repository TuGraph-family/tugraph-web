<i18n src="./subgraph-manage-lang.json"></i18n>
<template>
    <div class="subgraph-manage">
        <span>{{ $t('text1') }}</span>
        <el-select :value="selectedSubGraph" @change="updateSelectedSubGraph">
            <el-option :label="index" :value="index" v-for="(item, index) in subGraphList" :key="index + item" style="font-size:12px;">
                <span style="float: left">{{ index }}</span>
                <span style="float: right">
                    <el-button style="padding:3px 10px;" icon="el-icon-delete" size="mini" :disabled="item !== 'FULL'" @click.stop="deleteSubGraph(index)"></el-button>
                </span>
            </el-option>
        </el-select>
        <a class="subgraph-manage-addbtn new-graph" @click="dialogVisible = true" v-if="isAdmin"> <i class="el-icon-circle-plus-outline"></i> {{ $t('text2') }} </a>
        <a class="subgraph-manage-addbtn new-scene" @click="demoDialogVisible = true" v-if="isAdmin"> <i class="el-icon-circle-plus-outline"></i> {{ $t('text10') }} </a>
        <i class="el-icon-question help-icon" v-if="targetComponentName !== 'Help'" @click="showHelp"></i>
        <el-dialog :visible.sync="dialogVisible" :title="$t('text3')">
            <section class="subgraph-manage-dialog">
                <div class="subgraph-manage-dialog-title">{{ $t('text4') }}</div>
                <el-input class="subgraph-manage-dialog-graphname" v-model="subGraphName"></el-input>
                <div class="subgraph-manage-dialog-title">{{ $t('text9') }}</div>
                <el-input class="subgraph-manage-dialog-graphname" v-model="subGraphDesc"></el-input>
                <div class="subgraph-manage-dialog-title">{{ $t('text5') }}</div>
                <div class="subgraph-manage-dialog-config">
                    <span class="subgraph-manage-dialog-name">max_size_GB</span>
                    <el-input-number size="mini" v-model="maxSizeGB"></el-input-number>
                </div>
                <div class="subgraph-manage-dialog-config">
                    <span class="subgraph-manage-dialog-name">async</span>
                    <el-select v-model="isAsync" :placeholder="$t('text6')">
                        <el-option label="true" :value="true"> </el-option>
                        <el-option label="false" :value="false"> </el-option>
                    </el-select>
                </div>
            </section>
            <section class="subgraph-manage-dialog-btns">
                <el-button size="mini" type="primary" @click="createSubGraph">{{ $t('text7') }}</el-button>
                <el-button size="mini" @click="dialogVisible = false">{{ $t('text8') }}</el-button>
            </section>
        </el-dialog>
        <el-dialog :destroy-on-close="true" :custom-class="'scene-dialog'" :visible.sync="demoDialogVisible" :title="$t('text10')">
            <Scene></Scene>
        </el-dialog>
        <el-drawer size="40%" :visible.sync="drawer" :with-header="false">
            <div class="help-content">
                <!-- {{ targetComponentName }} -->
                <template v-if="targetComponentName === 'CreateLabel'">
                    <CreateLabel></CreateLabel>
                </template>
                <template v-if="targetComponentName === 'ImportData'">
                    <ImportData></ImportData>
                </template>
                <template v-if="targetComponentName === 'Plugin'">
                    <Plugin></Plugin>
                </template>
                <template v-if="targetComponentName === 'Cypher'">
                    <CypherQuery :show.sync="drawer"></CypherQuery>
                </template>
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import UserLoginStore from '@/store/user-login/user-login'
import CreateLabel from '../help/create-label.vue'
import ImportData from '../help/data-import.vue'
import CypherQuery from '../help/cypher-query.vue'
import Plugin from '../help/plugins.vue'
import Scene from '@/components/scene/scene.vue'

@Component({ components: { CreateLabel, ImportData, CypherQuery, Plugin, Scene } })
export default class SubGraphManage extends Vue {
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    dialogVisible: boolean = false
    demoDialogVisible: boolean = false
    dialogIsAddingGraph: boolean = false
    maxSizeGB: number = 2048
    isAsync: boolean = true
    subGraphName: string = ''
    subGraphDesc: string = ''
    drawer: boolean = false
    targetComponentName: string = ''
    get selectedSubGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    get subGraphList() {
        return this.subGraphManageStore.subGraphList
    }
    get tableData() {
        interface row {
            subGraphName: string
            subGraphAuth: string
        }
        let tableData: Array<row> = []
        Object.keys(this.subGraphManageStore.subGraphList).forEach((key) => {
            let row: row = { subGraphName: key, subGraphAuth: this.subGraphManageStore.subGraphList[key] }
            tableData.push(row)
        })
        return tableData
    }
    get isAdmin() {
        return this.userLoginStore.isAdmin
    }
    created() {
        this.targetComponentName = this.$route.name
        this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
        this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
    }
    activated() {
        this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
    }
    mounted(): void {}
    updateSelectedSubGraph(value: string) {
        this.subGraphManageStore.updateSelectedSubGraph(value)
    }
    deleteSubGraph(subGraphName: string) {
        this.$confirm(`${this.$t('confirm.text2', [subGraphName])}`, `${this.$t('confirm.text1')}`, {
            confirmButtonText: `${this.$t('confirm.text3')}`,
            cancelButtonText: `${this.$t('confirm.text4')}`,
            type: 'warning'
        })
            .then(async () => {
                let result = await this.subGraphManageStore.deleteSubGraph(subGraphName)
                if (result.status === 200) {
                    this.$message({
                        type: 'success',
                        message: `${this.$t('message.text1')}`
                    })
                    await this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
                    this.subGraphManageStore.updateSelectedSubGraph('')
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: `${this.$t('message.text2')}`
                })
            })
    }
    async createSubGraph() {
        if (!this.subGraphName) {
            this.$message({
                type: 'warning',
                message: `${this.$t('message.text4')}`
            })
            return
        }
        let option = {
            name: this.subGraphName,
            config: {
                max_size_GB: this.maxSizeGB,
                async: this.isAsync,
                description: this.subGraphDesc
            }
        }
        let result = await this.subGraphManageStore.createSubGraph(option)
        if (result.status === 200) {
            this.$message({
                type: 'success',
                message: `${this.$t('message.text4')}`
            })
            this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
        } else {
            this.$message({
                type: 'error',
                message: `${this.$t('message.text5', [result.data ? result.data.error_message : ''])}`
            })
        }
        this.dialogVisible = false
    }
    showHelp() {
        this.drawer = true
        this.targetComponentName = this.$route.name
    }
}
</script>
<style lang="less" scoped>
.subgraph-manage {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #44527c;
    display: flex;
    align-items: center;

    /deep/.el-select .el-input__inner {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
    }
    /deep/ .el-input__icon {
        line-height: 28px;
        font-size: 12px;
    }
    /deep/ .el-select {
        margin-left: 12px;
    }

    /deep/ .el-dialog {
        width: 440px;
        height: 380px;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0 16px;
        &.scene-dialog {
            width: 640px;
            height: auto;
        }
    }
    /deep/ .el-dialog__header {
        padding-top: 0;
        height: 63px;
        line-height: 63px;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #44527c;
        height: 63px;
        line-height: 63px;
        border-bottom: 1px solid #e6e6e6;
    }
    /deep/ .el-dialog__headerbtn {
        font-size: 20px;
    }
    /deep/ .el-dialog__body {
        padding: 0;
    }
    /deep/.el-table .el-table__header th {
        height: 28px;
        padding: 0;
    }
    /deep/.el-table .el-table__body td {
        height: 24px;
        padding: 0;
    }
    .subgraph-manage-addbtn {
        height: 28px;
        line-height: 28px;
        border: 1px solid #cccccc;
        margin-left: 10px;
        padding: 0 10px;
        border-radius: 5px;
        cursor: pointer;
        &.new-graph {
            &:hover {
                color: #3e8cf6;
                border-color: #3e8cf6;
            }
            &:active {
                background: #f0f0f0;
            }
        }
        &.new-scene {
            &:hover {
                color: #3e8cf6;
                border-color: #3e8cf6;
            }
            &:active {
                background: #f0f0f0;
            }
        }
    }
    .subgraph-manage-dialog-name {
        display: inline-block;
        width: 90px;
        font-size: 14px;
    }
    .subgraph-manage-dialog-title {
        line-height: 35px;
        font-size: 14px;
        font-weight: 700;
    }
    .subgraph-manage-dialog-config {
        margin-bottom: 20px;
    }
    /deep/.subgraph-manage-dialog .el-select {
        margin-left: 0;
        width: 130px;
    }
    /deep/.subgraph-manage-dialog-graphname .el-input__inner {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
    }
    /deep/.help-icon {
        color: #cccccc;
        font-size: 26px;
        opacity: 0.8;
        position: absolute;
        right: 10px;
        cursor: pointer;
        &:hover {
            color: #4b4d74;
        }
    }
    .el-drawer {
        position: relative;
    }
    .subgraph-manage-dialog {
        border-bottom: 1px solid #cccccc;
        margin-bottom: 20px;
    }
    .subgraph-manage-dialog-btns {
        white-space: nowrap;
        text-align: right;
    }
    .help-content {
        padding: 0 15px;
        width: 100%;
        height: 100%;
        max-height: 100%;
        overflow: auto;
        position: absolute;
    }
}
</style>
