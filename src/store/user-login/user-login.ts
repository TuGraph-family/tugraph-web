import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { userLogin, logout } from '@/service/user-login/user-login'

function decode(data: string, is_admin: boolean, userName: string) {
    let user_info = {
        user: userName,
        is_admin
    }
    sessionStorage.__FMA_USERINFO__ = JSON.stringify(user_info)
}

@Module({ name: 'UserLogin' })
export default class UserLogin extends VuexModule {
    userName: string = sessionStorage.__FMA_USERINFO__ ? JSON.parse(sessionStorage.__FMA_USERINFO__).user : ''
    // password: string = sessionStorage.__FMA_USERINFO__ ? JSON.parse(sessionStorage.__FMA_USERINFO__).password : ''
    token: string = sessionStorage.__FMA_TOKEN__ || ''
    isAdmin: boolean = sessionStorage.__FMA_USERINFO__ ? JSON.parse(sessionStorage.__FMA_USERINFO__).is_admin : ''
    @Mutation
    updateToken(params: { token: string; isAdmin: boolean }): void {
        this.token = 'Bearer ' + params.token
        this.isAdmin = params.isAdmin
        sessionStorage.__FMA_TOKEN__ = this.token
        console.log(1)
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
        let res = await logout({ jwt: sessionStorage.__FMA_TOKEN__ })
        console.log(res)
        sessionStorage.__FMA_USERINFO__ = ''
        sessionStorage.__FMA_TOKEN__ = ''
        return res
    }
}
