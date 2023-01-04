import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '../views/user-login/user-login.vue'
import Workbench from '@/views/workbench/workbench.vue'
import Cypher from '@/views/workbench/cypher/cypher.vue'
import CreateLabel from '@/views/workbench/create-label/create-label.vue'
import ImportData from '@/views/workbench/import-data/import-data.vue'
import Plugin from '@/views/workbench/plugin/plugin.vue'
import ControlBoard from '@/views/control-board/control-board.vue'
import Help from '@/views/workbench/help/help.vue'
import DbInfo from '@/views/control-board/db-info/db-info.vue'
import AccountList from '@/views/control-board/account-list/account-list.vue'
import DbStatus from '@/views/control-board/db-status/db-status.vue'
import TaskList from '@/views/control-board/task-list/task-list.vue'
import AuditLog from '@/views/control-board/audit-log/audit-log.vue'
import RoleList from '@/views/control-board/role-list/role-list.vue'
import Authority from '@/views/control-board/authority/authority.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/Workbench'
    },
    {
        path: '/Workbench',
        name: 'Workbench',
        component: Workbench,
        redirect: '/Workbench/Cypher',
        children: [
            {
                path: 'Cypher',
                name: 'Cypher',
                component: Cypher,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'CreateLabel',
                name: 'CreateLabel',
                component: CreateLabel
            },
            {
                path: 'ImportData',
                name: 'ImportData',
                component: ImportData
            },
            {
                path: 'Plugin',
                name: 'Plugin',
                component: Plugin,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'Help',
                name: 'Help',
                component: Help
            }
        ]
    },
    {
        path: '/ControlBoard',
        name: 'ControlBoard',
        component: ControlBoard,
        redirect: '/ControlBoard/DbInfo',
        children: [
            {
                path: 'DbInfo',
                name: 'DbInfo',
                component: DbInfo
            },
            {
                path: 'AccountList',
                name: 'AccountList',
                component: AccountList
            },
            {
                path: 'RoleList',
                name: 'RoleList',
                component: RoleList
            },
            {
                path: 'DbStatus',
                name: 'DbStatus',
                component: DbStatus
            },
            {
                path: 'TaskList',
                name: 'TaskList',
                component: TaskList
            },
            {
                path: 'AuditLog',
                name: 'AuditLog',
                component: AuditLog
            },
            {
                path: 'Authority',
                name: 'Authority',
                component: Authority
            }
        ]
    },
    {
        path: '/login',
        name: 'UserLogin',
        component: UserLogin
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    setTimeout(() => {
        const token = localStorage.__FMA_TOKEN__
        if (!token && to.name !== 'UserLogin') {
            next({ name: 'UserLogin' })
        } else {
            next()
        }
    }, 300)
})
export default router
