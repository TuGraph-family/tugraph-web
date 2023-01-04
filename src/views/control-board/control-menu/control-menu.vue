<i18n src="./control-menu-lang.json"></i18n>
<template>
    <div class="control-menu">
        <section class="control-menu-logo">
            <router-link to="/Workbench/Cypher"></router-link>
        </section>
        <section class="control-menu-list">
            <div class="control-menu-list-item DbInfo" :class="currentRouter.name === 'DbInfo' ? 'active' : ''">
                <router-link to="/ControlBoard/DbInfo">{{ $t('t1') }}</router-link>
            </div>
            <!-- <div class="control-menu-list-item RoleList" :class="currentRouter.name === 'RoleList' ? 'active' : ''" v-if="isAdmin">
                <router-link to="/ControlBoard/RoleList">{{ $t('t6') }}</router-link>
            </div>
            <div class="control-menu-list-item AccountList" :class="currentRouter.name === 'AccountList' ? 'active' : ''" v-if="isAdmin">
                <router-link to="/ControlBoard/AccountList">{{ $t('t2') }}</router-link>
            </div> -->
            <div class="control-menu-list-item Authority" :class="currentRouter.name === 'Authority' ? 'active' : ''" v-if="isAdmin">
                <router-link to="/ControlBoard/Authority">{{ $t('t7') }}</router-link>
            </div>
            <div class="control-menu-list-item DbStatus" :class="currentRouter.name === 'DbStatus' ? 'active' : ''">
                <router-link to="/ControlBoard/DbStatus">{{ $t('t3') }}</router-link>
            </div>
            <div class="control-menu-list-item TaskList" :class="currentRouter.name === 'TaskList' ? 'active' : ''" v-if="isAdmin">
                <router-link to="/ControlBoard/TaskList">{{ $t('t4') }}</router-link>
            </div>
            <div class="control-menu-list-item AuditLog" :class="currentRouter.name === 'AuditLog' ? 'active' : ''">
                <router-link to="/ControlBoard/AuditLog">{{ $t('t5') }}</router-link>
            </div>
        </section>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserLoginStore from '@/store/user-login/user-login'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import router from '@/router'
@Component
export default class WorkbenchMenu extends Vue {
    subGraphManageStore: any = getModule(SubGraphManageStore, store)
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    menuRouter: any = router
    get isAdmin() {
        return this.userLoginStore.isAdmin
    }
    get selectedSubGraph() {
        return this.subGraphManageStore.selectedSubGraph
    }
    get currentRouter() {
        return this.menuRouter.currentRoute
    }
    created() {}
}
</script>
<style lang="less" scoped>
.control-menu {
    width: 100%;
    height: 100%;
    background: #323457;
    color: #bebfca;
    font-size: 12px;
    .control-menu-logo {
        height: 90px;
        background: url('../../../assets/control-menu/logo.png') no-repeat center;
        background-size: 150px;
        a {
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
    .control-menu-graph-name {
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .control-menu-list-item {
        margin: 3px 8px;
        a {
            display: inline-block;
            text-decoration: none;
            color: unset;
            width: 100%;
            height: 48px;
            line-height: 48px;
            padding-left: 44px;
        }
        &.active {
            color: #fff;
            font-weight: 700;
            border-radius: 4px;
        }
        &.DbInfo {
            background: url('../../../assets/control-menu/database.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/control-menu/database_active.svg') no-repeat 15px center;
            }
        }
        &.AccountList,
        &.Authority {
            background: url('../../../assets/control-menu/user.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/control-menu/user_active.svg') no-repeat 15px center;
            }
        }
        &.RoleList {
            background: url('../../../assets/control-menu/role-normal.png') no-repeat 15px center;
            background-size: 20px;
            &.active {
                background: #4b4d74 url('../../../assets/control-menu/role-active.png') no-repeat 15px center;
                background-size: 20px;
            }
        }
        &.DbStatus {
            background: url('../../../assets/control-menu/server.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/control-menu/server_active.svg') no-repeat 15px center;
            }
        }
        &.TaskList {
            background: url('../../../assets/control-menu/running.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/control-menu/running_active.svg') no-repeat 15px center;
            }
        }
        &.AuditLog {
            background: url('../../../assets/control-menu/auditlog.svg') no-repeat 15px center;
            &.active {
                background: #4b4d74 url('../../../assets/control-menu/auditlog_active.svg') no-repeat 15px center;
            }
        }
        &:hover {
            background-color: #191c46;
            border-radius: 4px;
        }
    }
}
</style>
