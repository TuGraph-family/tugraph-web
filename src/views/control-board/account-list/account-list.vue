<i18n src="./account-list-lang.json"></i18n>
<template>
    <div class="user-manage">
        <div class="user-manage-head">
            <div>{{ $t('t1') }}</div>
            <a @click="popAddUserDig">{{ $t('t2') }}</a>
        </div>
        <div class="user-manage-table">
            <el-table :data="userList" border style="width: 100%" :row-class-name="rowClassName">
                <el-table-column prop="userName" :label="$t('t5')" width="152">
                    <template slot-scope="scope">
                        <div class="tbody-user-name" v-if="scope" :class="scope.row.userRight ? 'admin' : 'not-admin'">
                            {{ scope.row.userName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="roles" :label="$t('t6')" width="400">
                    <template slot-scope="scope">
                        <div style="text-align: left;display: flex;align-items: center;">
                            <el-select
                                style="width:300px;margin-right:10px;"
                                size="mini"
                                :disabled="scope.row.userName === 'admin' || scope.row.edit === false"
                                v-model="scope.row.roles"
                                multiple
                                placeholder="请选择角色"
                            >
                                <el-option v-for="item in roleList" :key="item.name" :label="item.name" :value="item.name"> </el-option>
                            </el-select>
                            <span v-if="scope.row.userName !== 'admin' && scope.row.edit === false" class="el-icon-edit pointer" @click="setUserList(scope.row, true, scope)"></span>
                            <span v-if="scope.row.userName !== 'admin' && scope.row.edit === true" class="el-icon-circle-check pointer" @click="saveUserList(scope.row, scope)"></span>
                            <span v-if="scope.row.userName !== 'admin' && scope.row.edit === true" class="el-icon-circle-close pointer" @click="setUserList(scope.row, false, scope)"></span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="graphList" width="440">
                    <template slot="header">
                        <div class="user-manage-color">
                            <div>{{ $t('t7') }}</div>
                            <div>
                                <span class="icon READ"></span>
                                <span>READ</span>
                            </div>
                            <div>
                                <span class="icon WRITE"></span>
                                <span>WRITE</span>
                            </div>
                            <div>
                                <span class="icon FULL"></span>
                                <span>FULL</span>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="scope">
                        <div class="tbody-graph-list" v-if="scope.row.graphList">
                            <span class="graph-item" v-for="(item, index) in scope.row.graphList" :key="index" :class="item">{{ index }}</span>
                        </div>
                        <div v-else class="tbody-graph-list">
                            <span class="NONE graph-item">{{ $t('t8') }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('t9')" min-width="200">
                    <template slot-scope="scope">
                        <div class="tbody-control-cell">
                            <div class="change-pwd" @click="popChangeUsrDig('pwd', scope.row)">
                                {{ $t('t13') }}
                            </div>
                            <div class="delete" @click="deleteUser(scope.row)" v-if="scope.row.userName !== currentUserName && scope.row.userName !== 'admin'">
                                {{ $t('t14') }}
                            </div>
                            <el-switch
                                v-if="scope.row.userName !== currentUserName && scope.row.userName !== 'admin'"
                                v-model="scope.row.enable"
                                active-text="已启用"
                                inactive-text="已禁用"
                                @change="enableOrDisableUser(scope)"
                            >
                            </el-switch>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="box" v-if="showUserDig">
            <div class="add-user-dig">
                <div class="add-user-dig-header">
                    <div>{{ $t('t15') }}</div>
                    <span class="el-icon-close" @click="cancelAddUser"></span>
                </div>
                <div class="add-user-dig-name">
                    <div class="add-user-dig-text">
                        {{ $t('t16') }}
                    </div>
                    <el-input v-model="addUserName" size="small"></el-input>
                </div>
                <div class="add-user-dig-pwd">
                    <div class="add-user-dig-text">
                        {{ $t('t17') }}
                    </div>
                    <el-input v-model="addUserPWd" show-password size="small"></el-input>
                </div>

                <div class="add-user-dig-btns">
                    <el-button @click="saveAddUser" class="c">{{ $t('t23') }}</el-button>
                    <el-button @click="cancelAddUser">{{ $t('t24') }}</el-button>
                </div>
            </div>
        </div>

        <div class="box" v-if="showChangeUsrDig">
            <div class="change-user-pwdorright">
                <div class="change-user-pwdorright-header">
                    {{ $t('t25') }}
                    <span class="el-icon-close" @click="cancelChangeUsrDig"></span>
                </div>
                <div class="change-user-pwdorright-text">
                    {{ $t('t26') }}
                </div>
                <div>
                    <el-input v-model="newPwd" show-password></el-input>
                </div>
                <div class="change-user-pwdorright-btns">
                    <el-button @click="changeUserPwd" type="primary">{{ $t('t23') }}</el-button>
                    <el-button @click="cancelChangeUsrDig">{{ $t('t24') }}</el-button>
                </div>
            </div>
        </div>

        <section v-if="showChagePwd">
            <ChangePwd :show.sync="showChagePwd"></ChangePwd>
        </section>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { formatSeconds } from '@/core/uitls.ts'
import { getModule } from 'vuex-module-decorators'
import ChangePwd from '@/components/change-pwd/change-pwd.vue'
import AccountListStore from '@/store/account-list/account-list'
import UserLoginStore from '@/store/user-login/user-login'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
import RoleListStore from '@/store/role-list/role-list'
@Component({
    components: {
        ChangePwd
    }
})
// 用户管理页，代码逻辑写的比较冗余，待有时间需要优化。——2021-07-20
export default class AccountList extends Vue {
    accountListStore: AccountListStore = getModule(AccountListStore, store)
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    subGraphManageStore: any = getModule(SubGraphManageStore, store)
    roleListStore: RoleListStore = getModule(RoleListStore, store)
    showUserDig: boolean = false
    showChangeUsrDig: boolean = false
    showChangeGraphRightDig: boolean = false
    addUserName: string = ''
    addUserPWd: string = ''
    newPwd: string = ''
    is_add_admin: boolean = false
    changeType: string = ''
    targeRowData: any = null
    allGraphList: any = []
    graphRightTable: any = []
    showChagePwd: boolean = false
    desForKeys: any = {
        user: '账户名\xa0',
        password: '账户密码\xa0',
        newPassword: '密码\xa0'
    }
    tableData: any = []
    get userList() {
        return JSON.parse(JSON.stringify(this.accountListStore.userList))
    }
    get roleList() {
        let data = JSON.parse(JSON.stringify(this.roleListStore.roleList))
        return data
    }
    get currentUserName() {
        return this.userLoginStore.userName
    }
    created() {
        this.accountListStore.getUserList(this.currentUserName)
        this.roleListStore.getRoleList(this.currentUserName)
    }
    rowClassName(row: any) {
        if (row.rowIndex === 0) {
            return 'current-user-row'
        }
    }
    popAddUserDig() {
        let graphRightTable = []
        Object.keys(this.subGraphManageStore.subGraphList).forEach((item) => {
            var obj = {
                graphName: item,
                graphRight: (this.targeRowData && this.targeRowData.graphList && this.targeRowData.graphList[item]) || 'NONE'
            }
            graphRightTable.push(obj)
        })
        this.graphRightTable = graphRightTable
        this.showUserDig = !this.showUserDig
    }
    checkNull(data) {
        let keys = Object.keys(data)
        let nullKeyList = []
        keys.forEach((item) => {
            if (!data[item] && data[item] !== false) {
                nullKeyList.push(item)
            }
        })
        if (nullKeyList.length > 0) {
            let keysString = ''
            nullKeyList.forEach((key) => {
                // eslint-disable-next-line no-useless-escape
                keysString += this.desForKeys[key] || key
            })
            this.$message({
                message: keysString + ' 不能为空',
                type: 'error'
            })
            return true
        } else {
            return false
        }
    }
    setUserList(row, status, scope) {
        row.edit = status
        if (!status && scope) {
            console.log(store)
            row.roles = this.accountListStore.userList[scope.$index].roles
        }
        this.accountListStore.updateUserList(this.userList)
    }
    async saveUserList(row, scope) {
        let params = {
            name: row.userName,
            roles: row.roles
        }
        let res = await this.accountListStore.saveUserList(params)
        if (res.status === 200) {
            this.$message({
                message: '配置角色成功',
                type: 'success'
            })
            this.accountListStore.setUserGraphList(row.userName)
        } else {
            this.$message({
                message: res.data ? res.data.error_message : '配置角色失败',
                type: 'error'
            })
            this.accountListStore.getUserList(this.currentUserName)
        }
        this.setUserList(row, false, null)
    }
    changeAddUserRole() {
        let graphRightTable = []
        if (this.is_add_admin) {
            Object.keys(this.subGraphManageStore.subGraphList).forEach((item) => {
                var obj = {
                    graphName: item,
                    graphRight: (this.targeRowData && this.targeRowData.graphList && this.targeRowData.graphList[item]) || 'FULL'
                }
                graphRightTable.push(obj)
            })
            this.graphRightTable = graphRightTable
        } else {
            Object.keys(this.subGraphManageStore.subGraphList).forEach((item) => {
                var obj = {
                    graphName: item,
                    graphRight: (this.targeRowData && this.targeRowData.graphList && this.targeRowData.graphList[item]) || 'NONE'
                }
                graphRightTable.push(obj)
            })
        }
        this.graphRightTable = graphRightTable
    }
    async saveAddUser() {
        var data = {
            user: this.addUserName,
            password: this.addUserPWd,
            is_admin: this.is_add_admin,
            description: ''
        }
        let hasNull = this.checkNull(data)
        if (!hasNull) {
            let res = await this.accountListStore.addUser(data)
            if (res.status === 200) {
                this.$message({
                    message: '添加账户成功',
                    type: 'success'
                })
                // await this.accountListStore.changeGraphAcl({ graphRightTable: this.graphRightTable, userName: this.addUserName })
                this.cancelAddUser()
                this.accountListStore.getUserList(this.currentUserName)
            } else {
                this.$message({
                    message: res.data ? res.data.error_message : '',
                    type: 'error'
                })
            }
        }
    }
    cancelAddUser() {
        this.showUserDig = false
    }

    popChangeUsrDig(data, rowData) {
        this.changeType = data
        this.targeRowData = rowData
        if (this.currentUserName === rowData.userName) {
            this.showChagePwd = true
            return
        }
        this.changeUser()
    }
    cancelChangeUsrDig() {
        this.showChangeUsrDig = false
    }
    async changeUserPwd() {
        let obj = {
            name: this.targeRowData.userName,
            isAdmin: this.targeRowData.userRight === '管理员',
            newPassword: this.newPwd
        }
        let hasNull = this.checkNull(obj)
        if (!hasNull) {
            let result = await this.accountListStore.changeUserPwd(obj)
            if (result) {
                this.$message({
                    message: '修改密码成功',
                    type: 'success'
                })
                this.accountListStore.getUserList(this.currentUserName)
            }
            this.showChangeUsrDig = false
        }
    }

    changeUser() {
        if (this.changeType === 'pwd') {
            this.showChangeUsrDig = true
        }
    }
    async enableOrDisableUser(scope) {
        let row = scope.row
        let res = await this.accountListStore.enableOrDisableUser({
            roleName: row.userName,
            status: row.enable
        })
        if (res.status === 200) {
            this.$message({
                message: scope.row.enable ? '启动用户成功' : '禁用用户成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.data ? res.data.error_message : scope.row.enable ? '启动用户成功' : '禁用用户成功',
                type: 'error'
            })
        }
        this.accountListStore.getUserList(this.currentUserName)
    }
    async deleteUser(data) {
        if (data.userName === this.currentUserName) {
            this.$message({
                message: '不能删除自己的账户',
                type: 'warning'
            })
            return
        }
        this.$confirm(`此操作将永久删除${data.userName}账户, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                let result = await this.accountListStore.delUser(data.userName)

                if (result && result.status === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    if (data.userName === this.currentUserName) {
                        this.$router.push({ name: 'UserLogin' })
                        return
                    }
                    this.accountListStore.getUserList(this.currentUserName)
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
    }
}
</script>
<style lang="less" scoped>
.user-manage {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    .READ {
        background: #dbdbdb;
    }
    .WRITE {
        background: #3e8cf6;
    }
    .FULL {
        background: #46c120;
    }
    .NONE {
        background: #aaaaaa;
    }
    .pointer {
        cursor: pointer;
        font-size: 20px;
        margin: 0 5px;
        &:hover {
            color: #3e8cf6;
        }
    }
    .add-user-dig {
        width: 440px;
        height: 300px;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        padding: 0 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -390px;
        margin-top: -286px;
        &-header {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
            height: 63px;
            line-height: 63px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 20px;
                cursor: pointer;
            }
        }
        &-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            height: 40px;
            line-height: 40px;
        }
        .el-input {
            input {
                height: 28px;
                line-height: 28px;
            }
            .el-input__icon {
                line-height: 28px;
            }
        }
        .el-select {
            input {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #44527c;
            }
            .el-input__icon {
                line-height: 28px;
                font-size: 12px;
            }
        }
        &-btns {
            margin-top: 36px;
            display: flex;
            justify-content: flex-end;
            .el-button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                padding: 0;
            }
        }
    }
    .change-user-pwdorright {
        width: 440px;
        height: 220px;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        padding: 0 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -390px;
        margin-top: -110px;
        &-header {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
            height: 63px;
            line-height: 63px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 20px;
                cursor: pointer;
            }
        }
        &-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            height: 40px;
            line-height: 40px;
        }
        .el-input {
            input {
                height: 28px;
                line-height: 28px;
            }
            .el-input__icon {
                line-height: 28px;
            }
        }
        .change-user-pwdorright-btns {
            margin-top: 36px;
            display: flex;
            justify-content: flex-end;
            .el-button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                padding: 0;
            }
        }
    }
    .user-manage-color {
        display: flex;
        height: 23px;
        justify-content: center;
        > div {
            height: 23px;
            display: flex;
            align-items: center;
        }
        .icon {
            width: 11px;
            height: 6px;
            border-radius: 3px;
            margin-right: 5px;
        }
    }
    .user-manage-head {
        height: 60px;
        display: flex;
        padding-left: 25px;
        padding-right: 20px;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        box-shadow: 0 1px 0 0 #dedfdf;
        > div:first-child {
            font-family: OpenSans;
            font-size: 24px;
            color: #44527c;
        }
        > a:last-child {
            background: #3e8cf6;
            border-radius: 4px;
            border-radius: 4px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #ffffff;
            width: 98px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            cursor: pointer;
            &:hover {
                background: #70acff;
            }
            &:active {
                background: #2774de;
            }
        }
    }
    /deep/.user-manage-table {
        .el-table thead th {
            padding-top: 0;
            padding-bottom: 0;
            height: 32px;
            line-height: 32px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            border-right: none;
            border-bottom-color: #e6e6e6;
            > div {
                border-right: 1px solid #e6e6e6;
                text-align: center;
            }
        }
        .el-table tbody td {
            padding-top: 5px;
            padding-bottom: 5px;
            border-right: none;
            border-bottom-color: #e6e6e6;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #44527c;
            text-align: center;
        }
        .el-table {
            .tbody-user-name {
                background-repeat: no-repeat;
                padding-left: 37px;
                text-align: left;
                line-height: 20px;
                &.admin {
                    background-image: url('../../../assets/user/admin.svg');
                }
                &.not-admin {
                    background-image: url('../../../assets/user/user.svg');
                }
            }
            .tbody-graph-list {
                display: flex;
                flex-wrap: wrap;
                padding: 10px 5px;
                align-content: stretch;
                align-items: center;
                color: #ffffff;
                .graph-item {
                    padding: 0px 20px;
                    border-radius: 10px;
                    margin-right: 10px;
                    margin-bottom: 5px;
                    margin-top: 5px;
                }
            }
        }
    }
    .tbody-control-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
        > div {
            margin: 5px 30px 5px 0px;
            background-repeat: no-repeat;
            padding-left: 25px;
            height: 20px;
            line-height: 20px;
            cursor: pointer;
            &:hover {
                color: #3e8cf6;
            }
        }
        .level-down {
            background-image: url('../../../assets/user/down-level.svg');
        }
        .level-up {
            background-image: url('../../../assets/user/up-level.svg');
        }
        .change-pwd {
            background-image: url('../../../assets/user/change-pwd.svg');
        }
        .graph-right {
            background-image: url('../../../assets/user/graph-right.svg');
        }
        .delete {
            background-image: url('../../../assets/user/delete.svg');
        }
    }
    .box {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.3);
    }
    .change-graph-dig {
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        width: 440px;
        height: 440px;
        padding: 0 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -390px;
        margin-top: -220px;
        &-header {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
            height: 63px;
            line-height: 63px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 20px;
                cursor: pointer;
            }
        }
        &-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            height: 40px;
            line-height: 40px;
        }
        .el-table {
            background: #f5f7fa;
        }
        thead tr th {
            height: 28px;
            padding: 0;
            border-right: 0;
            text-align: center;
        }
        tbody {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #44527c;
            .cell {
                white-space: nowrap;
            }
            label {
                margin-right: 20px;
            }
            td {
                height: 24px;
                padding: 0;
                text-align: center;
            }
            .el-radio__label {
                font-size: 12px;
            }
            .el-radio__inner {
                width: 12px;
                height: 12px;
            }
        }
        &-btns {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            .el-button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                padding: 0;
            }
        }
    }
    .change-graph-dig-create {
        background: #ffffff;
        margin-top: 18px;
        &-header {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
            height: 63px;
            line-height: 63px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 20px;
                cursor: pointer;
            }
        }
        &-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            height: 40px;
            line-height: 40px;
        }
        .el-table {
            background: #f5f7fa;
            height: 166px !important;
        }
        thead tr th {
            height: 28px;
            padding: 0;
            border-right: 0;
            text-align: center;
        }
        tbody {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #44527c;
            .cell {
                white-space: nowrap;
            }
            label {
                margin-right: 20px;
            }
            td {
                height: 24px;
                padding: 0;
                text-align: center;
            }
            .el-radio__label {
                font-size: 12px;
            }
            .el-radio__inner {
                width: 12px;
                height: 12px;
            }
        }
        &-btns {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            .el-button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                padding: 0;
            }
        }
    }
    .current-user-row {
        background: rgba(62, 140, 246, 0.1);
    }
    /deep/.el-switch {
        span {
            font-size: 12px;
        }
    }
}
</style>
