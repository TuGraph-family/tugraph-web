import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { userLogin } from '@/service/user-login/user-login'

function decode(data: string, is_admin: boolean) {
    let user_info = JSON.parse(window.atob(data.split('.')[1]))
    user_info.is_admin = is_admin
    localStorage.__FMA_USERINFO__ = JSON.stringify(user_info)
}

@Module({ name: 'UserLogin' })
export default class UserLogin extends VuexModule {
    userName: string = localStorage.__FMA_USERINFO__ ? JSON.parse(localStorage.__FMA_USERINFO__).user : ''
    password: string = localStorage.__FMA_USERINFO__ ? JSON.parse(localStorage.__FMA_USERINFO__).password : ''
    token: string = localStorage.__FMA_TOKEN__ || ''
    isAdmin: boolean = localStorage.__FMA_USERINFO__ ? JSON.parse(localStorage.__FMA_USERINFO__).is_admin : ''
    @Mutation
    updateToken(params: { token: string; isAdmin: boolean }): void {
        this.token = 'Bearer ' + params.token
        this.isAdmin = params.isAdmin
        localStorage.__FMA_TOKEN__ = this.token
        decode(params.token, params.isAdmin)
    }
    @Mutation
    updateUserName(userName: string): void {
        this.userName = userName
    }
    @Mutation
    updatePassword(password: string): void {
        this.password = password
    }
    @Mutation
    userLogout(): void {
        this.password = ''
        this.token = ''
        this.userName = ''
        localStorage.__FMA_USERINFO__ = ''
        localStorage.__FMA_TOKEN__ = ''
        location.reload()
    }
    @Action
    async userLogin() {
        return await userLogin({ user: this.userName, password: this.password })
    }
}
