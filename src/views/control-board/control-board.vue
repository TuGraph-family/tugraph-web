<i18n src="./control-border-lang.json"></i18n>
<template>
    <div class="workbench">
        <section class="workbench-menu">
            <ControlMenu></ControlMenu>
            <section class="user-logout">
                <div class="avator" @click="clickUserLogout"></div>
                <div class="user-name" :title="userName">{{ userName }}</div>
                <div class="user-logout-panel" v-if="showUserLogoutPanel">
                    <div class="user-panel-item" @click.stop="updatePassword">{{ $t('text1') }}</div>
                    <div class="user-panel-item" @click.stop="logout">{{ $t('text2') }}</div>
                </div>
                <!-- <section>
                    <el-button size="mini" @click="changeLang('zh')">中</el-button>
                    <el-button size="mini" @click="changeLang('en')">En</el-button>
                </section> -->
            </section>
            <section class="to-control-board">
                <router-link to="/Workbench">
                    {{ $t('text3') }}
                </router-link>
            </section>
        </section>
        <section class="workbench-container">
            <article class="workbench-container-body">
                <router-view></router-view>
            </article>
        </section>
        <section v-if="showChagePwd">
            <ChangePwd :show.sync="showChagePwd"></ChangePwd>
        </section>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserLoginStore from '@/store/user-login/user-login'
import ControlMenu from '@/views/control-board/control-menu/control-menu.vue'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import CypherStore from '@/store/cypher/cypher'
import ChangePwd from '@/components/change-pwd/change-pwd.vue'
@Component({
    components: {
        ControlMenu,
        ChangePwd
    }
})
export default class ControlBoard extends Vue {
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    subGraphManageStore: SubGraphManageStore = getModule(SubGraphManageStore, store)
    showUserLogoutPanel: boolean = false
    showChagePwd: boolean = false
    cypherStore: CypherStore = getModule(CypherStore, store)
    get userName() {
        return this.userLoginStore.userName
    }
    get isAdmin() {
        return this.userLoginStore.isAdmin
    }
    created() {
        this.subGraphManageStore.getUserGraph(this.userLoginStore.userName)
    }
    clickUserLogout() {
        this.showUserLogoutPanel = !this.showUserLogoutPanel
    }
    updatePassword() {
        this.showUserLogoutPanel = false
        this.showChagePwd = true
    }
    async logout() {
        this.cypherStore.upDateCypherReasultDatas([])
        this.subGraphManageStore.updateSelectedSubGraph('')
        let res = await this.userLoginStore.userLogout()
        location.href = location.origin + '#/login'
    }
    changeLang(lang: string) {
        this.$i18n.locale = lang
        this.$store.commit('changeLanguage', { vue: this, lang: lang })
    }
}
</script>
<style lang="less" scoped>
.workbench {
    width: 100%;
    height: 100%;
    display: flex;
    .workbench-menu {
        width: 170px;
        height: 100%;
        flex-shrink: 0;
        position: relative;
    }
    .workbench-container {
        flex-grow: 1;
        height: 100%;
        max-width: calc(100% - 170px);
        overflow: hidden;
        .workbench-container-header {
            padding: 6px 10px;
            border-bottom: 1px solid #cccccc;
        }
        .workbench-container-body {
            width: 100%;
            height: 100%;
        }
    }
    .user-logout {
        position: absolute;
        width: 100%;
        bottom: 96px;
        color: #bebfca;
        text-align: center;
        font-size: 12px;
        .avator {
            width: 100%;
            height: 30px;
            background: url('../../assets/workbench/user-nomal.png') no-repeat center;
        }
        &:hover,
        &.active {
            cursor: pointer;
            color: #ffffff;
            .avator {
                background: url('../../assets/workbench/user-active.png') no-repeat center;
            }
        }
    }
    .user-logout-panel {
        position: absolute;
        top: 0;
        right: -93px;
        border-radius: 4px;
        border: 1px solid #e6e6e6;
        -webkit-box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.3);
        background-color: #fff;
        z-index: 100;
        .user-panel-item {
            width: 70px;
            margin: 0 10px;
            line-height: 44px;
            color: #44527c;
            text-align: center;
            cursor: pointer;
            &:hover {
                color: #3e8cf6;
            }
            &:first-child {
                border-bottom: 1px solid #aaa;
            }
        }
        .user-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .to-control-board {
        position: absolute;
        bottom: 58px;
        width: 100%;
        a {
            text-decoration: none;
            color: unset;
            display: block;
            width: 110px;
            height: 28px;
            line-height: 28px;
            background-color: #5c71c0;
            border-radius: 4px;
            padding-left: 44px;
            font-size: 12px;
            color: #fff;
            margin: 0px auto;
            background-image: url('../../assets/workbench/control-board-btn.png');
            background-position: 20px center;
            background-repeat: no-repeat;
            &:hover {
                background-color: #7891ee;
            }
            &:active {
                background-color: #4358a9;
            }
        }
    }
}
</style>
