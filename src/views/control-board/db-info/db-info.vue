<i18n src="./db-info-lang.json"></i18n>
<template>
    <div class="control-db-info">
        <div class="db-info-header">
            {{ $t('t1') }}
        </div>
        <div class="db-info-body">
            <div class="db-info-body-left">
                <div class="base-info">
                    <div class="base-info-header">
                        {{ $t('t2') }}
                    </div>
                    <div class="base-info-body">
                        <div class="line-box" style="height:240px;">
                            <div class="center-line"></div>
                            <div class="row">
                                <span class="left-text">{{ $t('t3') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ lgraph_version }}</span>
                            </div>
                            <div class="row">
                                <span class="left-text">{{ $t('t4') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ formatSeconds(up_time) }}</span>
                            </div>
                            <div class="row">
                                <span class="left-text">{{ $t('t5') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ this.git_branch }}</span>
                            </div>
                            <div class="row">
                                <span class="left-text">{{ $t('t6') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ this.git_commit }}</span>
                            </div>
                            <div class="row">
                                <span class="left-text">{{ $t('t13') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ this.web_commit }}</span>
                            </div>
                            <div class="row">
                                <span class="left-text">{{ $t('t14') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ this.cpp_version }}</span>
                            </div>
                            <div class="row">
                                <span class="left-text">{{ $t('t15') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ this.python_version }}</span>
                            </div>
                            <div class="row">
                                <span class="left-text">{{ $t('t16') }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ this.cpp_id }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="config-info">
                    <div class="config-info-header">
                        {{ $t('t7') }}
                    </div>
                    <div class="config-info-body">
                        <div class="line-box">
                            <div class="center-line"></div>
                            <div class="row" v-for="(item, index) in db_config" :key="item + index">
                                <span class="left-text">{{ index }}</span>
                                <span class="node"></span>
                                <span class="right-text">{{ item }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="graph-info">
                    <div class="graph-info-header">
                        {{ $t('t9') }}
                        <el-button :loading="loading" size="mini" @click="getSubGraphVertexAndEdgeNumber">{{ $t('t12') }}</el-button>
                    </div>
                    <div class="graph-info-body">
                        <div class="line-box">
                            <div class="center-line"></div>
                            <div class="row" v-for="(item, index) in subGraphList" :key="item + index">
                                <span class="left-text">{{ item.name }}</span>
                                <span class="node"></span>
                                <template v-if="item.hasCount">
                                    <span class="right-text"> {{ $t('t10') }}:{{ item.vertexCount }} / {{ $t('t11') }}:{{ item.edgeCount }}</span>
                                </template>
                                <template v-else>
                                    <span class="right-text">******</span>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="db-info-body-center" v-if="db_config.enable_ha">
                <div class="ha-info">
                    <div class="ha-info-header">
                        {{ $t('t8') }}
                    </div>
                    <div class="ha-list">
                        <div class="ha-item" v-for="(item, index) in HAInfoList" :key="item + index">
                            <div>rest_address : {{ item.rest_address }}</div>
                            <div>rpc_address : {{ item.rpc_address }}</div>
                            <div>state : {{ item.state }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { formatSeconds } from '@/core/uitls.ts'
import { getModule } from 'vuex-module-decorators'
import DbInfoStore from '@/store/db-info/db-info'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import UserLoginStore from '@/store/user-login/user-login'
import { delUser } from '@/src/service/account-list/account-list'
@Component
export default class DbInfo extends Vue {
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    dbInfoStore: DbInfoStore = getModule(DbInfoStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    intervalSwitch: any = null
    dbInfoList: any = {}
    formatSeconds: any = formatSeconds
    subGraphList: any = []
    loading: boolean = false
    get lgraph_version() {
        return this.dbInfoStore.lgraph_version
    }
    get cpp_version() {
        return this.dbInfoStore.cpp_version
    }
    get cpp_id() {
        return this.dbInfoStore.cpp_id
    }
    get python_version() {
        return this.dbInfoStore.python_version
    }
    get node() {
        return this.dbInfoStore.node
    }
    get git_branch() {
        return this.dbInfoStore.git_branch
    }
    get git_commit() {
        return this.dbInfoStore.git_commit
    }
    get web_commit() {
        return this.dbInfoStore.web_commit
    }
    get relationship() {
        return this.dbInfoStore.relationship
    }
    get up_time() {
        return this.dbInfoStore.up_time
    }
    get db_config() {
        return this.dbInfoStore.db_config
    }
    get HAInfoList() {
        return this.dbInfoStore.haList
    }
    @Watch('db_config')
    upDateHaList() {
        if (this.db_config.enable_ha) {
            this.dbInfoStore.getHaList()
        }
    }
    created() {
        this.getDBInfo()
        this.getSubGraph()
    }
    beforeDestroy() {}

    async getDBInfo() {
        this.dbInfoStore.getDbInfo()
    }
    async getSubGraph() {
        let graphList: any = Object.keys(this.subGraphManageStore.subGraphList)
        if (graphList.length === 0) {
            await this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
            graphList = Object.keys(this.subGraphManageStore.subGraphList)
        }
        let data = []
        for (let i = 0; i < graphList.length; i++) {
            let obj = {
                name: graphList[i],
                hasCount: false
            }
            data.push(obj)
        }
        this.subGraphList = data
    }
    async getSubGraphVertexAndEdgeNumber() {
        this.loading = true
        let graphList: any = Object.keys(this.subGraphManageStore.subGraphList)
        if (graphList.length === 0) {
            await this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
            graphList = Object.keys(this.subGraphManageStore.subGraphList)
        }
        let data = []
        for (let i = 0; i < graphList.length; i++) {
            let res = await this.dbInfoStore.getSubGraphVertexCountAndEdgeCount({ graphName: graphList[i] })
            let obj = {
                name: graphList[i],
                hasCount: true,
                ...res
            }
            data.push(obj)
        }
        this.subGraphList = data
        this.loading = false
    }
}
</script>
<style lang="less">
.control-db-info {
    position: relative;
    width: 100%;
    height: 100%;
    .db-info-header {
        background: #ffffff;
        box-shadow: 0 1px 0 0 #dedfdf;
        width: 100%;
        height: 60px;
        font-family: OpenSans;
        font-size: 24px;
        color: #44527c;
        line-height: 60px;
        padding-left: 25px;
    }
    .db-info-body {
        width: 100%;
        height: calc(100% - 60px);
        padding: 20px;
        background: #e6eaf2;
        display: flex;
        box-sizing: border-box;
        overflow: auto;
        &-left {
            display: flex;
            .base-info {
                width: 400px;
                height: 487px;
                background: #ffffff;
                box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
                border-radius: 4px;
                border-radius: 4px;
                margin-bottom: 20px;
                margin-right: 20px;
                &-header {
                    border-bottom: 1px solid #e6e6e6;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 17px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #44527c;
                }
                &-body {
                    .line-box {
                        height: 157 - 66px;
                        margin-top: 33px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        position: relative;
                        .center-line {
                            position: absolute;
                            width: 1px;
                            height: 222px;
                            background: #e6e6e6;
                            left: 50%;
                            top: 9px;
                            z-index: 0;
                        }
                        .row {
                            display: flex;
                            height: 20px;
                            align-items: center;
                        }
                        .left-text {
                            width: 50%;
                            font-family: PingFangSC-Regular;
                            font-size: 14px;
                            color: #878fa7;
                            text-align: right;
                        }
                        .node {
                            width: 5px;
                            height: 5px;
                            flex-shrink: 0;
                            background: #97aced;
                            border-radius: 50%;
                            margin: 0 8px;
                            position: relative;
                            z-index: 1;
                        }
                        .right-text {
                            width: 50%;
                            font-family: PingFangSC-Semibold;
                            font-size: 14px;
                            color: #44527c;
                        }
                    }
                }
            }
            .config-info {
                width: 400px;
                height: 487px;
                background: #ffffff;
                box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
                border-radius: 4px;
                border-radius: 4px;
                &-header {
                    border-bottom: 1px solid #e6e6e6;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 17px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #44527c;
                }
                &-body {
                    .line-box {
                        height: 436 - 58px;
                        margin-top: 28px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        position: relative;
                        .center-line {
                            position: absolute;
                            width: 1px;
                            height: 360px;
                            background: #e6e6e6;
                            left: 50%;
                            top: 9px;
                            z-index: 0;
                        }
                        .row {
                            display: flex;
                            height: 20px;
                            align-items: center;
                        }
                        .left-text {
                            width: 50%;
                            font-family: PingFangSC-Regular;
                            font-size: 14px;
                            color: #878fa7;
                            text-align: right;
                            max-width: 50%;
                            overflow: hidden;
                            padding-left: 10px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .node {
                            width: 5px;
                            height: 5px;
                            flex-shrink: 0;
                            background: #97aced;
                            border-radius: 50%;
                            margin: 0 8px;
                            position: relative;
                            z-index: 1;
                        }
                        .right-text {
                            width: 50%;
                            font-family: PingFangSC-Semibold;
                            font-size: 14px;
                            color: #44527c;
                        }
                    }
                }
            }
            .graph-info {
                width: 400px;
                height: 487px;
                background: #ffffff;
                box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
                border-radius: 4px;
                border-radius: 4px;
                margin-left: 20px;
                &-header {
                    border-bottom: 1px solid #e6e6e6;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 17px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #44527c;
                }
                &-body {
                    .line-box {
                        height: 436 - 58px;
                        margin-top: 28px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        position: relative;
                        .center-line {
                            position: absolute;
                            width: 1px;
                            height: 360px;
                            background: #e6e6e6;
                            left: 50%;
                            top: 9px;
                            z-index: 0;
                        }
                        .row {
                            display: flex;
                            height: 20px;
                            align-items: center;
                        }
                        .left-text {
                            width: 50%;
                            font-family: PingFangSC-Regular;
                            font-size: 14px;
                            color: #878fa7;
                            text-align: right;
                            max-width: 50%;
                            overflow: hidden;
                            padding-left: 10px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .node {
                            width: 5px;
                            height: 5px;
                            flex-shrink: 0;
                            background: #97aced;
                            border-radius: 50%;
                            margin: 0 8px;
                            position: relative;
                            z-index: 1;
                        }
                        .right-text {
                            width: 50%;
                            font-family: PingFangSC-Semibold;
                            font-size: 14px;
                            color: #44527c;
                        }
                    }
                }
            }
        }
        &-center {
            margin-left: 20px;
            max-height: 100%;
            overflow: auto;
            width: 400px;
            min-width: 400px;
            .ha-info {
                background: #ffffff;
                box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
                border-radius: 4px;
                border-radius: 4px;
                &-header {
                    border-bottom: 1px solid #e6e6e6;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 17px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #44527c;
                }
                .ha-list {
                    padding: 20px;
                }
                .ha-item {
                    background: #f5f7fa;
                    border-radius: 8px;
                    border-radius: 8px;
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #44527c;
                    margin-bottom: 12px;
                    padding: 12px 40px;
                    > div {
                        line-height: 20px;
                        height: 17px;
                    }
                }
            }
        }
        &-right {
            margin-left: 20px;
            max-height: 100%;
            overflow: auto;
            width: 400px;
            .static-info {
                background: #ffffff;
                box-shadow: 0 4px 20px 0 rgba(119, 133, 162, 0.2);
                border-radius: 4px;
                border-radius: 4px;
                &-header {
                    border-bottom: 1px solid #e6e6e6;
                    height: 50px;
                    line-height: 50px;
                    padding-left: 17px;
                    font-family: PingFangSC-Regular;
                    font-size: 16px;
                    color: #44527c;
                }
                &-body {
                    padding-bottom: 33px;
                    .line-box {
                        height: 130 - 66px;
                        margin-top: 33px;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        position: relative;
                        .center-line {
                            position: absolute;
                            width: 1px;
                            height: 50px;
                            background: #e6e6e6;
                            left: 50%;
                            top: 9px;
                            z-index: 0;
                        }
                        .row {
                            display: flex;
                            height: 20px;
                            align-items: center;
                        }
                        .left-text {
                            width: 50%;
                            font-family: PingFangSC-Regular;
                            font-size: 14px;
                            color: #878fa7;
                            text-align: right;
                        }
                        .node {
                            width: 5px;
                            height: 5px;
                            flex-shrink: 0;
                            background: #97aced;
                            border-radius: 50%;
                            margin: 0 8px;
                            position: relative;
                            z-index: 1;
                        }
                        .right-text {
                            width: 50%;
                            font-family: PingFangSC-Semibold;
                            font-size: 14px;
                            color: #44527c;
                        }
                    }
                }
            }
        }
    }
}
</style>
