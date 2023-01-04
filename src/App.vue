<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive && $route.name === 'Cypher'"></router-view>
        </keep-alive>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive && $route.name === 'Plugin'"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script lang="ts">
import store from '@/store/index'
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserLoginStore from '@/store/user-login/user-login'
@Component
export default class App extends Vue {
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    isOriginalPWD: boolean = true
    get userName() {
        return this.userLoginStore.userName
    }

    created() {
        let ISORIGINALPWD = localStorage.ISORIGINALPWD
        console.log(this.userName)
        if (ISORIGINALPWD !== 'fixed' && this.userName === 'admin') {
            this.$notify({
                title: '提示',
                message: '为了您的数据安全，请修改admin的初始密码！',
                type: 'warning',
                duration: 0
            })
        }
    }
}
</script>

<style lang="less" scope>
html,
body {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
* {
    box-sizing: border-box;
}
#app {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .warn {
        position: absolute;
        z-index: 10;
        background: red;
        top: 0;
        right: 0;
    }
}
</style>
