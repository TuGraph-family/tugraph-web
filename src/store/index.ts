import Vue from 'vue'
import Vuex from 'vuex'
// import UserManage from './user-manage/user-manage'
import UserLogin from './user-login/user-login'
import SubGraphManage from './subgraph-manage/subgraph-manage'
import Cypher from './cypher/cypher'
import CreateLabel from './create-label/create-label'
import ImportData from './import-data/import-data'
import Plugin from './plugin/plugin'
import DbInfo from './db-info/db-info'
import AccountList from './account-list/account-list'
import DbStatus from './db-status/db-status'
import TaskList from './task-list/task-list'
import AuditLog from './audit-log/audit-log'
import Help from './help/help'
import RoleList from './role-list/role-list'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        language: 'zh'
    },
    mutations: {
        changeLanguage(state, payload) {
            payload.vue.$children.forEach((item) => {
                item.$i18n.locale = payload.lang
            })
            state.language = payload.lang
        }
    },
    // actions: {},
    modules: {
        // UserManage,
        UserLogin,
        SubGraphManage,
        Cypher,
        CreateLabel,
        ImportData,
        Plugin,
        DbInfo,
        AccountList,
        DbStatus,
        TaskList,
        AuditLog,
        Help,
        RoleList
    }
})
