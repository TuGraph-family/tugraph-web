import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getAllSubGraph, deleteSubGraph, createSubGraph } from '@/service/subgraph-manage/subgraph-manage'
import { getUserGraph } from '@/service/account-list/account-list'

interface SubGraphList {
    [propName: string]: string
}

@Module({ name: 'SubGraphManage' })
export default class SubGraphManage extends VuexModule {
    subGraphList: SubGraphList = {}
    selectedSubGraph: string = ''
    selectedSubGraphDesc: string = ''
    allSubGraphList: any = []
    @Mutation
    updateAllSubGraphList(response: any): void {
        if (response && response.status === 200) {
            this.allSubGraphList = response.data || {}
        }
    }
    @Mutation
    updateSubGraphList(response: any): void {
        if (response && response.status === 200) {
            if (response.data) {
                delete response.data['@meta_graph@']
            }
            let data: any = {}

            Object.keys(response.data || {}).forEach((item) => {
                if (response.data[item] !== 'NONE') {
                    data[item] = response.data[item]
                }
            })

            this.subGraphList = data

            if (!this.allSubGraphList) {
                this.selectedSubGraph = ''
                this.selectedSubGraphDesc = ''
                return
            }
            // **这是什么乱糟糟的鬼逻辑,找个时间优化一下吧**
            if (this.subGraphList) {
                if (!this.selectedSubGraph) {
                    this.selectedSubGraph = Object.keys(this.subGraphList || {})[0] || ''
                    // this.selectedSubGraphDesc = this.allSubGraphList[Object.keys(response.data)[0]] ? this.allSubGraphList[Object.keys(response.data)[0]].description : this.selectedSubGraph
                } else {
                    if (!Object.keys(response.data || {}).includes(this.selectedSubGraph) && Object.keys(response.data || {}).length > 1) {
                        this.selectedSubGraph = Object.keys(response.data || {})[0] || ''
                        // this.selectedSubGraphDesc = this.allSubGraphList[Object.keys(response.data)[0]] ? this.allSubGraphList[Object.keys(response.data)[0]].description : this.selectedSubGraph
                    }
                }
            }
        }
    }
    @Mutation
    updateSelectedSubGraph(subGraphName: string) {
        this.selectedSubGraph = subGraphName
        // if (subGraphName) {
        //     this.selectedSubGraph = subGraphName || ''
        //     this.selectedSubGraphDesc = this.allSubGraphList[subGraphName] ? this.allSubGraphList[subGraphName].description : ''
        // }
    }
    // @Action({ commit: 'updateSubGraphList' })
    // async getAllSubGraph() {
    //     return await getAllSubGraph()
    // }
    @Action
    async deleteSubGraph(params: string) {
        return await deleteSubGraph(params)
    }
    @Action
    async createSubGraph(params: { name: string; config: { max_size_GB: number; async: boolean; description: string } }) {
        return await createSubGraph(params)
    }
    // 获取当前用户的权限，（getAllSubGraph）这个api非admin用户不能使用，所以使用这个接口获取当前用户的子图
    @Action({ commit: 'updateSubGraphList' })
    async getUserGraph(params: string) {
        // await this.getAllSubGraph()
        return await getUserGraph(params)
    }
    @Action({ commit: 'updateAllSubGraphList' })
    async getAllSubGraph() {
        return await getAllSubGraph()
    }
}
