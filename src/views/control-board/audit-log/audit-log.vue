<i18n src="./audit-log.json"></i18n>
<template>
    <div class="control-auditlog">
        <div class="auditlog-head">
            <span class="auditlog-head-name">{{ $t('t1') }}</span>
            <div v-if="isAdmin && userList" class="filter-by-user">
                <el-select size="small" v-model="currentUser" :placeholder="$t('t5')" @change="change" clearable>
                    <el-option v-for="(item, index) in userList" :key="item.userName + index" :label="item.userName" :value="item.userName"> </el-option>
                    <el-option label="ALL" value="ALL"> </el-option>
                </el-select>
            </div>
            <div class="audit-filter">
                <span class="audit-filter-name">{{ $t('t2') }}：</span>
                <el-date-picker v-model="time" type="datetimerange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :unlink-panels="true" size="small" style="width:360px">
                </el-date-picker>
                <span class="audit-filter-name">{{ $t('t3') }}：</span>
                <el-input-number v-model="num_log" :min="1" size="small"></el-input-number>
                <el-button type="primary" size="small" @click="search(currentUser === 'ALL' ? '' : currentUser)">{{ $t('t4') }}</el-button>
            </div>
        </div>
        <div class="audit-log-content">
            <el-table :data="logList[currentPage - 1]" style="width: 100%" :empty-text="empty_text">
                <el-table-column prop="begin_time" label="begin_time" width="200"> </el-table-column>
                <el-table-column prop="content" label="content" width="400"></el-table-column>
                <el-table-column prop="graph" label="graph"> </el-table-column>
                <el-table-column prop="read_write" label="read_write"> </el-table-column>
                <el-table-column prop="index" label="index"> </el-table-column>
                <el-table-column label="success" prop="success"></el-table-column>
                <el-table-column prop="type" label="type"> </el-table-column>
                <el-table-column prop="user" label="user"> </el-table-column>
                <el-table-column prop="end_time" label="end_time" width="200"> </el-table-column>
            </el-table>
            <div style="padding-top:3px;padding-left:30px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="filterResult.length"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { formatSeconds } from '@/core/uitls.ts'
import { getModule } from 'vuex-module-decorators'
import TaskListStore from '@/store/task-list/task-list'
import UserLoginStore from '@/store/user-login/user-login'
import DbStatusStore from '@/store/db-status/db-status'
import AccountListStore from '@/store/account-list/account-list'
import AuditLogStroe from '@/store/audit-log/audit-log'
import moment from 'moment'
@Component
export default class AuditLog extends Vue {
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    accountListStore: AccountListStore = getModule(AccountListStore, store)
    auditLogStroe: AuditLogStroe = getModule(AuditLogStroe, store)
    dbStatusStore: DbStatusStore = getModule(DbStatusStore, store)
    err_msg: string = ''
    dataResult: any[] = []
    filterResult: any[] = []
    currentPage: number = 1
    pageSize: number = 10
    time: any = null // [new Date() - 3 * 24 * 60 * 60 * 1000, new Date()],
    num_log: number = 100
    empty_text: string = '暂无数据'
    logList: any[] = []
    currentUser: string = ''
    created() {
        if (this.isAdmin) {
            this.initSearch('')
            this.accountListStore.getUserList(this.currentUser)
        } else {
            this.currentUser = this.userName
            this.initSearch(this.userName)
        }
        this.dbStatusStore.getStatus()
        setTimeout(() => {
            this.getOhterLog()
        }, 500)
    }
    get result() {
        return this.auditLogStroe.logList
    }
    get isAdmin() {
        return this.userLoginStore.isAdmin
    }
    get userList() {
        return this.accountListStore.userList
    }
    get userName() {
        return this.userLoginStore.userName
    }
    handleSizeChange(num) {
        this.pageSize = num
        this.splitData(this.result)
    }
    handleCurrentChange() {}
    change() {
        if (this.currentUser) {
            if (this.currentUser === 'ALL') {
                this.filterResult = this.result
                this.splitData(this.filterResult)
            } else {
                let result = this.result.filter((item) => item.user === this.currentUser)
                this.filterResult = result
                this.splitData(this.filterResult)
            }
        } else {
            this.filterResult = [...this.result]
            this.splitData(this.filterResult)
        }
    }
    async initSearch(userName) {
        var _time = [new Date().getTime() - 3 * 24 * 60 * 60 * 1000, new Date()]
        let begin_time = moment(_time[0]).format('YYYY-MM-DD HH:mm:ss')
        let end_time = moment(_time[1]).format('YYYY-MM-DD HH:mm:ss')
        this.time = [begin_time, end_time]
        let num_log = this.num_log + ''
        let user = userName || ''
        let result = await this.auditLogStroe.getLog({ begin_time, end_time, num_log, user })
        let setList = localStorage.__FMA_SETLIST__
        let list: any[] = []

        setList &&
            JSON.parse(setList).forEach((item) => {
                let obj = {
                    begin_time: item.begin_time,
                    content: `设置${item.type}阈值,普通告警:${item.data.warning_1}%;严重告警:${item.data.warning_2}%`
                }
                list.push(obj)
            })

        setTimeout(() => {
            let a = this.dbStatusStore.isWarning
            let list1 = []
            Object.keys(a).forEach((item) => {
                if (a[item].status) {
                    let obj = {
                        content: `${item}告警,当前值:${a[item].value}`
                    }
                    list1.push(obj)
                }
            })
            this.filterResult = [...this.filterResult, ...list, ...list1]
            this.splitData(this.filterResult)
        }, 800)
        if (result && result.status === 200) {
            if (this.currentUser && this.currentUser !== 'ALL') {
                this.filterResult = this.result.filter((item) => item.user === this.currentUser)
            } else {
                this.filterResult = [...this.result]
            }
            this.result.forEach((item) => {
                if (item.success) {
                    item.success = 'true'
                } else {
                    item.success = 'false'
                }
            })
            this.splitData(this.filterResult)
        } else {
            this.empty_text = result ? result.error_message : ''
        }
    }
    async search(userName) {
        if (!this.time) {
            this.$message({
                message: '请选择查询时间',
                type: 'warning'
            })
            return
        }
        let begin_time = moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
        let end_time = moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
        let num_log = this.num_log + ''
        let user = userName || ''
        let result = await this.auditLogStroe.getLog({ begin_time, end_time, num_log, user })
        if (result.status === 200) {
            result = this.result.sort((a: any, b: any) => {
                return new Date(b.begin_time).getTime() - new Date(a.begin_time).getTime()
            })

            if (this.currentUser && this.currentUser !== 'ALL') {
                this.filterResult = this.result.filter((item) => item.user === this.currentUser)
            } else {
                this.filterResult = [...result]
            }
            this.result.forEach((item) => {
                if (item.success) {
                    item.success = 'true'
                } else {
                    item.success = 'false'
                }
            })
            this.splitData(this.filterResult)
        } else {
            this.empty_text = result.error_message
        }
    }
    splitData(data) {
        let len = data.length
        let n = this.pageSize // 假设每行显示4个
        let lineNum = len % this.pageSize === 0 ? len / n : Math.floor(len / n + 1)
        let res = []
        for (let i = 0; i < lineNum; i++) {
            // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
            let temp = data.slice(i * n, i * n + n)
            res.push(temp)
        }
        this.logList = res
    }
    getOhterLog() {
        let alarm = this.dbStatusStore.isWarning
        console.log(alarm)
    }
}
</script>

<style lang="less" scope>
.control-auditlog {
    position: relative;
    width: 100%;
    height: 100%;
    .auditlog-head {
        background: #ffffff;
        box-shadow: 0 1px 0 0 #dedfdf;
        width: 100%;
        height: 60px;
        padding-left: 25px;
        padding-right: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1px;
        .auditlog-head-name {
            font-family: OpenSans;
            font-size: 24px;
            color: #44527c;
        }
    }
    .audit-filter {
        padding: 5px 10px;
        .audit-filter-name {
            font-size: 14px;
            color: #44527c;
        }
    }
    .el-date-editor {
        margin-right: 20px;
        color: #44527c;
    }
    .el-input-number {
        margin-right: 20px;
    }
    .audit-log-content {
        height: calc(100% - 100px);
        overflow: auto;
        .el-table__header {
            th {
                padding: 0;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #666666;
                height: 32px;
                line-height: 32px;
                font-weight: unset;
                div {
                    border-right: 1px solid #e6e6e6;
                }
            }
        }
        .el-table__body {
            td {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #44527c;
            }
        }
    }
    .filter-by-user {
        position: absolute;
        left: 150px;
    }
}
</style>
