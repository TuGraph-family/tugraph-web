import { VuexModule, Module } from 'vuex-module-decorators'

interface user {
    userName: string
    userRight: string
    graphList: {
        [propName: string]: string
    }
}

@Module
export default class UserManage extends VuexModule {
    userList: Array<user> = []
}
