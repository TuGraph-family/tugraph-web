<i18n src="./user-login-lang.json"></i18n>
<template>
    <div class="user-login">
        <div class="imgLogo"></div>
        <div class="particlesBg">
            <Particles></Particles>
            <div class="textBg">
                <div class="text1">{{ $t('text1') }}</div>
                <div class="text2">{{ $t('text2') }}</div>
            </div>
        </div>
        <section class="user-login-panel">
            <span class="inputHeader">{{ $t('text3') }}</span>
            <el-input class="inputLogin" :placeholder="$t('text4')" v-model="userName" autofocus="autofocus" />
            <el-input class="inputLogin" show-password :placeholder="$t('text5')" v-model="password" />
            <el-button class="createButton" @click="userLogin" type="primary">{{ $t('text6') }}</el-button>
        </section>
        <div class="imgBottom"></div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserLoginStore from '@/store/user-login/user-login'
import Particles from '@/components/particles/particles.vue'
@Component({
    components: {
        Particles
    }
})
export default class UserLogin extends Vue {
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    userName: string = ''
    password: string = ''
    @Watch('userName')
    onChangeUserName() {
        this.userLoginStore.updateUserName(this.userName)
    }
    created(): void {
        console.log('login created')
    }
    mounted(): void {
        console.log('login mounted')
        document.addEventListener('keydown', this.submit)
    }
    submit(value: any) {
        if (value && value.keyCode === 13) {
            this.userLogin()
        }
    }
    async userLogin() {
        let result = await this.userLoginStore.userLogin({ userName: this.userName, password: this.password })
        if (result && result.status === 200) {
            let token = result.data.jwt
            let isAdmin = result.data.is_admin
            this.userLoginStore.updateToken({ token, isAdmin })
            this.$router.push({ name: 'Workbench' })
            this.$message({
                type: 'success',
                message: '登录成功'
            })
            localStorage.loadTime = new Date().getTime()
            document.removeEventListener('keydown', this.submit)
        } else {
            this.$message({
                type: 'error',
                message: result ? result.data && '登录失败' : '登录失败'
            })
        }
    }
}
</script>
<style lang="less" scoped>
.user-login {
    width: 100%;
    height: 100%;
    background: #516699;
    position: relative;
    .imgLogo {
        width: 135px;
        height: 60px;
        position: absolute;
        top: 45px;
        left: 63px;
        background-size: 100%;
        background-image: url('../../assets/user-login/logo.png');
        background-repeat: no-repeat;
    }
    .particlesBg {
        background: radial-gradient(rgba(255, 255, 255, 0.19, 50% 50%) 0%, rgba(81, 102, 153, 0) 60%);
        display: flex;
        position: relative;
        width: 426px;
        height: 426px;
        border-radius: 50%;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #ffffff;
        top: 17.7%;
        // transform: translate(0, -50%);
        left: 16.8%;
        .textBg {
            position: absolute;
            text-align: center;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            div {
                word-break: keep-all;
            }
            .text2 {
                margin-top: 16px;
            }
        }
    }
    .user-login-panel {
        display: flex;
        flex-flow: column;
        position: absolute;
        right: 17.1%;
        top: 27.2%;
        // transform: translate(0, -50%);
        width: 300px;
        .inputHeader {
            display: block;
            padding-bottom: 19px;
            border-bottom: 1px solid #ffffff;
            margin-bottom: 29px;
            font-family: PingFangSC-Regular;
            font-size: 28px;
            color: #ffffff;
        }
        .inputLogin {
            width: 100%;
            height: 40px;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #ffffff !important;
            background: #6c7ea8 !important;
            border-radius: 4px;
            border-radius: 4px;
            margin-bottom: 20px;
            border: none;
        }
        // input:-webkit-autofill {
        //     font-size: 14px;
        //     box-shadow: 0 0 0px 1000px #6c7ea8 inset;
        //     -webkit-text-fill-color: #ffffff;
        // }
        // ::-webkit-input-placeholder {
        //     /* WebKit browsers */
        //     color: #ffffff;
        // }
        // ::-moz-placeholder {
        //     /* Mozilla Firefox 19+ */
        //     color: #ffffff;
        // }
        // :-ms-input-placeholder {
        //     /* Internet Explorer 10+ */
        //     color: #ffffff;
        // }
        .createButton {
            width: 100%;
            height: 40px;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
            text-align: right;
            background: rgba(87, 158, 255, 0.6);
            border-radius: 8px;
            border-radius: 8px;
            text-align: center;
            border: none;
        }
    }
    .imgBottom {
        width: 100%;
        height: 100px;
        position: absolute;
        bottom: 0px;
        background-size: cover;
        background-image: url('../../assets/user-login/wave.svg');
    }
}
</style>
