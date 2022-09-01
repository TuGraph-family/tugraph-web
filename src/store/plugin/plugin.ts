import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import {
    loadCppPlugin,
    loadPythonPlugin,
    getCppPlugin,
    getPythonPlugin,
    excuteCppPlugin,
    excutePythonPlugin,
    deleteCppPlugin,
    deletePythonPlugin,
    getCppPluginDetail,
    getPyPluginDetail
} from '@/service/plugin/plugin'

@Module({ name: 'Plugin' })
export default class Plugin extends VuexModule {
    pluginList: {
        cppPluginList: any[]
        pyPluginList: any[]
    } = {
        cppPluginList: [],
        pyPluginList: []
    }
    tabPluginList: Array<{ key: string; name: string; type: string }> = []
    @Mutation
    addTab(params: { name: string; type: string }) {
        this.tabPluginList.push({ key: params.type + '_' + params.name, name: params.name, type: params.type })
    }
    @Mutation
    removeTab(params: { key: string }) {
        this.tabPluginList = this.tabPluginList.filter((item) => item.key !== params.key)
    }
    @Mutation
    clearTab() {
        this.tabPluginList = []
    }
    @Action
    async loadCppPlugin(params: { graph: string; data: { name: string; description: string; code_base64: string; read_only: boolean; code_type: string } }) {
        let res = await loadCppPlugin(params)
        return res
    }
    @Action
    async loadPythonPlugin(params: { graph: string; data: { name: string; description: string; code_base64: string; read_only: boolean; code_type: string } }) {
        let res = await loadPythonPlugin(params)
        return res
    }
    @Mutation
    upDatePluginList(params: any) {
        this.pluginList.cppPluginList = params.cppPluginList
        this.pluginList.pyPluginList = params.pyPluginLis
    }
    @Action({ commit: 'upDatePluginList' })
    async getPluginList(graph: string) {
        let res = await Promise.all([getCppPlugin(graph), getPythonPlugin(graph)])
        if (res && res.length) {
            return {
                cppPluginList: res[0].status === 200 ? res[0].data : [],
                pyPluginLis: res[1].status === 200 ? res[1].data : []
            }
        } else {
            return []
        }
    }

    @Action
    async excuteCppPlugin(params: { graph: string; name: string; data: { data: string; timeout: number; in_process: boolean } }) {
        let res = await excuteCppPlugin(params)
        return res
    }
    @Action
    async excutePythonPlugin(params: { graph: string; name: string; data: { data: string; timeout: number; in_process: boolean } }) {
        let res = await excutePythonPlugin(params)
        return res
    }
    @Action
    async deleteCppPlugin(params: { graph: string; name: string }) {
        let res = await deleteCppPlugin(params)
        return res
    }
    @Action
    async deletePythonPlugin(params: { graph: string; name: string }) {
        let res = await deletePythonPlugin(params)
        return res
    }
    @Action
    async getPyPluginDetail(params: { graph: string; name: string }) {
        let res = await getPyPluginDetail(params)
        return res
    }
    @Action
    async getCppPluginDetail(params: { graph: string; name: string }) {
        let res = await getCppPluginDetail(params)
        return res
    }
}
