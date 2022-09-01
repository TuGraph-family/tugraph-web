import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getDBInfo, getDBInfoPeers } from '@/service/db-info/db-info.ts'
import { queryByCypher } from '@/service/cypher/cypher.ts'
@Module({ name: 'DbInfo', namespaced: true })
export default class DbInfo extends VuexModule {
    lgraph_version: string = ''
    cpp_version: string = ''
    cpp_id: string = ''
    python_version: string = ''
    node: string = ''
    git_branch: string = ''
    git_commit: string = ''
    web_commit: string = ''
    relationship: string = ''
    up_time: string = ''
    haList: any = []
    db_config: {
        [prop: string]: string
    } = {}
    @Mutation
    updateDbInfo(params: any) {
        this.lgraph_version = params.lgraph_version
        this.cpp_version = params.cpp_version
        this.cpp_id = params.cpp_id
        this.python_version = params.python_version
        this.node = params.node
        this.git_branch = params.git_branch
        this.git_commit = params.git_commit
        this.web_commit = params.web_commit
        this.relationship = params.relationship
        this.up_time = params.up_time
        this.db_config = params.db_config
    }
    @Action({ rawError: true, commit: 'updateDbInfo' })
    async getDbInfo() {
        let res = await getDBInfo()
        if (res && res.status === 200) {
            return res.data
        }
    }
    @Mutation
    updateHaList(params: any) {
        this.haList = params
    }
    @Action({ rawError: true, commit: 'updateHaList' })
    async getHaList() {
        let res = await getDBInfoPeers()
        if (res && res.status === 200) {
            return res.data
        }
    }
    @Action
    async getSubGraphVertexCountAndEdgeCount(params: { graphName: string }) {
        let cypherVertex = `MATCH (n) RETURN count(n)`
        let cypherEdge = `MATCH (n) -[r]-> (m) RETURN count(r)`
        let promisList = []
        promisList.push(queryByCypher({ graph: params.graphName, script: cypherVertex }))
        promisList.push(queryByCypher({ graph: params.graphName, script: cypherEdge }))
        let res = await Promise.all(promisList)
        let vertexData = res[0].data.result
        let edgeData = res[1].data.result
        let vertexCount: number = 0
        let edgeCount: number = 0
        if (vertexData.length) {
            vertexCount = vertexData[0][0]
        }
        if (edgeData.length) {
            edgeCount = edgeData[0][0]
        }
        return {
            vertexCount,
            edgeCount
        }
    }
}
