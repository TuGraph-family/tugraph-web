import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { getUserList, delUser, addUser, changeUserPwd, setUserRole, getUserGraph, enableOrDisableUser, changeUserDesc } from '@/service/account-list/account-list'

@Module({ name: 'AccountList', namespaced: true })
export default class AccountList extends VuexModule {
    userList: Array<{ userName: string; roles: any[]; edit: boolean; graphList: { [prop: string]: string } }> = []
    @Mutation
    updateUserList(params: any) {
        this.userList = params
    }
    @Action({ rawError: true, commit: 'updateUserList' })
    async getUserList(userName: string) {
        let userList: Array<{ userName: string; roles: any[]; edit: boolean; graphList: { [prop: string]: string } }> = []
        let res = await getUserList()
        if (res && res.status === 200) {
            let data = res.data
            let promiseList = []
            let a: any[] = []
            let b: any[] = []
            Object.keys(data).forEach((item: any) => {
                promiseList.push(getUserGraph(item))
                let obj = {
                    userName: item,
                    graphList: {},
                    roles: data[item].roles,
                    edit: false,
                    enable: !data[item].disabled,
                    desc: data[item].description
                }
                if (userName === item) {
                    a.push(obj)
                } else {
                    b.push(obj)
                }
            })
            userList = [...a, ...b]
            let AclResult = await Promise.all(promiseList)
            AclResult.forEach((item, index) => {
                userList[index].graphList = item.data
                userList[index].graphList && delete userList[index].graphList['@meta_graph@']
            })
            return userList
        }
    }
    @Action
    async delUser(userName: string) {
        let res = await delUser(userName)
        return res
    }
    @Action
    async addUser(params: { user: string; password: string; is_admin: boolean; description: string }) {
        let result = await addUser(params)
        return result
    }
    @Action
    async changeUserPwd(params: { name: string; oldPassword?: string; newPassword?: string; isAdmin: boolean }) {
        let result = await changeUserPwd(params)
        if (params.name === 'admin') {
            localStorage.ISORIGINALPWD = 'fixed'
        }
        return result
    }
    @Action
    async changeGraphAcl(params: { graphRightTable: Array<any>; userName: string }) {
        let promiseList = []
        params.graphRightTable.forEach((item) => {
            // promiseList.push(
            //     changeUserAcl({
            //         userName: params.userName,
            //         graphName: item.graphName,
            //         acl: item.graphRight
            //     })
            // )
        })
        let res = await Promise.all(promiseList)
        let result = res.filter((item) => item.status !== 200)
        if (!result.length) {
            return Promise.resolve({ status: 'success' })
        } else {
            return Promise.resolve({ status: 'faild' })
        }
    }
    @Action
    async saveUserList(params: { name: string; roles: any[] }) {
        let res = await setUserRole(params)
        return res
    }
    @Mutation
    updateUserGraphList(params: any) {
        let target = this.userList.find((item) => item.userName === params.userName)
        if (target) {
            target.graphList = params.data
            target.graphList && delete target.graphList['@meta_graph@']
        }
    }
    @Action({ rawError: true, commit: 'updateUserGraphList' })
    async setUserGraphList(userName: string) {
        let res = await getUserGraph(userName)
        return Promise.resolve({
            data: res.data,
            userName: userName
        })
    }
    @Action
    async enableOrDisableUser(params: { roleName: string; status: boolean }) {
        let status = 'enable'
        !params.status && (status = 'disable')
        let res = await enableOrDisableUser({ name: params.roleName, status: status })
        return res
    }
    @Action
    async changeUserDesc(params: { name: string; description: string }) {
        let res = await changeUserDesc(params)
        return res
    }
}
