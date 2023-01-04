import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { userLogin, logout } from '@/service/user-login/user-login'

function decode(data: string, is_admin: boolean, userName: string) {
    let user_info = {
        user: userName,
        is_admin
    }
    localStorage.__FMA_USERINFO__ = JSON.stringify(user_info)
}

@Module({ name: 'UserLogin' })
export default class UserLogin extends VuexModule {
    userName: string = localStorage.__FMA_USERINFO__ ? JSON.parse(localStorage.__FMA_USERINFO__).user : ''
    // password: string = localStorage.__FMA_USERINFO__ ? JSON.parse(localStorage.__FMA_USERINFO__).password : ''
    token: string = localStorage.__FMA_TOKEN__ || ''
    isAdmin: boolean = localStorage.__FMA_USERINFO__ ? JSON.parse(localStorage.__FMA_USERINFO__).is_admin : ''
    @Mutation
    updateToken(params: { token: string; isAdmin: boolean }): void {
        this.token = 'Bearer ' + params.token
        this.isAdmin = params.isAdmin
        localStorage.__FMA_TOKEN__ = this.token
        decode(params.token, params.isAdmin, this.userName)
    }
    @Mutation
    updateUserName(userName: string): void {
        this.userName = userName
    }
    @Mutation
    updatePassword(password: string): void {
        // this.password = password
    }

    @Action
    async userLogin(params: { userName: string; password: string }) {
        return await userLogin({ user: params.userName, password: params.password })
    }
    @Action
    async userLogout() {
        let res = await logout({ jwt: localStorage.__FMA_TOKEN__ })
        localStorage.__FMA_USERINFO__ = ''
        localStorage.__FMA_TOKEN__ = ''
        return res
    }
}
