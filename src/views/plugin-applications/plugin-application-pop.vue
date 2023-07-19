<template>
    <div class="plugin-application-pop">
        <div v-for="(item, index) in appList" class="app-item" :key="item.name">
            <span class="app-name">{{ item.name }}</span>
            <el-button v-if="item.status !== 'loaded'" size="mini" plain @click="installApplication(item.name, index)" :loading="item.status === 'loading'">安装</el-button>
            <template v-else>
                <el-button size="mini" plain @click="installApplication(item.name, index)" :disabled="true">已安装</el-button>
                <el-button size="mini" plain @click="jumpTo(item.name)">进入</el-button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import { getModule } from 'vuex-module-decorators'
import HelpStore from '@/store/help/help'
import UserLoginStore from '@/store/user-login/user-login'

import Config from './plugin-application-config'

@Component
export default class PluginApplicationsPop extends Vue {
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    helpStore: HelpStore = getModule(HelpStore, store)
    appList: Array<any> = []
    get subGraphNames() {
        return Object.keys(this.subGraphManageStore.subGraphList || [])
    }
    created() {
        Config.forEach((app) => {
            let obj = { ...app, status: 'unloaded' }
            if (this.subGraphNames.includes(app.name)) {
                obj.status = 'loaded'
            }
            this.appList.push(obj)
        })
    }
    @Watch('subGraphNames')
    updateApplist() {}
    mounted() {}
    async installApplication(appName: string, index) {
        this.appList[index].status = 'loading'
        this.appList = [...this.appList]
        let createGraphRes = await this.createGraph(appName)
        if (createGraphRes.status == 200) {
            this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
            let createlabelRes = await this.createlabel(appName, Config[index].createLabelScript)
            if (createlabelRes.status == 'success') {
                debugger
                let data = await Config[index].data()
                let importDataRes = await this.importData(appName, data, index)
                console.log(importDataRes)
            }
        } else {
            this.showError(createGraphRes.data.error_message)
        }
    }
    async createGraph(graphName: string) {
        let option = {
            name: graphName,
            config: {
                max_size_GB: 1,
                async: true,
                description: graphName
            }
        }
        let result = await this.subGraphManageStore.createSubGraph(option)
        return result
    }
    async createlabel(graphName, creaeteLabelScripts) {
        let result = await this.helpStore.createLabels({ graph: graphName, scripts: creaeteLabelScripts })
        return result
    }
    async importData(graphName, data, index) {
        let result = await this.helpStore.createData({ graph: graphName, dataList: data })
        this.appList[index].status = 'loaded'
        this.appList = [...this.appList]
        return result
    }
    async uploadPlugin() {}
    showError(data) {
        this.$message({
            message: data,
            type: 'error'
        })
    }
    jumpTo(name: string) {
        this.$emit('update:show', false)
        this.$router.push({ name })
    }
}
</script>
<style lang="less" scoped>
.plugin-application-pop {
    width: 100%;
    height: 100%;
    min-height: 300px;
    .app-item {
        width: 100%;
        height: 40px;
        margin-top: 10px;
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-radius: 5px;
        justify-content: space-between;
        background-color: rgb(50, 52, 87);
        .app-name {
            font-weight: 600;
            color: white;
        }
    }
}
</style>
