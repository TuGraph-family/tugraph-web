import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getRoleList, setRolePermissions, setRoleDescription, delRole, enableOrDisableRole, addRole } from '@/service/role-list/role-list'
import { getAllSubGraph } from '@/service/subgraph-manage/subgraph-manage'
import { getUserGraph } from '@/service/account-list/account-list'
@Module({ name: 'RoleList', namespaced: true })
export default class RoleList extends VuexModule {
    roleList: any[] = []
    @Mutation
    setRoleList(params: any) {
        this.roleList = params
    }
    @Mutation
    updateRoleList(params: any) {
        let res = params.user.data
        let allGraph = params.graph.data || {}
        allGraph && delete allGraph['@meta_graph@']
        let roleList: any[] = []
        Object.keys(res).forEach((item) => {
            let obj: any = {}
            obj.name = item
            obj.description = res[item].description
            obj.edit = false
            obj.enable = !res[item].disabled
            obj.permissions = res[item].permissions || {}
            if (obj.name === 'admin') {
                obj.permissions = {}
                Object.keys(allGraph).forEach((graphName: string) => {
                    if (!obj.permissions[graphName]) {
                        obj.permissions[graphName] = 'FULL'
                    }
                })
            }
            Object.keys(allGraph).forEach((graphName: string) => {
                if (!obj.permissions[graphName]) {
                    obj.permissions[graphName] = 'NONE'
                }
            })
            roleList.push(obj)
        })
        this.roleList = roleList
    }
    @Action({ rawError: true, commit: 'updateRoleList' })
    async getRoleList(name: string) {
        let res = await getRoleList()
        let allGraph = await getUserGraph(name)
        return {
            user: res,
            graph: allGraph
        }
    }
    @Action
    async setRolePermissions(params: { roleName: string; data: any }) {
        let res = await setRolePermissions(params)
        return res
    }
    @Action
    async setRoleDescription(params: { roleName: string; description: string }) {
        let res = await setRoleDescription(params)
        return res
    }
    @Action
    async delRole(params: string) {
        let res = await delRole(params)
        return res
    }
    @Action
    async enableOrDisableRole(params: { roleName: string; status: boolean }) {
        let status = 'enable'
        !params.status && (status = 'disable')
        let res = await enableOrDisableRole({ name: params.roleName, status: status })
        return res
    }
    @Action
    async addRole(params: { role: string; description: string }) {
        let res = await addRole({ role: params.role, description: params.description })
        return res
    }
}
